  const axios = require('axios');
  const https = require('https');
  const fs = require('fs');
  const path = require('path');
const tls = require('tls');
const crypto = require('crypto');
  const { getBrowserDetailsFromRequest } = require('../browserDetails/index.js');
  require("dotenv").config();
  const CibpayOrder = require("../models/cibpay");

  // Configuration - use environment variables so credentials aren't hardcoded.
  const CIBPAY_USER = process.env.CIBPAY_USER || process.env.CIBPAY_USERNAME || "cibpay";
  const CIBPAY_PASS = process.env.CIBPAY_PASS || process.env.CIBPAY_PASSWORD || "gxIO8aH6N3j13FREp2";
  const BASE_URL = process.env.CIBPAY_API_URL || "https://api-preprod.cibpay.co"; // sandbox default

  // Basic Auth header value
  const auth = Buffer.from(`${CIBPAY_USER}:${CIBPAY_PASS}`).toString("base64");

  // HTTPS agent for pfx certificate (optional) and strict mode depending on env
  const pfxPath = process.env.CIBPAY_PFX_PATH || "./cert/api-cibpay.p12";
const usePfx =
  String(process.env.CIBPAY_USE_PFX ?? (process.env.NODE_ENV === "production" ? "true" : "false"))
    .toLowerCase() === "true";

let pfxBuffer;
if (usePfx && fs.existsSync(pfxPath)) {
  pfxBuffer = fs.readFileSync(pfxPath);
  const passphrase = process.env.CIBPAY_PFX_PASSPHRASE;
  try {
    // Fail fast with a clear error if the .p12/.pfx can't be opened
    tls.createSecureContext({ pfx: pfxBuffer, passphrase });
  } catch (e) {
    const hint =
      "Invalid CIBPAY PFX or passphrase. Fix CIBPAY_PFX_PASSPHRASE, replace the .p12 file, " +
      "or disable certificate usage with CIBPAY_USE_PFX=false (recommended for sandbox unless required).";
    e.message = `${e.message} | ${hint}`;
    throw e;
  }
}

const agent = new https.Agent({
  pfx: pfxBuffer,
  passphrase: process.env.CIBPAY_PFX_PASSPHRASE,
  // in production we should validate the cert, this flag can be toggled via env
  rejectUnauthorized: process.env.NODE_ENV === "production"
});
  /**
   * Authorize - Kartla ödəniş yaratmaq
   */


const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await CibpayOrder.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        failureMessage: order.failureMessage,
        pan: order.pan,
        updatedAt: order.updatedAt,
      }
    });
  } catch (err) {
    console.error("getOrderStatus error:", err);
    return res.status(500).json({ success: false, error: "SERVER_ERROR" });
  }
};

/**
 * CIBPAY Webhook Controller
 * Tranzaksiyaların status dəyişikliyi barədə məlumatları qəbul edir
 */
