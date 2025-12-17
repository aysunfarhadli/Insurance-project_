  const axios = require('axios');
  const https = require('https');
  const fs = require('fs');
  const path = require('path');
  // const { getBrowserDetailsFromRequest } = require('../browserDetails/index.js');
  require("dotenv").config();
  const Order = require("../models/cibpay");

  // Configuration
  const username = "cibpay";
  const password = "gxIO8aH6N3j13FREp2";

  // Basic Auth üçün Base64 encode
  const auth = Buffer.from(`${username}:${password}`).toString("base64");



  const agent = new https.Agent({
    pfx: fs.readFileSync("./cert/api-cibpay.p12"),
    passphrase: process.env.CIBPAY_PFX_PASSPHRASE,
    rejectUnauthorized: false
  });
  /**
   * Authorize - Kartla ödəniş yaratmaq
   */


const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

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

    // if (user !== process.env.CIBPAY_WEBHOOK_USER || pass !== process.env.CIBPAY_WEBHOOK_PASS) {
    //   return res.status(403).json({ error: "Forbidden" });
    // }

    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    for (const cibOrder of orders) {
      await Order.findOneAndUpdate(
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




  // Authorize Payment Controller
  const authorizePayment = async (req, res) => {
    try {
      const { orderId, amount, pan, card, client, options, location, browserDetails } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "Order ID is required"
        });
      }

      // Validate and format browser details for 3-D Secure 2.0
      if (!browserDetails || Object.keys(browserDetails).length === 0) {
        return res.status(400).json({
          success: false,
          error: "Browser details are required for 3-D Secure 2.0"
        });
      }

      // Convert browser details to snake_case format (Cibpay API requirement)
      // Cibpay API browser details-i root level-də gözləyir
      const formattedBrowserDetails = {
        accept_header: browserDetails.acceptHeader || browserDetails.accept_header || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        java_enabled: browserDetails.javaEnabled !== undefined ? browserDetails.javaEnabled : (browserDetails.java_enabled !== undefined ? browserDetails.java_enabled : false),
        javascript_enabled: browserDetails.javascriptEnabled !== undefined ? browserDetails.javascriptEnabled : (browserDetails.javascript_enabled !== undefined ? browserDetails.javascript_enabled : true),
        language: browserDetails.language || "az-AZ",
        color_depth: browserDetails.colorDepth || browserDetails.color_depth || 24,
        screen_height: browserDetails.screenHeight || browserDetails.screen_height || 1080,
        screen_width: browserDetails.screenWidth || browserDetails.screen_width || 1920,
        time_zone_offset: browserDetails.timeZoneOffset !== undefined ? browserDetails.timeZoneOffset : (browserDetails.time_zone_offset !== undefined ? browserDetails.time_zone_offset : new Date().getTimezoneOffset()),
        user_agent: browserDetails.userAgent || browserDetails.user_agent || "",
        challenge_window_size: browserDetails.challengeWindowSize || browserDetails.challenge_window_size || "full-screen"
      };

      // Cibpay authorize endpoint - orderId body-də göndərilməlidir
      // Browser details root level-də göndərilir (Cibpay API tələbi)
      const authData = {
        order_id: orderId, // Cibpay API-də order_id body-də göndərilir
        amount,
        pan,
        card: {
          cvv: card.cvv,
          expiration_month: Number(card.expiration_month),
          expiration_year: Number(card.expiration_year),
          holder: card.holder || ""
        },
        client: {
          name: client?.name || "Test",
          email: client?.email || "test@mail.com"
        },
        options: {
          force3d: options?.force3d || 1
        },
        browser: formattedBrowserDetails, // Browser details root level-də göndərilir
        location: {
          ip: location?.ip || "93.88.94.130"
        }
      };

      console.log("Sending to CIBPAY authorize:", JSON.stringify(authData, null, 2));
      console.log("Order ID for authorize:", orderId);

      // Cibpay authorize endpoint - orderId body-də göndərilir
      const response = await axios.post(
        `https://api-preprod.cibpay.co/orders/authorize`,
        authData,
        {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        }
      );

      // Update order status in database
      const maskedPan = pan.length >= 4 
        ? pan.substring(pan.length - 4).padStart(pan.length, '*')
        : pan;
      
      await Order.findOneAndUpdate(
        { orderId: req.body.merchant_order_id || orderId },
        {
          transactionId: response.data.id || orderId,
          status: response.data.status === "AUTHORIZED" || response.data.status === "CHARGED" 
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
      const response = await axios.get(`https://api-preprod.cibpay.co/orders/`, {
          headers: {
            "Authorization": `Basic ${auth}`,
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
      const response = await axios.get(`https://api-preprod.cibpay.co/orders/${orderId}`,  {
          headers: {
            "Authorization": `Basic ${auth}`,
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

    // Build options object - terminal parametrini tamamilə sil
    const options = {
      auto_charge: req.body.options?.auto_charge ?? false,
      expiration_timeout: req.body.options?.expiration_timeout || "30m", // 30 dəqiqə (4320m çox böyükdür)
      force3d: req.body.options?.force3d || 1,
      language: req.body.options?.language || "az",
      return_url: req.body.options?.return_url || "https://cibpay.az"
      // terminal parametri tamamilə silindi - Cibpay API-də bu parametr validation xətası verir
    };

    const orderData = {
      amount: parseFloat(req.body.amount),
      currency: req.body.currency || "AZN",
      merchant_order_id: String(req.body.merchant_order_id),
      options: options,
      client: {
        name: req.body.client?.name || "Test",
        email: req.body.client?.email || "test@mail.com"
      }
    };

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(
      "https://api-preprod.cibpay.co/orders/create",
      orderData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        httpsAgent: agent
      }
    );

    // Save to MongoDB
    await Order.findOneAndUpdate(
      { orderId: orderData.merchant_order_id },
      {
        orderId: orderData.merchant_order_id,
        amount: orderData.amount,
        currency: orderData.currency,
        status: response.data.status || "NEW",
        rawResponse: response.data
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    
    // Cibpay API validation xətası
    if (error.response?.status === 422) {
      return res.status(422).json({
        success: false,
        error: "Validation failed",
        details: error.response?.data || error.message
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: "Failed to create order",
      details: error.response?.data || error.message
    });
  }
};

  /**
   * Create order with Millikart recurring
   */
  const createOrderMKRecurring = async (req, res) => {
    try {
      const orderData = {
        amount: req.body.amount,
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

      const response = await axios.post(`https://api-preprod.cibpay.co/orders/create`, orderData,  {
          headers: {
            "Authorization": `Basic ${auth}`,
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

      const response = await axios.put(`https://api-preprod.cibpay.co/orders/${orderId}/charge`, {},  {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
      // Update order status in database
      if (merchant_order_id || response.data.merchant_order_id) {
        await Order.findOneAndUpdate(
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
      const response = await axios.put(`https://api-preprod.cibpay.co/orders/${orderId}/reverse`, {},  {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
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
      const { orderId } = req.body;
      const response = await axios.put(`https://api-preprod.cibpay.co/orders/${orderId}/refund`, {},  {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          },
          httpsAgent: agent
        });
      
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

      const response = await axios.post(`https://api-preprod.cibpay.co/orders/${id}/credit`, creditData,  {
          headers: {
            "Authorization": `Basic ${auth}`,
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

      const response = await axios.post(`https://api-preprod.cibpay.co/orders/credit`, creditData,  {
          headers: {
            "Authorization": `Basic ${auth}`,
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

      const response = await axios.post(`https://api-preprod.cibpay.co/orders/credit`, creditData, {
          headers: {
            "Authorization": `Basic ${auth}`,
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
 * CIBPAY Webhook Controller
 * Tranzaksiyaların status dəyişikliyi barədə məlumatları qəbul edir
 */
// const cibpayWebhook = async (req, res) => {
//   try {
//     // Authorization yoxlanışı
//     const authHeader = req.headers['authorization'];
//     if (!authHeader || !authHeader.startsWith('Basic ')) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Base64 aç və username/password yoxla
//     const base64Credentials = authHeader.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':');
//     const [username, password] = credentials;

//     if (username !== process.env.CIBPAY_WEBHOOK_USER || password !== process.env.CIBPAY_WEBHOOK_PASS) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     // Webhook gövdəsi
//     const { order_id, status } = req.body;

//     console.log(`Webhook received: Order ID: ${order_id}, Status: ${status}`);

//     // Burada statusa görə DB update və ya Get order by ID ilə təsdiqləmə edə bilərsən
//     // Məsələn:
//     // const response = await axios.get(`https://api-preprod.cibpay.co/orders/${order_id}`, {
//     //   headers: {
//     //     "Authorization": `Basic ${Buffer.from(`${process.env.CIBPAY_USER}:${process.env.CIBPAY_PASS}`).toString('base64')}`,
//     //     "Content-Type": "application/json"
//     //   },
//     //   httpsAgent: agent
//     // });

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Webhook error:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


  // Export all functions
module.exports = {
  authorizePayment,
  getOrders,
  getOrderById,
  createOrder,
  createOrderMKRecurring,
  chargePayment,
  reversePayment,
  refundPayment,
  octCreditById,
  octCredit,
  octCreditSRN,
  getOrderStatus,
  cibpayWebhook
  // cibpayWebhook  // ← burada əlavə etdik
};
