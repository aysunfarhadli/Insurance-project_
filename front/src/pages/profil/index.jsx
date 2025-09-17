import React, { useState } from 'react';
import './index.scss';
import { MdExitToApp } from "react-icons/md";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send updated data to your backend
  };

  return (
    <section className="profile-section">
      <div className='container'>
        <div className='all'>
          <div className='head'>
            <div className='prof'>
              <h2>Profil</h2>
              <p>Hesab məlumatlarınızı idarə edin</p>
            </div>
            <button className='logout-btn'><MdExitToApp /> <span>Çıxış</span></button>
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
        <span>GM</span>
      </div>
      <div className='info'>
        <h3>{userData.firstName} {userData.lastName}</h3>
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
              name="firstName"
              value={userData.firstName} 
              onChange={handleInputChange}
            />
          ) : (
            <div className='value-display'>{userData.firstName}</div>
          )}
        </div>
        
        <div className='input col-12 col-sm-6 col-md-6'>
          <label>Soyad</label>
          {isEditing ? (
            <input 
              type='text' 
              name="lastName"
              value={userData.lastName} 
              onChange={handleInputChange}
            />
          ) : (
            <div className='value-display'>{userData.lastName}</div>
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