import React, { useState, useEffect } from 'react';
import './index.scss';
import { MdExitToApp } from "react-icons/md";
import axios from "axios";

axios.defaults.withCredentials = true; // send cookies automatically

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: ""
  });

  // ✅ Fetch profile data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/authUser/profile", { withCredentials: true,})
      .then(res => {
        setUserData(res.data.user); // backend returns user
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: send updated data to backend with axios.put/post
  };

  const handleLogout = () => {
    axios.post("http://localhost:5000/authUser/logout") // add logout route in backend
      .then(() => {
        window.location.href = "/login"; // redirect after logout
      })
      .catch(err => console.error("Logout error:", err));
  };

  if (!userData.email) return <p>Profil yüklənir...</p>;

  return (
    <section className="profile-section">
      <div className='container'>
        <div className='all'>
          <div className='head'>
            <div className='prof'>
              <h2>Profil</h2>
              <p>Hesab məlumatlarınızı idarə edin</p>
            </div>
            <button className='logout-btn' onClick={handleLogout}>
              <MdExitToApp /> <span>Çıxış</span>
            </button>
          </div>
          
          <div className='body1 row col-12'>
            <div className='left col-12 col-sm-7 col-md-7'>
              <div className='change'>
                <p>Şəxsi məlumatlar</p>
                {isEditing ? (
                  <button className='save-btn' onClick={handleSave}>Yadda saxla</button>
                ) : (
                  <button className='edit-btn' onClick={() => setIsEditing(true)}>Düzəliş et</button>
                )}
              </div>
              
              <div className='user'>
                <div className='user-avatar'>
                  <span>
                    {userData.name?.charAt(0)}{userData.surname?.charAt(0)}
                  </span>
                </div>
                <div className='info'>
                  <h3>{userData.name} {userData.surname}</h3>
                  <p>{userData.email}</p>
                  <span className='verified'>Təsdiqlənmiş hesab</span>
                </div>
              </div>
              
              <div className='details'>
                <div className='shexsi row'>
                  <div className='input col-12 col-sm-6 col-md-6'>
                    <label>Ad</label>
                    {isEditing ? (
                      <input 
                        type='text' 
                        name="name"
                        value={userData.name} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className='value-display'>{userData.name}</div>
                    )}
                  </div>
                  
                  <div className='input col-12 col-sm-6 col-md-6'>
                    <label>Soyad</label>
                    {isEditing ? (
                      <input 
                        type='text' 
                        name="surname"
                        value={userData.surname} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className='value-display'>{userData.surname}</div>
                    )}
                  </div>
                  
                  <div className='input col-12 col-sm-6 col-md-6'>
                    <label>Email</label>
                    {isEditing ? (
                      <input 
                        type='email' 
                        name="email"
                        value={userData.email} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className='value-display'>{userData.email}</div>
                    )}
                  </div>
                  
                  <div className='input col-12 col-sm-6 col-md-6'>
                    <label>Telefon</label>
                    {isEditing ? (
                      <input 
                        type='text' 
                        name="phone"
                        value={userData.phone} 
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className='value-display'>{userData.phone}</div>
                    )}
                  </div>
                </div>
                
                <div className='input address-input col-12'>
                  <label>Ünvan</label>
                  {isEditing ? (
                    <input 
                      type='text' 
                      name="address"
                      value={userData.address} 
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className='value-display'>{userData.address}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className='right col-12 col-sm-5 col-md-4'>
              <div className='stat'>
                <h3>Hesab Statistikası</h3>
                <div className='stat-item active'>
                  <p>Aktiv Sığortalar</p>
                  <span>5</span>
                </div>
                <div className='stat-item tamam'>
                  <p>Tamamlanmış Sığortalar</p>
                  <span>12</span>
                </div>
                <div className='stat-item umumi'>
                  <p>Ümumi Xərclər</p>
                  <span>8.450 AZN</span>
                </div>
                <div className='stat-item qenaet'>
                  <p>Qənaət</p>
                  <span>1.200 AZN</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;
