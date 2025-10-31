const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // unikallıq
      enum: [
        "vehicle_liability",             // Avtonəqliyyat Mülki Məsuliyyət
        "property_insurance",            // Daşınmaz Əmlakın İcbari Sığortası
        "property_liability",            // Əmlakın İstismarı üzrə Məsuliyyət
        "employer_liability",            // İşəgötürənin Məsuliyyəti
        "passenger_accident",            // Sərnişinlərin Qəza Sığortası
        "hazardous_liability"            // Təhlükəli Obyektlərin Məsuliyyəti
      ],
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

delete mongoose.models.Category;

module.exports = mongoose.model("Category", categorySchema);