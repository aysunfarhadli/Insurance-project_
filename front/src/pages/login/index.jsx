import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import LoadingSpinner from '../../components/LoadingSpinner'
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
        <Card className="login-form">
          <CardHeader>
            <CardTitle className="login-title">Daxil olun</CardTitle>
            <CardDescription className="login-description">CİB siğorta hesabınıza daxil olun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && <p className="error-text" style={{ color: 'var(--destructive)', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

              <div className="form-group">
                <Label htmlFor="email">Email ünvanı</Label>
                <Input
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
                <Label htmlFor="password">Şifrə</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Şifrənizi daxil edin"
                />
              </div>

              <Button type="submit" className="login-btn" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LoadingSpinner size="small" />
                    Gözləyin...
                  </span>
                ) : "Daxil ol"}
              </Button>

              <p className="register-link">
                Hesabınız yoxdur? <a href="/register">Qeydiyyatdan keçin</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Login
