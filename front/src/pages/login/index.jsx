import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
      const res = await fetch(`${API_BASE}/authUser/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Xəta baş verdi")
      } else {
        // login successful
        localStorage.setItem("user", JSON.stringify(data.user)) // istəsən saxla
        navigate("/profile")
      }
    } catch (err) {
      setError("Serverə qoşulmaq mümkün olmadı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='login'>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Daxil olun</h2>
          <p className="login-description">CİB siğorta hesabınıza daxil olun</p>

          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email ünvanı</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifrə</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Şifrənizi daxil edin"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Gözləyin..." : "Daxil ol"}
          </button>

          <p className="register-link">
            Hesabınız yoxdur? <a href="/register">Qeydiyyatdan keçin</a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Login
