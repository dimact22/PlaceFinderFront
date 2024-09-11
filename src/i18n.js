import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de', // Язык по умолчанию
    debug: true,
    supportedLngs: ['en', 'uk', 'de'], // Поддерживаемые языки
    interpolation: {
      escapeValue: false, // Для React не требуется экранирование
    },
  });

  

export default i18n;