import React, { useState } from "react";
import axios from "axios";

export default function CreateOrderTester() {
  const [form, setForm] = useState({
    amount: "10.50",
    currency: "AZN",
    name: "Test User",
    email: "testuser@mail.com",
    note: "Test order from React",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        amount: parseFloat(form.amount),
        currency: form.currency,
        merchant_order_id: "test_" + Date.now(),
        options: {
          auto_charge: true,
          expiration_timeout: "60m",
          force3d: 1,
          language: "az",
          return_url: "https://example.com/payment-return",
          terminal: "atb_test",
        },
        client: {
          name: form.name,
          email: form.email,
        },
        extra_fields: {
          note: form.note,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/payments/orders/create",
        payload
      );
      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">CIBPAY Create Order Test</h1>

      <label className="block mb-2">Amount</label>
      <input
        type="number"
        step="0.01"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Currency</label>
      <input
        type="text"
        name="currency"
        value={form.currency}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <label className="block mb-2">Note</label>
      <input
        type="text"
        name="note"
        value={form.note}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Order
      </button>

      {response && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
