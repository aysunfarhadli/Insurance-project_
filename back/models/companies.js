const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // hər şirkətin unikal kodu olacaq
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    logo_url: {
      type: String,
      default: null,
    },
    contact_info: {
      email: { type: String, default: null },
      phone: { type: String, default: null },
      address: { type: String, default: null },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
