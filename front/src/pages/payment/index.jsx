import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/cib pay logo png.png";
import mastercard from "../../assets/image.png";
import maestro from "../../assets/maestro-vertical-logo.png";
import visa from "../../assets/Logo-VISA-transparent-PNG.png";
import visaSecure from "../../assets/uk-visa-secure-640x640.webp";
import mastercardSecurecode from "../../assets/mastercard-securecode.webp";
import pciDss from "../../assets/pci-dss-compliant-logo-vector.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [cardData, setCardData] = useState({
    pan: "",
    cvv: "",
    expiration_month: "",
    expiration_year: "",
    holder: ""
  });

  useEffect(() => {
    // Check authentication and load order data
    const checkAuthAndLoadData = async () => {
      try {
        setPageLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        
        // Check authentication first
        try {
          const authRes = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
          const user = authRes.data.user || authRes.data;
          if (user) {
            setIsAuthenticated(true);
          } else {
            // Birbaşa login-ə yönləndir
            navigate("/login");
            return;
          }
        } catch (authErr) {
          console.error("Authentication check failed:", authErr);
          // Birbaşa login-ə yönləndir
          navigate("/login");
          return;
        }

        // Load order data
        const data = location.state?.orderData || JSON.parse(sessionStorage.getItem('paymentOrderData') || '{}');
        setOrderData(data);
        
        // Check if order data exists
        if (!orderId && !data.orderId) {
          navigate('/umumiSig');
          return;
        }
        
        // Simulate page loading to ensure smooth transition
        setTimeout(() => {
          setPageLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error loading data:", err);
        setPageLoading(false);
        if (!orderId) {
          navigate('/umumiSig');
        }
      }
    };

    checkAuthAndLoadData();
  }, [orderId, location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format card number (no spaces - as per cibpay requirement)
    if (name === 'pan') {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        setCardData(prev => ({ ...prev, [name]: cleaned }));
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
    if (!cardData.pan || cardData.pan.length < 16) {
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

      // Create payment order (with auto_charge: false to manually control the flow)
      const createOrderRes = await axios.post(`${API_BASE}/api/payment/orders/create`, {
        amount: orderData.total_amount || 150.00,
        currency: orderData.currency || "AZN",
        merchant_order_id: orderData.orderId || orderId,
        options: {
          auto_charge: false, // Manual authorize and charge
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

      // Authorize payment with orderId
      const authRes = await axios.post(`${API_BASE}/api/payment/authorize`, {
        orderId: cibpayOrderId,
        merchant_order_id: orderData.orderId || orderId,
        amount: orderData.total_amount || 150.00,
        pan: cardData.pan,
        card: {
          cvv: cardData.cvv,
          expiration_month: parseInt(cardData.expiration_month),
          expiration_year: 2000 + parseInt(cardData.expiration_year),
          holder: cardData.holder || ""
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

      // Check if authorization was successful
      if (!authRes.data?.success) {
        throw new Error(authRes.data?.error || "Ödəniş autorizasiyası uğursuz oldu");
      }

      // Charge payment after successful authorization
      try {
        const chargeRes = await axios.post(`${API_BASE}/api/payment/orders/charge`, {
          orderId: cibpayOrderId,
          merchant_order_id: orderData.orderId || orderId
        });
        
        // Check payment status
        const paymentStatus = chargeRes.data?.data?.status || chargeRes.data?.status;
        if (paymentStatus === "PAID" || paymentStatus === "ISSUED" || paymentStatus === "CHARGED") {
          console.log("Payment successful:", chargeRes.data);
        } else if (paymentStatus === "DECLINED" || paymentStatus === "FAILED") {
          const errorMsg = chargeRes.data?.data?.failure_message || chargeRes.data?.failure_message || "Ödəniş rədd edildi";
          throw new Error(errorMsg);
        } else {
          console.log("Payment status:", paymentStatus);
        }
      } catch (chargeErr) {
        console.error("Charge error:", chargeErr.response?.data || chargeErr.message);
        // If charge fails, check if payment was already processed
        if (chargeErr.response?.status !== 400 && chargeErr.response?.status !== 409) {
          throw new Error(chargeErr.response?.data?.error || chargeErr.message || "Ödəniş zamanı xəta baş verdi");
        }
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

  const amount = orderData.total_amount || 1.00;
  const currency = orderData.currency || "AZN";

  // Show loading spinner while page is loading
  if (pageLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen={true} size="large" />
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <div className={styles.paymentWrapper}>
        {/* Header with cibpay logo and amount */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <img src={logo} alt="" />
              <span className={styles.logoText}>cibpay</span>
            </div>
            <div className={styles.amountDisplay}>
              <span className={styles.amountLabel}>Məbləğ:</span>
              <span className={styles.amountValue}>{amount.toFixed(2)}{currency}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className={styles.paymentOptions}>
          <button type="button" className={styles.birPayButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5L12 8H8L10 5Z" fill="currentColor" />
              <path d="M8 12L10 15L12 12H8Z" fill="currentColor" />
            </svg>
            bir pay
          </button>

          <div className={styles.divider}>
            <span>və ya</span>
          </div>

          <button type="button" className={styles.googlePayButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5C8.5 5 7.2 5.5 6.2 6.3L4.8 4.9C6.1 3.7 7.9 3 10 3C12.1 3 13.9 3.7 15.2 4.9L13.8 6.3C12.8 5.5 11.5 5 10 5Z" fill="#4285F4" />
              <path d="M10 15C11.5 15 12.8 14.5 13.8 13.7L15.2 15.1C13.9 16.3 12.1 17 10 17C7.9 17 6.1 16.3 4.8 15.1L6.2 13.7C7.2 14.5 8.5 15 10 15Z" fill="#EA4335" />
              <path d="M4.8 4.9L6.2 6.3C7.2 5.5 8.5 5 10 5V3C7.9 3 6.1 3.7 4.8 4.9Z" fill="#FBBC04" />
              <path d="M15.2 15.1L13.8 13.7C12.8 14.5 11.5 15 10 15V17C12.1 17 13.9 16.3 15.2 15.1Z" fill="#34A853" />
            </svg>
            Buy with G Pay
          </button>
        </div>

        {/* Card Brand Logos */}
        <div className={styles.cardBrands}>
          <img src={mastercard} alt="Mastercard" className={styles.brandLogo} />
          <img src={maestro} alt="Maestro" className={styles.brandLogo} />
          <img src={visa} alt="VISA" className={styles.brandLogo} />
          <img src={visa} alt="VISA Electron" className={styles.brandLogo} />
        </div>

        {/* Card Details Form */}
        <form className={styles.paymentForm} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Kart nömrəsi</label>
            <div>
              <input
                type="text"
                name="pan"
                value={cardData.pan}
                onChange={handleInputChange}
                placeholder="Rəqəmləri boşluq olmadan doldurun"
                maxLength="16"
                required
              />
              <span className={styles.hint}>Rəqəmləri boşluq olmadan doldurun</span>

            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Etibarlıdır:</label>
            <div className={styles.expiryInputs}>
              <select
                name="expiration_month"
                value={cardData.expiration_month}
                onChange={handleInputChange}
                required
              >
                <option value="">Ay</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = String(i + 1).padStart(2, '0');
                  return <option key={month} value={month}>{month}</option>;
                })}
              </select>
              <select
                name="expiration_year"
                value={cardData.expiration_year}
                onChange={handleInputChange}
                required
              >
                <option value="">İl</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = String(new Date().getFullYear() % 100 + i).padStart(2, '0');
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>CVV</label>
            <div className={styles.cvvInputWrapper}>
              <input
                type={showCvv ? "text" : "password"}
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder=""
                maxLength="3"
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowCvv(!showCvv)}
              >
                {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <span className={styles.hint}>Kartın arxasındakı son 3 rəqəm</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Kart sahibi</label>
            <div>
              <input
                type="text"
                name="holder"
                value={cardData.holder}
                onChange={handleInputChange}
                placeholder=""
              />
              <span className={styles.hint}>Kartda ad yoxdursa boş saxlayın</span>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Ödəniş edilir..." : "Ödə"}
          </button>
        </form>

        {/* Security Logos */}
        <div className={styles.securityLogos}>
          <img src={visaSecure} alt="VISA SECURE" className={styles.securityLogo} />
          <img src={mastercardSecurecode} alt="MasterCard SecureCode" className={styles.securityLogo} />
          <img src={pciDss} alt="PCI DSS COMPLIANT" className={styles.securityLogo} />
        </div>
      </div>
    </div>
  );
}

export default Payment;

