const express = require("express");
const router = express.Router();

// Import controller functions directly
const {
  authorizePayment,
  getOrders,
  getOrderById,
  createOrder,
  createOrderMKRecurring,
  chargePayment,
  reversePayment,
  refundPayment,
  octCreditById,
  octCredit,
  octCreditSRN,
  cibpayWebhook,
} = require("../controller/paymentController");

// Kartla ödəniş (authorize)
router.post("/authorize", authorizePayment);

// Orders siyahısı
router.get("/orders", getOrders);

// Order by ID
router.get("/orders/:orderId", getOrderById);

// Orders create
router.post("/orders/create", createOrder);

// Orders create MK recurring
router.post("/orders/mk/recurring", createOrderMKRecurring);

// Charge (authorized payment) - requires orderId in body
router.post("/orders/charge", chargePayment);

// Reverse (void) payment - requires orderId in body
router.post("/orders/reverse", reversePayment);

// Refund (OCT) - requires orderId in body
router.post("/refund", refundPayment);

// OCT Credit by ID
router.post("/oct/:id", octCreditById);

// OCT Credit
router.post("/oct/credit", octCredit);

// OCT Credit SRN
router.post("/oct/credit/:srn", octCreditSRN);

// router.post('/cibpay/webhook', cibpayWebhook);
router.post("/webhooks/cibpay", express.json(), cibpayWebhook);

module.exports = router;