const OrderFormSpecific = require("../models/orderSpecific");
const Order = require("../models/insurer");

// 🔹 Create
exports.createOrderFormSpecific = async (req, res) => {
  try {
    const { order_id, category_code, details } = req.body;

    // ✅ Find order by custom string orderId, not Mongo _id
    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Prevent duplicate forms for the same order
    const exists = await OrderFormSpecific.findOne({ order_id });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Specific form already exists for this order" });
    }

    // ✅ Create new form
    const form = new OrderFormSpecific({ order_id, category_code, details });
    await form.save();

    res.status(201).json({
      message: "Order form created successfully ✅",
      data: form,
    });
  } catch (err) {
    console.error("createOrderFormSpecific error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get all forms (with order info)
exports.getOrderFormSpecifics = async (req, res) => {
  try {
    const forms = await OrderFormSpecific.find();

    // ✅ Manually populate order info by orderId
    const populatedForms = await Promise.all(
      forms.map(async (form) => {
        const order = await Order.findOne({ orderId: form.order_id }).select(
          "status start_date end_date category_id"
        );
        return { ...form.toObject(), order };
      })
    );

    res.json(populatedForms);
  } catch (err) {
    console.error("getOrderFormSpecifics error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get form by ID (with order info)
exports.getOrderFormSpecificById = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const order = await Order.findOne({ orderId: form.order_id }).select(
      "status start_date end_date category_id"
    );

    res.json({ ...form.toObject(), order });
  } catch (err) {
    console.error("getOrderFormSpecificById error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update
exports.updateOrderFormSpecific = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({
      message: "Form updated successfully ✅",
      data: form,
    });
  } catch (err) {
    console.error("updateOrderFormSpecific error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete
exports.deleteOrderFormSpecific = async (req, res) => {
  try {
    const form = await OrderFormSpecific.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Form deleted successfully 🗑️" });
  } catch (err) {
    console.error("deleteOrderFormSpecific error:", err);
    res.status(500).json({ message: err.message });
  }
};
