const Document = require("../models/document");
const Order = require("../models/insurer");

// Create document
exports.createDocument = async (req, res) => {
  try {
    const { order_id, type, file_url } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const document = new Document({ order_id, type, file_url });
    await document.save();

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("order_id", "status start_date end_date");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("order_id", "status");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
