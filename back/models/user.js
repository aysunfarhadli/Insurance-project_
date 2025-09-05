const mongoose = require("mongoose");

const insuranceFormSchema = new mongoose.Schema({
  ownerType: { type: String, enum: ["SELF", "OTHER"], required: true },
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
  passportNumber: { type: String, required: true, match: /^[A-Z0-9]{5,15}$/ },
  finCode: { type: String, required: true, match: /^[A-Z0-9]{7}$/ },
  phone: { type: String, required: true }, // validated at controller
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("InsuranceForm", insuranceFormSchema);