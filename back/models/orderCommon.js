const mongoose = require("mongoose");

const orderFormCommonSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", unique: true, required: true },
    identification_type: { type: String, enum: ["passport", "id"], required: true },
    fin_code: { type: String, default: null },
    id_card_number: { type: String, default: null },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    contact_phone: { type: String, required: true },
    address: { type: String, required: true },
    email_copy: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.OrderFormCommon ||
  mongoose.model("OrderFormCommon", orderFormCommonSchema);
