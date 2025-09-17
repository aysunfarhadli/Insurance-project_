const mongoose = require("mongoose");

const orderFormCommonSchema = new mongoose.Schema(
  {
    order_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      unique: true, 
      required: true 
    },

    identification_type: { 
      type: String, 
      enum: ["passport", "id"], 
      required: true 
    },

    // Azərbaycan FİN kodu (7 simvol, I və O istisna)
    fin_code: { 
      type: String, 
      default: null, 
      match: /^[A-HJ-NP-Z0-9]{7}$/ 
    },

    // Şəxsiyyət vəsiqəsi və ya pasport nömrəsi (AZ1234567)
    id_card_number: { 
      type: String, 
      default: null, 
      match: /^[A-Z]{2}[0-9]{7}$/ 
    },

    date_of_birth: { type: Date, required: true },

    gender: { 
      type: String, 
      enum: ["male", "female"], 
      required: true 
    },

    first_name: { type: String, required: true, minlength: 2, maxlength: 50 },
    last_name: { type: String, required: true, minlength: 2, maxlength: 50 },

    // Azərbaycan telefon nömrəsi (+994 və ya 0 ilə başlayan)
    contact_phone: { 
      type: String, 
      required: true, 
      match: /^(?:\+994|0)(?:10|50|51|55|60|70|77|99)[0-9]{7}$/ 
    },

    address: { type: String, required: true },

    // Email yoxlaması
    email_copy: { 
      type: String, 
      default: null, 
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.OrderFormCommon ||
  mongoose.model("OrderFormCommon", orderFormCommonSchema);
