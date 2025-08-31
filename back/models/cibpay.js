const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // sənin merchant_order_id
  transactionId: { type: String }, // cibpay id
  status: { type: String, enum: ["NEW", "PAID", "DECLINED", "FAILED", "ISSUED"], default: "NEW" },
  amount: { type: Number },
  currency: { type: String },
  failureMessage: { type: String },
  pan: { type: String }, // maskalanmış kart
  rawResponse: { type: Object }, // CibPay-dən gələn bütün məlumat
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
