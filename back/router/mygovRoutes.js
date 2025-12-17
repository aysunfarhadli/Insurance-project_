const express = require("express");
const router = express.Router();
const {
  getCompanies,
  issuePolicy,
  refreshToken
} = require("../controller/mygovController");

// Get all companies
router.get("/companies", getCompanies);

// Issue insurance policy
router.post("/issue-policy", issuePolicy);

// Refresh token manually
router.post("/refresh-token", refreshToken);

module.exports = router;

