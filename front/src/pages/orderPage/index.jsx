import { useState, useEffect } from "react";
import { ArrowLeft, Phone, CheckCircle, User, Car, Home, Building, Briefcase, Bus, AlertTriangle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

// 🔹 Hər kateqoriya üçün konfiqurasiya 
const categoryConfig = {
  vehicle_liability: {
    name: "Avtomobil Məsuliyyət Sığortası",
    icon: Car,
    subtitle: "Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət sığortası",
    fields: {
      // Şəxsi məlumatlar (ümumi bütün kateqoriyalar üçün) 
      personal: [
        { name: "fullName", label: "Sahibkarın tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: false },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      // Kateqoriyaya xüsusi fieldlər 
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", placeholder: "10-AA-123", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", placeholder: "VIN nömrəsini daxil edin", required: true },
        { name: "brandModel", label: "Marka/Model", placeholder: "Toyota Camry", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", placeholder: "2020", required: true },
        { name: "engineVolume", label: "Mühərrik həcmi", type: "number", placeholder: "2.5" },
        { name: "fuelType", label: "Yanacaq növü", options: ["benzin", "dizel", "qaz", "elektrik", "hibrid"] },
        { name: "usagePurpose", label: "İstifadə təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["şəxsi", "taksi", "kommersiya", "korporativ"] },
        { name: "ownershipType", label: "Sahiblik növü", options: ["fərdi", "hüquqi", "lizinq"] },
        { name: "previousPolicy", label: "Keçmiş polis nömrəsi (bonus-malus üçün)", placeholder: "POL-123456" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  property_insurance: {
    name: "İcbari Əmlak Sığortası",
    icon: Home,
    subtitle: "Yaşayış və qeyri-yaşayış binalar, mənzillər və tikililər üçün icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Sahibi tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: false },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      specific: [
        { name: "propertyAddress", label: "Əmlakın ünvanı (küçə, bina/mənzil, şəhər/rayon)", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "propertyType", label: "Əmlak tipi", placeholder: "Əmlak tipini seçin", required: true, options: ["mənzil", "ev", "ofis", "ticarət", "anbar"] },
        { name: "area", label: "Sahə (m²)", type: "number", placeholder: "120", required: true },
        { name: "totalFloors", label: "Mərtəbə sayı", type: "number", placeholder: "9" },
        { name: "floorLocation", label: "Yerləşdiyi mərtəbə", type: "number", placeholder: "5" },
        { name: "wallMaterial", label: "Divar materialı", placeholder: "Material seçin", options: ["kərpic", "beton", "ağac", "digər"] },
        { name: "constructionYear", label: "Tikinti ili", type: "number", placeholder: "2015" },
        { name: "propertyDocument", label: "Mülkiyyət sənədi nömrəsi (çıxarış/kupça)", placeholder: "Sənəd nömrəsi" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  property_liability: {
    name: "Əmlakın İstismarı üzrə Məsuliyyət",
    icon: Building,
    subtitle: "İstismarçı kimi üçüncü şəxslərə dəyə biləcək zərərlərə görə icbari məsuliyyət",
    fields: {
      personal: [
        { name: "fullName", label: "İstismarçının adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: false },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "objectAddress", label: "Obyektin ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "objectPurpose", label: "Obyektin təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["ticarət mərkəzi", "ofis", "yaşayış", "sənaye", "ictimai"] },
        { name: "totalArea", label: "Ümumi sahə (m²)", type: "number", placeholder: "500" },
        { name: "visitorFlow", label: "Təxmini gündəlik insan axını", type: "number", placeholder: "100" },
        { name: "fireSafety", label: "Yanğın təhlükəsizliyi sertifikatı var", type: "checkbox" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  employer_liability: {
    name: "İşəgötürənin Məsuliyyəti",
    icon: Briefcase,
    subtitle: "İş zamanı əməkdaşlara dəyən zərərlərə görə işəgötürənin məsuliyyəti",
    fields: {
      personal: [
        { name: "fullName", label: "Şirkətin adı", placeholder: "Şirkətin tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Hüquqi ünvan", placeholder: "Tam ünvanı daxil edin", required: true },
      ],
      specific: [
        { name: "activityField", label: "Fəaliyyət sahəsi (NACE/OKED kodu və ya təsvir)", placeholder: "Fəaliyyət sahəsini daxil edin", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "50", required: true },
        { name: "averageSalary", label: "Orta aylıq əməkhaqqı fondu", type: "number", placeholder: "5000" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  passenger_accident: {
    name: "Sərnişinlərin Qəza Sığortası",
    icon: Bus,
    subtitle: "Sərnişin daşıyan subyektlər üçün qanunla nəzərdə tutulmuş icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Daşıyıcının adı", placeholder: "Daşıyıcının tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: false },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "routeType", label: "Marşrut və fəaliyyət növü", placeholder: "Fəaliyyət növünü seçin", required: true, options: ["şəhəriçi", "şəhərlərarası", "daxili rayon", "beynəlxalq", "dəniz", "hava"] },
        { name: "vehicleCount", label: "Nəqliyyat vasitələrinin sayı", type: "number", placeholder: "5" },
        { name: "seatCount", label: "Oturacaq sayı", type: "number", placeholder: "50" },
        { name: "maxPassengers", label: "Maksimal sərnişin sayı", type: "number", placeholder: "50" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  hazardous_liability: {
    name: "Təhlükəli Obyektlərin Məsuliyyəti",
    icon: AlertTriangle,
    subtitle: "Partlayış, kimyəvi, yanğın və s. təhlükə yaradan obyektləri istismar edənlər üçün icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Subyektin adı", placeholder: "Subyektin tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: false },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "objectType", label: "Obyektin tipi", placeholder: "Obyekt tipini seçin", required: true, options: ["kimyəvi", "partlayış", "yanğın", "radioaktiv", "digər"] },
        { name: "objectAddress", label: "Obyektin tipi və ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "dangerClass", label: "Təhlükə sinfi / Lisenziyalar (uyğunluq sənədləri)", placeholder: "Təhlükə sinfini daxil edin" },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "20" },
        { name: "operationVolume", label: "Əməliyyat həcmi", placeholder: "Əməliyyat həcmini daxil edin" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  }
};

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSelf, setIsSelf] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 🔹 Check authentication and get user profile
  useEffect(() => {
    const checkAuthAndGetProfile = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_BASE}/authUser/profile`);
        const user = res.data.user || res.data;
        if (user) {
          setIsAuthenticated(true);
          setUserId(user._id);
          setUserProfile(user);
          console.log("User authenticated:", user);
        } else {
          setIsAuthenticated(false);
          setError("Sifariş etmək üçün daxil olmalısınız.");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        // Don't use mock data - handle error properly
        setIsAuthenticated(false);
        setError("Giriş edilməyib. Zəhmət olmasa giriş edin.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndGetProfile();
  }, [navigate]);

  // 🔹 Cari kateqoriyanın konfiqurasiyası 
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_BASE}/api/categories/${id}`);
        const data = res.data;
        console.log("Gətirilən kateqoriya:", data);
        const categoryCode = data.code || data.category_code || 'property_insurance';
        setCategory(categoryCode);
        console.log("Kateqoriya kodu:", categoryCode);
      } catch (err) {
        console.error("Kateqoriya alınmadı:", err);
        // Don't use mock data - handle error properly
        setError("Kateqoriya məlumatları yüklənə bilmədi.");
      }
    };
    fetchCategory();
  }, [id]);


  console.log("cat2 ", category);

  // Default to property_insurance if category not found (for design purposes)
  const currentCategory = categoryConfig[category] || categoryConfig.property_insurance;
  const CategoryIcon = currentCategory.icon;

  // console.log("cate ", currentCategory); 

  // 🔹 Dinamik form data strukturu 
  const [formData, setFormData] = useState({
    // Şəxsi məlumatlar 
    fullName: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    passportNumber: "",
    finCode: "",
    voen: "",
    birthDate: "",
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
    // Kateqoriyaya xüsusi məlumatlar (avtomatik boş olacaq) 
    ...Object.fromEntries(
      currentCategory.fields.specific
        .filter(field => !currentCategory.fields.personal.some(p => p.name === field.name))
        .map(field => [field.name, ""])
    )
  });

  // 🔹 Öz məlumatlarını avtomatik doldur 
  useEffect(() => {
    if (isSelf && userProfile) {
      const user = userProfile;
      const userData = {
        fullName: `${user.name || ""} ${user.surname || ""}`.trim(),
        firstName: user.name || "",
        lastName: user.surname || "",
        fatherName: user.fatherName || "",
        passportNumber: user.passportNumber || "",
        finCode: user.finCode || "",
        voen: user.voen || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      };

      // Kateqoriya xüsusi fieldləri sıfırlamaq 
      const categorySpecificFields = Object.fromEntries(
        currentCategory.fields.specific.map(field => [field.name, ""])
      );

      setFormData({
        ...categorySpecificFields,
        ...userData
      });
    } else {
      // Başqası üçün bütün fieldləri sıfırla 
      const allFields = [
        ...currentCategory.fields.personal,
        ...currentCategory.fields.specific
      ];
      const emptyForm = Object.fromEntries(
        allFields.map(field => [field.name, ""])
      );
      setFormData({
        ...emptyForm,
        gender: "MALE"
      });
    }
  }, [isSelf, id, userProfile]);

  // 🔹 Dəyişiklikləri idarə edir 
  const handleChange = (e) => {
    // Remove the blocking condition to allow editing even when isSelf is true
    // if (isSelf && currentCategory.fields.personal.some(field => field.name === e.target.name)) { 
    //   return; // Şəxsi məlumatları dəyişmə 
    // } 

    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // 🔹 Addım yoxlanışı 
  const validateStep = () => {
    if (step === 1) {
      const requiredFields = currentCategory.fields.personal
        .filter(field => field.required)
        .map(field => field.name);
      for (const field of requiredFields) {
        if (!formData[field]?.trim()) {
          setError("Zəhmət olmasa bütün şəxsi məlumatları doldurun.");
          return false;
        }
      }
    }
    if (step === 2) {
      const requiredSpecificFields = currentCategory.fields.specific
        .filter(field => field.required)
        .map(field => field.name);
      for (const field of requiredSpecificFields) {
        if (!formData[field]?.trim()) {
          setError("Zəhmət olmasa bütün tələb olunan sığorta məlumatlarını doldurun.");
          return false;
        }
      }
    }
    if (step === 3) {
      if (!formData.phone?.trim() || !formData.email?.trim()) {
        setError("Zəhmət olmasa telefon və email məlumatlarını daxil edin.");
        return false;
      }
    }
    setError("");
    return true;
  };

  // 🔹 Field komponenti 
  const renderField = (field) => {
    if (field.options) {
      return (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">{field.placeholder || "Seçin"}</option>
          {field.options.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          name={field.name}
          checked={formData[field.name] || false}
          onChange={handleChange}
          className={styles.checkbox}
        />
      );
    }

    return (
      <input
        type={field.type || "text"}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className={styles.input}
        placeholder={field.placeholder || ""}
      />
    );
  };

  // 🔹 Növbəti addım və ya göndəriş 
  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 3) return setStep(step + 1);
    
    // Step 3 is last - redirect to company selection page
    if (step === 3) {
      // Save form data to sessionStorage
      const formDataToSave = {
        ...formData,
        category,
        categoryId: id,
        isSelf
      };
      sessionStorage.setItem('orderFormData', JSON.stringify(formDataToSave));
      navigate(`/companies/${id}`);
      return;
    }
  };

        console.log("salammmmmmmmmmmmm", userId);


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Show loading or authentication error
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          {loading ? (
            <p>Yoxlanılır...</p>
          ) : (
            <div className={styles.authError}>
              <p>{error}</p>
              <p>Giriş səhifəsinə yönləndirilirsiniz...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 🔹 Page Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{currentCategory.name}</h1>
          <p className={styles.pageSubtitle}>
            {currentCategory.subtitle || 
             (category === 'property_insurance' 
              ? 'Yaşayış və qeyri-yaşayış binaları, mənzillər və tikililər üçün sığorta'
              : 'Sığorta məlumatlarını doldurun')}
          </p>
        </div>
      </div>

      {/* 🔹 Progress Indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${step >= 1 ? styles.completed : ''} ${step === 1 ? styles.active : ''}`}>
            <div className={styles.stepCircle}>
              {step > 1 ? <CheckCircle size={20} /> : '1'}
            </div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.completed : ''} ${step === 2 ? styles.active : ''}`}>
            <div className={styles.stepCircle}>
              {step > 2 ? <CheckCircle size={20} /> : '2'}
            </div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.completed : ''} ${step === 3 ? styles.active : ''}`}>
            <div className={styles.stepCircle}>
              {step > 3 ? <CheckCircle size={20} /> : '3'}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Əsas forma hissəsi */}
      <main className={styles.main}>
        <div className={styles.formCard}>
          {error && <p className={styles.error}>{error}</p>}

          {/* 🔹 Addım 1: Şəxsi məlumatlar */}
          {step === 1 && (
            <>
              <div className={styles.sectionHeader}>
                <User className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Sahibkar məlumatları</h3>
              </div>

              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    checked={isSelf}
                    onChange={() => setIsSelf(true)}
                  />
                  <span>özüm üçün</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    checked={!isSelf}
                    onChange={() => setIsSelf(false)}
                  />
                  <span>Başqası üçün</span>
                </label>
              </div>

              {loading ? (
                <p>Profil məlumatları yüklənir...</p>
              ) : (
                <div className={styles.formFields}>
                  {/* Full Name - Full Width */}
                  {currentCategory.fields.personal.find(f => f.name === 'fullName') && (
                    <div className={styles.formGroup}>
                      {(() => {
                        const field = currentCategory.fields.personal.find(f => f.name === 'fullName');
                        return (
                          <>
                            <label className={styles.label}>
                              {field.label}
                              {field.required && <span className={styles.required}>*</span>}
                            </label>
                            {renderField(field)}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* FIN/VOEN - Two Columns (if both exist) */}
                  {currentCategory.fields.personal.find(f => f.name === 'finCode') && currentCategory.fields.personal.find(f => f.name === 'voen') && (
                    <div className={styles.twoColumnLayout}>
                      {(() => {
                        const finField = currentCategory.fields.personal.find(f => f.name === 'finCode');
                        const voenField = currentCategory.fields.personal.find(f => f.name === 'voen');
                        return (
                          <>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                {finField.label}
                                {finField.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(finField)}
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                {voenField.label}
                                {voenField.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(voenField)}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Single FIN field if VOEN doesn't exist */}
                  {currentCategory.fields.personal.find(f => f.name === 'finCode') && !currentCategory.fields.personal.find(f => f.name === 'voen') && (
                    <div className={styles.formGroup}>
                      {(() => {
                        const field = currentCategory.fields.personal.find(f => f.name === 'finCode');
                        return (
                          <>
                            <label className={styles.label}>
                              {field.label}
                              {field.required && <span className={styles.required}>*</span>}
                            </label>
                            {renderField(field)}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Phone and Email - Two Columns */}
                  {currentCategory.fields.personal.find(f => f.name === 'phone') && currentCategory.fields.personal.find(f => f.name === 'email') && (
                    <div className={styles.twoColumnLayout}>
                      {(() => {
                        const phoneField = currentCategory.fields.personal.find(f => f.name === 'phone');
                        const emailField = currentCategory.fields.personal.find(f => f.name === 'email');
                        return (
                          <>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                {phoneField.label}
                                {phoneField.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(phoneField)}
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                {emailField.label}
                                {emailField.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(emailField)}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Address - Full Width (if exists) */}
                  {currentCategory.fields.personal.find(f => f.name === 'address') && (
                    <div className={styles.formGroup}>
                      {(() => {
                        const field = currentCategory.fields.personal.find(f => f.name === 'address');
                        return (
                          <>
                            <label className={styles.label}>
                              {field.label}
                              {field.required && <span className={styles.required}>*</span>}
                            </label>
                            {renderField(field)}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 🔹 Addım 2: Sığorta məlumatları */}
          {step === 2 && (
            <div className={styles.formFields}>
              <div className={styles.sectionHeader}>
                <CategoryIcon className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>
                  {category === 'property_insurance' ? 'Əmlak məlumatları' : `${currentCategory.name} Məlumatları`}
                </h3>
              </div>
              <div className={styles.twoColumnLayout}>
                {currentCategory.fields.specific.map((field, i) => (
                  <div key={i} className={styles.formGroup}>
                    <label className={styles.label}>
                      {field.label}
                      {field.required && <span className={styles.required}>*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔹 Addım 3: Əlaqə məlumatları */}
{step === 3 && ( 
  <div className={styles.formFields}> 
    <h3 className={styles.sectionTitle}>Əlaqə Məlumatları</h3> 
    <div className={styles.formGroup}> 
      <label className={styles.label}> 
        Telefon nömrəsi <span className={styles.required}>*</span> 
      </label> 
      <input 
        type="text" 
        name="phone" 
        value={formData.phone} 
        onChange={handleChange} 
        placeholder="+994..." 
        className={styles.input} 
        // Remove disabled={isSelf}
      /> 
    </div> 
    <div className={styles.formGroup}> 
      <label className={styles.label}> 
        Email <span className={styles.required}>*</span> 
      </label> 
      <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        placeholder="example@mail.com" 
        className={styles.input} 
        // Remove disabled={isSelf}
      /> 
    </div> 
  </div> 
)} 

        </div>
      </main>

            {/* 🔹 Addım idarə düymələri */}
            {step <= 3 && (
              <div className={styles.formActions}>
                <button
                  className={styles.prevButton}
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Əvvəlki
                </button>
                <button
                  className={styles.nextButton}
                  onClick={handleNext}
                  disabled={loading}
                >
                  Növbəti
                </button>
              </div>
            )}
    </div>
  );
}

export default Order;