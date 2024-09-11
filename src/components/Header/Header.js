import React, { useEffect } from 'react';
import styles from './Header.module.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Получаем сохраненный язык из localStorage или используем 'de' по умолчанию
    const savedLanguage = localStorage.getItem('language') || 'de';
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Слушаем изменения языка и перезагружаем страницу при его смене
    const handleLanguageChange = (lng) => {
      if (lng !== savedLanguage) {
        window.location.reload();
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Смена языка
    localStorage.setItem('language', lng); // Сохраняем выбранный язык в localStorage
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1><a href="/" className={styles.az}>PlaceFinder</a></h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/">{t('home')}</a></li>
          <li><a href="/about">{t('about')}</a></li>
          <li><a href="/register">{t('register')}</a></li>
          <li><a href="/login">{t('login')}</a></li>
        </ul>
      </nav>
      <div className={styles.languageSwitcher}>
        <select 
          onChange={(e) => changeLanguage(e.target.value)} 
          value={i18n.language} 
          className={styles.languageDropdown}
        >
          <option value="en">🇺🇸 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="uk">Ua Українська</option>
        </select>
      </div>
    </header>
  );
};

export default Header;