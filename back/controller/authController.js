const crypto = require("crypto");

// TEMP in-memory stores (replace with DB later)
const otpRequests = {};   // { email: { hash, expiresAt, status } }
const users = {};         // { email: { email, lastLoginAt } }

// OTP generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Fake email sender (console)
const sendOtpEmail = async (email, otp) => {
  console.log(`👉 OTP for ${email}: ${otp}`);
};

// Request OTP
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = generateOtp();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

    otpRequests[email] = { hash: otpHash, expiresAt, status: "PENDING" };
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent (check console)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

    const record = otpRequests[email];
    if (!record) return res.status(400).json({ error: "No OTP request found" });

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== record.hash) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    record.status = "VERIFIED";

    // Register/login user
    users[email] = { email, lastLoginAt: new Date() };

    res.json({ success: true, message: "OTP verified", user: users[email] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { requestOtp, verifyOtp };
