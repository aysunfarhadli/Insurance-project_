const axios = require('axios');
require("dotenv").config();

// MyGov API Configuration
const MYGOV_API_URL = process.env.MYGOV_API_URL || "https://insure.az/api";
const MYGOV_USERNAME = process.env.MYGOV_USERNAME || "ASANPAY";
const MYGOV_PASSWORD = process.env.MYGOV_PASSWORD || "";

// Token cache (in-memory)
let tokenCache = {
  token: null,
  expiresAt: null
};

/**
 * Get MyGov API Token
 * Token cache edilir və expire olana qədər istifadə olunur
 */
const getToken = async () => {
  try {
    // Cache-dən token varsa və expire olmayıbsa, onu qaytar
    if (tokenCache.token && tokenCache.expiresAt && new Date() < tokenCache.expiresAt) {
      return tokenCache.token;
    }

    // Yeni token al (GET request ilə body göndərmək qeyri-adi, amma API belə tələb edir)
    const response = await axios({
      method: 'GET',
      url: `${MYGOV_API_URL}/token`,
      data: {
        username: MYGOV_USERNAME,
        password: MYGOV_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = response.data?.token || response.data?.access_token || response.data;

    if (!token) {
      throw new Error("Token alına bilmədi");
    }

    // Token-i cache et (1 saat müddətində etibarlıdır)
    tokenCache.token = token;
    tokenCache.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    console.log("✅ MyGov token alındı");
    return token;
  } catch (error) {
    console.error("MyGov token alma xətası:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Token alına bilmədi");
  }
};

/**
 * Get all companies from MyGov API
 */
const getCompanies = async (req, res) => {
  try {
    const token = await getToken();

    const response = await axios.get(`${MYGOV_API_URL}/icbari/getCompanies`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Get companies error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || "Şirkətlər gətirilə bilmədi",
      details: error.response?.data || error.message
    });
  }
};

/**
 * Issue insurance policy
 */
const issuePolicy = async (req, res) => {
  try {
    const {
      company,
      vehicleCarNumber,
      vehicleCertificateNumber,
      vehicleCertificateDate,
      insuredIdDocument,
      insuredPin,
      insuredPhoneNumber,
      userDriverLicense,
      email
    } = req.body;

    // Validation
    if (!company || !vehicleCarNumber || !vehicleCertificateNumber || !insuredIdDocument) {
      return res.status(400).json({
        success: false,
        error: "Zəruri məlumatlar doldurulmayıb"
      });
    }

    const token = await getToken();

    const policyData = {
      company,
      vehicleCarNumber,
      vehicleCertificateNumber,
      vehicleCertificateDate: vehicleCertificateDate || new Date().getFullYear().toString(),
      insuredIdDocument,
      insuredPin: insuredPin || "",
      insuredPhoneNumber: insuredPhoneNumber || "",
      userDriverLicense: userDriverLicense || "",
      email: email || ""
    };

    // Issue policy (GET request ilə body göndərmək qeyri-adi, amma API belə tələb edir)
    const response = await axios({
      method: 'GET',
      url: `${MYGOV_API_URL}/icbari/issuePolicy`,
      data: policyData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Issue policy error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || "Polis yaradıla bilmədi",
      details: error.response?.data || error.message
    });
  }
};

/**
 * Refresh token manually
 */
const refreshToken = async (req, res) => {
  try {
    // Cache-i təmizlə
    tokenCache.token = null;
    tokenCache.expiresAt = null;

    // Yeni token al
    const token = await getToken();

    res.json({
      success: true,
      message: "Token yeniləndi",
      token: token
    });
  } catch (error) {
    console.error("Refresh token error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || "Token yenilənə bilmədi",
      details: error.response?.data || error.message
    });
  }
};

module.exports = {
  getCompanies,
  issuePolicy,
  refreshToken,
  getToken
};

