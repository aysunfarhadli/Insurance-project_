const mongoose = require("mongoose");

const companyInsuranceTypeSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // FK → companies
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // FK → categories
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Eyni şirkət + eyni category təkrar olmasın
companyInsuranceTypeSchema.index({ company_id: 1, category_id: 1 }, { unique: true });

module.exports = mongoose.models.CompanyInsuranceType ||
  mongoose.model("CompanyInsuranceType", companyInsuranceTypeSchema);
