import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentTest = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [pan, setPan] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [holder, setHolder] = useState("");
  const [response, setResponse] = useState(null);

  const API_BASE = "http://localhost:5000/api/payments"; // backend URL
  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Create order
  const handleCreateOrder = async () => {
    try {
      const res = await axios.post(`${API_BASE}/orders/create`, {
        amount: parseFloat(amount),
        currency: "AZN",
        client: {
          name: "Test User",
          email: "test@mail.com",
        },
        merchant_order_id: `ORD-${Date.now()}`,
      });
      setResponse(res.data);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setResponse(err.response?.data || err.message);
    }
  };

  // Authorize payment
  const handleAuthorizePayment = async () => {
    try {
      const res = await axios.post(`${API_BASE}/orders/authorize`, {
        amount: parseFloat(amount),
        pan,
        card: {
          cvv,
          expiration_month: Number(expMonth),
          expiration_year: Number(expYear),
          holder,
        },
        client: { name: "Test User", email: "test@mail.com" },
        options: { force3d: 1 },
        location: { ip: "93.88.94.130" },
        browserDetails: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          colorDepth: window.screen.colorDepth,
          screenHeight: window.screen.height,
          screenWidth: window.screen.width,
          timezoneOffset: new Date().getTimezoneOffset(),
          javaEnabled: navigator.javaEnabled(),
        },
      });
      setResponse(res.data);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setResponse(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CIBPAY Test Frontend</h1>

      <h2>Create Order</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleCreateOrder}>Create Order</button>

      <h2>Authorize Payment</h2>
      <input
        type="text"
        placeholder="PAN"
        value={pan}
        onChange={(e) => setPan(e.target.value)}
      />
      <input
        type="text"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />
      <input
        type="text"
        placeholder="Expiration Month"
        value={expMonth}
        onChange={(e) => setExpMonth(e.target.value)}
      />
      <input
        type="text"
        placeholder="Expiration Year"
        value={expYear}
        onChange={(e) => setExpYear(e.target.value)}
      />
      <input
        type="text"
        placeholder="Card Holder"
        value={holder}
        onChange={(e) => setHolder(e.target.value)}
      />
      <button onClick={handleAuthorizePayment}>Authorize Payment</button>

      <h2>Orders List</h2>
      <button onClick={fetchOrders}>Refresh Orders</button>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id}>
              ID: {order.id}, Amount: {order.amount}, Status: {order.status}
            </li>
          ))
        ) : (
          <li>No orders yet</li>
        )}
      </ul>

      <h2>Response</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default PaymentTest;
