const express = require("express");
const router = express.Router();
const companyController = require("../controller/companies");
const authMiddleware = require("../middleware/authMiddleware");

// CRUD
router.post("/", authMiddleware, companyController.createCompany);
router.get("/", companyController.getCompanies);
router.get("/:id", companyController.getCompanyById);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

// Mövcud şirkətlər üçün kateqoriyaları sync etmək
router.post("/sync-categories", authMiddleware, companyController.syncCompanyCategories);

module.exports = router;
