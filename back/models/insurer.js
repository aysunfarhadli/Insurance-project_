const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProduct", default: null },

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

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