const cibpayWebhook = async (req, res) => {
  try {
    // Optional: verify auth header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const [user, pass] = Buffer.from(base64Credentials, "base64")
      .toString("utf-8")
      .split(":");

    if (user !== process.env.CIBPAY_WEBHOOK_USER || pass !== process.env.CIBPAY_WEBHOOK_PASS) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    for (const cibOrder of orders) {
      await CibpayOrder.findOneAndUpdate(
        { orderId: cibOrder.merchant_order_id },
        {
          transactionId: cibOrder.id,
          status: cibOrder.status,
          amount: parseFloat(cibOrder.amount),
          currency: cibOrder.currency,
          pan: cibOrder.pan,
          failureMessage: cibOrder.failure_message || null,
          updatedAt: new Date(cibOrder.updated),
          rawResponse: cibOrder
        },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Webhook received:", orders.map(o => o.merchant_order_id));
    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




  // Authorize Payment Controller (Direct API with browserInfo)
  const authorizePayment = async (req, res) => {
  try {
    let { orderId, merchant_order_id, amount, pan, card, client, options, location, browserInfo } = req.body;
    // allow either field name
    orderId = orderId || merchant_order_id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required"
      });
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: "Valid amount is required" });
    }
    if (!pan || typeof pan !== "string" || pan.length < 12) {
      return res.status(400).json({ success: false, error: "Valid card PAN is required" });
    }
    if (!card || !card.cvv || !card.expiration_month || !card.expiration_year) {
      return res.status(400).json({ success: false, error: "Card details (cvv and expiry) are required" });
    }

    // ✅ CVV Validation - CVV should be 3-4 digits, numeric only
    const cvvStr = String(card.cvv).trim();
    if (!/^\d{3,4}$/.test(cvvStr)) {
      return res.status(400).json({ 
        success: false, 
        error: "CVV must be 3 or 4 digits (numeric only)" 
      });
    }

    // ✅ BrowserInfo – əvvəlcə body-dən, yoxdursa request header-lərindən toplayırıq
    const rawBrowser =
      (browserInfo && Object.keys(browserInfo).length > 0 && browserInfo) ||
      (() => {
        const fallback = getBrowserDetailsFromRequest(req);
        // getBrowserDetailsFromRequest snake_case qaytarır, onu browserInfo camelCase-ə map edək
        return {
          acceptHeader: fallback.accept_header,
          javaEnabled: fallback.java_enabled,
          javascriptEnabled: fallback.javascript_enabled,
          language: fallback.language,
          colorDepth: fallback.color_depth,
          screenHeight: fallback.screen_height,
          screenWidth: fallback.screen_width,
          timeZone: fallback.time_zone_offset,
          userAgent: fallback.user_agent
        };
      })();

    const finalBrowserInfo = {
      acceptHeader: rawBrowser.acceptHeader || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      javaEnabled: rawBrowser.javaEnabled ?? false,
      javascriptEnabled: rawBrowser.javascriptEnabled ?? true,
      language: rawBrowser.language || "az-AZ",
      colorDepth: rawBrowser.colorDepth || 24,
      screenHeight: rawBrowser.screenHeight || 1080,
      screenWidth: rawBrowser.screenWidth || 1920,
      timeZone: rawBrowser.timeZone ?? new Date().getTimezoneOffset(),
      userAgent: rawBrowser.userAgent || req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    };

    // sanity check: ensure none of the required browser fields are missing
    const missing = [];
    ["acceptHeader","javaEnabled","javascriptEnabled","language","colorDepth","screenHeight","screenWidth","timeZone","userAgent"].forEach(k => {
      if (finalBrowserInfo[k] === undefined || finalBrowserInfo[k] === "") missing.push(k);
    });
    if (missing.length) {
      console.warn("authorizePayment: missing browserInfo fields", missing);
      // still continue; CIBPay may accept defaults, but log for debugging
    }


    // Cibpay authorize endpoint - Direct API browserInfo obyekti ilə
    const clientIp = (location && location.ip) || req.ip || req.headers["x-forwarded-for"] || "93.88.94.130";

    const authData = {
      order_id: orderId, // Cibpay API-də order_id body-də göndərilir
      amount: String(amount),
      pan,
      card: {
        cvv: String(card.cvv).trim(), // ✅ Ensure CVV is a string, trimmed
        expiration_month: Number(card.expiration_month),
        expiration_year: Number(card.expiration_year),
        holder: card.holder || ""
      },
      client: {
        name: client?.name || "Test",
        email: client?.email || "test@mail.com"
      },
      options: {
        force3d: options?.force3d || 1,
        ...(options?.terminal ? { terminal: String(options.terminal) } : {})
      },
      browserInfo: finalBrowserInfo,
      device: {
        browser: finalBrowserInfo,
        ipAddress: clientIp
      },
      // ✅ Cibpay validation üçün ayrıca location.ip də veririk
      location: {
        ip: clientIp
      }
    };

      console.log("Sending to CIBPAY authorize:", JSON.stringify({
        ...authData,
        pan: authData.pan.slice(-4).padStart(authData.pan.length, '*'),
        card: {
          ...authData.card,
          cvv: '***'
        }
      }, null, 2));
      console.log("CVV Details - Length:", String(card.cvv).length, "Type:", typeof card.cvv, "Value (trimmed):", String(card.cvv).trim());
      console.log("Order ID for authorize:", orderId);

      // Cibpay authorize endpoint - orderId body-də göndərilir
      const response = await axios.post(
        `${BASE_URL}/orders/authorize`,
        authData,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          httpsAgent: agent
        }
      );

      // Update order status in database
      const maskedPan = pan.length >= 4 
        ? pan.substring(pan.length - 4).padStart(pan.length, '*')
        : pan;
      
      // persist/update local order record using the merchant order id the client supplied
      await CibpayOrder.findOneAndUpdate(
        { orderId: orderId },
        {
          transactionId: response.data.id || orderId,
          status: ["AUTHORIZED","CHARGED"].includes(response.data.status)
            ? response.data.status
            : "AUTHORIZED",
          pan: response.data.pan || maskedPan,
          rawResponse: response.data,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      res.json({ success: true, data: response.data });
    } catch (error) {
      console.error("Authorize error:", error.response?.status, error.response?.data || error.message);
      console.error("CVV Debug Info - Length:", String(card?.cvv).length, "Type:", typeof card?.cvv, "Value:", String(card?.cvv).trim());
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // 403 xətası üçün xüsusi mesaj
      if (error.response?.status === 403) {
        return res.status(403).json({
          success: false,
          error: "Authorization failed - Access forbidden. Check order status and credentials.",
          details: error.response?.data || "Order may not be in 'new' status or authorization credentials are invalid"
        });
      }

      res.status(error.response?.status || 500).json({
        success: false,
        error: error.response?.data || error.message
      });
    }
  };




  /**
   * Get orders list
   */
  const getOrders = async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/`, {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch orders',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Get order by ID
   */
  const getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching order:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to fetch order',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Get order by Merchant Order ID (CIBPay API)
   * GET /orders/?merchant_order_id={merchant_order_id}
   */
  const getOrderByMerchantId = async (req, res) => {
    try {
      const { merchantOrderId } = req.params;
      if (!merchantOrderId) {
        return res.status(400).json({ success: false, error: "merchantOrderId is required" });
      }

      const response = await axios.get(`${BASE_URL}/orders/`, {
        params: { merchant_order_id: merchantOrderId },
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json"
        },
        httpsAgent: agent
      });

      const order =
        Array.isArray(response.data?.orders) && response.data.orders.length > 0
          ? response.data.orders[0]
          : null;

      return res.json({ success: true, data: response.data, order });
    } catch (error) {
      console.error("Error fetching order by merchant id:", error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        success: false,
        error: "Failed to fetch order by merchant id",
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Create order
   */
  const createOrder = async (req, res) => {
  try {
    // Validation
    if (!req.body.amount || isNaN(req.body.amount) || req.body.amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount is required and must be a positive number"
      });
    }

    if (!req.body.merchant_order_id) {
      return res.status(400).json({
        success: false,
        error: "merchant_order_id is required"
      });
    }

    // Validate currency is set
    if (!req.body.currency) {
      return res.status(400).json({
        success: false,
        error: "currency is required (e.g., AZN, USD, EUR)"
      });
    }

    // Build options object - terminal parametrini tamamilə sil
    const options = {
      auto_charge: req.body.options?.auto_charge ?? false,
      expiration_timeout: req.body.options?.expiration_timeout || "30m", // 30 dəqiqə (4320m çox böyükdür)
      force3d: req.body.options?.force3d || 1,
      language: req.body.options?.language || "az",
      return_url: req.body.options?.return_url || "https://cibpay.az",
      // Some test cards require a specific terminal (per CIBPay integration doc).
      // If omitted, CIBPay uses the merchant's default terminal.
      ...(req.body.options?.terminal ? { terminal: String(req.body.options.terminal) } : {})
    };

    const orderData = {
      amount: Number.parseFloat(req.body.amount).toFixed(2),
      currency: req.body.currency || "AZN",
      merchant_order_id: String(req.body.merchant_order_id),
      options: options,
      // Bank-side validation often expects these fields; provide safe defaults.
      custom_fields: {
        home_phone_country_code: req.body.custom_fields?.home_phone_country_code || "994",
        home_phone_subscriber: req.body.custom_fields?.home_phone_subscriber || "129998877",
        mobile_phone_country_code: req.body.custom_fields?.mobile_phone_country_code || "055",
        mobile_phone_subscriber: req.body.custom_fields?.mobile_phone_subscriber || "5554433",
        work_phone_country_code: req.body.custom_fields?.work_phone_country_code || "010",
        work_phone_subscriber: req.body.custom_fields?.work_phone_subscriber || "2223344"
      },
      client: {
        name: req.body.client?.name || "Test",
        email: req.body.client?.email || "test@mail.com",
        phone: req.body.client?.phone || "99455555555",
        city: req.body.client?.city || "Baku",
        country: req.body.client?.country || "AZE",
        address: req.body.client?.address || "1, Azerbaijan ave.",
        zip: req.body.client?.zip || "1000"
      }
    };

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
    const requestId = req.headers["x-request-id"] || crypto.randomUUID();

    const response = await axios.post(
      `${BASE_URL}/orders/create`,
      orderData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Request-Id": requestId
        },
        httpsAgent: agent
      }
    );

    console.log("✅ CibPay create order response status:", response.status);
    console.log("📦 CibPay full response:", JSON.stringify(response.data, null, 2));
    console.log("📍 Response headers:", {
      location: response.headers?.location,
      Location: response.headers?.Location
    });

    // CIBPay typically returns { orders: [...] } for create order
    const createdOrder =
      Array.isArray(response.data?.orders) && response.data.orders.length > 0
        ? response.data.orders[0]
        : response.data;

    console.log("🔗 Created order object:", JSON.stringify(createdOrder, null, 2));

    // CIBPay may return the checkout link in the Location response header or in the response body
    const checkout_url =
      response.headers?.location ||
      response.headers?.Location ||
      createdOrder?.checkout_url ||
      createdOrder?.checkoutUrl ||
      (createdOrder?.id ? `https://checkout-preprod.cibpay.co/pay/${createdOrder.id}` : null);

    console.log("🌐 Final checkout_url:", checkout_url);

    // Save to MongoDB
    await CibpayOrder.findOneAndUpdate(
      { orderId: orderData.merchant_order_id },
      {
        orderId: orderData.merchant_order_id,
        amount: orderData.amount,
        currency: orderData.currency,
        status: createdOrder?.status || "new",
        transactionId: createdOrder?.id || undefined,
        rawResponse: response.data,
        checkoutUrl: checkout_url || undefined
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: response.data, order: createdOrder, checkout_url });
  } catch (error) {
    console.error("❌ Error creating order with CibPay:");
    console.error("   Status:", error.response?.status);
    console.error("   Message:", error.message);
    console.error("   CibPay error:", JSON.stringify(error.response?.data, null, 2));
    console.error("   Request was:", JSON.stringify(orderData, null, 2));
    
    // Cibpay API validation xətası
    if (error.response?.status === 422) {
      return res.status(422).json({
        success: false,
        error: "Validation failed",
        details: error.response?.data || error.message,
        request_data: orderData
      });
    }

    // 402 Payment Required from CibPay
    if (error.response?.status === 402) {
      return res.status(402).json({
        success: false,
        error: "Payment required - CibPay account issue or order already exists",
        details: error.response?.data || error.message,
        request_data: orderData
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: "Failed to create order",
      details: error.response?.data || error.message,
      request_data: orderData
    });
  }
};

  /**
   * Create order with Millikart recurring
   */
  const createOrderMKRecurring = async (req, res) => {
    try {
      const orderData = {
        amount: String(req.body.amount),
        currency: req.body.currency || 'AZN',
        extra_fields: {
          invoice_id: req.body.extra_fields?.invoice_id || '001',
          oneclick: {
            customer_id: req.body.extra_fields?.oneclick?.customer_id || '001',
            prechecked: req.body.extra_fields?.oneclick?.prechecked || 0
          }
        },
        merchant_order_id: req.body.merchant_order_id,
        options: {
          auto_charge: req.body.options?.auto_charge || true,
          expiration_timeout: req.body.options?.expiration_timeout || '4320m',
          force3d: req.body.options?.force3d || 0,
          language: req.body.options?.language || 'az',
          return_url: req.body.options?.return_url || 'https://google.com',
          terminal: req.body.options?.terminal || 'millikart_test',
          recurring: req.body.options?.recurring || 1
        },
        tdsPresetAreq: req.body.tdsPresetAreq || {
          cardholderName: "Test Testov",
          email: "test@test.az",
          homePhone: {
            subscriber: "120000000",
            cc: "994"
          },
          mobilePhone: {
            subscriber: "700000000",
            cc: "994"
          },
          workPhone: {
            subscriber: "120000000",
            cc: "994"
          }
        },
        client: {
          name: req.body.client?.name || 'Test',
          email: req.body.client?.email || 'test@mail.com'
        }
      };

      const response = await axios.post(`${BASE_URL}/orders/create`, orderData,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error creating MK recurring order:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to create MK recurring order',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Charge payment
   */
  const chargePayment = async (req, res) => {
    try {
      const { orderId, merchant_order_id } = req.body;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "Order ID is required"
        });
      }

      // charge may include amount (string) so that partial captures are possible
      const chargeBody = {};
      if (req.body.amount != null) chargeBody.amount = String(req.body.amount);
      const response = await axios.put(`${BASE_URL}/orders/${orderId}/charge`, chargeBody,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      // Update order status in database
      if (merchant_order_id || response.data.merchant_order_id) {
        await CibpayOrder.findOneAndUpdate(
          { orderId: merchant_order_id || response.data.merchant_order_id },
          {
            transactionId: response.data.id || orderId,
            status: response.data.status || "CHARGED",
            amount: response.data.amount || undefined,
            currency: response.data.currency || undefined,
            pan: response.data.pan || undefined,
            failureMessage: response.data.failure_message || null,
            rawResponse: response.data,
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );
      }
      
      res.json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error charging payment:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        success: false,
        error: 'Failed to charge payment',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Reverse payment
   */
  const reversePayment = async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      const response = await axios.put(`${BASE_URL}/orders/${orderId}/reverse`, {},  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      // update local order status for traceability
      await CibpayOrder.findOneAndUpdate(
        { orderId },
        {
          status: response.data.status || "CANCELED",
          rawResponse: response.data,
          updatedAt: new Date()
        },
        { upsert: true }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error reversing payment:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to reverse payment',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Refund payment (OCT)
   */
  const refundPayment = async (req, res) => {
    try {
      const { orderId, amount } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      // refund amount is recommended to be provided
      const refundBody = {};
      if (amount != null) {
        refundBody.amount = String(amount);
      }
      const response = await axios.put(`${BASE_URL}/orders/${orderId}/refund`, refundBody,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      // update DB
      await CibpayOrder.findOneAndUpdate(
        { orderId },
        {
          status: response.data.status || "REFUNDED",
          rawResponse: response.data,
          updatedAt: new Date()
        },
        { upsert: true }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error refunding payment:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to refund payment',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * Cancel order (void) – sets status to CANCELED server‑side
   */
  const cancelPayment = async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const response = await axios.put(`${BASE_URL}/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        httpsAgent: agent
      });

      // update local record
      await CibpayOrder.findOneAndUpdate(
        { orderId },
        {
          status: response.data.status || "CANCELED",
          rawResponse: response.data,
          updatedAt: new Date()
        },
        { upsert: true }
      );

      res.json(response.data);
    } catch (error) {
      console.error('Error cancelling order:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to cancel order',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * OCT Credit by ID
   */
  const octCreditById = async (req, res) => {
    try {
      const { id } = req.params;
      const creditData = {
        amount: req.body.amount,
        currency: req.body.currency || 'AZN',
        description: req.body.description || null,
        client: {
          name: req.body.client?.name || 'test',
          email: req.body.client?.email || 'test@test.com'
        }
      };

      const response = await axios.post(`${BASE_URL}/orders/${id}/credit`, creditData,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error processing OCT credit by ID:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to process OCT credit',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * OCT Credit
   */
  const octCredit = async (req, res) => {
    try {
      const creditData = {
        amount: req.body.amount,
        currency: req.body.currency || 'AZN',
        description: req.body.description || null,
        client: {
          name: req.body.client?.name || 'test',
          email: req.body.client?.email || 'test@test.com'
        }
      };

      const response = await axios.post(`${BASE_URL}/orders/credit`, creditData,  {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error processing OCT credit:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to process OCT credit',
        details: error.response?.data || error.message
      });
    }
  };

  /**
   * OCT Credit SRN
   */
  const octCreditSRN = async (req, res) => {
    try {
      const { srn } = req.params;
      const creditData = {
        amount: req.body.amount,
        currency: req.body.currency || 'AZN',
        description: req.body.description || null,
        merchant_order_id: req.body.merchant_order_id || srn,
        pan: req.body.pan,
        client: {
          name: req.body.client?.name || 'test',
          email: req.body.client?.email || 'test@test.com'
        }
      };

      const response = await axios.post(`${BASE_URL}/orders/credit`, creditData, {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      res.json(response.data);
    } catch (error) {
      console.error('Error processing OCT credit with SRN:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to process OCT credit with SRN',
        details: error.response?.data || error.message
      });
    }
  };


  /**
   * Save/Update InsuranceOrder when CibPay payment is successful
   * Called from webhook when payment status changes
   */
  const saveOrderFromCibpay = async (cibOrder) => {
    try {
      const { merchant_order_id, status } = cibOrder;

      if (!merchant_order_id) {
        console.warn("CibPay webhook: merchant_order_id missing in payload");
        return;
      }

      // Successful payment statuses
      const successfulStatuses = ["AUTHORIZED", "CHARGED", "PAID", "ISSUED"];
      const isSuccessful = successfulStatuses.includes(status);

      console.log(`[CibPay Webhook] Processing order ${merchant_order_id}: status=${status}, successful=${isSuccessful}`);

      if (isSuccessful) {
        // Import InsuranceOrder model
        const InsuranceOrder = require("../models/insurer");
        
        // ✅ Update existing order status to "paid"
        const updatedOrder = await InsuranceOrder.findByIdAndUpdate(
          merchant_order_id, // assuming merchant_order_id is the OrderId  
          { status: "paid" },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`✅ InsuranceOrder ${merchant_order_id} status updated to "paid"`);
        } else {
          // Try with orderId field instead
          const updatedOrder2 = await InsuranceOrder.findOneAndUpdate(
            { orderId: merchant_order_id },
            { status: "paid" },
            { new: true }
          );

          if (updatedOrder2) {
            console.log(`✅ InsuranceOrder ${merchant_order_id} status updated to "paid" (via orderId)`);
          } else {
            console.warn(`⚠️  InsuranceOrder not found for merchant_order_id: ${merchant_order_id}. Webhook will only update CibPay status.`);
          }
        }
      } else {
        console.log(`[CibPay Webhook] Order ${merchant_order_id} payment unsuccessful: ${status}`);
      }
    } catch (error) {
      console.error("saveOrderFromCibpay error:", error);
    }
  };


  // Export all functions
module.exports = {
  authorizePayment,
  getOrders,
  getOrderById,
  getOrderByMerchantId,
  createOrder,
  createOrderMKRecurring,
  chargePayment,
  reversePayment,
  refundPayment,
  cancelPayment,
  octCreditById,
  octCredit,
  octCreditSRN,
  getOrderStatus,
  cibpayWebhook,
  saveOrderFromCibpay
};

