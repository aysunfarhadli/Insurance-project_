const Order = require("../models/insurer");
const User = require("../models/authUser");
const Category = require("../models/insCategory");

// 🔹 Yeni trip əlavə
exports.createOrder = async (req, res) => {
  try {
    const { user_id, category_id, product_id, status, start_date, end_date, currency, total_amount } = req.body;

    // validate user & category
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const category = await Category.findById(category_id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ message: "end_date must be later than start_date" });
    }

    const order = new Order({
      user_id,
      category_id,
      product_id,
      status,
      start_date,
      end_date,
      currency,
      total_amount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Qiymət hesablaması (yalnız preview üçün)
exports.calculatePrice = (req, res) => {
  try {
    const { startDate, endDate, coverageAmount } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate || !coverageAmount) {
      return res.status(400).json({ error: "startDate, endDate və coverageAmount vacibdir" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ error: "Bitmə tarixi başlama tarixindən sonra olmalıdır." });
    }

    // Sadə hesablamaya misal (sonradan dəyişilə bilər)
    const dailyRate = coverageAmount / 1000 * 0.5;
    const price = dailyRate * days;

    res.json({ days, price });
  } catch (err) {
    res.status(500).json({ error: "Qiymət hesablamasında xəta", details: err.message });
  }
};

// 🔹 Bütün trip-ləri al (pagination + filter)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "first_name last_name email phone")
      .populate("category_id", "name code")
      .populate("product_id", "name code");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user_id", "first_name last_name email phone")
      .populate("category_id", "name code")
      .populate("product_id", "name code");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Trip update
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("user_id", "first_name last_name email phone")
      .populate("category_id", "name code")
      .populate("product_id", "name code");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Trip delete
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
