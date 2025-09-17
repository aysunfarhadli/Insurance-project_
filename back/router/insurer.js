const express = require("express");
const router = express.Router();
const orderController = require("../controller/insurerController");

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.post("/calculate-price", orderController.calculatePrice);

module.exports = router;
