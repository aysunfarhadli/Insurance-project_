# CIBPay API Integration Guide (Sandbox & Production)

Overview
- Base sandbox URL: `https://api-preprod.cibpay.co`
- Base production URL: `https://api.cibpay.co`
- Checkout sandbox: `https://checkout-preprod.cibpay.co/pay/{order_id}`
- Authentication: Basic Auth (username:password), Base64-encoded
- Content-Type: `application/json`
- Recommended: `Accept: application/json`, charset UTF-8

Quick auth header example

Authorization header (example):

Authorization: Basic BASE64(username:password)

Where `BASE64(username:password)` is the Base64 encoding of `username:password` (no extra spaces or newlines).

Key notes / conventions
- Use ISO 8601 timestamps (UTC) for examples (e.g. `2025-08-02T12:52:28.000Z`).
- Amounts: endpoints that perform charge/refund/credit require decimal amounts as strings (e.g. `"11.00"`). Order creation may accept numeric values in some clients but using strings avoids ambiguity.
- Use `X-Request-Id` for idempotency/tracing when available (recommended for `rebill` and retryable requests).
- Use TLS (HTTPS) for all requests—never send credentials over plain HTTP.

Required headers
- `Authorization: Basic ...`
- `Content-Type: application/json`
- `Accept: application/json`
- Optional: `X-Request-Id` for idempotency/tracing

Ping (connectivity)

curl

curl -u "USERNAME:PASSWORD" "https://api-preprod.cibpay.co/ping"

Python (requests)

import requests

resp = requests.get(f"{BASE_URL}/ping", auth=(USERNAME, PASSWORD), headers={'Accept':'application/json'})
resp.raise_for_status()
print(resp.json())

Response (200)
{
  "status": "ok"
}

Exchange rates
GET /exchange_rates/?date=YYYY-MM-DD&rate_table=optional

curl

curl -u "USERNAME:PASSWORD" "https://api-preprod.cibpay.co/exchange_rates/?date=2025-07-03"

Response (200) example
{
  "rates": [
    { "currency_from": "AZN", "currency_to": "EUR", "buy": 1.70, "sell": 1.75 },
    { "currency_from": "AZN", "currency_to": "USD", "buy": 1.70, "sell": 1.70 }
  ]
}

Create order (auto_charge = true)
POST /orders/create

Notes: include `options.auto_charge` to control immediate charging. Provide `return_url` in `options` for web checkout flows.

Minimal curl example

curl -u "USERNAME:PASSWORD" -H "Content-Type: application/json" -d '{"amount":3.33,"currency":"AZN","merchant_order_id":"ORDER123","options":{"auto_charge":true,"return_url":"https://yourdomain.az"}}' "https://api-preprod.cibpay.co/orders/create"

Successful response (200)
{
  "orders": [
    { "id": "94611545647300120", "status": "CREATED", "created": "2025-08-02T12:52:28.000Z", "expiration_date": "2025-08-02T13:07:28.000Z", "checkout_url": "https://checkout-preprod.cibpay.co/pay/94611545647300120" }
  ],
  "result_code": 0
}

Create order (authorize only)
- Same endpoint, set `options.auto_charge` to `false`. Response `status` will be `AUTHORIZED`.

Charge an authorized order
PUT /orders/{order_id}/charge

Note: amount should be a string representing a decimal (e.g. `"11.00"`).

curl

curl -u "USERNAME:PASSWORD" -X PUT -H "Content-Type: application/json" -d '{"amount":"11.00"}' "https://api-preprod.cibpay.co/orders/94611545647300120/charge"

Success (200) example
{
  "status": "CHARGED",
  "transactions": [ { "id": "94611545647300120-1", "status": "SUCCESS", "amount": 11.00 } ]
}

Rebill (using stored payment details)
POST /orders/{order_id}/rebill

Recommended: include `X-Request-Id` header to avoid duplicate processing on retries.

curl

curl -u "USERNAME:PASSWORD" -H "Content-Type: application/json" -H "X-Request-Id: MYTRACEID123" -d '{"amount":33.00,"currency":"AZN","merchant_order_id":"PKgn75jB","client":{"email":"test@gmail.com"}}' "https://api-preprod.cibpay.co/orders/94611545647300120/rebill"

Get order
GET /orders/{order_id}

curl -u "USERNAME:PASSWORD" "https://api-preprod.cibpay.co/orders/94611545647300120"

Get all orders
GET /orders

Cancel order
PUT /orders/{order_id}/cancel

Refund order
PUT /orders/{order_id}/refund

Note: refund `amount` should be a string (e.g. `"1.00"`).

Payout / send money to a card
POST /orders/credit

Note: amount should be a string, include `pan` and `client` information.

Errors and HTTP status codes
- 401 Unauthorized: invalid credentials. Body often contains an error message.
- 400 Bad Request: validation errors (missing fields, wrong formats) — body contains details.
- 404 Not Found: order not found.

Example error body (400)
{
  "error": "validation_error",
  "details": { "amount": "Invalid format, expected string decimal" }
}

Common parameter notes
- `rate_table` (exchange_rates): optional string or id of table
- `recurring`: integer (0/1) — indicates recurring payment
- `force3d`: integer (0/1) — enforce 3D Secure flow
- `terminal`: string — terminal identifier (validation depends on merchant account)
- `trace_id`: string — merchant trace id for logging
- `segment`: string — merchant-specific segmentation id

Order statuses (summary)
- `CREATED`: order created, awaiting payment
- `AUTHORIZED`: card authorized, not charged
- `CHARGED`: payment captured
- `CANCELED`: order canceled
- `REFUNDED`: refunded (partially or fully)

Client & custom fields
- Validate phone numbers and country codes according to your app rules (examples in API show numeric country codes like `994`).
- Indicate which fields are required by your own integration — server-side code must check.

Security best practices
- Store credentials in environment variables and never commit them. Example `.env` entries:

  CIBPAY_USERNAME=your_username
  CIBPAY_PASSWORD=your_password
  CIBPAY_BASE_URL=https://api-preprod.cibpay.co

- Use short-lived credentials if supported and rotate them periodically.
- Use `X-Request-Id` to avoid duplicate processing for retryable operations.

Testing checklist
- Test authentication (`/ping`).
- Test order creation with auto_charge true/false.
- Test payment flows: authorize → charge and refunds.
- Test rebill with `X-Request-Id` for idempotency.
- Test webhook handling and validate webhook credentials.

Examples included
- curl: quick testing for every endpoint above
- Python: `requests` snippets (auth via `auth=(USER,PASS)`)
- Node: use `axios` or `fetch` with `Authorization: Basic ...`

Notes about this repository
- This project contains CIBPay-related server code in `back/controller/paymentController.js` and webhook handling in `back/controller/webhookController.js`. Keep your `.env` files out of source control; use `.env.example` for placeholders.

If you want, I can:
- add `curl` + `axios` + `requests` full snippets for each endpoint into this file,
- or update an existing README instead of adding `docs/CIBPay_INTEGRATION.md`.
