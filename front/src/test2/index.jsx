import React, { useState } from "react";
import axios from "axios";

export default function WebhookTester() {
  const [orderId, setOrderId] = useState("ORDER123");
  const [status, setStatus] = useState("success");
  const [amount, setAmount] = useState("10.50");
  const [currency, setCurrency] = useState("AZN");
  const [response, setResponse] = useState(null);

  const sendWebhook = async () => {
    try {
      const testOrders = [
        {
          merchant_order_id: orderId,
          status,
          amount,
          currency,
          pan: "411111******1111",
          failure_message: null,
          updated: new Date().toISOString(),
          id: "tx_" + Math.floor(Math.random() * 10000)
        }
      ];

      // Webhook Basic Auth (env-də yazdığın user/pass ilə eyni olmalıdır)
      const username = "testuser"; // dəyiş: process.env.CIBPAY_WEBHOOK_USER
      const password = "testpass"; // dəyiş: process.env.CIBPAY_WEBHOOK_PASS
      const basicAuth = "Basic " + btoa(`${username}:${password}`);

      const res = await axios.post(
        "http://localhost:5000/api/payments/webhooks/cibpay", // backend endpoint
        { orders: testOrders },
        {
          headers: {
            "Authorization": basicAuth,
            "Content-Type": "application/json"
          }
        }
      );

      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">CIBPay Webhook Tester</h1>

      <label className="block mb-2">Merchant Order ID</label>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Status</label>
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Currency</label>
      <input
        type="text"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        onClick={sendWebhook}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send Webhook
      </button>

      {response && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
