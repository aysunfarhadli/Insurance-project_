import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import './index.scss'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com'

const CreateCategory = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createdCategory, setCreatedCategory] = useState(null)

  const categoryCodes = [
    // İcbari Sığorta
    { value: 'vehicle_liability', label: 'Avtonəqliyyat Mülki Məsuliyyət', group: 'İcbari' },
    { value: 'property_insurance', label: 'Daşınmaz Əmlakın İcbari Sığortası', group: 'İcbari' },
    { value: 'property_liability', label: 'Əmlakın İstismarı üzrə Məsuliyyət', group: 'İcbari' },
    { value: 'employer_liability', label: 'İşəgötürənin Məsuliyyəti', group: 'İcbari' },
    { value: 'passenger_accident', label: 'Sərnişinlərin Qəza Sığortası', group: 'İcbari' },
    { value: 'hazardous_liability', label: 'Təhlükəli Obyektlərin Məsuliyyəti', group: 'İcbari' },
    // Könüllü Sığorta (from image)
    { value: 'travel', label: 'Səyahət', group: 'Könüllü', defaultName: 'Beynəlxalq və daxili səyahət sığortası' },
    { value: 'life', label: 'Hayat', group: 'Könüllü', defaultName: 'Hayat və təqaüd sığortası' },
    { value: 'medical', label: 'Tibbi', group: 'Könüllü', defaultName: 'Tibbi xərclərin ödənilməsi' },
    { value: 'property_voluntary', label: 'Əmlak', group: 'Könüllü', defaultName: 'Ev və digər əmlak sığortası' },
    { value: 'transport', label: 'Nəqliyyat', group: 'Könüllü', defaultName: 'Avtomobil və nəqliyyat sığortası' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    }
    
    // Əgər kod seçilibsə və defaultName varsa, adı avtomatik doldur
    if (name === 'code' && value) {
      const selectedCategory = categoryCodes.find(c => c.value === value)
      if (selectedCategory && selectedCategory.defaultName) {
        newFormData.name = selectedCategory.defaultName
      }
    }
    
    setFormData(newFormData)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!formData.code) {
      setError('Kod seçilməlidir')
      setLoading(false)
      return
    }

    if (!formData.name || formData.name.trim() === '') {
      setError('Ad doldurulmalıdır')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(`${API_BASE}/api/categories`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 201) {
        setSuccess('Kateqoriya uğurla yaradıldı!')
        setCreatedCategory(res.data)
        // Reset form
        setFormData({
          code: '',
          name: '',
          active: true
        })
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
    <section className='create-category'>
      <div className="create-category-container">
        <form className="create-category-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Yeni Kateqoriya Yarat</h2>
          <p className="form-description">Sığorta kateqoriyası üçün məlumatları doldurun</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Yaradılan kateqoriyanın məlumatları */}
          {createdCategory && (
            <div className="created-category-section">
              <h3 className="section-title">✅ Yaradılan Kateqoriya</h3>
              <div className="category-details">
                <div className="detail-item">
                  <strong>ID:</strong> <span>{createdCategory._id}</span>
                </div>
                <div className="detail-item">
                  <strong>Kod:</strong> <span>{createdCategory.code}</span>
                </div>
                <div className="detail-item">
                  <strong>Ad:</strong> <span>{createdCategory.name}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> <span className={createdCategory.active ? 'status-active' : 'status-inactive'}>
                    {createdCategory.active ? 'Aktiv' : 'Qeyri-aktiv'}
                  </span>
                </div>
                {createdCategory.created_at && (
                  <div className="detail-item">
                    <strong>Yaradılma tarixi:</strong> <span>{new Date(createdCategory.created_at).toLocaleString('az-AZ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="code">Kod *</label>
              <select
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Kod seçin</option>
                <optgroup label="İcbari Sığorta">
                  {categoryCodes.filter(c => c.group === 'İcbari').map(code => (
                    <option key={code.value} value={code.value}>
                      {code.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Könüllü Sığorta">
                  {categoryCodes.filter(c => c.group === 'Könüllü').map(code => (
                    <option key={code.value} value={code.value}>
                      {code.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <small className="form-hint">Kateqoriya kodunu seçin</small>
            </div>

            <div className="form-group">
              <label htmlFor="name">Ad *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Kateqoriya adını daxil edin (avtomatik doldurulacaq)"
                required
              />
              <small className="form-hint">
                {formData.code && categoryCodes.find(c => c.value === formData.code)?.defaultName 
                  ? 'Ad avtomatik doldurulub. Lazım olsa dəyişdirə bilərsiniz.' 
                  : 'Kod seçdikdə ad avtomatik doldurulacaq'}
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Aktiv</span>
              </label>
              <small className="form-hint">Kateqoriya aktiv olacaqsa işarələyin</small>
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
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <LoadingSpinner size="small" />
                  Gözləyin...
                </span>
              ) : 'Kateqoriya Yarat'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateCategory

