const OrderFormCommon = require("../models/orderCommon");
const Order = require("../models/insurer");

// Create
exports.createOrderFormCommon = async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const exists = await OrderFormCommon.findOne({ order_id });
    if (exists) return res.status(400).json({ message: "Common form already exists for this order" });

    const form = new OrderFormCommon(req.body);
    await form.save();

    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all
exports.getOrderFormCommons = async (req, res) => {
  try {
    const forms = await OrderFormCommon.find().populate("order_id", "status start_date end_date");
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getOrderFormCommonById = async (req, res) => {
  try {
    const form = await OrderFormCommon.findById(req.params.id).populate("order_id", "status");
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateOrderFormCommon = async (req, res) => {
  try {
    const form = await OrderFormCommon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteOrderFormCommon = async (req, res) => {
  try {
    const form = await OrderFormCommon.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
