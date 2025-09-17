const express = require("express");
const router = express.Router();
const controller = require("../controller/orderCommon");

router.post("/", controller.createOrderFormCommon);
router.get("/", controller.getOrderFormCommons);
router.get("/:id", controller.getOrderFormCommonById);
router.put("/:id", controller.updateOrderFormCommon);
router.delete("/:id", controller.deleteOrderFormCommon);

module.exports = router;
