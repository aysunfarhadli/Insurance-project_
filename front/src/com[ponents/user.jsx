// src/components/FormManager.jsx
import { useState, useEffect } from "react";
import api from "./api"; // Axios instance with baseURL = http://localhost:5000

export default function FormManager() {
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState({
    ownerType: "SELF",
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "MALE",
    passportNumber: "",
    finCode: "",
    phone: "",
    email: "",
  });

  // Fetch forms from backend
  const fetchForms = async () => {
    try {
      const res = await api.get("/forms");
      setForms(res.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/forms", form);
      fetchForms();
      setForm({
        ownerType: "SELF",
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "MALE",
        passportNumber: "",
        finCode: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-2">Insurance Forms</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-4">
        <select
          name="ownerType"
          value={form.ownerType}
          onChange={handleChange}
          className="border p-1"
        >
          <option value="SELF">SELF</option>
          <option value="OTHER">OTHER</option>
        </select>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="border p-1"
          required
        />

        {/* <input
          type="text"
          name="middleName"
          placeholder="Middle Name (optional)"
          value={form.middleName}
          onChange={handleChange}
          className="border p-1"
        /> */}

        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-1"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <input
          type="text"
          name="passportNumber"
          placeholder="Passport Number"
          value={form.passportNumber}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <input
          type="text"
          name="finCode"
          placeholder="FIN Code"
          value={form.finCode}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="+994XXXXXXXXX"
          value={form.phone}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-1"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded col-span-2"
        >
          Submit Form
        </button>
      </form>

      <ul>
        {forms.map((f) => (
          <li key={f._id} className="border-b py-1">
            {f.firstName} {f.lastName} — {f.passportNumber} ({f.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
