import { useState } from "react";

export default function App2() {
  const [form, setForm] = useState({
    embassy: "",
    coverageScope: "SCHENGEN",
    startDate: "",
    endDate: "",
    multiEntry: false,
    entriesCount: "SINGLE",
    tripPurpose: "TOURISM",
    coverageAmount: 30000,
    currency: "EUR",
    covidCoverage: "FULL",
    termsAccepted: true,
  });

  const [result, setResult] = useState(null);
  const [priceResult, setPriceResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
  };

  const calculatePrice = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/trips/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: form.startDate,
          endDate: form.endDate,
          coverageAmount: form.coverageAmount,
        }),
      });
      const data = await res.json();
      setPriceResult(data);
    } catch (err) {
      setPriceResult({ error: err.message });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Insurance Trip Test Form</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="embassy"
          placeholder="Embassy"
          value={form.embassy}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select name="coverageScope" value={form.coverageScope} onChange={handleChange} className="border p-2 w-full">
          <option value="SCHENGEN">SCHENGEN</option>
          <option value="WORLDWIDE">WORLDWIDE</option>
          <option value="REGIONAL_TR">REGIONAL_TR</option>
        </select>

        <label>Start Date</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 w-full" />

        <label>End Date</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 w-full" />

        <label>
          <input type="checkbox" name="multiEntry" checked={form.multiEntry} onChange={handleChange} />
          Multi Entry
        </label>

        <select name="entriesCount" value={form.entriesCount} onChange={handleChange} className="border p-2 w-full">
          <option value="SINGLE">SINGLE</option>
          <option value="MULTIPLE">MULTIPLE</option>
        </select>

        <select name="tripPurpose" value={form.tripPurpose} onChange={handleChange} className="border p-2 w-full">
          <option value="TOURISM">TOURISM</option>
          <option value="BUSINESS">BUSINESS</option>
        </select>

        <select name="coverageAmount" value={form.coverageAmount} onChange={handleChange} className="border p-2 w-full">
          <option value={5000}>5000</option>
          <option value={10000}>10000</option>
          <option value={30000}>30000</option>
          <option value={50000}>50000</option>
        </select>

        <select name="currency" value={form.currency} onChange={handleChange} className="border p-2 w-full">
          <option value="AZN">AZN</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>

        <select name="covidCoverage" value={form.covidCoverage} onChange={handleChange} className="border p-2 w-full">
          <option value="FULL">FULL</option>
          <option value="LIMIT">LIMIT</option>
        </select>

        <label>
          <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} />
          Terms Accepted
        </label>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Trip
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 border bg-gray-50">
          <h2 className="font-bold">Server Response:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <button
        onClick={calculatePrice}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Calculate Price
      </button>

      {priceResult && (
        <div className="mt-4 p-3 border bg-gray-50">
          <h2 className="font-bold">Price Result:</h2>
          <pre>{JSON.stringify(priceResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
