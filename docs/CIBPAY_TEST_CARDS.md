# CibPay Test Cards & CVV Guide

## Common CibPay Test Cards (Sandbox)

Use these test card numbers in the sandbox environment for testing different scenarios.

### Test Card Formats

#### Visa Test Card (3D Secure)
- **PAN:** `4111111111111111`
- **CVV:** `123`
- **Expiry:** Any future date (e.g., 12/25)
- **Notes:** Default test card, supports 3D Secure

#### Mastercard Test Card (3D Secure)
- **PAN:** `5555555555554444`
- **CVV:** `123`
- **Expiry:** Any future date (e.g., 12/25)
- **Notes:** Standard Mastercard test, supports 3D Secure

#### Maestro Test Card
- **PAN:** `6762697046410113`
- **CVV:** `123`
- **Expiry:** Any future date
- **Notes:** Some acquiring banks may decline

#### AmEx Test Card
- **PAN:** `378282246310005`
- **CVV:** `1234`  ← AmEx uses 4-digit CVV
- **Expiry:** Any future date

---

## CVV Rules

### Valid CVV Formats
- **3-digit CVV:** For Visa, Mastercard, Discover
  - Example: `123`, `456`, `999`
  - Format: Numeric only, no leading/trailing spaces

- **4-digit CVV:** For American Express / Diners
  - Example: `1234`, `0001`
  - Format: Numeric only

### CVV Validation & Common Errors

#### Error: `invalid_cvv`
**Causes:**
1. CVV contains non-numeric characters (spaces, dashes, letters)
2. CVV length is wrong (should be 3-4 digits)
3. CVV has leading/trailing whitespace
4. Card type doesn't match CVV length (e.g., 4-digit CVV for Visa)

**Solutions:**
```javascript
// ✅ CORRECT
cvv: "123"           // 3-digit Visa/MC
cvv: "1234"          // 4-digit AmEx

// ❌ INCORRECT
cvv: "123 "          // Has space
cvv: "0123"          // Too long (4 digits for Visa)
cvv: "12"            // Too short
cvv: "12a"           // Contains letter
```

---

## Terminal-Specific Test Cards

Some CibPay terminals require specific test cards:

### KapitalBank (kapital)
- Test PAN: `4111111111111111`
- Recommended CVV: `123`
- Best for: Basic 3D Secure testing

### MilliKart (millikart_test)
- Test PAN: `5410000000000008`
- Recommended CVV: `123`
- Best for: Recurring/OneClick payments
- OTP Code (if prompted): `1111` or `123456`

### ATB (atb)
- Test PAN: `4111111111111111`
- Recommended CVV: `123`

### Tamkart/ABB (tamkart)
- Test PAN: `4111111111111111`
- Recommended CVV: `123`
- OTP Code: Usually `1111`
- Best for: Installment payments

---

## Testing Checklist

- [ ] CVV is 3-4 numeric digits only
- [ ] No spaces or special characters around CVV
- [ ] Expiry date is in the future
- [ ] Card format matches terminal setting
- [ ] Using sandbox credentials (preprod.cibpay.co)
- [ ] Browser info properly populated (user-agent, IP, etc.)

---

## Production vs Sandbox

| Environment | URL | CVV Format | Card Source |
|------|-----|-----------|-----------|
| **Sandbox** | `https://api-preprod.cibpay.co` | 3-4 digits | Use test cards above |
| **Production** | `https://api.cibpay.co` | 3-4 digits | Real cards only |

---

## Additional Notes

- **Expiry Month/Year:** Both should be numeric (e.g., `12` for December, `2025` for year)
- **Cardholder Name:** Optional in most cases, but recommended
- **Browser Info:** Required for 3D Secure; ensure user-agent and timezone are properly set
- **Test vs Real:** Always verify you're in sandbox mode before testing with real cards

---

## Troubleshooting: 402 Payment Required Error

### What is 402 Error?
`POST https://checkout-preprod.cibpay.co/v2/api/pay 402 (Payment Required)`

