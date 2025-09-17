const crypto = require("crypto");
const { saveOrderFromCibpay } = require("./paymentController");

// 🔔 CibPay Webhook
const cibpayWebhook = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, error: "INVALID_PAYLOAD" });
    }

    // Hər bir order-i DB-yə saxla
    for (const cibOrder of orders) {
      await saveOrderFromCibpay(cibOrder);
    }

    console.log("✅ Webhook received:", orders.map(o => o.merchant_order_id));

    return res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false, error: "SERVER_ERROR" });
  }
};

module.exports = { cibpayWebhook };
