// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const paymentRoutes = require("./router/paymentRoutes");
const authRoutes = require("./router/auth");
const insuranceRoutes = require("./router/index.js");
const webhookRoutes = require("./router/webhooks");
const authRoute = require("./router/authUser.js");
const companyRoutes = require("./router/companies");
const companyInsuranceTypeRoutes = require("./router/companyInsType");
const orderRoutes = require("./router/insurer");
const orderFormCommonRoutes = require("./router/orderCommon");
const orderFormSpecificRoutes = require("./router/orderSpecific");
const documentRoutes = require("./router/document");
const mygovRoutes = require("./router/mygovRoutes");
const categoryRoutes = require("./router/insCategory");
const dbDel = require("./router/dbDel");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

/* -------------------- CORS (FIXED) -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://insurance-project-beta.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Required for preflight requests
app.options("*", cors());

/* -------------------- RATE LIMIT -------------------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

/* -------------------- DATABASE -------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------- ROUTES -------------------- */

app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes); // compatibility
app.use("/auth", authRoutes);
app.use("/authUser", authRoute);

app.use("/api/forms", insuranceRoutes);
app.use("/", webhookRoutes);
app.use("/del", dbDel);

app.use("/api/categories", categoryRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/company-insurance-types", companyInsuranceTypeRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-form-common", orderFormCommonRoutes);
app.use("/api/order-form-specific", orderFormSpecificRoutes);
app.use("/api/mygov", mygovRoutes);

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
