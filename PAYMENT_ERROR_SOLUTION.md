# 402 Payment Error - Complete Solution Summary

## Problem Description
```
POST https://checkout-preprod.cibpay.co/v2/api/pay 402 (Payment Required)
```

Order creation succeeds, but CibPay checkout page returns 402 error when user is redirected.

---

## Root Causes Identified

1. **Missing or Invalid `currency` Field** - Most common
2. **Duplicate `merchant_order_id`** - CibPay rejects retries with same ID
3. **Terminal/Test Card Mismatch** - Wrong card for selected terminal
4. **Amount Format Issues** - Amount as string instead of number
5. **CibPay Account/Credentials Issue** - Account permission problem

---

## Solutions Implemented

### 1. Backend Improvements (`back/controller/paymentController.js`)

#### ✅ Added Currency Validation
```javascript
if (!req.body.currency) {
  return res.status(400).json({
    success: false,
    error: "currency is required (e.g., AZN, USD, EUR)"
  });
}
```

#### ✅ Enhanced Checkout URL Generation
```javascript
const checkout_url =
  response.headers?.location ||
  response.headers?.Location ||
  createdOrder?.checkout_url ||
  createdOrder?.checkoutUrl ||
  (createdOrder?.id ? `https://checkout-preprod.cibpay.co/pay/${createdOrder.id}` : null);
```

#### ✅ Comprehensive Logging
```javascript
console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
console.log("✅ CibPay create order response status:", response.status);
console.log("📦 CibPay full response:", JSON.stringify(response.data, null, 2));
console.log("🌐 Final checkout_url:", checkout_url);
```

#### ✅ Detailed Error Handling
```javascript
if (error.response?.status === 402) {
  return res.status(402).json({
    success: false,
    error: "Payment required - CibPay account issue",
    details: error.response?.data,
    request_data: orderData
  });
}
```

### 2. Frontend Improvements (`front/src/pages/payment/index.jsx`)

#### ✅ Enhanced Success Logging
```javascript
console.log("✅ Order created successfully");
console.log("📦 Full response:", createOrderRes.data);
console.log("🔗 Redirecting to checkout URL:", checkoutUrl);
console.log("📋 Order details sent:", {
  amount,
  currency: orderData.currency,
  terminal,
  merchant_order_id: merchantOrderId
});
```

#### ✅ Detailed Error Logging
```javascript
catch (err) {
  console.error("❌ Payment error:", err);
  console.error("📋 Request details:", {
    amount,
    currency: orderData.currency,
    merchant_order_id,
    terminal
  });
  console.error("📦 Error response:", {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message
  });
}
```

### 3. Documentation Created

#### 📄 `CIBPAY_TEST_CARDS.md`
- Test card configurations per terminal
- CVV validation rules
- 402 error troubleshooting guide
- Quick fix checklist

#### 📄 `DEBUG_PAYMENT_FLOW.md`
- Step-by-step debugging instructions
- Frontend console log examples
- Backend log examples
- cURL command for direct testing
- Common issues and fixes

#### 📄 `QUICK_FIX_402_ERROR.md`
- Quick reference card
- Most common causes
- Immediate fixes
- Diagnostic checklist

---

## Testing Instructions

### Step 1: Clear Browser Cache
- Press `Ctrl+Shift+Delete`
- Select "All time"
- Clear cache

### Step 2: Open DevTools
- Press `F12` → Console tab

### Step 3: Perform Payment
- Click payment button
- Watch console logs

### Step 4: Check for These Logs

**Success should show:**
```
✅ Order created successfully
📦 Full response: { success: true, checkout_url: "..." }
📋 Order details sent: { amount: 150, currency: "AZN", ... }
🔗 Redirecting to checkout URL: https://checkout-preprod.cibpay.co/pay/...
```

**If error:**
```
❌ Payment error: ...
📋 Request details: { amount: ..., currency: "AZN", ... }
📦 Error response: { status: 402, data: {...} }
```

### Step 5: Check Server Logs
Run backend server in terminal:
```bash
npm start
```

Look for:
```
Creating order with data: {...}
✅ CibPay create order response status: 200
📦 CibPay full response: {...}
🌐 Final checkout_url: https://...
```

---

## Quick Troubleshooting

### If you see: "Checkout URL not found"
1. Check server logs for CibPay error
2. Verify `amount` is > 0
3. Verify `currency` is provided
4. Check API credentials in `.env`

### If you see: 402 error
1. Use unique `merchant_order_id` (don't retry same ID)
2. Fix terminal/test card mismatch
3. Use correct amount format (e.g., 0.10, 150.00)
4. Check currency is "AZN"

### If you see: 422 validation error
1. Check request body format
2. Verify all required fields
3. Try smaller amount (0.10)

### If no logs appear
1. Clear browser cache (Ctrl+Shift+Delete)
2. Close and reopen browser
3. Check if DevTools is open BEFORE clicking payment
4. Check if JavaScript is enabled

---

## Files Changed

```
📝 back/controller/paymentController.js
   - Added currency validation
   - Enhanced checkout URL generation
   - Improved logging (4 console.log statements)
   - Better error handling

📝 front/src/pages/payment/index.jsx
   - Added success logging
   - Enhanced error logging
   - More detailed error messages

📄 docs/CIBPAY_TEST_CARDS.md
   - Created comprehensive guide
   - Test cards for each terminal
   - 402 error troubleshooting

📄 DEBUG_PAYMENT_FLOW.md
   - Step-by-step debugging
   - Example logs
   - cURL testing commands

📄 QUICK_FIX_402_ERROR.md
   - Quick reference
   - Common causes
   - Immediate fixes
```

---

## Next Steps

1. **Test with provided test cards** (see `CIBPAY_TEST_CARDS.md`)
2. **Watch console logs** while performing payment
3. **Compare logs** against examples in `DEBUG_PAYMENT_FLOW.md`
4. **Follow the fix checklist** in `QUICK_FIX_402_ERROR.md`
5. **If still failing**, collect logs and contact `support@cibpay.com`

---

## Critical Points to Remember

✅ **Always provide `currency`** - It's required!  
✅ **Use unique order IDs** - Don't retry same `merchant_order_id`  
✅ **Match terminal to test card** - Kapital uses Visa, Millikart uses 5410...  
✅ **Amount must be valid decimal** - Use 0.10, 150.00, etc.  
✅ **Check BOTH frontend and backend logs** - Don't check just one!

---

## Support

For detailed debugging: See `DEBUG_PAYMENT_FLOW.md`  
For test cards: See `CIBPAY_TEST_CARDS.md`  
For quick help: See `QUICK_FIX_402_ERROR.md`
