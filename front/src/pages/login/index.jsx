import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import LoadingSpinner from '../../components/LoadingSpinner'
import './index.scss'

const Login = () => {
  const { t } = useTranslation()
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
        setError(data.message || t('common.error'))
      } else {
        // login successful
        localStorage.setItem("user", JSON.stringify(data.user)) // istəsən saxla
        navigate("/profile")
      }
    } catch (err) {
      setError(t('auth.connectionError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='login'>
      <div className="login-container">
        <Card className="login-form">
          <CardHeader>
            <CardTitle className="login-title">{t('auth.login')}</CardTitle>
            <CardDescription className="login-description">{t('auth.loginDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && <p className="error-text" style={{ color: 'var(--destructive)', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

              <div className="form-group">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>

              <Button type="submit" className="login-btn" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LoadingSpinner size="small" />
                    {t('common.wait')}
                  </span>
                ) : t('auth.loginButton')}
              </Button>

              <p className="register-link">
                {t('common.noAccount')} <a href="/register">{t('common.register')}</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Login
