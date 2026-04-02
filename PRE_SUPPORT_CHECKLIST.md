# Pre-Support Checklist - Before Contacting CibPay

Use this checklist before contacting CibPay support to help them troubleshoot faster.

---

## 1. Request Data Validation

- [ ] **Amount is provided and > 0**
  - Example: `150.00`, `0.10`, NOT `0` or negative
  - Location: Browser Console → "📋 Order details sent"

- [ ] **Currency is provided**
  - Value: `"AZN"` (or other valid code)
  - Location: Browser Console → "📋 Order details sent"

- [ ] **Merchant Order ID is UNIQUE**
  - Don't use same ID twice
  - Example: `ORDER-${Date.now()}`
  - Location: Browser Console → "📋 Order details sent"

- [ ] **Terminal matches test card**
  - Kapital/ATB/Tamkart: Use `4111111111111111` (Visa)
  - Millikart: Use `5410000000000008`
  - Location: Browser Console → Log shows terminal name

---

## 2. Server-Side Validation

Run backend and check these logs:

- [ ] **Order received by backend**
  ```
  Creating order with data: { amount: "...", currency: "...", ... }
  ```

- [ ] **CibPay responds successfully**
  ```
  ✅ CibPay create order response status: 200
  ```

- [ ] **Checkout URL is generated**
  ```
  🌐 Final checkout_url: https://checkout-preprod.cibpay.co/pay/XXXXX
  ```

- [ ] **No error messages in logs**
  - Look for "❌" symbols
  - Look for red error messages

---

## 3. API Credentials

- [ ] **CIBPAY_USER is set in `.env`**
  ```
  CIBPAY_USER=username
  ```

- [ ] **CIBPAY_PASS is set in `.env`**
  ```
  CIBPAY_PASS=password
  ```

- [ ] **Using correct environment**
  ```
  NODE_ENV=test (or development)
  ```
  NOT `NODE_ENV=production`

- [ ] **API URL is sandbox**
  ```
  CIBPAY_API_URL=https://api-preprod.cibpay.co
  ```
  NOT production URL

---

## 4. CibPay Checkout Page Behavior

- [ ] **Page loads (doesn't show 402 immediately)**
  - If 402 on redirect: Backend issue
  - If 402 after card entry: Payment processing failed

- [ ] **You see CibPay branding/logo**
  - Not a blank page
  - Not an error page

- [ ] **Browser Developer Tools Network tab shows request to checkout-preprod.cibpay.co**
  - Click on request
  - Check status code
  - Record in support ticket

---

## 5. Test Cases to Try

Before contacting support, try each:

### Test 1: Minimal Amount, Visa Card
```
Amount: 0.10 AZN
Terminal: kapital
Card: 4111111111111111 / 12/25 / 123
```

### Test 2: Merchant Order ID with Timestamp
```
Merchant Order ID: TEST-${Date.now()}
(Each try should have new ID)
```

### Test 3: Different Terminal
```
Terminal: millikart_test (instead of kapital)
Card: 5410000000000008 / 12/25 / 123
```

- [ ] Test 1 tried
- [ ] Test 2 tried (with different IDs)
- [ ] Test 3 tried

---

## 6. Network Request Inspection

Open Browser DevTools → Network Tab, then retry payment:

- [ ] **Find request to `/orders/create`**
  - Click on it
  - Go to "Request" tab
  - Check Request Body includes:
    ```json
    {
      "amount": 0.1,
      "currency": "AZN",
      "merchant_order_id": "...",
      "options": {...}
    }
    ```
  - **Both amount AND currency must be present**

- [ ] **Find request to `checkout-preprod.cibpay.co/pay/...`**
  - Note the URL
  - Check status code (should be 200, not 402)
  - If 402: CibPay rejected it

---

## 7. Information to Collect

Gather before contacting support:

**From Browser Console:**
- [ ] "📋 Order details sent" log (screenshot)
- [ ] "❌ Error response" if present (screenshot)
- [ ] Exact error message

**From Server Logs:**
- [ ] "Creating order with data" log
- [ ] "CibPay create order response" log
- [ ] Any error messages

**From Network Tab:**
- [ ] Request body to `/orders/create` (screenshot)
- [ ] Response status and body
- [ ] CibPay checkout request URL

**Your Setup:**
- [ ] Terminal name (kapital/millikart_test/atb/tamkart)
- [ ] Test card used (last 4 digits: ****1111)
- [ ] Amount tried
- [ ] Environment (sandbox/production)

---

## 8. Before Contacting Support

- [ ] I've checked all items above
- [ ] I've tried with different terminals
- [ ] I've tried with different amounts
- [ ] I've verified currency is provided
- [ ] I've verified unique merchant_order_id
- [ ] I have console logs (screenshot)
- [ ] I have server logs (screenshot)
- [ ] I have network request details

---

## What to Send to CibPay Support

Include these in your ticket:

```
Subject: 402 Payment Required Error - Sandbox Order Creation

Description:
I'm getting a 402 error when redirecting to the checkout page.
Order creation seems successful on my backend, but CibPay rejects it
when the user is redirected to https://checkout-preprod.cibpay.co/pay/...

Testing Info:
- Terminal: [kapital/millikart_test/etc]
- Test Card: [****1111]
- Amount: 0.10 AZN
- Merchant Order ID: ORDER-1234567890
- API Credentials User: [USERNAME]

Error Details:
[Paste "📦 Error response" log]

Server Logs:
[Paste "Creating order with data" log]
[Paste "CibPay create order response" log]

Network Request:
Status: 402
URL: https://checkout-preprod.cibpay.co/v2/api/pay
[Paste request/response if available]

What I've Tried:
- ✅ Different terminals (kapital, millikart_test)
- ✅ Different amounts (0.10, 1.00)
- ✅ Verified currency is "AZN"
- ✅ Unique merchant_order_id each time

Environment:
- API URL: https://api-preprod.cibpay.co
- Node Environment: test
```

---

## Still Getting 402?

Try these last things:

- [ ] **Restart backend server**
  ```bash
  npm stop
  npm start
  ```

- [ ] **Clear ALL browser cache**
  - Ctrl+Shift+Delete
  - Select "All time"
  - Clear all

- [ ] **Use incognito/private mode**
  - Ctrl+Shift+N (new incognito window)
  - Try payment fresh

- [ ] **Try different browser**
  - Firefox instead of Chrome
  - Safari if on Mac

- [ ] **Check CibPay status page**
  - Is sandbox online?
  - Any maintenance?

---

## Contact Information

**CibPay Support:** support@cibpay.com  
**Sandbox API:** https://api-preprod.cibpay.co  
**Documentation:** See `CIBPAY_TEST_CARDS.md` and `DEBUG_PAYMENT_FLOW.md`

---

## Quick Summary

✅ Check currency is provided  
✅ Check unique merchant_order_id  
✅ Check terminal/card match  
✅ Check both frontend AND backend logs  
✅ Try different combinations  
✅ Collect all info before contacting support

**If all pass and you still get 402, it's likely a CibPay account permission issue.**
