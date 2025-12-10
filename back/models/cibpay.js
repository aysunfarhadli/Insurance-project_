const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // sənin merchant_order_id
  transactionId: { type: String }, // cibpay id
  status: { 
    type: String, 
    enum: ["NEW", "AUTHORIZED", "PAID", "DECLINED", "FAILED", "ISSUED", "CHARGED"], 
    default: "NEW" 
  },
  amount: { type: Number },
  currency: { type: String },
  failureMessage: { type: String },
  pan: { type: String }, // maskalanmış kart
  rawResponse: { type: Object }, // CibPay-dən gələn bütün məlumat
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Avtomatik createdAt və updatedAt
});

// Pre-save hook to update updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
