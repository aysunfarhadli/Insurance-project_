const express = require("express");
const router = express.Router();
const categoryController = require("../controller/insCategory");

// CRUD
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
