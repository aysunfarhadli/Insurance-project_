const mongoose = require("mongoose");

const orderFormSpecificSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", unique: true, required: true },
    category_code: {
      type: String,
      enum: ["life", "travel", "vehicle", "medical", "property"],
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible JSON
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.OrderFormSpecific ||
  mongoose.model("OrderFormSpecific", orderFormSpecificSchema);
