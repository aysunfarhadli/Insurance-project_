const InsuranceOrder = require("../models/insurer");
const User = require("../models/authUser");
const Category = require("../models/insCategory");

// 🔹 Yeni order əlavə
exports.createOrder = async (req, res) => {
  try {
    const {
      finCode,
      category_id,
      status,
      start_date,
      end_date,
      currency,
      total_amount,
      userId
    } = req.body;

    // ✅ FinCode yoxlaması (boş gəlməsin deyə)
    if (!finCode) {
      return res.status(400).json({ message: "finCode tələb olunur" });
    }

    // ✅ Kateqoriya yoxlaması
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    // ✅ Tarix yoxlaması
    if (new Date(end_date) <= new Date(start_date)) {
      return res
        .status(400)
        .json({ message: "Bitmə tarixi başlanğıc tarixindən sonra olmalıdır" });
    }

    // ✅ Yeni order yarat
    const order = new InsuranceOrder({
      finCode,
      category_id,
      status,
      start_date,
      end_date,
      currency,
      total_amount,
      userId
    });
    await order.save();


    res.status(201).json({
      message: "Sifariş uğurla yaradıldı ✅",
      data: order,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};


// 🔹 Qiymət hesablaması
exports.calculatePrice = (req, res) => {
  try {
    const { startDate, endDate, coverageAmount } = req.body;
    if (!startDate || !endDate || !coverageAmount) {
      return res.status(400).json({ error: "startDate, endDate və coverageAmount vacibdir" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ error: "Bitmə tarixi başlanğıc tarixindən sonra olmalıdır." });
    }

    const dailyRate = (coverageAmount / 1000) * 0.5;
    const price = dailyRate * days;

    res.json({ days, price });
  } catch (err) {
    res.status(500).json({ error: "Qiymət hesablamasında xəta", details: err.message });
  }
};

// 🔹 Bütün order-ləri al (finCode ilə user məlumatı)
exports.getOrders = async (req, res) => {
  try {
    const orders = await InsuranceOrder.find()
      .populate({ path: "category_id", select: "name code" })
    // .populate({ path: "product_id", select: "name code" });

    // finCode ilə user məlumatını ayrıca əlavə edirik
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findOne({ finCode: order.finCode }).select("first_name last_name email phone finCode");
        return { ...order.toObject(), user };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Tək order
exports.getOrderById = async (req, res) => {
  try {
    const order = await InsuranceOrder.findById(req.params.id)
      .populate({ path: "category_id", select: "name code" })
    // .populate({ path: "product_id", select: "name code" });

    if (!order) return res.status(404).json({ message: "Order tapılmadı" });

    const user = await User.findOne({ finCode: order.finCode }).select("first_name last_name email phone finCode");
    res.json({ ...order.toObject(), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update
exports.updateOrder = async (req, res) => {
  try {
    const order = await InsuranceOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({ path: "category_id", select: "name code" })
    // .populate({ path: "product_id", select: "name code" });

    if (!order) return res.status(404).json({ message: "Order tapılmadı" });

    const user = await User.findOne({ finCode: order.finCode }).select("first_name last_name email phone finCode");
    res.json({ ...order.toObject(), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete
exports.deleteOrder = async (req, res) => {
  try {
    const order = await InsuranceOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order tapılmadı" });
    res.json({ message: "Order silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
