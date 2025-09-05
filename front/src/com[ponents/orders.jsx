import { useEffect, useState } from "react";
import api from "./api";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    category_id: "",
    start_date: "",
    end_date: "",
    currency: "AZN",
    total_amount: 0,
  });

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/orders", form);
    setForm({
      user_id: "",
      category_id: "",
      start_date: "",
      end_date: "",
      currency: "AZN",
      total_amount: 0,
    });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-2">Orders</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          placeholder="User ID"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Category ID"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="border p-1"
        />
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="border p-1"
        />
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Currency"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="border p-1"
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={form.total_amount}
          onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
          className="border p-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded col-span-2"
        >
          Create Order
        </button>
      </form>

      <ul>
        {orders.map((o) => (
          <li key={o._id} className="flex justify-between border-b py-1">
            <span>
              User: {o.user_id} | Category: {o.category_id} | {o.currency} {o.total_amount}
            </span>
            <button
              onClick={() => deleteOrder(o._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
