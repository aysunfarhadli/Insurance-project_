import { useState, useEffect } from "react";
import { ArrowLeft, Phone, CheckCircle, Calendar, User } from "lucide-react";
import axios from "axios";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function Order() {
  const [step, setStep] = useState(1); // 1: məlumatlar, 2: əlaqə, 3: nəticə
  const [isSelf, setIsSelf] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    passportNumber: "",
    finCode: "",
    birthDate: "",
    phone: "",
    email: "",
  });

  // ✅ Özüm üçün seçiləndə backend-dən profili al
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
            phone: user.phone || "",
            email: user.email || "",
          });
        })
        .catch((err) => console.error("Profil alınmadı:", err))
        .finally(() => setLoading(false));
    } else {
      // ✅ Başqası üçün seçiləndə form sıfırlanır
      setFormData({
        firstName: "",
        lastName: "",
        fatherName: "",
        passportNumber: "",
        finCode: "",
        birthDate: "",
        phone: "",
        email: "",
      });
    }
  }, [isSelf]);

  const handleChange = (e) => {
    if (isSelf) return; // özüm üçün rejimdə heç nə dəyişməsin
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={styles.container}>
      {/* TABLAR */}
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

      {/* FORM */}
      <main className={styles.main}>
        <div className={styles.formCard}>
          {step === 1 && (
            <>
              {/* Radio */}
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
                  {[
                    { name: "firstName", label: "Ad" },
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
                </div>
              )}
            </>
          )}

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

          {step === 3 && (
            <div>
              <h2>Nəticə və təsdiq</h2>
              <p>Yazdığınız bütün məlumatları yoxlayın və təsdiqləyin:</p>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
              <button
                className={styles.nextButton}
                onClick={() => alert("Məlumatlar uğurla göndərildi ✅")}
              >
                Təsdiqlə
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
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
          >
            {step < 3 ? "Növbəti" : "Bitir"}
            <ArrowLeft className={styles.arrowIcon} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Order;
