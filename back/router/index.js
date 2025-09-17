// routes/insuranceRoutes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const insuranceController = require("../controller/user");

router.post(
  "/",
  [
    body("ownerType").isIn(["SELF", "OTHER"]),
    body("firstName").isLength({ min: 2, max: 50 }),
    body("lastName").isLength({ min: 2, max: 50 }),
    body("middleName").optional().isLength({ max: 50 }),
    body("birthDate").isISO8601().toDate(),
    body("gender").isIn(["MALE", "FEMALE"]),
    body("passportNumber").matches(/^[A-Z0-9]{5,15}$/),
    body("finCode").matches(/^[A-Z0-9]{7}$/),
    body("phone").matches(/^\+994[0-9]{9}$/), // Azərbaycan formatı
    body("email").isEmail(),
  ],
  insuranceController.createForm
);

router.get("/", insuranceController.getForms);

module.exports = router;
