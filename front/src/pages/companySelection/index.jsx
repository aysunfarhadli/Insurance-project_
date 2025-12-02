import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TbStarFilled, TbClock, TbFilter } from "react-icons/tb";
import { Car } from "lucide-react";
import styles from "./index.module.scss";
import { mockCompanies, getMockCompaniesByCategory } from "../../mockData/companies";
import { getMockCategoryById } from "../../mockData/categories";
import { withMockFallback } from "../../utils/mockDataHelper";

axios.defaults.withCredentials = true;

function CompanySelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Hamısı");

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        
        const { data, isMock } = await withMockFallback(
          async () => {
            const res = await axios.get(`${API_BASE}/api/categories/${id}`);
            return { data: res.data };
          },
          () => getMockCategoryById(id)
        );

        if (isMock) {
          console.log('📦 Using mock category data');
        }

        setCategory(data);
      } catch (err) {
        console.error("Category fetch error:", err);
        const mockCat = getMockCategoryById(id);
        if (mockCat) {
          setCategory(mockCat);
        }
      }
    };

    fetchCategory();
  }, [id]);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        
        const { data, isMock } = await withMockFallback(
          async () => {
            const res = await axios.get(`${API_BASE}/api/company-insurance-types`);
            const companyTypes = res.data.filter(ct => 
              ct.category_id?._id === id || ct.category_id?.code === category?.code
            );
            const companyIds = [...new Set(companyTypes.map(ct => ct.company_id?._id).filter(Boolean))];
            const companiesRes = await Promise.all(
              companyIds.map(cid => axios.get(`${API_BASE}/api/companies/${cid}`))
            );
            return { data: companiesRes.map(r => r.data) };
          },
          () => getMockCompaniesByCategory(id)
        );

        if (isMock) {
          console.log('📦 Using mock companies data');
        }

        // Add mock insurance plan data to companies
        const badges = ["Ən Populyar", "Ən Sürətli", "Premium", "Budget"];
        const monthlyPrices = ["45 AZN/ay", "38 AZN/ay", "52 AZN/ay", "32 AZN/ay"];
        const coverages = ["50,000 AZN", "40,000 AZN", "75,000 AZN", "30,000 AZN"];
        const processingTimes = ["2 saat", "1 saat", "3 saat", "4 saat"];
        const featureSets = [
          ["24/7 Dəstək", "Tez Ödəniş", "Beynəlxalq əhatə"],
          ["Online Xidmət", "Sürətli Qeydiyyat", "Mobil Tətbiq"],
          ["Premium Xidmət", "VIP Dəstək", "Genişləndirilmiş əhatə"],
          ["Əsas əhatə", "Standart Dəstək", "Sənədləşmə"]
        ];
        const ratings = [4.8, 4.6, 4.7, 4.5];
        const reviews = [2341, 1876, 1234, 987];
        const iconColors = ["#9333ea", "#10b981", "#3b82f6", "#10b981"];

        const companiesWithPlans = (Array.isArray(data) ? data : []).map((company, index) => ({
          ...company,
          badge: badges[index % badges.length],
          monthlyPrice: monthlyPrices[index % monthlyPrices.length],
          coverage: coverages[index % coverages.length],
          processingTime: processingTimes[index % processingTimes.length],
          features: featureSets[index % featureSets.length],
          rating: ratings[index % ratings.length],
          reviews: reviews[index % reviews.length],
          iconColor: iconColors[index % iconColors.length]
        }));

        setCompanies(companiesWithPlans.length > 0 ? companiesWithPlans : mockCompanies.map((c, i) => ({
          ...c,
          badge: badges[i % badges.length],
          monthlyPrice: monthlyPrices[i % monthlyPrices.length],
          coverage: coverages[i % coverages.length],
          processingTime: processingTimes[i % processingTimes.length],
          features: featureSets[i % featureSets.length],
          rating: ratings[i % ratings.length],
          reviews: reviews[i % reviews.length],
          iconColor: iconColors[i % iconColors.length]
        })));
      } catch (err) {
        console.error("Companies fetch error:", err);
        setCompanies(mockCompanies);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
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
      setLoading(true);

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // Get user ID
      const userRes = await axios.get(`${API_BASE}/authUser/profile`);
      const userId = userRes.data.user?._id || 'mock_user_123';

      // Create order
      const orderRes = await axios.post(`${API_BASE}/api/orders`, {
        finCode: formData.finCode,
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

      // Clear sessionStorage
      sessionStorage.removeItem('orderFormData');

      alert("Məlumatlar uğurla göndərildi ✅");
      navigate('/umumiSig');
    } catch (err) {
      console.error("Göndərmə xətası:", err);
      alert("Göndərmə zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["Hamısı", "Populyar", "Ən Ucuz", "Ən Sürətli", "Premium"];

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
          <div className={styles.filterButton}>
            <TbFilter />
            <span>Filtr</span>
          </div>
        </div>
      </div>

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
        ) : companies.length === 0 ? (
          <div className={styles.error}>Bu kateqoriya üçün şirkət tapılmadı</div>
        ) : (
          <div className={styles.companiesGrid}>
            {companies.map((company, index) => (
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
                        <span>{company.rating} ({company.reviews} rəy)</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.badge}>{company.badge}</div>
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

