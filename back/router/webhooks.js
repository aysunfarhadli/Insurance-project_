const express = require("express");
const router = express.Router();
const { cibpayWebhook } = require("../controller/webhookController");

// CibPay webhook buraya POST göndərəcək
router.post("/webhooks/cibpay", express.json(), cibpayWebhook);

module.exports = router;
