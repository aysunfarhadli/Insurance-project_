const express = require("express");
const router = express.Router();
const controller = require("../controller/companyInsType");

// CRUD
router.post("/", controller.addCompanyInsuranceType);
router.get("/", controller.getCompanyInsuranceTypes);
router.get("/:id", controller.getCompanyInsuranceTypeById);
router.put("/:id", controller.updateCompanyInsuranceType);
router.delete("/:id", controller.deleteCompanyInsuranceType);

module.exports = router;
