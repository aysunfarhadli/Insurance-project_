# Debug Payment Flow - 402 Error Troubleshooting

## Issue
```
POST https://checkout-preprod.cibpay.co/v2/api/pay 402 (Payment Required)
```

When redirecting to CibPay checkout page, getting 402 error.

---

## Step 1: Check Frontend Console

Open browser DevTools (F12) → Console tab and perform payment. Look for these logs:

**✅ SUCCESS PATH - You should see:**
```
✅ Order created successfully
📦 Full response: {
  success: true,
  data: {...},
  order: {id: "94611545647300120", status: "CREATED", ...},
  checkout_url: "https://checkout-preprod.cibpay.co/pay/94611545647300120"
}
🔗 Redirecting to checkout URL: https://checkout-preprod.cibpay.co/pay/94611545647300120
```

**❌ ERROR PATH - If you see error:**
```
❌ Payment error: ...
📋 Request details: {
  amount: 150.00,
  currency: "AZN",
  merchant_order_id: "ORDER-XXXXX",
  terminal: "kapital"
}
📦 Error response: {
  status: 402 (or 400, 422, etc.),
  data: {...},
  message: "..."
}
```

---

## Step 2: Check Backend Logs

Run the backend server and check the logs when you perform payment.

**✅ SUCCESS LOGS - You should see:**
```
Creating order with data: {
  amount: "150.00",
  currency: "AZN",
  merchant_order_id: "ORDER-XXXXX",
  options: {...},
  ...
}

✅ CibPay create order response status: 200
📦 CibPay full response: {
  orders: [{
    id: "94611545647300120",
    status: "CREATED",
    checkout_url: "https://checkout-preprod.cibpay.co/pay/94611545647300120"
  }]
}

🔗 Final checkout_url: https://checkout-preprod.cibpay.co/pay/94611545647300120
```

**❌ ERROR LOGS - If you see error:**
```
❌ Error creating order with CibPay:
   Status: 402
   Message: Payment Required
   CibPay error: {...}
   Request was: {
     amount: "150.00",
     currency: "AZN",
     merchant_order_id: "ORDER-XXXXX",
     ...
   }
```

---

## Step 3: Validate Request Data

### Frontend is sending:
```javascript
const createOrderRes = await axios.post(`${API_BASE}/api/payment/orders/create`, {
  amount: 150.00,                    // ← Number, not string
  currency: "AZN",                   // ← Must be provided
  merchant_order_id: "ORDER-123",    // ← Must be unique
  options: {
    auto_charge: true,               // ← For hosted checkout
    force3d: 1,                       // ← Depends on terminal
    language: "az",
    return_url: "https://...",       // ← Where to redirect after payment
    terminal: "kapital"              // ← Terminal code
  },
  client: {
    name: "User Name",
    email: "user@email.com"
  }
});
```

### Check: Are all these present and valid?
- [ ] `amount` > 0 (e.g., `150.00`)
- [ ] `currency` exists (e.g., `"AZN"`)
- [ ] `merchant_order_id` is unique
- [ ] `options.auto_charge` is `true`
- [ ] `options.return_url` exists
- [ ] `options.terminal` matches test card:
  - Visa (`4111...`) → kapital, atb, tamkart
  - Millikart (`5410...`) → millikart_test

---

## Step 4: Test with cURL

Test order creation directly from command line:

```bash
curl -X POST "https://api-preprod.cibpay.co/orders/create" \
  -u "USERNAME:PASSWORD" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "amount": "150.00",
    "currency": "AZN",
    "merchant_order_id": "TEST-'$(date +%s)'",
    "options": {
      "auto_charge": true,
      "force3d": 1,
      "language": "az",
      "return_url": "https://yourdomain.az/payment/success"
    },
    "client": {
      "name": "Test User",
      "email": "test@email.com"
    }
  }'
```

**Expected response (200):**
```json
{
  "orders": [{
    "id": "94611545647300120",
    "status": "CREATED",
    "checkout_url": "https://checkout-preprod.cibpay.co/pay/94611545647300120",
    "created": "2025-08-02T12:52:28.000Z"
  }]
}
```

**If you get 402:**
- Check CibPay API credentials (Basic Auth)
- Verify merchant account status
- Contact `support@cibpay.com`

---

## Step 5: Common Issues & Fixes

### Issue: `checkout_url` is `null` or missing
**Cause:** Order creation failed silently
**Fix:** Check error response in Step 2 logs

### Issue: `402` error on checkout page
**Cause:** CibPay rejected the order
**Possible fixes:**
1. Verify merchant order ID is unique (don't retry same ID)
2. Try different terminal:
   ```
   From: terminal: "kapital"
   To:   terminal: "millikart_test"
   ```
3. Try `auto_charge: false` instead of `true`

### Issue: Order created but stuck on checkout
**Cause:** Browser issue or checkout page bug
**Fix:**
1. Try incognito/private mode
2. Try different browser
3. Check browser console for JavaScript errors

---

## Step 6: Check Backend Endpoint Health

Test if your backend is properly forwarding requests:

```bash
curl -X POST "http://localhost:5000/api/payment/orders/status/ORDER-TEST" \
  -H "Content-Type: application/json"
```

Should return the order status.

---

## Step 7: Enable Detailed Logging

Edit `paymentController.js` and ensure these are uncommented:
```javascript
console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
console.log("✅ CibPay create order response status:", response.status);
console.log("📦 CibPay full response:", JSON.stringify(response.data, null, 2));
console.log("🔗 Final checkout_url:", checkout_url);
```

---

## Success Checklist

- [ ] Frontend sends unique `merchant_order_id`
- [ ] `amount` is a positive number
- [ ] `currency` is provided (e.g., "AZN")
- [ ] `auto_charge: true` is set
- [ ] `terminal` matches test card
- [ ] Backend receives request and logs it
- [ ] Backend forwards to CibPay successfully
- [ ] Backend receives `checkout_url` from CibPay
- [ ] Frontend extracts `checkout_url` from response
- [ ] Frontend redirects (using `window.location.assign()`)
- [ ] User sees CibPay checkout page (not 402 error)

---

## Still Having Issues?

1. **Check both frontend AND backend console logs** - compare what's sent vs. what's returned
2. **Look at network tab in DevTools** - see actual HTTP request/response
3. **Try with different amount** - sometimes server rejects large amounts
4. **Check `.env` file** - verify API credentials are correct
5. **Contact CibPay** - provide order ID and error details

**Useful info for CibPay support:**
- Merchant order ID (from logs)
- Request data (send full JSON from logs)
- Error response (full JSON)
- Backend logs (if available)
- Account/username used
