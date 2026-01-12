import React, { useState, useEffect } from 'react';
import './index.scss';
import { MdExitToApp } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import LoadingSpinner from '../../components/LoadingSpinner';

axios.defaults.withCredentials = true;

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: ""
  });
  const [userId, setUserId] = useState(null);

  // ✅ Check authentication and fetch user profile
  // COMMENTED OUT FOR TESTING - Uncomment to enable authentication
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      try {
        setLoading(true);
        // Mock user data for testing
        setUserData({
          name: "Test",
          surname: "User",
          email: "test@example.com",
          phone: "+994501234567",
          address: "Test Address"
        });
        setUserId("test_user_id");
        setIsAuthenticated(true);
        setLoading(false);
        return;

        /* UNCOMMENT BELOW TO ENABLE AUTHENTICATION
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        
        // First check if user is authenticated
        try {
          const authRes = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
          const user = authRes.data.user || authRes.data;
          
          if (user && user.email) {
            setIsAuthenticated(true);
            setUserData(user);
            setUserId(user._id);
          } else {
            // User not authenticated, redirect to login
            navigate("/login");
            return;
          }
        } catch (authErr) {
          console.error("Authentication check failed:", authErr);
          // If authentication fails, redirect to login immediately
          navigate("/login");
          return;
        }
        */
      } catch (err) {
        console.error("Profile load error:", err);
        setError(t('profile.loadError'));
        // navigate("/login"); // COMMENTED OUT FOR TESTING
        setLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, [navigate]);

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

    const { _id, __v, ...updatedData } = userData;


    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
    axios.put(`${API_BASE}/authUser/update/${userId}`, updatedData, {
      withCredentials: true,
    })
      .then(res => {
        setUserData(res.data.user); // update UI with new data
        setIsEditing(false);
        alert(t('profile.updateSuccess'));
      })
      .catch(err => {
        console.error("Update error:", err);
        alert(t('profile.updateError'));
      });
  };

  // ✅ Logout
  const handleLogout = () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
    axios.post(`${API_BASE}/authUser/logout`, {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/login";
      })
      .catch(err => console.error("Logout error:", err));
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <section className="profile-section">
        <div className='container'>
          <LoadingSpinner fullScreen={true} size="large" />
        </div>
      </section>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (!isAuthenticated || !userData.email) {
    return null;
  }

  if (error) {
    return (
      <section className="profile-section">
        <div className='container'>
          <p style={{ color: 'var(--destructive)' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <div className='container'>
        <div className='all'>
          <div className='head'>
            <div className='prof'>
              <h2>{t('header.profile')}</h2>
              <p>{t('profile.manageAccount')}</p>
            </div>
            <Button variant="outline" className='logout-btn' onClick={handleLogout}>
              <MdExitToApp /> <span>{t('header.logout')}</span>
            </Button>
          </div>

          <div className='body1 row col-12'>
            <div className='left col-12 col-sm-7 col-md-7'>
              <div className='change'>
                <p>{t('order.personalInfo')}</p>
                {isEditing ? (
                  <Button className='save-btn' onClick={handleSave}>{t('profile.save')}</Button>
                ) : (
                  <Button variant="outline" className='edit-btn' onClick={() => setIsEditing(true)}>{t('profile.edit')}</Button>
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
                  <span className='verified'>{t('profile.verifiedAccount')}</span>
                </div>
              </div>

              <div className='details'>
                <div className='shexsi row'>
                  {["name", "surname", "email", "phone"].map((field, i) => (
                    <div className='formGroup col-6' key={i}>
                      {isEditing ? (
                        <>
                          <Input
                            type={field === "email" ? "email" : "text"}
                            name={field}
                            value={userData[field] || ""}
                            onChange={handleInputChange}
                            placeholder=" "
                          />
                          <Label className='label'>{field === "name" ? t('auth.name') :
                            field === "surname" ? t('auth.surname') :
                              field === "email" ? t('order.email') : t('order.phone')}</Label>
                        </>
                      ) : (
                        <div className='value-display'>
                          <Label className='label-display'>{field === "name" ? t('auth.name') :
                            field === "surname" ? t('auth.surname') :
                              field === "email" ? t('order.email') : t('order.phone')}</Label>
                          <div>{userData[field]}</div>
                        </div>
                      )}
                    </div>

                  ))}
                  <div className='formGroup address-input col-12'>
                    {isEditing ? (
                      <>
                        <Input
                          type='text'
                          name="address"
                          value={userData.address || ""}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <Label className='label'>{t('order.address')}</Label>
                      </>
                    ) : (
                      <div className='value-display'>
                        <Label className='label-display'>{t('order.address')}</Label>
                        <div>{userData.address}</div>
                      </div>
                    )}
                  </div>
                </div>


              </div>
            </div>

            <div className='right col-12 col-sm-5 col-md-4'>
              <div className='stat'>
                <h3>{t('profile.accountStatistics')}</h3>
                <div className='stat-item active'>
                  <p>{t('profile.activeInsurances')}</p>
                  <span>5</span>
                </div>
                <div className='stat-item tamam'>
                  <p>{t('profile.completedInsurances')}</p>
                  <span>12</span>
                </div>
                <div className='stat-item umumi'>
                  <p>{t('profile.totalExpenses')}</p>
                  <span>8.450 AZN</span>
                </div>
                <div className='stat-item qenaet'>
                  <p>{t('profile.savings')}</p>
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
