import React, { useState, useEffect } from 'react';
import "./index.scss";
import { TbActivityHeartbeat, TbStarFilled, TbCheck, TbInfoCircle } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom'; // <-- əlavə et

const SeyahatSigortasi = () => {
  const [activeTab, setActiveTab] = useState('Hamısı');
  const [apiPlans, setApiPlans] = useState([]);
  const navigate = useNavigate(); // <-- initialize navigate

  const staticFields = {
    dailyPrice: "3-15 AZN",
    processingTime: "Ø 2-3 saat",
    coverage: "30K-150K EUR",
    regions: "Avropa, Asiya...",
    countries: 180,
    features: ["Beynəlxalq əhatə", "COVID-19 əhatəsi", "Sürətli ödəniş", "24/7 Dəstək"],
    coverageItems: ["Tibbi təcil", "Baqaj itkisi", "Səyahət ləğvi", "Uçuş gecikmə"],
    popular: true
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => {
        const merged = data.map(item => ({
          ...item,
          ...staticFields,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 5000) + 100,
        }));
        setApiPlans(merged);
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const tabs = ['Hamısı', 'Populyar', 'Ən ucuz', 'Ən sürətli', 'Premium'];

  return (
    <section className='seyahat-sigortasi'>
      <div className='container'>
        <div className='all'>
          {/* Header */}
          <div className='header'>
            <div className='title-section'>
              <div className='icon'>
                <TbActivityHeartbeat />
              </div>
              <div className='text'>
                <h4>Səyahət Sığortası</h4>
                <p>Beynəlxalq və daxili səyahət sığortası</p>
              </div>
            </div>
            <div className='filter-button'>
              <span>Filtr</span>
            </div>
          </div>

          {/* Tabs */}
          <div className='tab-navigationn'>
            {tabs.map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className='insurance-cards row'>
            {apiPlans.map((plan, index) => (
              <div key={index} className='insurance-card '>
                <div className='card-header'>
                  <div className='company-info'>
                    <div className='icon'>
                      <TbActivityHeartbeat />
                    </div>
                    <div className='text'>
                      <h4>{plan.name}</h4>
                      <div className='rating'>
                        <TbStarFilled />
                        <span>{plan.rating} ({plan.reviews} rəy)</span>
                      </div>
                    </div>
                  </div>
                  {plan.popular && <div className='popular-badge'>Populyar</div>}
                </div>

                <div className='card-body'>
                  <div className='details-grid'>
                    <div className='detail-item'>
                      <h5>Günlük</h5>
                      <p>{plan.dailyPrice}</p>
                    </div>
                    <div className='detail-item'>
                      <h5>Rəsmiləşdirmə</h5>
                      <p>{plan.processingTime}</p>
                    </div>
                    <div className='detail-item'>
                      <h5>Əhatə məbləği</h5>
                      <p>{plan.coverage}</p>
                    </div>
                    <div className='detail-item'>
                      <h5>Regionlar</h5>
                      <p>{plan.regions}</p>
                    </div>
                    <div className='detail-item'>
                      <h5>Ölkələr</h5>
                      <p>● {plan.countries}</p>
                    </div>
                  </div>

                  <div className='features-section'>
                    <h5>Xüsusiyyətlər</h5>
                    <div className='features-list'>
                      {plan.features.map((feature, i) => (
                        <div key={i} className='feature-item'>
                          <TbCheck />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='coverage-section'>
                    <div className='coverage-grid'>
                      {plan.coverageItems.map((item, i) => (
                        <div key={i} className='coverage-item'>
                          <TbInfoCircle />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='card-footer'>
                  <button className='details-btn'>Ətraflı</button>
                  <button 
                    className='apply-btn' 
                    onClick={() => navigate(`/order/${plan._id}`)} // <-- navigate ilə yönləndiririk
                  >
                    Müraciət et
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeyahatSigortasi;
