import { useEffect, useState } from "react";
import api from "./api";

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ order_id: "", type: "passport", file_url: "" });

  const fetchDocs = async () => {
    const res = await api.get("/documents");
    setDocuments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/documents", form);
    setForm({ order_id: "", type: "passport", file_url: "" });
    fetchDocs();
  };

  const deleteDoc = async (id) => {
    await api.delete(`/documents/${id}`);
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-2">Documents</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Order ID"
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          className="border p-1"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-1"
        >
          <option value="passport">Passport</option>
          <option value="id_card">ID Card</option>
          <option value="driver_license">Driver License</option>
          <option value="invoice">Invoice</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="File URL"
          value={form.file_url}
          onChange={(e) => setForm({ ...form, file_url: e.target.value })}
          className="border p-1"
        />
        <button type="submit" className="bg-purple-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {documents.map((d) => (
          <li key={d._id} className="flex justify-between border-b py-1">
            <span>{d.type} — <a href={d.file_url} target="_blank" rel="noreferrer">{d.file_url}</a></span>
            <button
              onClick={() => deleteDoc(d._id)}
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
