const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  document_type: {
    type: String,
    enum: ["passport", "id_card", "medical_certificate", "other"], // can extend
    required: true,
  },
  file_url: {
    type: String, // path to uploaded file (e.g. /uploads/passport.jpg)
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Document || mongoose.model("Document", documentSchema);
