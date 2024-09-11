import i18n from '../i18n.js'; // Импортируем i18n для доступа к текущему языку

let googleMapsLoaded = false;

const loadGoogleMapsApi = (callback) => {
  if (typeof callback !== 'function') {
    console.error('Expected callback to be a function');
    return;
  }

  if (googleMapsLoaded) {
    callback(window.google);
    return;
  }

  // Получаем текущий язык из i18n
  const currentLanguage = i18n.language || 'de'; // По умолчанию используем 'de', если язык не определен

  // Создаем URL для загрузки Google Maps API с учетом текущего языка
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD4kbpTHuPM7rJ2KEDJmQIYgtnIbOyWiC4&libraries=places&language=${currentLanguage}`;
  script.async = true;
  script.onload = () => {
    googleMapsLoaded = true;
    callback(window.google);
  };
  script.onerror = () => {
    console.error('Failed to load Google Maps API');
  };

  document.head.appendChild(script);
};

export default loadGoogleMapsApi;