This error occurs when:
1. Order creation succeeded on backend
2. User is redirected to CibPay checkout page
3. CibPay checkout page fails with 402 when trying to process payment

### Common Causes & Solutions

#### 1. **Amount Format Issues**
- **Problem:** Amount sent as string when it should be number, or vice versa
- **Check:**
  ```
  Frontend sends: amount: 150.00 (number) ✅
  Backend formats: "150.00" (string) ✅
  ```
- **Fix:** Ensure amount is a valid decimal number, backend converts to string

#### 2. **Currency Mismatch**
- **Problem:** Currency parameter missing or invalid
- **Valid currencies:** `AZN`, `USD`, `EUR`, `GBP`, etc.
- **Check in Frontend:**
  ```javascript
  const createOrderRes = await axios.post(`${API_BASE}/api/payment/orders/create`, {
    amount: 150.00,
    currency: "AZN",  // ← Must be provided
    merchant_order_id: "ORDER123"
  });
  ```
- **Fix:** Always send `currency` from frontend

#### 3. **Duplicate Order ID**
- **Problem:** Using same merchant_order_id twice (CibPay rejects duplicates)
- **Solution:** Generate unique order IDs with timestamps:
  ```javascript
  merchant_order_id = `ORDER-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  ```

#### 4. **Terminal Configuration Mismatch**
- **Problem:** Selected terminal doesn't support the test card
- **Millikart requires:** `5410000000000008` (test card)
- **Other terminals:** `4111111111111111` (Visa)
- **Fix:** Check terminal setting matches card:
  ```
  Terminal: kapital → Use Visa (4111...)
  Terminal: millikart_test → Use 5410...
  ```

#### 5. **Auto-Charge Not Supported**
- **Problem:** Terminal doesn't support `auto_charge: true`
- **Check:** Some terminals require manual charge after authorization
- **Fix:** Try with `auto_charge: false` first, then manually charge

#### 6. **CibPay Account Issue**
- **Problem:** Merchant account doesn't have sufficient permissions
- **Check:**
  - Verify API credentials are correct
  - Check CibPay merchant portal for account status
  - Ensure test mode is enabled for sandbox
- **Fix:** Contact CibPay support: `support@cibpay.com`

### Debug Steps

**1. Check Backend Logs**
```
✅ Order created successfully
📦 Full response: { ... }
🔗 Final checkout_url: https://checkout-preprod.cibpay.co/pay/XXXX
```

**2. Check Frontend Logs**
```
✅ Order created successfully
📦 Full response: { checkout_url: "...", order: {...} }
🔗 Redirecting to checkout URL: https://checkout-preprod.cibpay.co/pay/XXXX
```

**3. Verify Request Data**
```
📋 Order details sent: {
  amount: 150.00,
  currency: "AZN",
  terminal: "kapital",
  merchant_order_id: "ORDER-XXXXX"
}
```

**4. Check Error Response**
Backend will return:
```json
{
  "success": false,
  "error": "Failed to create order",
  "details": { "error": "...", "message": "..." },
  "request_data": { ... }
}
```

### Quick Fix Checklist

- [ ] Amount is positive number (e.g., `150.00`, not `"150.00"`)
- [ ] Currency is provided and valid (e.g., `"AZN"`)  
- [ ] Merchant order ID is unique (not used before)
- [ ] Terminal setting matches test card:
  - Visa cards → kapital, atb, tamkart
  - Millikart cards → millikart_test
- [ ] `auto_charge` is `true` (for hosted checkout)
- [ ] `return_url` is provided (for after payment)
- [ ] API credentials are correct in backend `.env`
- [ ] Using sandbox URL: `api-preprod.cibpay.co`

---

## Contact Support

If you continue to receive errors:
1. Check all items in the checklist above
2. Review backend & frontend console logs
3. Try with a different test card
4. Contact CibPay support: `support@cibpay.com`

For API integration issues, provide:
- Merchant order ID
- Amount and currency
- Error response from CibPay
- Backend logs (if available)
