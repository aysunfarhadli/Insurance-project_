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
const authRoute = require("./router/authUser.js")
const cookieParser = require("cookie-parser");
const companyRoutes = require("./router/companies");
const companyInsuranceTypeRoutes = require("./router/companyInsType");
const orderRoutes = require("./router/insurer");
const orderFormCommonRoutes = require("./router/orderCommon");
const orderFormSpecificRoutes = require("./router/orderSpecific");
const documentRoutes = require("./router/document");
const mygovRoutes = require("./router/mygovRoutes");
const app = express();
const categoryRoutes = require("./router/insCategory");
const dbDel = require("./router/dbDel");


app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // frontend-in origin-i
    credentials: true                // cookie üçün şərtdir
}));
app.use(cookieParser());



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
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes); // Keep both for compatibility
app.use("/auth", authRoutes);
app.use("/api/forms", insuranceRoutes);
// app.use("/api/trips", tripRoutes);
app.use("/", webhookRoutes);
app.use("/del", dbDel);

app.use("/authUser", authRoute)
app.use("/api/categories", categoryRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/company-insurance-types", companyInsuranceTypeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-form-common", orderFormCommonRoutes);
app.use("/api/order-form-specific", orderFormSpecificRoutes);
app.use("/api/mygov", mygovRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir`));
