import React, { useState } from "react";
import axios from "axios";

export default function OtpTester() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // request | verify
  const [response, setResponse] = useState(null);

  // Request OTP
  const requestOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/request-otp", { email });
      setResponse(res.data);
      setStep("verify");
    } catch (err) {
      setResponse(err.response?.data || err.message);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", { email, otp });
      setResponse(res.data);
    } catch (err) {
      setResponse(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">OTP Test</h1>

      {step === "request" && (
        <>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            onClick={requestOtp}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Request OTP
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <p className="mb-2">👉 OTP göndərildi (console-da bax!)</p>
          <label className="block mb-2">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            onClick={verifyOtp}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      {response && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
