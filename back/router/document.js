const express = require("express");
const router = express.Router();
const controller = require("../controller/document");

router.post("/", controller.createDocument);
router.get("/", controller.getDocuments);
router.get("/:id", controller.getDocumentById);
router.put("/:id", controller.updateDocument);
router.delete("/:id", controller.deleteDocument);

module.exports = router;
