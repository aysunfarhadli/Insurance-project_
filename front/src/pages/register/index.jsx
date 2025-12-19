import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import LoadingSpinner from '../../components/LoadingSpinner'
import './index.scss'

const Register = () => {
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
      setMessage("Şifrələr eyni olmalıdır!");
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
        setMessage("Qeydiyyat uğurla tamamlandı ✅");
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
        setMessage(data.message || "Xəta baş verdi!");
      }
    } catch (err) {
      setMessage("Serverə qoşulmaq mümkün olmadı!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='register'>
      <Card className="signup-form">
        <CardHeader>
          <CardTitle className="form-title">Qeydiyyat</CardTitle>
          <CardDescription className="form-description">CİB sığorta hesabı yaradın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Label htmlFor="name">Ad</Label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Ad" />
            </div>

            <div className="form-group">
              <Label htmlFor="surname">Soyad</Label>
              <Input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required placeholder="Soyad" />
            </div>

            <div className="form-group">
              <Label htmlFor="phone">Telefon nömrəsi</Label>
              <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Telefon nömrəsi" />
            </div>

            <div className="form-group">
              <Label htmlFor="email">Email ünvanı</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email ünvanı" />
            </div>

            <div className="form-group">
              <Label htmlFor="password">Şifrə</Label>
              <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Şifrə" />
            </div>

            <div className="form-group">
              <Label htmlFor="confirmPassword">Şifrə təkrarı</Label>
              <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Şifrə təkrarı" />
            </div>

            <Button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <LoadingSpinner size="small" />
                  Gözləyin...
                </span>
              ) : "Qeydiyyatdan keç"}
            </Button>

            {message && <p className="form-message" style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '4px',
              backgroundColor: message.includes('✅') ? 'var(--green-100)' : 'var(--red-100)',
              color: message.includes('✅') ? 'var(--green-600)' : 'var(--red-600)',
              fontSize: '14px'
            }}>{message}</p>}

            <p className="login-link">Hesabınız var? <a href="/login">Daxil olun</a></p>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default Register
