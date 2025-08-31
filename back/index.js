// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const paymentRoutes = require("./router/paymentRoutes");
const cors = require("cors");
const authRoutes = require("./router/auth");
const insuranceRoutes = require("./router/index.js");
const tripRoutes = require("./router/insurer");
const webhookRoutes = require("./router/webhooks");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors())



// DDOS qoruma
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Mongo qoşulma
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB qoşuldu"))
  .catch((err) => console.error("MongoDB error:", err));

// Router
app.use("/api/payments", paymentRoutes);
app.use("/auth", authRoutes);
app.use("/api/forms", insuranceRoutes);
app.use("/api/trips", tripRoutes);
app.use("/", webhookRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir`));
