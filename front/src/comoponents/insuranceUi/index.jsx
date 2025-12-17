import React, { useState, useEffect } from "react";
import "./index.scss";
import { TbActivityHeartbeat, TbCar, TbHome, TbUserHeart, TbPlane, TbStarFilled, TbClock, TbFilter } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const icons = {
  travel: <TbPlane />,
  auto: <TbCar />,
  property: <TbHome />,
  health: <TbUserHeart />,
  life: <TbActivityHeartbeat />,
};

const InsuranceCategory = ({ type, title, subtitle }) => {
  const [activeTab, setActiveTab] = useState("Hamısı");
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const staticFields = {
    monthlyPrice: "45 AZN/ay",
    processingTime: "2 saat",
    coverage: "50,000 AZN",
    features: ["24/7 Dəstək", "Tez Ödəniş", "Beynəlxalq əhatə"],
    badge: "Ən Populyar",
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const res = await fetch(`${API_BASE}/api/categories?type=${type}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();

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
        const reviews = [2341, 1892, 3124, 1456];
        
        const merged = Array.isArray(data) ? data.map((item, index) => ({
          ...item,
          monthlyPrice: item.monthlyPrice || monthlyPrices[index % monthlyPrices.length],
          processingTime: item.processingTime || processingTimes[index % processingTimes.length],
          coverage: item.coverage || coverages[index % coverages.length],
          features: item.features || featureSets[index % featureSets.length],
          badge: item.badge || badges[index % badges.length],
          rating: item.rating || ratings[index % ratings.length],
          reviews: item.reviews || reviews[index % reviews.length],
        })) : [];
        
        setPlans(merged);
      } catch (err) {
        console.error("Categories fetch error:", err);
        setPlans([]);
      }
    };

    loadCategories();
  }, [type]);

  const tabs = ["Hamısı", "Populyar", "Ən Ucuz", "Ən Sürətli", "Premium"];

  // const typeCodeMap = {
  //   travel: "passenger_accident",
  //   auto: "vehicle_liability",
  //   property: "property_insurance",
  //   health: "employer_liability",
  //   life: "hazardous_liability",
  // };

  let filteredPlans = plans.filter((i) => i.code === type);

  return (
    <section className="insurance-category">
      <div className="container">
        <div className="all">
          <div className="header">
            <div className="title-section">
              <div className="icon">{icons[type]}</div>
              <div className="text">
                <h4>{title}</h4>
                <p>{subtitle}</p>
              </div>
            </div>
            <div className="filter-button">
              <TbFilter />
              <span>Filtr</span>
            </div>
          </div>

          <div className="tab-navigationn">
            {tabs.map((tab) => (
              <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="insurance-cards row">
            {filteredPlans.map((plan, index) => {
              const iconColors = ["#9333ea", "#10b981", "#3b82f6", "#10b981"];
              const iconColor = iconColors[index % iconColors.length];
              
              return (
                <div key={index} className="insurance-card">
                  <div className="card-header">
                    <div className="company-info">
                      <div className="icon" style={{ backgroundColor: iconColor }}>
                        {icons[type]}
                      </div>
                      <div className="text">
                        <h4>{plan.name}</h4>
                        <div className="rating">
                          <TbStarFilled />
                          <span>{plan.rating} ({plan.reviews} rəy)</span>
                        </div>
                      </div>
                    </div>
                    <div className="badge">{plan.badge}</div>
                  </div>

                  <div className="card-body">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h5>Aylıq ödəniş:</h5>
                        <p className="price-value">{plan.monthlyPrice}</p>
                      </div>
                      <div className="detail-item">
                        <h5>Əhatə məbləği:</h5>
                        <p>{plan.coverage}</p>
                      </div>
                      <div className="detail-item">
                        <h5>İcra müddəti:</h5>
                        <p className="time-value">
                          <TbClock />
                          <span>{plan.processingTime}</span>
                        </p>
                      </div>
                    </div>

                    <div className="features-section">
                      <h5>Xüsusiyyətlər:</h5>
                      <div className="features-list">
                        {plan.features.map((f, i) => (
                          <div key={i} className="feature-tag">{f}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="details-btn">Ətraflı</button>
                    <button
                      className="apply-btn"
                      onClick={() => navigate(`/order/${plan._id}`)}
                    >
                      Sifariş et
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceCategory;
