// src/App.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/payments"; // replace with your backend URL

function Appp() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // Get all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message);
    }
  };

  // Get order by ID
  const fetchOrderById = async () => {
    if (!orderId) return alert("Please enter Order ID");
    try {
      const res = await axios.get(`${API_BASE}/orders/${orderId}`);
      setOrder(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setOrder(null);
      setError(err.response?.data || err.message);
    }
  };
console.log(orders.orders);
let all = orders.orders

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CIBPAY Orders GET Test</h1>

      <section>
        <h2>All Orders</h2>
        <button onClick={fetchOrders}>Fetch Orders</button>
        <ul>
          {
             all?.map((o) => (
                <li key={o.id}>
                  ID: {o.id}, Amount: {o.amount}, Status: {o.status}
                </li>
              ))
           }
        </ul>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2>Get Order by ID</h2>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button onClick={fetchOrderById}>Fetch Order</button>

        {order && (
          <div style={{ marginTop: "10px" }}>
            <h3>Order Details:</h3>
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </div>
        )}
      </section>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h3>Error:</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Appp;
