import React, { useState, useEffect } from 'react';
import './index.scss';
import { MdExitToApp } from "react-icons/md";
import axios from "axios";
import { mockUserProfile } from '../../mockData/user';
import { withMockFallback } from '../../utils/mockDataHelper';

axios.defaults.withCredentials = true;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: ""
  });
  const [userId, setUserId] = useState(null);

  // ✅ Fetch user profile (based on JWT cookie)
  useEffect(() => {
    const loadProfile = async () => {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const { data, isMock } = await withMockFallback(
        async () => {
          const res = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
          return { data: res.data };
        },
        () => ({ user: mockUserProfile })
      );

      if (isMock) {
        console.log('📦 Using mock user profile');
      }

      const user = data.user || data;
      setUserData(user);
      setUserId(user._id);
    };

    loadProfile();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Save updated user info
  const handleSave = () => {

    const { _id,__v, ...updatedData } = userData;


    axios.put(`http://localhost:5000/authUser/update/${userId}`, updatedData, {
      withCredentials: true,
    })
      .then(res => {
        setUserData(res.data.user); // update UI with new data
        setIsEditing(false);
        alert("Məlumatlar uğurla yeniləndi ✅");
      })
      .catch(err => {
        console.error("Update error:", err);
        alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin ❌");
      });
  };

  // ✅ Logout
  const handleLogout = () => {
    axios.post("http://localhost:5000/authUser/logout", {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/login";
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
                  {["name", "surname", "email", "phone"].map((field, i) => (
                    <div className='input col-12 col-sm-6 col-md-6' key={i}>
                      <label>{field === "name" ? "Ad" :
                        field === "surname" ? "Soyad" :
                          field === "email" ? "Email" : "Telefon"}</label>
                      {isEditing ? (
                        <input
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={userData[field] || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className='value-display'>{userData[field]}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className='input address-input col-12'>
                  <label>Ünvan</label>
                  {isEditing ? (
                    <input
                      type='text'
                      name="address"
                      value={userData.address || ""}
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
