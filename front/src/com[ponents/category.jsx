import { useEffect, useState } from "react";
import api from "./api";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ code: "", name: "" });

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/categories", form);
    setForm({ code: "", name: "" });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-2">Categories</h2>

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
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c._id} className="flex justify-between border-b py-1">
            <span>{c.code} — {c.name}</span>
            <button
              onClick={() => deleteCategory(c._id)}
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
