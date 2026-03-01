const express = require("express");
const router = express.Router();

// Import controller functions directly
const {
  authorizePayment,
  getOrders,
  getOrderById,
  getOrderStatus,
  createOrder,
  createOrderMKRecurring,
  chargePayment,
  reversePayment,
  refundPayment,
  cancelPayment,
  octCreditById,
  octCredit,
  octCreditSRN,
  cibpayWebhook,
} = require("../controller/paymentController");

// Kartla ödəniş (authorize)
router.post("/authorize", authorizePayment);

// Orders siyahısı
router.get("/orders", getOrders);

// Order by ID (from Cibpay API)
router.get("/orders/:orderId", getOrderById);

// Order status (from database)
router.get("/orders/status/:orderId", getOrderStatus);

// Orders create
router.post("/orders/create", createOrder);

// Orders create MK recurring
router.post("/orders/mk/recurring", createOrderMKRecurring);

// Charge (authorized payment) - requires orderId in body
router.post("/orders/charge", chargePayment);

// Reverse (void) payment - requires orderId in body
router.post("/orders/reverse", reversePayment);

// Cancel order - requires orderId in body
router.post("/orders/cancel", cancelPayment);

// Refund (OCT) - requires orderId and optionally amount in body
router.post("/orders/refund", refundPayment);

// OCT Credit by ID
router.post("/oct/:id", octCreditById);

// OCT Credit
router.post("/oct/credit", octCredit);

// OCT Credit SRN
router.post("/oct/credit/:srn", octCreditSRN);

// router.post('/cibpay/webhook', cibpayWebhook);
router.post("/webhooks/cibpay", express.json(), cibpayWebhook);

module.exports = router;