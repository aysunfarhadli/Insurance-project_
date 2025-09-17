const express = require("express");
const router = express.Router();
const controller = require("../controller/orderSpecific");

router.post("/", controller.createOrderFormSpecific);
router.get("/", controller.getOrderFormSpecifics);
router.get("/:id", controller.getOrderFormSpecificById);
router.put("/:id", controller.updateOrderFormSpecific);
router.delete("/:id", controller.deleteOrderFormSpecific);

module.exports = router;
