import React, { useState, useEffect } from 'react'
import "./index.scss"
import { FaExclamationTriangle, FaPlane } from "react-icons/fa";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaHeart } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../components/LoadingSpinner';
import carouselImage1 from '../../assets/WhatsApp Image 2025-12-26 at 3.33.27 PM.jpeg';
import carouselImage2 from '../../assets/WhatsApp Image 2025-12-26 at 3.33.28 PM.jpeg';

const UmSig = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate(); // ✅ əlavə olundu

  // Kampaniya slides
  const campaigns = [
    {
      title: t('insurance.campaigns.seasonal'),
      description: t('insurance.campaigns.seasonalDesc'),
      image: carouselImage1
    },
    {
      title: t('insurance.campaigns.mandatory'),
      description: t('insurance.campaigns.mandatoryDesc'),
      image: carouselImage2
    }
  ];

  const [activeTab, setActiveTab] = useState("icbari"); // "icbari" or "konullu"

  // Karusel funksionallığı
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Avtomatik çevirmə
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaigns.length);
    }, 5000); // 5 saniyədə bir çevirir

    return () => clearInterval(interval);
  }, [campaigns.length]);

  // Kateqoriya ikonları mapping
  const categoryIcons = {
    travel: <FaPlane />,
    life: <TbActivityHeartbeat />,
    health: <FaHeart />,
    medical: <FaHeart />,
    property: <FaHouse />,
    property_voluntary: <FaHouse />,
    vehicle: <FaCar />,
    transport: <FaCar />,
    default: <FaShield />
  };

  // Könüllü sığorta kateqoriyaları
  const voluntaryCategories = [
    {
      code: 'travel',
      name: t('insurance.categories.travel'),
      description: t('insurance.categories.travelDesc'),
      icon: FaPlane,
      route: 'travel'
    },
    {
      code: 'life',
      name: t('insurance.categories.life'),
      description: t('insurance.categories.lifeDesc'),
      icon: TbActivityHeartbeat,
      route: 'life'
    },
    {
      code: 'medical',
      name: t('insurance.categories.medical'),
      description: t('insurance.categories.medicalDesc'),
      icon: FaHeart,
      route: 'medical'
    },
    {
      code: 'property_voluntary',
      name: t('insurance.categories.property'),
      description: t('insurance.categories.propertyDesc'),
      icon: FaHouse,
      route: 'property_voluntary'
    },
    {
      code: 'transport',
      name: t('insurance.categories.transport'),
      description: t('insurance.categories.transportDesc'),
      icon: FaCar,
      route: 'transport'
    }
  ];

  // Status rəngləri
  const statusColors = {
    draft: '#6c757d',
    pending: '#ffc107',
    priced: '#17a2b8',
    approved: '#28a745',
    paid: '#20c997',
    rejected: '#dc3545',
    canceled: '#6c757d'
  };

  // Status mətnləri
  const statusTexts = {
    draft: 'Qaralama',
    pending: 'Gözləyir',
    priced: 'Qiymətləndirilib',
    approved: 'Təsdiqlənib',
    paid: 'Ödənilib',
    rejected: 'Rədd edilib',
    canceled: 'Ləğv edilib'
  };

  // İstifadəçi profilini gətir
  useEffect(() => {
    const checkAuthAndGetProfile = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        
        const res = await axios(`${API_BASE}/authUser/profile`);
        const user = res.data.user || res.data;
        setUserId(user._id);
      } catch (err) {
        console.error("Authentication check failed:", err);
        // Don't use mock data - handle error properly
        setError("Giriş edilməyib. Zəhmət olmasa giriş edin.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndGetProfile();
  }, []);


  // Sifarişləri gətir (userId-yə görə)
  useEffect(() => {
    const getUserAndOrders = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        
        // Get user profile
        const userRes = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
        const user = userRes.data.user || userRes.data;
        setUserId(user._id);

        // Get orders
        const ordersRes = await axios.get(`${API_BASE}/api/orders`);
        const ordersData = ordersRes.data;

        const allOrders = Array.isArray(ordersData) ? ordersData : [];
        const userOrders = allOrders.filter(order => order.userId === user._id);
        
        setOrders(userOrders);

      } catch (err) {
        console.error(err);
        // Silently handle error - just set empty orders array
        setOrders([]);
        setError(""); // Clear any previous errors
      } finally {
        setLoading(false);
      }
    };

    getUserAndOrders();
  }, []);

  // Fetch categories to get real IDs
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const res = await axios.get(`${API_BASE}/api/categories`);
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
        console.log("Fetched categories:", categoriesData.map(c => ({ code: c.code, name: c.name, id: c._id })));
      } catch (err) {
        console.error("Categories fetch error:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get category ID by code
  const getCategoryIdByCode = (code) => {
    if (!code || !categories || categories.length === 0) {
      console.warn(`Cannot find category: code="${code}", categories array:`, categories);
      return null;
    }
    const category = categories.find(cat => cat && cat.code === code);
    if (!category) {
      console.warn(`Category with code "${code}" not found. Available categories:`, categories.map(c => ({ code: c.code, name: c.name, id: c._id })));
      return null;
    }
    console.log(`Found category: code="${code}" -> id="${category._id}", name="${category.name}"`);
    return category._id || null;
  };

  console.log(orders);



  // Tarixi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'long'
    });
  };


  // Kateqoriya ikonunu gətir
  const getCategoryIcon = (categoryCode) => {
    return categoryIcons[categoryCode] || categoryIcons.default;
  };

  // Order card icon colors
  const getOrderIconColor = (index) => {
    const colors = ['#9ca3af', '#9333ea', '#10b981', '#2563eb'];
    return colors[index % colors.length];
  };

  return (
    <>
      <section className='umSigorta'>
        <div className='container'>
          <div className='all row'>
            <div className='box1 col-12'>
              <div className='kampaniya-carousel'>
                <div className='carousel-container'>
                  <div className='carousel-wrapper'>
                    <div 
                      className='carousel-slides' 
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {campaigns.map((campaign, index) => (
                        <div 
                          key={index} 
                          className='kampaniya slide'
                          style={{ backgroundImage: `url(${campaign.image})` }}
                        >
                          <div className="slide-overlay">
                            <h3>{campaign.title}</h3>
                            <p>{campaign.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className='carousel-dots'>
                    {campaigns.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className='insurance-tabs'>
                <button 
                  className={`tab-btn ${activeTab === 'icbari' ? 'active' : ''}`}
                  onClick={() => setActiveTab('icbari')}
                >
                  {t('insurance.mandatory')}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'konullu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('konullu')}
                >
                  {t('insurance.voluntary')}
                </button>
              </div>
              <div className='sig row'>
                {activeTab === 'icbari' ? (
                  <>
                <div className='sey col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('passenger_accident');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: passenger_accident');
                }}>
                  <div className='svg'>
                    <FaPlane />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.passengerAccident')}</h4>
                    <p>{t('insurance.categories.passengerAccidentDesc')}</p>
                  </div>
                </div>
                <div className='heyat col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('employer_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: employer_liability');
                }}>
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.employerLiability')}</h4>
                    <p>{t('insurance.categories.employerLiabilityDesc')}</p>
                  </div>
                </div>
                <div className='tibbi col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('property_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: property_liability');
                }}>
                  <div className='svg'>
                    <FaHeart />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.propertyOperations')}</h4>
                    <p>{t('insurance.categories.propertyOperationsDesc')}</p>
                  </div>
                </div>
                <div className='emlak col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('property_insurance');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: property_insurance');
                }}>
                  <div className='svg'>
                    <FaHouse />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.mandatoryProperty')}</h4>
                    <p>{t('insurance.categories.mandatoryPropertyDesc')}</p>
                  </div>
                </div>
                <div className='neqliy col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('vehicle_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: vehicle_liability');
                }}>
                  <div className='svg'>
                    <FaCar />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.vehicleLiability')}</h4>
                    <p>{t('insurance.categories.vehicleLiabilityDesc')}</p>
                  </div>
                </div>
                <div className='tehlukeli col-2 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('hazardous_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: hazardous_liability');
                }}>
                  <div className='svg'>
                    <FaExclamationTriangle />
                  </div>
                  <div className='par'>
                    <h4>{t('insurance.categories.hazardous')}</h4>
                    <p>{t('insurance.categories.hazardousDesc')}</p>
                  </div>
                </div>
                  </>
                ) : (
                  <>
                    {voluntaryCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div 
                          key={category.code}
                          className={`${category.code} col-2 sam `}
                          onClick={async () => {
                            try {
                              // Fetch categories again to ensure we have latest data
                              const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
                              const res = await axios.get(`${API_BASE}/api/categories`);
                              const allCategories = Array.isArray(res.data) ? res.data : [];
                              
                              // Find the specific category by code
                              const foundCategory = allCategories.find(cat => cat && cat.code === category.code);
                              
                              if (foundCategory && foundCategory._id) {
                                console.log(`Navigating to /order/${foundCategory._id} for ${category.name} (${category.code})`);
                                navigate(`/order/${foundCategory._id}`);
                              } else {
                                console.error(`Category "${category.code}" not found. Available categories:`, allCategories.map(c => ({ code: c.code, name: c.name })));
                                alert(`"${category.name}" kateqoriyası tapılmadı. Zəhmət olmasa əvvəlcə bu kateqoriyanı yaradın (/create-category səhifəsində).`);
                              }
                            } catch (err) {
                              console.error('Error fetching categories:', err);
                              alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
                            }
                          }}
                        >
                          <div className='svg'>
                            <Icon />
                          </div>
                          <div className='par'>
                            <h4>{category.name}</h4>
                            <p>{category.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='tamam'>
        <div className='container'>
          <div className='all row'>
            <div className='ms col-12'>
              <div className='act row'>
                <a href='#' className='wh'>{t('insurance.orders')}</a>
                <a href='#'>{t('common.seeAll')}</a>
              </div>

              {loading ? (
                <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                  <LoadingSpinner size="large" />
                </div>
              ) : (
                <>
                  {orders.length > 0 ? (
                    <div className='cards row'>
                      {orders.slice(0, 4).map((order, index) => {
                        const companyName = order.company || ["Mega Sığorta", "Paşa Sığorta", "ASCO Sığorta", "Atəşgah Sığorta"][index % 4];
                        const iconColor = getOrderIconColor(index);
                        
                        return (
                          <div key={order._id} className='order-card'>
                            <div className='order-card-content'>
                              <div className='order-icon' style={{ color: iconColor, borderColor: iconColor }}>
                                {getCategoryIcon(order.category_id?.code)}
                              </div>
                              <div className='order-info'>
                                <h4 className='company-name'>{companyName}</h4>
                                <p className='order-date'>{formatDate(order.created_at)}</p>
                                <p className='order-type'>{order.category_id?.name || 'Sığorta'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-orders">
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p className="empty-message">{t('common.noData')}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default UmSig
