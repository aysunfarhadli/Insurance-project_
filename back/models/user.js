const mongoose = require("mongoose");

const insuranceFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },

    ownerType: { type: String, enum: ["SELF", "OTHER"], required: true },
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },

    passportNumber: {
      type: String,
      required: true,
      match: /^[A-Z]{2}[0-9]{7}$/,
    },

    finCode: {
      type: String,
      required: true,
      match: /^[A-HJ-NP-Z0-9]{7}$/,
    },

    phone: {
      type: String,
      required: true,
      match: /^(?:\+994|0)(?:10|50|51|55|60|70|77|99)[0-9]{7}$/,
    },

    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InsuranceForm", insuranceFormSchema);
