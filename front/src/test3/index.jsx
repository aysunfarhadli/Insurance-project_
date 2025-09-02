import { useState } from "react";

export default function InsuranceForm() {
  const [formData, setFormData] = useState({
    ownerType: "SELF",
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    gender: "MALE",
    passportNumber: "",
    finCode: "",
    phone: "",
    email: "",
  });

  const [result, setResult] = useState(null);

  // input dəyişiklikləri üçün
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Xəta baş verdi", details: err.message });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Insurance Form Test</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select name="ownerType" value={formData.ownerType} onChange={handleChange}>
          <option value="SELF">Özüm üçün</option>
          <option value="OTHER">Digər şəxs üçün</option>
        </select>

        <input
          name="firstName"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          name="middleName"
          placeholder="Ata adı"
          value={formData.middleName}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="MALE">Kişi</option>
          <option value="FEMALE">Qadın</option>
        </select>

        <input
          name="passportNumber"
          placeholder="Passport (AB12345)"
          value={formData.passportNumber}
          onChange={handleChange}
          required
        />
        <input
          name="finCode"
          placeholder="FIN (7 simvol)"
          value={formData.finCode}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="+9945XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Göndər
        </button>
      </form>

      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
