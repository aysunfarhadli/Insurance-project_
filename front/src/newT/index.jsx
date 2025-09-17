import React, { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // vacibdir cookie üçün

export default function AuthTest() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [profile, setProfile] = useState(null);




const api = axios.create({
  baseURL: "http://localhost:5000/authUser",
  withCredentials: true // cookie gets sent automatically
});



  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      const res = await api.post("/login", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  const getProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Profile error");
    }
  };

  const logout = async () => {
    await api.post("/logout");
    setProfile(null);
    alert("Logged out");
  };

  return (
    <div>
      <h2>Auth Test</h2>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />

      <div>
        <button onClick={login}>Login</button>
        <button onClick={getProfile}>Get Profile</button>
        <button onClick={logout}>Logout</button>
      </div>

      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  );
}
