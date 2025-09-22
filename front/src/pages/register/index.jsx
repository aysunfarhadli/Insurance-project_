import React from 'react'
import './index.scss'

const Register = () => {
  return (
    <section className='register'>
      <form className="signup-form">
        <h2 className="form-title">Qeydiyyat</h2>
        <p className="form-description">CİB siğorta hesab yaradın</p>

        <div className="form-group">
          <input type="text" required placeholder="Tam ad" />
        </div>

        <div className="form-group">
          <input type="email" required placeholder="Email ünvanı" />
        </div>

        <div className="form-group">
          <input type="password" required placeholder="Şifrə" />
        </div>

        <div className="form-group">
          <input type="password" required placeholder="Şifrə təkrarı" />
        </div>

        <button type="submit" className="submit-btn">Qeydiyyatdan keç</button>

        <p className="login-link">Hesabınız var? <a href="#">Daxil olun</a></p>
      </form>
    </section>
  )
}

export default Register