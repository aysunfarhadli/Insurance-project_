const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // unikallıq
      enum: ["life", "travel", "vehicle", "property", "medical"], // məhdud seçimlər
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

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
