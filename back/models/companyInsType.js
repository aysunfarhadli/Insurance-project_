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
    // Sığorta planı məlumatları
    monthly_price: {
      type: Number,
      default: null, // AZN
    },
    coverage_amount: {
      type: Number,
      default: null, // AZN
    },
    processing_time_hours: {
      type: Number,
      default: null, // Saat
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews_count: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ["Ən Populyar", "Ən Sürətli", "Premium", "Budget", null],
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Eyni şirkət + eyni category təkrar olmasın
companyInsuranceTypeSchema.index({ company_id: 1, category_id: 1 }, { unique: true });

module.exports = mongoose.models.CompanyInsuranceType ||
  mongoose.model("CompanyInsuranceType", companyInsuranceTypeSchema);
