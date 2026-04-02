import { useState, useEffect } from "react";
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
import { Button } from "../../components/ui/button";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [terminal, setTerminal] = useState("kapital");

  useEffect(() => {
    // Check authentication and load order data
    const checkAuthAndLoadData = async () => {
      try {
        setPageLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const enableLogin = import.meta.env.VITE_ENABLE_LOGIN !== 'false';

        // Check authentication first
        if (enableLogin) {
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
        } else {
          // If login is disabled, skip authentication
          setIsAuthenticated(true);
        }

        // Load order data
        const data = location.state?.orderData || JSON.parse(sessionStorage.getItem('paymentOrderData') || '{}');
        setOrderData(data);
        if (data?.terminal) setTerminal(String(data.terminal));
        
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';

      // Validate order data before creating payment
      const merchantOrderId = orderData.orderId || orderId;
      if (!merchantOrderId) {
        throw new Error("Sifariş ID tapılmadı. Zəhmət olmasa yenidən cəhd edin.");
      }

      const amount = parseFloat(orderData.total_amount || 150.00);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Məbləğ düzgün deyil");
      }

      // Hosted checkout flow:
      // Create order and redirect user to CIBPay checkout page (no card data handled by us).
      const force3dByTerminal = {
        kapital: 1,
        millikart_test: 0,
        atb: 0,
        tamkart: 1
      };

      const createOrderRes = await axios.post(`${API_BASE}/api/payment/orders/create`, {
        amount: amount,
        currency: orderData.currency || "AZN",
        merchant_order_id: String(merchantOrderId),
        options: {
          auto_charge: true,
          force3d: force3dByTerminal[terminal] ?? 1,
          language: "az",
          return_url: `${window.location.origin}/payment/success/${merchantOrderId}`,
          ...(terminal ? { terminal: String(terminal) } : {})
        },
        client: {
          name: orderData.fullName || "Test User",
          email: orderData.email || "test@email.com"
        }
      });

      console.log("✅ Order created successfully");
      console.log("📦 Full response:", createOrderRes.data);

      const checkoutUrl =
        createOrderRes.data?.checkout_url ||
        createOrderRes.data?.order?.checkout_url ||
        createOrderRes.data?.data?.orders?.[0]?.checkout_url ||
        createOrderRes.data?.data?.orders?.[0]?.checkoutUrl;

      if (!checkoutUrl) {
        console.error("❌ Checkout URL not found. Response data:", {
          checkout_url: createOrderRes.data?.checkout_url,
          order_checkout_url: createOrderRes.data?.order?.checkout_url,
          data_orders: createOrderRes.data?.data?.orders?.[0],
          full_response: createOrderRes.data
        });
        throw new Error("Checkout link tapılmadı (checkout_url).");
      }

      console.log("🔗 Redirecting to checkout URL:", checkoutUrl);
      console.log("📋 Order details sent:", {
        amount,
        currency: orderData.currency,
        terminal,
        merchant_order_id: merchantOrderId
      });

      // Redirect to CIBPay payment page
      window.location.assign(checkoutUrl);
      return;

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
      console.error("❌ Payment error:", err);
      console.error("📋 Request details:", {
        amount,
        currency: orderData.currency,
        merchant_order_id: orderData.orderId || orderId,
        terminal
      });
      console.error("📦 Error response:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details?.failure_message ||
                          err.response?.data?.details?.message ||
                          err.response?.data?.details ||
                          err.message || 
                          "Ödəniş zamanı xəta baş verdi";
      setError(errorMessage);
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

        <div className={styles.formGroup}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Ödəniş metodu (test üçün terminal)
          </label>
          <select
            value={terminal}
            onChange={(e) => setTerminal(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              background: "white"
            }}
            disabled={loading}
          >
            <option value="kapital">KapitalBank (Ecom)</option>
            <option value="millikart_test">MilliKart (Ecom)</option>
            <option value="atb">ATB (Ecom)</option>
            <option value="tamkart">ABB Tamkart (Installment)</option>
          </select>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
            Qeyd: test kartlar terminala bağlıdır. “Tamkart” seçsəniz OTP adətən <b>1111</b> olur.
          </div>
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

          <Button type="submit" className={styles.submitButton} disabled={loading} style={{ width: '100%' }}>
            {loading ? "CIBPay səhifəsi açılır..." : "Ödəniş səhifəsinə keç"}
          </Button>
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

