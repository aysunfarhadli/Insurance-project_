import React from 'react'
import './index.scss'

const Login = () => {
  return (
    <section className='login'>
      <div className="login-container">
        <form className="login-form">
          <h2 className="login-title">Daxil olun</h2>
          <p className="login-description">CİB siğorta hesabınıza daxil olun</p>

          <div className="form-group">
            <label htmlFor="email">Email ünvanı</label>
            <input
              type="email"
              id="email"
              name="email"
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
              required
              placeholder="Şifrənizi daxil edin"
            />
          </div>

          <button type="submit" className="login-btn">Daxil ol</button>

          <p className="register-link">Hesabınız yoxdur? <a href="#">Qeydiyyatdan keçin</a></p>
        </form>
      </div>
    </section>
  )
}

export default Login