import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import LoadingSpinner from '../../components/LoadingSpinner'
import './index.scss'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // input dəyişdikdə state update
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // sadə frontend yoxlaması
    if (formData.password !== formData.confirmPassword) {
      setMessage(t('auth.passwordsMustMatch'));
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
      const res = await fetch(`${API_BASE}/authUser/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        }),
        credentials: "include" // cookie üçün
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(t('auth.registrationSuccess'));
        setFormData({
          name: "",
          surname: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        navigate("/profile") // uğurlu login sonrası yönləndir

      } else {
        setMessage(data.message || t('common.error'));
      }
    } catch (err) {
      setMessage(t('auth.connectionErrorExclamation'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='register'>
      <Card className="signup-form">
        <CardHeader>
          <CardTitle className="form-title">{t('auth.register')}</CardTitle>
          <CardDescription className="form-description">{t('auth.registerDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t('auth.namePlaceholder')} />
            </div>

            <div className="form-group">
              <Label htmlFor="surname">{t('auth.surname')}</Label>
              <Input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required placeholder={t('auth.surnamePlaceholder')} />
            </div>

            <div className="form-group">
              <Label htmlFor="phone">{t('order.phone')}</Label>
              <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t('auth.phonePlaceholder')} />
            </div>

            <div className="form-group">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t('auth.emailPlaceholder')} />
            </div>

            <div className="form-group">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder={t('auth.password')} />
            </div>

            <div className="form-group">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder={t('auth.confirmPasswordPlaceholder')} />
            </div>

            <Button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <LoadingSpinner size="small" />
                  {t('common.wait')}
                </span>
              ) : t('auth.registerButton')}
            </Button>

            {message && <p className="form-message" style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '4px',
              backgroundColor: message.includes('✅') ? 'var(--green-100)' : 'var(--red-100)',
              color: message.includes('✅') ? 'var(--green-600)' : 'var(--red-600)',
              fontSize: '14px'
            }}>{message}</p>}

            <p className="login-link">{t('common.haveAccount')} <a href="/login">{t('auth.login')}</a></p>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default Register
