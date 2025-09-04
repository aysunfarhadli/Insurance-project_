const OrderFormSpecific = require("../models/orderSpecific");
const Order = require("../models/insurer");

// Create
exports.createOrderFormSpecific = async (req, res) => {
  try {
    const { order_id, category_code, details } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const exists = await OrderFormSpecific.findOne({ order_id });
    if (exists) return res.status(400).json({ message: "Specific form already exists for this order" });

    const form = new OrderFormSpecific({ order_id, category_code, details });
    await form.save();

    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all
exports.getOrderFormSpecifics = async (req, res) => {
  try {
    const forms = await OrderFormSpecific.find().populate("order_id", "status start_date end_date");
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getOrderFormSpecificById = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findById(req.params.id).populate("order_id", "status");
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateOrderFormSpecific = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteOrderFormSpecific = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
