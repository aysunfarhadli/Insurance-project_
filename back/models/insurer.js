const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  embassy: {
    type: String,
    required: true,
  },
  coverageScope: {
    type: String,
    enum: ["SCHENGEN", "WORLDWIDE", "REGIONAL_TR"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date(); // today+1 sonrası
      },
      message: "Başlama tarixi sabahdan sonra olmalıdır",
    },
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return !this.startDate || value >= this.startDate;
      },
      message: "Bitmə tarixi başlama tarixindən əvvəl ola bilməz",
    },
  },
  multiEntry: {
    type: Boolean,
    default: false,
  },
  entriesCount: {
    type: String,
    enum: ["SINGLE", "MULTIPLE"],
    default: "SINGLE",
  },
  tripPurpose: {
    type: String,
    enum: ["TOURISM", "BUSINESS"],
    required: true,
  },

  // 🔹 yeni əlavə olunan sahələr
  coverageAmount: {
    type: Number,
    enum: [5000, 10000, 30000, 50000],
    required: true,
  },
  currency: {
    type: String,
    enum: ["AZN", "EUR", "USD"],
    required: true,
    default: "AZN",
  },
  covidCoverage: {
    type: String,
    enum: ["FULL", "LIMIT"],
    required: true,
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    validate: {
      validator: (v) => v === true,
      message: "Şərtlərlə razılaşmaq məcburidir",
    },
  },
});

module.exports = mongoose.model("Trip", tripSchema);
