import React, { useState, useEffect } from 'react'
import "./index.scss"
import { FaExclamationTriangle, FaPlane } from "react-icons/fa";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaHeart } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ əlavə olundu

const UmSig = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    monthlyExpenses: 0,
    upcomingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate(); // ✅ əlavə olundu

  // Kampaniya slides
  const campaigns = [
    {
      title: "Yeni il kampaniyası",
      description: "Səyahət sığortasında 30% endirim. Yeni il tətillərinizi güvənlə keçirin.",
      gradient: "linear-gradient(90deg, #ffe5c4, #ffb6a6)"
    },
    {
      title: "İcbari Sığorta Kampaniyası",
      description: "Bütün icbari sığorta növlərində sürətli rəsmiləşdirmə. Online müraciət edin!",
      gradient: "linear-gradient(90deg, #c4e5ff, #a6b6ff)"
    },
    {
      title: "Yay kampaniyası",
      description: "Avtomobil sığortasında 25% endirim. Yay səyahətləriniz üçün xüsusi təklif!",
      gradient: "linear-gradient(90deg, #c4ffe5, #a6ffb6)"
    }
  ];

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
        const res = await axios("http://localhost:5000/authUser/profile");
        const user = res.data.user
        setUserId(user._id);
      } catch (err) {
        console.error("Authentication check failed:", err);

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
        const res = await axios.get("http://localhost:5000/authUser/profile", { withCredentials: true });
        const user = res.data.user;
        setUserId(user._id);

        const ordersRes = await axios.get(`http://localhost:5000/api/orders`);
        const allOrders = ordersRes.data;

        // 🔹 yalnız istifadəçiyə aid sifarişləri seç
        const userOrders = allOrders.filter(order => order.userId === user._id);

        setOrders(userOrders);

      } catch (err) {
        console.error(err);
        setError("Məlumatlar gətirilərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };


    getUserAndOrders();
  }, []);
  // Statistika məlumatlarını gətir

  console.log(orders);



  // Tarixi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'long'
    });
  };

  // Pul formatı
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('az-AZ', {
      style: 'currency',
      currency: 'AZN'
    }).format(amount);
  };

  // Kateqoriya ikonunu gətir
  const getCategoryIcon = (categoryCode) => {
    return categoryIcons[categoryCode] || categoryIcons.default;
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
              <div className='act'>
                <a href='#' className='aD'>Kateqoriyalar</a>
                <a href='#'>Hamısını gör</a>
              </div>
              <div className='sig row'>
                <div className='sey col-4 sam' onClick={() => navigate('/seyahet')}> {/* ✅ əlavə olundu */}
                  <div className='svg'>
                    <FaPlane />
                  </div>
                  <div className='par'>
                    <h4>Sərnişin Qəzası</h4>
                    <p>Sənişinləri daşıyan qurumlar üçün sığorta</p>
                  </div>
                </div>
                <div className='heyat col-4 sam' onClick={() => navigate('/heyat')}> {/* ✅ əlavə olundu */}
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>İşəgötürən Məsuliyyəti</h4>
                    <p>İşçilərə dəyən zərərlərə görə məsuliyyət</p>
                  </div>
                </div>
                <div className='tibbi col-4 sam' onClick={() => navigate('/tibbi')}> {/* ✅ əlavə olundu */}
                  <div className='svg'>
                    <FaHeart />
                  </div>
                  <div className='par'>
                    <h4>Əmlak Əməliyyatları</h4>
                    <p>Əmlak satışının zamanı məsuliyyət</p>
                  </div>
                </div>
                <div className='emlak col-4 sam' onClick={() => navigate('/emlak')}> {/* ✅ əlavə olundu */}
                  <div className='svg'>
                    <FaHouse />
                  </div>
                  <div className='par'>
                    <h4>İcbari Əmlak</h4>
                    <p>Yaşayış və qeyri-yaşayış binaları, mənzillər</p>
                  </div>
                </div>
                <div className='neqliy col-4 sam' onClick={() => navigate('/neqliyyat')}> {/* ✅ əlavə olundu */}
                  <div className='svg'>
                    <FaCar />
                  </div>
                  <div className='par'>
                    <h4>Avtomobil Məsuliyyət</h4>
                    <p>Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət</p>
                  </div>
                </div>
                <div className='tehlukeli col-4 sam' onClick={() => navigate('/tehlukeli')}> {/* ✅ əlavə olundu */}
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
            <div className='ms col-9'>
              <div className='act row'>
                <a href='#' className='wh'>Tamamlanmış sığortalar</a>
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
                    orders.map((order) => (
                      <div key={order._id} className='card'>
                        <div className='ip'>
                          <div className='svg'>
                            {getCategoryIcon(order.category_id?.code)}
                          </div>
                          <div className='par2'>
                            <h4>{order.category_id?.name || 'Sığorta'}</h4>
                            <p
                              style={{
                                color: statusColors[order.status],
                                fontWeight: 'bold'
                              }}
                            >
                              {statusTexts[order.status]}
                            </p>
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                        <div>
                          <p>{formatCurrency(order.total_amount)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-orders">
                      <p>Hələ heç bir sifarişiniz yoxdur</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='statistika col-3'>
              <h4>Statistika</h4>
              <div className='stat'>
                <div className='actS same'>
                  <p>Aktiv sığortalar</p>
                  <span>{stats.activeOrders}</span>
                </div>
                <div className='xerc same'>
                  <p>Bu ay xərclər</p>
                  <span>{formatCurrency(stats.monthlyExpenses)}</span>
                </div>
                <div className='oden same'>
                  <p>Yaxın ödənişlər</p>
                  <span>{stats.upcomingPayments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default UmSig
