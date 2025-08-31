// controllers/insuranceController.js
const { validationResult } = require("express-validator");
const InsuranceForm = require("../models/user");

// Create new insurance form
exports.createForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Age check (≥ 18)
    const birthDate = new Date(req.body.birthDate);
    const age = Math.abs(new Date(Date.now() - birthDate.getTime()).getUTCFullYear() - 1970);
    if (age < 18) {
      return res.status(400).json({ error: "Minimum yaş 18 olmalıdır." });
    }

    const form = new InsuranceForm(req.body);
    await form.save();

    res.status(201).json({ message: "Form uğurla yaradıldı", data: form });
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};

// Get all forms
exports.getForms = async (req, res) => {
  try {
    const forms = await InsuranceForm.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Server xətası", details: err.message });
  }
};
