import { useState, useEffect } from "react";
import { ArrowLeft, Phone, CheckCircle, User } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function Order() {
  const { id } = useParams(); // URL-dən gələn kateqoriya ID
  const [step, setStep] = useState(1);
  const [isSelf, setIsSelf] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Backend-in gözlədiyi data strukturu
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    passportNumber: "",
    finCode: "",
    birthDate: "",
    gender: "MALE",
    phone: "",
    email: "",
  });

  // 🔹 Öz məlumatlarını avtomatik doldur
  useEffect(() => {
    if (isSelf) {
      setLoading(true);
      axios
        .get("http://localhost:5000/authUser/profile")
        .then((res) => {
          const user = res.data.user || {};
          setFormData({
            firstName: user.name || "",
            lastName: user.surname || "",
            fatherName: user.fatherName || "",
            passportNumber: user.passportNumber || "",
            finCode: user.finCode || "",
            birthDate: user.birthDate || "",
            gender: user.gender || "MALE",
            phone: user.phone || "",
            email: user.email || "",
          });
        })
        .catch((err) => console.error("Profil alınmadı:", err))
        .finally(() => setLoading(false));
    } else {
      // Başqası üçün
      setFormData({
        firstName: "",
        lastName: "",
        fatherName: "",
        passportNumber: "",
        finCode: "",
        birthDate: "",
        gender: "MALE",
        phone: "",
        email: "",
      });
    }
  }, [isSelf]);

  // 🔹 Dəyişiklikləri idarə edir
  const handleChange = (e) => {
    if (isSelf) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Addım yoxlanışı
  const validateStep = () => {
    if (step === 1) {
      const requiredFields = [
        "firstName",
        "lastName",
        "fatherName",
        "passportNumber",
        "finCode",
        "birthDate",
      ];
      for (const field of requiredFields) {
        if (!formData[field]?.trim()) {
          setError("Zəhmət olmasa bütün şəxsi məlumatları doldurun.");
          return false;
        }
      }
    }

    if (step === 2) {
      if (!formData.phone?.trim() || !formData.email?.trim()) {
        setError("Zəhmət olmasa telefon və email məlumatlarını daxil edin.");
        return false;
      }
    }

    setError("");
    return true;
  };

  // 🔹 Növbəti addım və ya göndəriş
  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 3) return setStep(step + 1);

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Form məlumatlarını backend-ə göndər
      const formRes = await axios.post("http://localhost:5000/api/forms", {
        ownerType: isSelf ? "SELF" : "OTHER",
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

      const userFormId = formRes.data?.data?._id;

      //   console.log(userFormId);

      console.log("finCode:", formData.finCode);

      console.log(id);



      // if (!userFormId) throw new Error("Form ID tapılmadı!");

      // 2️⃣ Sifariş (order) yaradır
      await axios.post("http://localhost:5000/api/orders", {
        finCode: formData.finCode,
        category_id: id,
        // product_id: "6703e6b8b5d2fbc5a2435a92", // test üçün
        status: "pending",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "AZN",
        total_amount: 100,
      });

      alert("Məlumatlar uğurla göndərildi ✅");
    } catch (err) {
      console.error("Göndərmə xətası:", err);
      setError("Göndərmə zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };



  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Addım naviqasiyası */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabContent}>
          <button className={`${styles.tab} ${step === 1 ? styles.active : styles.inactive}`}>
            <User />
            Sığorta olunanın məlumatları
          </button>
          <button className={`${styles.tab} ${step === 2 ? styles.active : styles.inactive}`}>
            <Phone />
            Əlaqə məlumatları
          </button>
          <button className={`${styles.tab} ${step === 3 ? styles.active : styles.inactive}`}>
            <CheckCircle />
            Nəticə və təsdiq
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
                  <span>özüm üçün</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="userType"
                    checked={!isSelf}
                    onChange={() => setIsSelf(false)}
                  />
                  <span>başqası üçün</span>
                </label>
              </div>

              {loading ? (
                <p>Profil məlumatları yüklənir...</p>
              ) : (
                <div className={styles.formFields}>
                  {[{ name: "firstName", label: "Ad" },
                  { name: "lastName", label: "Soyad" },
                  { name: "fatherName", label: "Ata adı" },
                  { name: "passportNumber", label: "Passport nömrəsi" },
                  { name: "finCode", label: "FİN kod" },
                  { name: "birthDate", label: "Doğum tarixi", type: "date" },
                  ].map((field, i) => (
                    <div key={i} className={styles.formGroup}>
                      <label className={styles.label}>
                        {field.label} <span className={styles.required}>*</span>
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={isSelf}
                        className={styles.input}
                      />
                    </div>
                  ))}

                  {/* 🔹 Yeni: Gender seçimi */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cins</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={isSelf}
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

          {/* 🔹 Addım 2: Əlaqə məlumatları */}
          {step === 2 && (
            <div className={styles.formFields}>
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
                  disabled={isSelf}
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
                  disabled={isSelf}
                />
              </div>
            </div>
          )}

          {/* 🔹 Addım 3: Nəticə */}
          {step === 3 && (
            <div className={styles.confirmationSection}>
              <div className={styles.confirmationHeader}>
                <CheckCircle className={styles.successIcon} />
                <h2>Məlumatlarınızı Yoxlayın</h2>
                <p>Bütün məlumatlar düzgündürsə, "Təsdiqlə" düyməsini klikləyin</p>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <User className={styles.sectionIcon} />
                    Şəxsi Məlumatlar
                  </h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ad, Soyad, Ata adı:</span>
                    <span className={styles.infoValue}>{formData.firstName} {formData.lastName} {formData.fatherName}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Passport nömrəsi:</span>
                    <span className={styles.infoValue}>{formData.passportNumber}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>FİN kod:</span>
                    <span className={styles.infoValue}>{formData.finCode}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Doğum tarixi:</span>
                    <span className={styles.infoValue}>
                      {new Date(formData.birthDate).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cins:</span>
                    <span className={styles.infoValue}>
                      {formData.gender === 'MALE' ? 'Kişi' : 'Qadın'}
                    </span>
                  </div>
                </div>

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
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>Sığorta Məlumatları</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Sığorta olunan:</span>
                    <span className={styles.infoValue}>
                      {isSelf ? 'Özüm üçün' : 'Başqası üçün'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Tarix:</span>
                    <span className={styles.infoValue}>
                      {new Date().toLocaleDateString('az-AZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.agreementSection}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.checkboxText}>
                    <a href="#" className={styles.link}>İstifadəçi razılaşmasını</a> və
                    <a href="#" className={styles.link}> məlumatların emalı şərtlərini</a> oxudum və qəbul edirəm
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
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft />
            Geri
          </button>

          <button
            className={`${styles.button} ${styles.nextButton}`}
            style={{
              backgroundColor: step < 3 ? "#3b82f6" : "#10b981",
              cursor: "pointer",
            }}
            onClick={handleNext}
            disabled={loading}
          >
            {step < 3 ? "Növbəti" : "Bitir"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Order;
