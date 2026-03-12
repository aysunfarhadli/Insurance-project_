import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Home, HelpCircle, Shield, Check } from "lucide-react";
import axios from "axios";
import styles from "./index.module.scss";

function PaymentSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [status, setStatus] = useState({ loading: true, ok: false, message: "" });

  useEffect(() => {
    const run = async () => {
      try {
        setStatus({ loading: true, ok: false, message: "" });
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';

        // Verify payment status from CIBPay using merchant order id (our internal orderId)
        const verifyRes = await axios.get(`${API_BASE}/api/payment/orders/merchant/${orderId}`);
        const cibOrder = verifyRes.data?.order;
        const cibStatus = cibOrder?.status;

        // Debug log to help during integration
        console.log("CIBPay order for merchant_order_id:", orderId, {
          status: cibStatus,
          failure_message: cibOrder?.failure_message,
          failure_type: cibOrder?.failure_type
        });

        // Accept typical "success" statuses; everything else is treated as failure
        const successStatuses = new Set(["charged", "CHARGED", "paid", "PAID", "issued", "ISSUED"]);

        if (!successStatuses.has(cibStatus || "")) {
          const msg =
            cibOrder?.failure_message ||
            cibOrder?.failure_type ||
            `Ödəniş müvəffəqiyyətlə tamamlanmadı (status: ${cibStatus || "unknown"})`;
          setStatus({ loading: false, ok: false, message: msg });
          return;
        }

        // Create local order only AFTER successful charge
        const pendingStr = sessionStorage.getItem("pendingOrder");
        if (!pendingStr) {
          setStatus({ loading: false, ok: true, message: "Payment verified, but pending order data not found." });
          return;
        }
        const pending = JSON.parse(pendingStr);

        const orderRes = await axios.post(`${API_BASE}/api/orders`, {
          finCode: pending.finCode,
          category_id: pending.category_id,
          userId: pending.userId,
          status: "paid",
          start_date: pending.start_date,
          end_date: pending.end_date,
          currency: pending.currency,
          total_amount: pending.total_amount
        });

        const createdOrderId = orderRes.data?.data?.orderId;
        if (!createdOrderId) {
          setStatus({ loading: false, ok: true, message: "Payment verified, but local order ID not returned." });
          return;
        }

        // Save specific form now that order exists
        if (pending.specificData && Object.keys(pending.specificData).length > 0) {
          await axios.post(`${API_BASE}/api/order-form-specific`, {
            order_id: createdOrderId,
            category_code: pending.category_code,
            details: pending.specificData
          });
        }

        // Build success view data
        const paymentOrderData = JSON.parse(sessionStorage.getItem('paymentOrderData') || '{}');
        setPaymentData({
          orderId: `POL-${createdOrderId}`,
          insuranceType: paymentOrderData.insuranceType || "Sığorta",
          amount: Number(pending.total_amount || 0),
          currency: pending.currency || "AZN",
          email: paymentOrderData.email || "example@email.com",
          paymentDate: new Date().toISOString()
        });

        // Cleanup so refresh doesn't try again
        sessionStorage.removeItem("pendingOrder");
        sessionStorage.removeItem("paymentOrderData");

        setStatus({ loading: false, ok: true, message: "" });
      } catch (e) {
        const msg = e.response?.data?.details?.failure_message || e.response?.data?.message || e.message || "Error";
        setStatus({ loading: false, ok: false, message: msg });
      }
    };

    run();
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

  if (status.loading) {
    return <div className={styles.container}>Yoxlanılır...</div>;
  }

  if (!status.ok) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h1>Ödəniş uğursuz oldu</h1>
          <p>{status.message || "Ödəniş rədd edildi."}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={() => navigate(`/payment/${orderId}`)}>
            Yenidən cəhd et
          </button>
          <button className={styles.secondaryButton} onClick={() => navigate('/umumiSig')}>
            Əsas səhifəyə qayıt
          </button>
        </div>
      </div>
    );
  }

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

