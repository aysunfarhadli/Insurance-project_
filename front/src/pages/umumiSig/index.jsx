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

const UmSig = () => {
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
      title: "Mövsümi Təkliflər",
      description: "Yeni ilin xüsusi təklifləri! Səyahət və tibbi sığortada unikal şərtlər. Ailəvi paketlərdə 30% endirim!",
      gradient: "linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%)"
    },
    {
      title: "İcbari Sığorta Kampaniyası",
      description: "Bütün icbari sığorta növlərində sürətli rəsmiləşdirmə. Online müraciət edin!",
      gradient: "linear-gradient(135deg, #c4e5ff 0%, #a6b6ff 100%)"
    },
    {
      title: "Yay kampaniyası",
      description: "Avtomobil sığortasında 25% endirim. Yay səyahətləriniz üçün xüsusi təklif!",
      gradient: "linear-gradient(135deg, #ffe5c4 0%, #ffb6a6 100%)"
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
    property: <FaHouse />,
    vehicle: <FaCar />,
    default: <FaShield />
  };

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
        setError("Məlumatlar gətirilərkən xəta baş verdi");
        // Don't use mock data - handle error properly
        setOrders([]);
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
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get category ID by code
  const getCategoryIdByCode = (code) => {
    const category = categories.find(cat => cat.code === code);
    return category?._id || null;
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
                          style={{ background: campaign.gradient }}
                        >
                          <h3>{campaign.title}</h3>
                          <p>{campaign.description}</p>
                        </div>
                      ))}
                    </div>
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
              <div className='insurance-tabs'>
                <button 
                  className={`tab-btn ${activeTab === 'icbari' ? 'active' : ''}`}
                  onClick={() => setActiveTab('icbari')}
                >
                  İcbari Sığorta
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'konullu' ? 'active' : ''}`}
                  onClick={() => setActiveTab('konullu')}
                >
                  Könüllü Sığorta
                </button>
              </div>
              <div className='sig row'>
                <div className='sey col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('passenger_accident');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: passenger_accident');
                }}>
                  <div className='svg'>
                    <FaPlane />
                  </div>
                  <div className='par'>
                    <h4>Sərnişin Qəzası</h4>
                    <p>Sənişinləri daşıyan qurumlar üçün sığorta</p>
                  </div>
                </div>
                <div className='heyat col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('employer_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: employer_liability');
                }}>
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>İşəgötürən Məsuliyyəti</h4>
                    <p>İşçilərə dəyən zərərlərə görə məsuliyyət</p>
                  </div>
                </div>
                <div className='tibbi col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('property_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: property_liability');
                }}>
                  <div className='svg'>
                    <FaHeart />
                  </div>
                  <div className='par'>
                    <h4>Əmlak Əməliyyatları</h4>
                    <p>Əmlak istismarı zamanı məsuliyyət</p>
                  </div>
                </div>
                <div className='emlak col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('property_insurance');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: property_insurance');
                }}>
                  <div className='svg'>
                    <FaHouse />
                  </div>
                  <div className='par'>
                    <h4>İcbari Əmlak</h4>
                    <p>Yaşayış və qeyri-yaşayış binaları, mənzillər</p>
                  </div>
                </div>
                <div className='neqliy col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('vehicle_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: vehicle_liability');
                }}>
                  <div className='svg'>
                    <FaCar />
                  </div>
                  <div className='par'>
                    <h4>Avtomobil Məsuliyyət</h4>
                    <p>Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət</p>
                  </div>
                </div>
                <div className='tehlukeli col-3 sam' onClick={() => {
                  const categoryId = getCategoryIdByCode('hazardous_liability');
                  if (categoryId) navigate(`/order/${categoryId}`);
                  else console.error('Category not found: hazardous_liability');
                }}>
                  <div className='svg'>
                    <FaExclamationTriangle />
                  </div>
                  <div className='par'>
                    <h4>Təhlükəli Obyektlər</h4>
                    <p>Partlayış, yanğın və kimyəvi təhlükələr</p>
                  </div>
                </div>
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
                <a href='#' className='wh'>Tamamlanmış sifarişlər</a>
                <a href='#'>Hamısını gör</a>
              </div>

              {loading ? (
                <div className="loading">
                  <p>Yüklənir...</p>
                </div>
              ) : error ? (
                <div className="error">
                  <p>{error}</p>
                </div>
              ) : (
                <div className='cards row'>
                  {orders.length > 0 ? (
                    orders.slice(0, 4).map((order, index) => {
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
                    })
                  ) : (
                    <div className="no-orders">
                      <p>Hələ heç bir sifarişiniz yoxdur</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default UmSig
