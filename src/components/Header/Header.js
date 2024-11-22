import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaGlobe, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
  },);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowLanguageMenu(false);
  };

  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/"><img src={`${process.env.PUBLIC_URL}/images/Logo.png`} alt="Logo for our website" /></a>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/">Пошук</a></li>
          <li><a href="/about">О нас</a></li>
        </ul>
      </nav>
      <div className={styles.icons}>
        <div className={styles.languageSwitcher} onClick={toggleLanguageMenu}>
          <FaGlobe className={styles.icon} />
        </div>
        {showLanguageMenu && (
          <div className={styles.dropdownMenu}>
            <ul>
              <li>US - English</li>
              <li>UA - Українська</li>
            </ul>
          </div>
        )}
        <div className={styles.userIcon} onClick={toggleUserMenu}>
          <FaUserCircle className={styles.icon} />
        </div>
        {showUserMenu && (
          <div className={styles.dropdownMenu}>
            <ul>
              {!isAuthenticated ? (
                <>
                  <li><a href="/register">Реєстрація</a></li>
                  <li><a href="/login">Логін</a></li>
                </>
              ) : (
                <>
                  <li><a href="/profile">Профіль</a></li>
                  <li onClick={handleLogout} className={styles.b}>Вийти</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
