import { useState, useEffect } from "react";
import { ArrowLeft, Phone, CheckCircle, User, Car, Home, Building, Briefcase, Bus, AlertTriangle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

// 🔹 Hər kateqoriya üçün konfiqurasiya 
const categoryConfig = {
  vehicle_liability: {
    name: "Avtonəqliyyat Mülki Məsuliyyət",
    icon: Car,
    fields: {
      // Şəxsi məlumatlar (ümumi bütün kateqoriyalar üçün) 
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      // Kateqoriyaya xüsusi fieldlər 
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", required: true },
        { name: "brandModel", label: "Marka/Model", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", required: true },
        { name: "engineVolume", label: "Mühərrik həcmi" },
        { name: "fuelType", label: "Yanacaq növü" },
        { name: "usagePurpose", label: "İstifadə təyinatı", required: true, options: ["şəxsi", "taksi", "kommersiya", "korporativ"] },
        { name: "ownershipType", label: "Sahiblik növü", options: ["fərdi", "hüquqi", "lizinq"] },
        { name: "previousPolicy", label: "Keçmiş polis nömrəsi" },
      ]
    }
  },
  property_insurance: {
    name: "Daşınmaz Əmlakın İcbari Sığortası",
    icon: Home,
    fields: {
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      specific: [
        { name: "propertyAddress", label: "Əmlakın ünvanı", required: true },
        { name: "propertyType", label: "Əmlak tipi", required: true, options: ["mənzil", "ev", "ofis", "ticarət", "anbar"] },
        { name: "area", label: "Sahə (m²)", type: "number", required: true },
        { name: "floor", label: "Mərtəbə sayı / yerləşdiyi mərtəbə" },
        { name: "wallMaterial", label: "Divar materialı" },
        { name: "constructionYear", label: "Tikinti ili", type: "number" },
        { name: "propertyDocument", label: "Mülkiyyət sənədi nömrəsi" },
      ]
    }
  },
  property_liability: {
    name: "Əmlakın İstismarı üzrə Məsuliyyət",
    icon: Building,
    fields: {
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      specific: [
        { name: "operatorName", label: "İstismarçının adı", required: true },
        { name: "objectAddress", label: "Obyektin ünvanı", required: true },
        { name: "objectPurpose", label: "Obyektin təyinatı", required: true, options: ["ticarət mərkəzi", "ofis", "yaşayış", "sənaye", "ictimai"] },
        { name: "totalArea", label: "Ümumi sahə (m²)", type: "number" },
        { name: "visitorFlow", label: "Təxmini gündəlik insan axını", type: "number" },
        { name: "fireSafety", label: "Yanğın təhlükəsizliyi sertifikatı", type: "checkbox" },
      ]
    }
  },
  employer_liability: {
    name: "İşəgötürənin Məsuliyyəti",
    icon: Briefcase,
    fields: {
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      specific: [
        { name: "companyName", label: "Şirkətin adı", required: true },
        { name: "voen", label: "VÖEN", required: true },
        { name: "activityField", label: "Fəaliyyət sahəsi", required: true },
        { name: "legalAddress", label: "Hüquqi ünvan", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", required: true },
        { name: "averageSalary", label: "Orta aylıq əməkhaqqı fondu", type: "number" },
      ]
    }
  },
  passenger_accident: {
    name: "Sərnişinlərin Qəza Sığortası",
    icon: Bus,
    fields: {
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      specific: [
        { name: "carrierName", label: "Daşıyıcının adı", required: true },
        { name: "voen", label: "VÖEN" },
        { name: "routeType", label: "Marşrut və fəaliyyət növü", required: true, options: ["şəhəriçi", "şəhərlərarası", "daxili rayon", "beynəlxalq"] },
        { name: "vehicleCount", label: "Nəqliyyat vasitələrinin sayı", type: "number" },
        { name: "seatCount", label: "Oturacaq sayı", type: "number" },
        { name: "maxPassengers", label: "Maksimal sərnişin sayı", type: "number" },
      ]
    }
  },
  hazardous_liability: {
    name: "Təhlükəli Obyektlərin Məsuliyyəti",
    icon: AlertTriangle,
    fields: {
      personal: [
        { name: "firstName", label: "Ad", required: true },
        { name: "lastName", label: "Soyad", required: true },
        { name: "fatherName", label: "Ata adı", required: true },
        { name: "passportNumber", label: "Passport nömrəsi", required: true },
        { name: "finCode", label: "FİN kod", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
      ],
      specific: [
        { name: "subjectName", label: "Subyektin adı", required: true },
        { name: "voen", label: "VÖEN" },
        { name: "objectType", label: "Obyektin tipi", required: true, options: ["kimyəvi", "partlayış", "yanğın", "radioaktiv", "digər"] },
        { name: "objectAddress", label: "Obyektin ünvanı", required: true },
        { name: "dangerClass", label: "Təhlükə sinfi" },
        { name: "employeeCount", label: "İşçi sayı", type: "number" },
        { name: "operationVolume", label: "Əməliyyat həcmi" },
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
        const res = await axios.get("http://localhost:5000/authUser/profile");
        const user = res.data.user
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
        setIsAuthenticated(false);
        setError("Sifariş etmək üçün daxil olmalısınız.");
        setTimeout(() => navigate("/login"), 2000);
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
        const res = await axios.get(`http://localhost:5000/api/categories/${id}`);
        console.log("Gətirilən kateqoriya:", res.data);
        // Məsələn, kodu ayrıca saxlayırsan: 
        const categoryCode = res.data.code;
        setCategory(categoryCode)
        console.log("Kateqoriya kodu:", categoryCode);
        // Əgər istəsən state-də də saxlaya bilərsən 
        // setCurrentCategoryData(res.data.data); 
      } catch (err) {
        console.error("Kateqoriya alınmadı:", err);
      }
    };
    fetchCategory();
  }, [id]);

  console.log("cat2 ", category);

  const currentCategory = categoryConfig[category] || categoryConfig.passenger_accident
  const CategoryIcon = currentCategory.icon;

  // console.log("cate ", currentCategory); 

  // 🔹 Dinamik form data strukturu 
  const [formData, setFormData] = useState({
    // Şəxsi məlumatlar 
    firstName: "",
    lastName: "",
    fatherName: "",
    passportNumber: "",
    finCode: "",
    birthDate: "",
    gender: "MALE",
    phone: "",
    email: "",
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
        firstName: user.name || "",
        lastName: user.surname || "",
        fatherName: user.fatherName || "",
        passportNumber: user.passportNumber || "",
        finCode: user.finCode || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        phone: user.phone || "",
        email: user.email || "",
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
  // 🔹 Field komponenti 
  const renderField = (field) => {
    if (field.options) {
      return (
        <select
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          // Remove the disabled condition for personal fields
          className={styles.input}
        >
          <option value="">Seçin</option>
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
        value={formData[field.name]}
        onChange={handleChange}
        // Remove the disabled condition for personal fields
        className={styles.input}
        placeholder={field.placeholder || ""}
      />
    );
  };

  // 🔹 Növbəti addım və ya göndəriş 
  const handleNext = async () => {
    if (!validateStep()) return;

    if (step <= 3) return setStep(step + 1);

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Form məlumatlarını backend-ə göndər 
      const formRes = await axios.post("http://localhost:5000/api/forms", {
        ownerType: isSelf ? "SELF" : "OTHER",
        userId: userId, // Add user ID to forms
        firstName: formData.firstName,
        lastName: formData.lastName,
        fatherName: formData.fatherName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        passportNumber: formData.passportNumber,
        finCode: formData.finCode,
        phone: formData.phone,
        email: formData.email,
      });

      // const manualOrderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5); 
      // console.log("id ", manualOrderId); 
      
      // 2️⃣ Sifariş (order) yaradır 
      const orderRes = await axios.post("http://localhost:5000/api/orders", {
        // id: manualOrderId, 
        finCode: formData.finCode,
        category_id: id,
        userId: userId, // Add user ID to orders
        status: "pending",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 il 
        currency: "AZN",
        total_amount: 100,
      });

      const orderId = orderRes.data?.data?.orderId;
      console.log("1 ", orderId);

      if (!orderId) {
        throw new Error("Order ID alınmadı!");
      }

      console.log("2 ", orderId);

      // 3️⃣ Kateqoriyaya xüsusi məlumatları saxla 
      const specificData = {};
      currentCategory.fields.specific.forEach(field => {
        specificData[field.name] = formData[field.name];
      });

      await axios.post("http://localhost:5000/api/order-form-specific", {
        order_id: orderId, // Əslində order ID olmalıdır 
        category_code: category,
        details: specificData
      });

      alert("Məlumatlar uğurla göndərildi ✅");
    } catch (err) {
      console.error("Göndərmə xətası:", err);
      setError("Göndərmə zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
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
      {/* 🔹 Kateqoriya başlığı */}
      {/* <div className={styles.categoryHeader}> 
        <CategoryIcon className={styles.categoryIcon} /> 
        <h1>{currentCategory.name}</h1> 
      </div> */}

      {/* 🔹 Addım naviqasiyası */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabContent}>
          <button className={`${styles.tab} ${step === 1 ? styles.active : styles.inactive}`}>
            <User /> Şəxsi məlumatlar
          </button>
          <button className={`${styles.tab} ${step === 2 ? styles.active : styles.inactive}`}>
            <CategoryIcon /> Sığorta məlumatları
          </button>
          <button className={`${styles.tab} ${step === 3 ? styles.active : styles.inactive}`}>
            <Phone /> Əlaqə məlumatları
          </button>
          <button className={`${styles.tab} ${step === 4 ? styles.active : styles.inactive}`}>
            <CheckCircle /> Təsdiq
          </button>
        </div>
      </div>

      {/* 🔹 Əsas forma hissəsi */}
      <main className={styles.main}>
        <div className={styles.formCard}>
          {error && <p className={styles.error}>{error}</p>}

          {/* 🔹 Addım 1: Şəxsi məlumatlar */}
          {step === 1 && (
            <>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    checked={isSelf}
                    onChange={() => setIsSelf(true)}
                  />
                  <span>Özüm üçün</span>
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
                  {currentCategory.fields.personal.map((field, i) => (
                    <div key={i} className={styles.formGroup}>
                      <label className={styles.label}>
                        {field.label}
                        {field.required && <span className={styles.required}>*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  {/* Gender seçimi */}
                  {/* Gender seçimi */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cins</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      // Remove disabled={isSelf}
                      className={styles.input}
                    >
                      <option value="MALE">Kişi</option>
                      <option value="FEMALE">Qadın</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 🔹 Addım 2: Sığorta məlumatları */}
          {step === 2 && (
            <div className={styles.formFields}>
              <h3 className={styles.sectionTitle}>{currentCategory.name} Məlumatları</h3>
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

          {/* 🔹 Addım 4: Təsdiq */}
          {step === 4 && (
            <div className={styles.confirmationSection}>
              <div className={styles.confirmationHeader}>
                <CheckCircle className={styles.successIcon} />
                <h2>Məlumatlarınızı Yoxlayın</h2>
                <p>Bütün məlumatlar düzgündürsə, "Təsdiqlə" düyməsini klikləyin</p>
              </div>

              <div className={styles.infoGrid}>
                {/* Şəxsi məlumatlar */}
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <User className={styles.sectionIcon} />
                    Şəxsi Məlumatlar
                  </h3>
                  {currentCategory.fields.personal.map(field => (
                    <div key={field.name} className={styles.infoRow}>
                      <span className={styles.infoLabel}>{field.label}:</span>
                      <span className={styles.infoValue}>{formData[field.name]}</span>
                    </div>
                  ))}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cins:</span>
                    <span className={styles.infoValue}>
                      {formData.gender === 'MALE' ? 'Kişi' : 'Qadın'}
                    </span>
                  </div>
                </div>

                {/* Sığorta məlumatları */}
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <CategoryIcon className={styles.sectionIcon} />
                    Sığorta Məlumatları
                  </h3>
                  {currentCategory.fields.specific.map(field => (
                    <div key={field.name} className={styles.infoRow}>
                      <span className={styles.infoLabel}>{field.label}:</span>
                      <span className={styles.infoValue}>
                        {field.type === 'checkbox' ? (formData[field.name] ? 'Bəli' : 'Xeyr') : formData[field.name]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Əlaqə məlumatları */}
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <Phone className={styles.sectionIcon} />
                    Əlaqə Məlumatları
                  </h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Telefon:</span>
                    <span className={styles.infoValue}>{formData.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{formData.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Sığorta olunan:</span>
                    <span className={styles.infoValue}>
                      {isSelf ? 'Özüm üçün' : 'Başqası üçün'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.agreementSection}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} required />
                  <span className={styles.checkboxText}>
                    <a href="#" className={styles.link}>İstifadəçi razılaşmasını</a> və <a href="#" className={styles.link}> məlumatların emalı şərtlərini</a> oxudum və qəbul edirəm
                  </span>
                </label>
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => setStep(1)}
                >
                  Məlumatları Düzəlt
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinner}></div>
                      Göndərilir...
                    </>
                  ) : (
                    <>
                      <CheckCircle className={styles.buttonIcon} />
                      Təsdiqlə və Göndər
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 🔹 Addım idarə düymələri */}
      {step < 4 && (
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft /> Geri
            </button>
            <button
              className={`${styles.button} ${styles.nextButton}`}
              onClick={handleNext}
              disabled={loading}
            >
              {step <= 3 ? "Növbəti" : "Təsdiqə keç"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Order;