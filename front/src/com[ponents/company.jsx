import { useEffect, useState } from "react";
import api from "./api";

export default function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ code: "", name: "" });

  const fetchCompanies = async () => {
    const res = await api.get("/companies");
    setCompanies(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/companies", form);
    setForm({ code: "", name: "" });
    fetchCompanies();
  };

  const deleteCompany = async (id) => {
    await api.delete(`/companies/${id}`);
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-2">Companies</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-1"
        />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {companies.map((c) => (
          <li key={c._id} className="flex justify-between border-b py-1">
            <span>{c.code} — {c.name}</span>
            <button
              onClick={() => deleteCompany(c._id)}
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
