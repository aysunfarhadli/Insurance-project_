import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TbStarFilled, TbClock, TbFilter } from "react-icons/tb";
import { Car } from "lucide-react";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

function CompanySelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Hamısı");
  const [showFilter, setShowFilter] = useState(false);
  const [filterPrice, setFilterPrice] = useState([0, 100]);
  const [filterRating, setFilterRating] = useState(0);

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const res = await axios.get(`${API_BASE}/api/categories/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Category fetch error:", err);
        setError("Kateqoriya məlumatları yüklənə bilmədi.");
      }
    };

    fetchCategory();
  }, [id]);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        
        // Backend-də category_id query parametri ilə şirkətləri gətir
        const res = await axios.get(`${API_BASE}/api/company-insurance-types`, {
          params: { category_id: id }
        });
        
        // Populate edilmiş şirkət məlumatlarını çıxar və unikal şirkətləri götür
        const companyMap = new Map();
        res.data.forEach(ct => {
          // Həm şirkət aktiv olmalıdır, həm də CompanyInsuranceType aktiv olmalıdır
          if (ct.company_id && 
              ct.company_id.active !== false && 
              ct.active !== false) {
            const companyId = ct.company_id._id || ct.company_id.id;
            if (!companyMap.has(companyId)) {
              // Backend-dən gələn məlumatları istifadə et
              companyMap.set(companyId, {
                ...ct.company_id,
                _id: companyId,
                // CompanyInsuranceType məlumatları
                monthly_price: ct.monthly_price,
                coverage_amount: ct.coverage_amount,
                processing_time_hours: ct.processing_time_hours,
                rating: ct.rating || 4.5,
                reviews_count: ct.reviews_count || 0,
                badge: ct.badge,
                features: ct.features || [],
                // Format edilmiş məlumatlar
                monthlyPrice: ct.monthly_price ? `${ct.monthly_price} AZN/ay` : "Qiymət yoxdur",
                coverage: ct.coverage_amount ? `${ct.coverage_amount.toLocaleString()} AZN` : "Əhatə yoxdur",
                processingTime: ct.processing_time_hours ? `${ct.processing_time_hours} saat` : "Müddət yoxdur",
                reviews: ct.reviews_count || 0,
                iconColor: ["#9333ea", "#10b981", "#3b82f6", "#f59e0b"][companyMap.size % 4]
              });
            }
          }
        });
        const data = Array.from(companyMap.values());

        setCompanies(data);
        setFilteredCompanies(data);
      } catch (err) {
        console.error("Companies fetch error:", err);
        setError("Şirkət məlumatları yüklənə bilmədi.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    if (id && category) {
      fetchCompanies();
    }
  }, [id, category]);

  const handleOrder = async (company) => {
    try {
      // Get form data from sessionStorage
      const formDataStr = sessionStorage.getItem('orderFormData');
      if (!formDataStr) {
        alert('Form məlumatları tapılmadı. Zəhmət olmasa formu yenidən doldurun.');
        navigate(`/order/${id}`);
        return;
      }

      const formData = JSON.parse(formDataStr);
      console.log("📋 Form Data:", formData);
      setLoading(true);

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';

      // Get user ID and finCode
      const userRes = await axios.get(`${API_BASE}/authUser/profile`);
      const user = userRes.data.user || userRes.data;
      console.log("👤 User Profile:", user);
      const userId = user._id || 'mock_user_123';
      
      // finCode formData-dan gəlir, yoxdursa user profilindən götür
      const finCode = formData.finCode || user.finCode;
      console.log("🔑 FIN Code:", finCode);
      
      if (!finCode || finCode.trim() === '') {
        alert('FİN kodu tapılmadı. Zəhmət olmasa formu yenidən doldurun və FİN kodunu daxil edin.');
        navigate(`/order/${id}`);
        setLoading(false);
        return;
      }

      // Create order
      const orderRes = await axios.post(`${API_BASE}/api/orders`, {
        finCode: finCode,
        category_id: id,
        userId: userId,
        company_id: company._id,
        status: "pending",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "AZN",
        total_amount: 100,
      });

      const orderId = orderRes.data?.data?.orderId;

      if (!orderId) {
        throw new Error("Order ID alınmadı!");
      }

      // Save specific form data
      const specificData = {};
      // Extract category-specific fields
      Object.keys(formData).forEach(key => {
        if (!['fullName', 'firstName', 'lastName', 'fatherName', 'passportNumber', 
              'finCode', 'voen', 'birthDate', 'gender', 'phone', 'email', 'address', 
              'category', 'categoryId', 'isSelf'].includes(key)) {
          specificData[key] = formData[key];
        }
      });

      await axios.post(`${API_BASE}/api/order-form-specific`, {
        order_id: orderId,
        category_code: formData.category || category?.code,
        details: specificData
      });

      // Prepare payment data
      const paymentOrderData = {
        orderId: orderId,
        insuranceType: category?.name || "Avtomobil Məsuliyyət Sığortası",
        total_amount: 150.00, // You can get this from orderRes or company data
        currency: "AZN",
        fullName: formData.fullName || "",
        email: formData.email || "",
        company_id: company._id,
        company_name: company.name
      };

      // Save payment data to sessionStorage
      sessionStorage.setItem('paymentOrderData', JSON.stringify(paymentOrderData));

      // Navigate to payment page
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Göndərmə xətası:", err);
      const errorMessage = err.response?.data?.message || err.message || "Göndərmə zamanı xəta baş verdi.";
      alert(errorMessage);
      
      // Əgər finCode problemi varsa, form səhifəsinə yönləndir
      if (errorMessage.includes("finCode")) {
        navigate(`/order/${id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["Hamısı", "Populyar", "Ən Ucuz", "Ən Sürətli", "Premium"];

  // Filter və sort funksiyaları
  useEffect(() => {
    let filtered = [...companies];

    // Tab filter
    switch (activeTab) {
      case "Populyar":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "Ən Ucuz":
        filtered = filtered.sort((a, b) => (a.monthly_price || 0) - (b.monthly_price || 0));
        break;
      case "Ən Sürətli":
        filtered = filtered.sort((a, b) => (a.processing_time_hours || 999) - (b.processing_time_hours || 999));
        break;
      case "Premium":
        filtered = filtered.filter(c => c.badge === "Premium");
        break;
      default:
        break;
    }

    // Price filter
    if (filterPrice[0] > 0 || filterPrice[1] < 100) {
      filtered = filtered.filter(c => {
        const price = c.monthly_price || 0;
        return price >= filterPrice[0] && price <= filterPrice[1];
      });
    }

    // Rating filter
    if (filterRating > 0) {
      filtered = filtered.filter(c => (c.rating || 0) >= filterRating);
    }

    setFilteredCompanies(filtered);
  }, [companies, activeTab, filterPrice, filterRating]);

  const handleFilterApply = () => {
    setShowFilter(false);
  };

  const handleFilterReset = () => {
    setFilterPrice([0, 100]);
    setFilterRating(0);
    setShowFilter(false);
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.icon}>
              <Car />
            </div>
            <div className={styles.text}>
              <h1 className={styles.pageTitle}>
                {category?.name || "Avtomobil Məsuliyyət Sığortası"}
              </h1>
              <p className={styles.pageSubtitle}>
                {category?.subtitle || "Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət"}
              </p>
            </div>
          </div>
          <div className={styles.filterButton} onClick={() => setShowFilter(!showFilter)}>
            <TbFilter />
            <span>Filtr</span>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className={styles.filterPanel}>
          <div className={styles.filterHeader}>
            <h3>Filtr</h3>
            <button onClick={() => setShowFilter(false)}>×</button>
          </div>
          <div className={styles.filterContent}>
            <div className={styles.filterGroup}>
              <label>Qiymət (AZN/ay)</label>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filterPrice[0]}
                  onChange={(e) => setFilterPrice([parseInt(e.target.value) || 0, filterPrice[1]])}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filterPrice[1]}
                  onChange={(e) => setFilterPrice([filterPrice[0], parseInt(e.target.value) || 100])}
                  placeholder="Max"
                />
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label>Minimum Reytinq</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filterRating}
                onChange={(e) => setFilterRating(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
          <div className={styles.filterActions}>
            <button onClick={handleFilterReset}>Təmizlə</button>
            <button onClick={handleFilterApply} className={styles.applyBtn}>Tətbiq et</button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Companies Grid */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>Şirkətlər yüklənir...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className={styles.error}>Bu kateqoriya üçün şirkət tapılmadı</div>
        ) : (
          <div className={styles.companiesGrid}>
            {filteredCompanies.map((company, index) => (
              <div key={company._id} className={styles.companyCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.companyInfo}>
                    <div className={styles.companyIcon} style={{ backgroundColor: company.iconColor }}>
                      <Car />
                    </div>
                    <div className={styles.companyText}>
                      <h4>{company.name}</h4>
                      <div className={styles.rating}>
                        <TbStarFilled />
                        <span>{company.rating?.toFixed(1) || '4.5'} ({company.reviews_count || company.reviews || 0} rəy)</span>
                      </div>
                    </div>
                  </div>
                  {company.badge && (
                    <div className={styles.badge}>{company.badge}</div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <h5>Aylıq ödəniş:</h5>
                      <p className={styles.priceValue}>{company.monthlyPrice}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <h5>Əhatə məbləği:</h5>
                      <p>{company.coverage}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <h5>İcra müddəti:</h5>
                      <p className={styles.timeValue}>
                        <TbClock />
                        <span>{company.processingTime}</span>
                      </p>
                    </div>
                  </div>

                  <div className={styles.featuresSection}>
                    <h5>Xüsusiyyətlər:</h5>
                    <div className={styles.featuresList}>
                      {company.features?.map((feature, i) => (
                        <div key={i} className={styles.featureTag}>{feature}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button className={styles.detailsBtn}>Ətraflı</button>
                  <button
                    className={styles.applyBtn}
                    onClick={() => handleOrder(company)}
                    disabled={loading}
                  >
                    Sifariş et
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CompanySelection;

