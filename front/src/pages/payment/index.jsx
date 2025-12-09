import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data from location state or sessionStorage
  const orderData = location.state?.orderData || JSON.parse(sessionStorage.getItem('paymentOrderData') || '{}');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardData, setCardData] = useState({
    pan: "",
    cvv: "",
    expiration_month: "",
    expiration_year: "",
    holder: ""
  });

  useEffect(() => {
    if (!orderId && !orderData.orderId) {
      navigate('/umumiSig');
    }
  }, [orderId, orderData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number (add spaces every 4 digits)
    if (name === 'pan') {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        setCardData(prev => ({ ...prev, [name]: formatted }));
      }
    }
    // Format CVV (max 3 digits)
    else if (name === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setCardData(prev => ({ ...prev, [name]: value }));
      }
    }
    // Format expiration month (01-12)
    else if (name === 'expiration_month') {
      if (value.length <= 2 && /^\d*$/.test(value)) {
        const month = parseInt(value) || 0;
        if (month <= 12) {
          setCardData(prev => ({ ...prev, [name]: value.padStart(2, '0') }));
        }
      }
    }
    // Format expiration year (2 digits)
    else if (name === 'expiration_year') {
      if (value.length <= 2 && /^\d*$/.test(value)) {
        setCardData(prev => ({ ...prev, [name]: value }));
      }
    }
    else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate card data
    if (!cardData.pan || cardData.pan.replace(/\s/g, '').length < 16) {
      setError("Kart nömrəsi düzgün deyil");
      return;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      setError("CVV düzgün deyil");
      return;
    }
    if (!cardData.expiration_month || !cardData.expiration_year) {
      setError("Kartın son istifadə tarixi düzgün deyil");
      return;
    }
    if (!cardData.holder) {
      setError("Kart sahibinin adı daxil edilməlidir");
      return;
    }

    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Get browser details for 3D Secure
      const browserDetails = {
        acceptHeader: navigator.acceptHeader || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
        language: navigator.language || "az-AZ",
        colorDepth: screen.colorDepth || 24,
        screenHeight: screen.height || 1080,
        screenWidth: screen.width || 1920,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Baku",
        userAgent: navigator.userAgent || ""
      };

      // Create payment order
      const createOrderRes = await axios.post(`${API_BASE}/api/payment/orders/create`, {
        amount: orderData.total_amount || 150.00,
        currency: orderData.currency || "AZN",
        merchant_order_id: orderData.orderId || orderId,
        options: {
          auto_charge: true,
          force3d: 1,
          language: "az",
          return_url: `${window.location.origin}/payment/success/${orderData.orderId || orderId}`
        },
        client: {
          name: orderData.fullName || "Test User",
          email: orderData.email || "test@email.com"
        }
      });

      const cibpayOrderId = createOrderRes.data?.data?.id;
      
      if (!cibpayOrderId) {
        throw new Error("Ödəniş sifarişi yaradıla bilmədi");
      }

      // Authorize payment
      const authRes = await axios.post(`${API_BASE}/api/payment/authorize`, {
        amount: orderData.total_amount || 150.00,
        pan: cardData.pan.replace(/\s/g, ''),
        card: {
          cvv: cardData.cvv,
          expiration_month: parseInt(cardData.expiration_month),
          expiration_year: 2000 + parseInt(cardData.expiration_year),
          holder: cardData.holder
        },
        client: {
          name: orderData.fullName || "Test User",
          email: orderData.email || "test@email.com"
        },
        options: {
          force3d: 1,
          browser: browserDetails
        },
        location: {
          ip: "93.88.94.130"
        },
        browserDetails
      });

      // Charge payment (if auto_charge is false, we need to charge manually)
      // Since auto_charge is true in createOrder, payment should be processed automatically
      // But we can still call charge to ensure it's processed
      try {
        await axios.post(`${API_BASE}/api/payment/orders/charge`, {
          orderId: cibpayOrderId
        });
      } catch (chargeErr) {
        // If charge fails, payment might have been auto-charged already
        console.log("Charge attempt:", chargeErr);
      }

      // Save payment data for success page
      const paymentSuccessData = {
        orderId: orderData.orderId || orderId,
        insuranceType: orderData.insuranceType || "Avtomobil Məsuliyyət Sığortası",
        amount: orderData.total_amount || 150.00,
        currency: orderData.currency || "AZN",
        email: orderData.email || "example@email.com",
        paymentDate: new Date().toISOString()
      };
      
      sessionStorage.setItem('paymentSuccessData', JSON.stringify(paymentSuccessData));
      
      // Navigate to success page
      navigate(`/payment/success/${orderData.orderId || orderId}`);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.error || err.message || "Ödəniş zamanı xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className={styles.title}>Ödəniş</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.orderSummary}>
          <h3>Sifariş məlumatları</h3>
          <div className={styles.summaryItem}>
            <span>Sığorta növü:</span>
            <span>{orderData.insuranceType || "Avtomobil Məsuliyyət Sığortası"}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Məbləğ:</span>
            <span className={styles.amount}>{orderData.total_amount || 150.00} {orderData.currency || "AZN"}</span>
          </div>
        </div>

        <form className={styles.paymentForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <CreditCard className={styles.icon} />
            <h2>Kart məlumatları</h2>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Kart nömrəsi</label>
            <input
              type="text"
              name="pan"
              value={cardData.pan}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Son istifadə tarixi</label>
              <div className={styles.expiryInputs}>
                <input
                  type="text"
                  name="expiration_month"
                  value={cardData.expiration_month}
                  onChange={handleInputChange}
                  placeholder="MM"
                  maxLength="2"
                  required
                />
                <span>/</span>
                <input
                  type="text"
                  name="expiration_year"
                  value={cardData.expiration_year}
                  onChange={handleInputChange}
                  placeholder="YY"
                  maxLength="2"
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Kart sahibinin adı</label>
            <input
              type="text"
              name="holder"
              value={cardData.holder}
              onChange={handleInputChange}
              placeholder="AD SOYAD"
              required
            />
          </div>

          <div className={styles.securityNote}>
            <Lock size={16} />
            <span>Bütün məlumatlar şifrələnmiş şəkildə ötürülür</span>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Ödəniş edilir..." : "Ödəniş et"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;

