import React, { useState } from 'react';
import './index.scss';
import { FaRegBell } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';
import { IoMenu } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '../../../assets/WhatsApp_Image_2025-12-01_at_14.30.06_9a87f36c-removebg-preview.png';

const Cheader = () => {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const languages = [
    { code: 'az', name: 'Az' },
    { code: 'en', name: 'En' },
    { code: 'ru', name: 'Ru' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header>
      <div className='container'>
        <div className='all'>
          {/* Logo or Brand - navigates to home */}
          <NavLink to="/" className="logo">
            <img src={logoImage} alt="logo" />
          </NavLink>

          {/* You can replace input with a search component or keep it */}
          <input placeholder={t('common.search')} />

          <div className='icons'>
            {/* Language Switcher */}
            <div className="language-switcher">
              <button 
                className="lang-button" 
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label="Change language"
              >
                <span className="lang-code">{currentLang.name}</span>
              </button>
              {showLangMenu && (
                <div className="lang-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span className="lang-name">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* <NavLink to="/notifications" className="icon">
              <FaRegBell />
            </NavLink> */}

            <NavLink to="/profile" className="icon">
              <CgProfile />
            </NavLink>
{/* 
            <NavLink to="/menu" className="icon">
              <IoMenu />
            </NavLink> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cheader;
