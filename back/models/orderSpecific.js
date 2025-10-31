const mongoose = require("mongoose");

const orderFormSpecificSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    category_code: {
      type: String,
      enum: [
        "vehicle_liability",             // Avtonəqliyyat Mülki Məsuliyyət
        "property_insurance",            // Daşınmaz Əmlakın İcbari Sığortası
        "property_liability",            // Əmlakın İstismarı üzrə Məsuliyyət
        "employer_liability",            // İşəgötürənin Məsuliyyəti
        "passenger_accident",            // Sərnişinlərin Qəza Sığortası
        "hazardous_liability"            // Təhlükəli Obyektlərin Məsuliyyəti
      ],
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible JSON
      required: true,
    },
  },
  { timestamps: true }
);

delete mongoose.models.OrderFormSpecific;

module.exports = mongoose.model("OrderFormSpecific", orderFormSpecificSchema);




