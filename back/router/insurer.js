const express = require("express");
const { body } = require("express-validator");
const tripController = require("../controller/insurerController");

const router = express.Router();

// ✅ Trip yaratmaq
router.post(
  "/",
  [
    body("embassy").notEmpty().withMessage("Embassy daxil edilməlidir"),
    body("coverageScope").isIn(["SCHENGEN", "WORLDWIDE", "REGIONAL_TR"])
      .withMessage("coverageScope yalnız SCHENGEN, WORLDWIDE və ya REGIONAL_TR ola bilər"),
    body("startDate").notEmpty().withMessage("startDate vacibdir"),
    body("endDate").notEmpty().withMessage("endDate vacibdir"),
    body("tripPurpose").isIn(["TOURISM", "BUSINESS"]).withMessage("tripPurpose yalniz TOURISM və ya BUSINESS ola bilər"),
    body("coverageAmount").isIn([5000, 10000, 30000, 50000])
      .withMessage("coverageAmount yalnız 5000, 10000, 30000 və ya 50000 ola bilər"),
    body("currency").isIn(["AZN", "EUR", "USD"]).withMessage("currency yalniz AZN, EUR və ya USD ola bilər"),
    body("covidCoverage").isIn(["FULL", "LIMIT"]).withMessage("covidCoverage yalniz FULL və ya LIMIT ola bilər"),
    body("termsAccepted").equals("true").withMessage("Şərtlərlə razılaşmaq məcburidir"),
  ],
  tripController.createTrip
);

// ✅ Qiymət hesablaması (preview)
router.post("/calculate-price", tripController.calculatePrice);

// ✅ Bütün trip-ləri al (pagination + filter dəstəyi ilə)
router.get("/", tripController.getTrips);

// ✅ Trip update
router.put("/:id", tripController.updateTrip);

// ✅ Trip delete
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
