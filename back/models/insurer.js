const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () =>
        `ORD${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },

    // finCode: { type: String, ref: "User", required: true },
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
