import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './index.scss'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-j5e6.onrender.com'

const CreateCompany = () => {
  const navigate = useNavigate()
  const [jsonBody, setJsonBody] = useState(`{
  "code": "MEGA",
  "name": "Mega Sığorta",
  "active": true,
  "logo_url": "https://example.com/logo.png",
  "contact_info": {
    "email": "info@mega.az",
    "phone": "+994 12 123 45 67",
    "address": "Bakı şəhəri, Nizami rayonu"
  }
}`)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [createdCompany, setCreatedCompany] = useState(null)

  // İstifadəçinin login olub-olmadığını yoxlayırıq
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/authUser/profile`, {
          withCredentials: true
        })
        if (!res.data.user) {
          navigate('/login')
        }
      } catch (err) {
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const handleJsonChange = (e) => {
    const value = e.target.value
    setJsonBody(value)
    setJsonError('')
    setError('')
  }

  const validateJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      setJsonError('')
      return parsed
    } catch (err) {
      setJsonError('JSON formatı düzgün deyil: ' + err.message)
      return null
    }
  }

  const formatJson = () => {
    const parsed = validateJson(jsonBody)
    if (parsed) {
      setJsonBody(JSON.stringify(parsed, null, 2))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // JSON-u validate et
    const parsedData = validateJson(jsonBody)
    if (!parsedData) {
      setLoading(false)
      return
    }

    // Body-ni console-da göstər
    console.log('📤 Göndərilən Body:', JSON.stringify(parsedData, null, 2))

    try {
      const res = await axios.post(`${API_BASE}/api/companies`, parsedData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 201) {
        setSuccess('Şirkət uğurla yaradıldı!')
        setCreatedCompany(res.data) // Yaradılan şirkətin məlumatlarını saxla
        // 5 saniyə sonra profilə yönləndir
        setTimeout(() => {
          navigate('/profile')
        }, 5000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='create-company'>
      <div className="create-company-container">
        <form className="create-company-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Yeni Şirkət Yarat</h2>
          <p className="form-description">JSON body-ni buraya paste edin və ya yazın</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          {jsonError && <div className="alert alert-error">{jsonError}</div>}

          {/* Yaradılan şirkətin məlumatları */}
          {createdCompany && (
            <div className="created-company-section">
              <h3 className="section-title">✅ Yaradılan Şirkət</h3>
              <div className="company-details">
                <div className="detail-item">
                  <strong>ID:</strong> <span>{createdCompany._id}</span>
                </div>
                <div className="detail-item">
                  <strong>Kod:</strong> <span>{createdCompany.code}</span>
                </div>
                <div className="detail-item">
                  <strong>Ad:</strong> <span>{createdCompany.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> <span className={createdCompany.active ? 'status-active' : 'status-inactive'}>
                    {createdCompany.active ? 'Aktiv' : 'Qeyri-aktiv'}
                  </span>
                </div>
                {createdCompany.logo_url && (
                  <div className="detail-item">
                    <strong>Logo URL:</strong> <span>{createdCompany.logo_url}</span>
                  </div>
                )}
                {createdCompany.contact_info && (
                  <div className="contact-details">
                    <strong>Əlaqə Məlumatları:</strong>
                    {createdCompany.contact_info.email && (
                      <div className="contact-item">📧 Email: {createdCompany.contact_info.email}</div>
                    )}
                    {createdCompany.contact_info.phone && (
                      <div className="contact-item">📞 Telefon: {createdCompany.contact_info.phone}</div>
                    )}
                    {createdCompany.contact_info.address && (
                      <div className="contact-item">📍 Ünvan: {createdCompany.contact_info.address}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="json-input-section">
            <div className="json-header">
              <label htmlFor="json-body">JSON Body *</label>
              <button 
                type="button" 
                className="format-btn" 
                onClick={formatJson}
                title="JSON-u formatla"
              >
                🔧 Formatla
              </button>
            </div>
            <textarea
              id="json-body"
              className="json-textarea"
              value={jsonBody}
              onChange={handleJsonChange}
              placeholder='JSON body-ni buraya yazın...'
              required
              rows={15}
            />
            <div className="json-hint">
              <p>💡 <strong>Nümunə format:</strong></p>
              <pre className="hint-code">
{`{
  "code": "MEGA",
  "name": "Mega Sığorta",
  "active": true,
  "logo_url": "https://example.com/logo.png",
  "contact_info": {
    "email": "info@mega.az",
    "phone": "+994 12 123 45 67",
    "address": "Bakı şəhəri"
  }
}`}
              </pre>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/profile')}
            >
              Ləğv et
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Gözləyin...' : 'Şirkət Yarat'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateCompany

