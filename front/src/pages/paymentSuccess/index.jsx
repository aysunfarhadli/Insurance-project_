import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Home, HelpCircle, Shield, Check } from "lucide-react";
import styles from "./index.module.scss";

function PaymentSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get payment data from sessionStorage
    const savedData = sessionStorage.getItem('paymentSuccessData');
    if (savedData) {
      const data = JSON.parse(savedData);
      // Format orderId as insurance policy number
      if (data.orderId && !data.orderId.startsWith('POL-')) {
        data.orderId = `POL-${data.orderId}`;
      }
      setPaymentData(data);
    } else {
      // Fallback data
      const fallbackOrderId = orderId || `POL-${Date.now()}`;
      setPaymentData({
        orderId: fallbackOrderId.startsWith('POL-') ? fallbackOrderId : `POL-${fallbackOrderId}`,
        insuranceType: "Avtomobil Məsuliyyət Sığortası",
        amount: 150.00,
        currency: "AZN",
        email: "example@email.com",
        paymentDate: new Date().toISOString()
      });
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthNames = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12"];
    return `${year} ${monthNames[month - 1]} ${day.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    // In a real app, this would download the insurance document
    alert("Sığorta faylı yüklənir...");
  };

  if (!paymentData) {
    return <div className={styles.container}>Yüklənir...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Success Icon */}
      <div className={styles.successIcon}>
        <div className={styles.shield}>
          <Shield size={64} />
        </div>
        <div className={styles.checkmark}>
          <Check size={32} />
        </div>
      </div>

      {/* Success Message */}
      <div className={styles.successMessage}>
        <h1>Ödəniş uğurla tamamlandı</h1>
        <p>Sığorta müraciətiniz qeydə alındı</p>
      </div>

      {/* Details Card */}
      <div className={styles.detailsCard}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Sığorta növü</span>
          <span className={styles.value}>{paymentData.insuranceType}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Sığorta nömrəsi</span>
          <span className={styles.value}>{paymentData.orderId}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Ödənilən məbləğ</span>
          <span className={`${styles.value} ${styles.amount}`}>
            {paymentData.amount.toFixed(2)} {paymentData.currency}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Ödəniş tarixi</span>
          <span className={styles.value}>{formatDate(paymentData.paymentDate)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={handleDownload}>
          <Download size={20} />
          <span>Sığorta faylını yüklə</span>
        </button>
        <button className={styles.secondaryButton} onClick={() => navigate('/umumiSig')}>
          <Home size={20} />
          <span>Əsas səhifəyə qayıt</span>
        </button>
      </div>

      {/* Additional Information */}
      <div className={styles.additionalInfo}>
        <h3>Əlavə məlumat</h3>
        <p>Sənədiniz {paymentData.email} e-poçt ünvanınıza da göndərildi.</p>
      </div>

      {/* Help Icon */}
      <button className={styles.helpButton}>
        <HelpCircle size={24} />
      </button>
    </div>
  );
}

export default PaymentSuccess;

