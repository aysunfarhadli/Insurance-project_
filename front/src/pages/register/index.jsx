import React, { useState } from 'react'
import './index.scss'

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

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

    try {
      const res = await fetch("http://localhost:5000/authUser/register", {
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
    }
  };

  return (
    <section className='register'>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Qeydiyyat</h2>
        <p className="form-description">CİB sığorta hesabı yaradın</p>

        <div className="form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ad" />
        </div>

        <div className="form-group">
          <input type="text" name="surname" value={formData.surname} onChange={handleChange} required placeholder="Soyad" />
        </div>

        <div className="form-group">
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Telefon nömrəsi" />
        </div>

        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email ünvanı" />
        </div>

        <div className="form-group">
          <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Şifrə" />
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Şifrə təkrarı" />
        </div>

        <button type="submit" className="submit-btn">Qeydiyyatdan keç</button>

        {message && <p className="form-message">{message}</p>}

        <p className="login-link">Hesabınız var? <a href="/login">Daxil olun</a></p>
      </form>
    </section>
  )
}

export default Register
