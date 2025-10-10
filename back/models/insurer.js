const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    finCode: { type: String, ref: "User", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "priced", "approved", "paid", "rejected", "canceled"],
      default: "draft",
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    currency: { type: String, required: true },
    total_amount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// ✅ Əvvəlki modeli silirik ki, OverwriteModelError olmasın
delete mongoose.models.Order;

module.exports = mongoose.model("Order", orderSchema);
