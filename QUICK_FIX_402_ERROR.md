# Quick Fix: 402 Payment Required Error

## The Error
```
POST https://checkout-preprod.cibpay.co/v2/api/pay 402 (Payment Required)
```

---

## What This Means
✅ Your backend successfully created the order  
✅ Your frontend got the checkout URL  
❌ CibPay's checkout page rejected the payment when it tried to process it

---

## Most Common Cause: Wrong Amount or Currency Format

### ✅ CORRECT
```javascript
// Frontend sends
amount: 150.00                    // Decimal number
currency: "AZN"                   // String code

// Backend converts
amount: "150.00"                  // String with 2 decimals
```

### ❌ WRONG
```javascript
// Frontend sends
amount: 150                        // Integer (missing decimals)
currency: null                     // Missing!
```

---

## Quick Diagnostic

### 1️⃣ Open Browser DevTools (F12)
- Go to **Console** tab
- Look for this line:
  ```
  📋 Request details: {amount: 150, currency: "AZN", ...}
  ```
  **Both `amount` AND `currency` must be present!**

### 2️⃣ Look at Network Tab
- Filter by `orders/create`
- Check the Request body has:
  ```json
  {
    "amount": 150.00,
    "currency": "AZN",
    "merchant_order_id": "..."
  }
  ```

### 3️⃣ Check Server Logs
Look for:
```
Creating order with data: {
  "amount": "150.00",           ← ✅ String with decimals
  "currency": "AZN",            ← ✅ Provided
  "merchant_order_id": "...",   ← ✅ Unique
  ...
}
```

---

## Fix Checklist (Do These!)

- [ ] **Amount is always positive** (e.g., `0.01` minimum, `150.00` typical)
- [ ] **Currency is provided** (e.g., `"AZN"`, `"USD"`)
- [ ] **Merchant order ID is UNIQUE** (don't retry same ID)
- [ ] **Terminal matches test card:**
  - Use Visa (`4111...`) with: kapital, atb, tamkart
  - Use Millikart (`5410...`) with: millikart_test
- [ ] **auto_charge is true** (for hosted checkout)
- [ ] **return_url is provided** (URL to redirect after payment)

---

## Try These Test Cases

### Case 1: Visa with KapitalBank
```javascript
{
  amount: 0.10,                          // Small amount
  currency: "AZN",
  merchant_order_id: `TEST-${Date.now()}`,  // Unique!
  options: {
    terminal: "kapital",
    auto_charge: true,
    force3d: 1
  }
}
```

### Case 2: Millikart
```javascript
{
  amount: 1.00,
  currency: "AZN",
  merchant_order_id: `TEST-${Date.now()}`,
  options: {
    terminal: "millikart_test",
    auto_charge: true,
    force3d: 0  // ← Different for this terminal
  }
}
```

---

## Most Likely Issues (In Order)

1. **Missing `currency` field** ← Check this first!
   - **Fix:** Add `currency: "AZN"` to request

2. **Duplicate `merchant_order_id`** ← Very common!
   - **Fix:** Generate unique ID: `ORDER-${Date.now()}`

3. **Amount is 0 or negative**
   - **Fix:** Use real amount like `150.00`

4. **Terminal doesn't match card** ← Second most common
   - **Fix:** Verify terminal matches test card combination

5. **API credentials wrong**
   - **Fix:** Check `.env` for `CIBPAY_USER` and `CIBPAY_PASS`

---

## Where To Look vs What To Check

| Check | Where | What to Look For |
|-------|-------|-----------------|
| Request Data | Browser Console | `amount: 150.00, currency: "AZN"` |
| Request Sent | Network Tab | Both `amount` and `currency` in body |
| Backend Received | Server Logs | `Creating order with data: {...}` |
| CibPay Response | Server Logs | Status 200 or error status |
| Checkout URL | Browser Console | `https://checkout-preprod.cibpay.co/pay/XXXXX` |

---

## Not Working? Do This

1. **Check all 5 items in Fix Checklist above**
2. **Clear browser cache:** Ctrl+Shift+Delete
3. **Try incognito mode:** Ctrl+Shift+N
4. **Try different terminal:** Change from kapital to millikart_test
5. **Try smaller amount:** 0.01 instead of 150.00
6. **Check server logs:** Look for error messages from CibPay
7. **Test with cURL:** See `DEBUG_PAYMENT_FLOW.md` Section 4

---

## Need More Help?

See full debugging guide: `DEBUG_PAYMENT_FLOW.md`  
See test cards: `CIBPAY_TEST_CARDS.md`  
Contact: `support@cibpay.com`

---

## TL;DR - The Three Things

1. ✅ Send `amount` as number, `currency` as string  
2. ✅ Make sure `merchant_order_id` is unique (don't repeat)  
3. ✅ Terminal setting must match your test card combo  

**If all three are correct, 402 is likely a CibPay account issue.**
