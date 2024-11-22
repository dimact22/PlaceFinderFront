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

  // Устанавливаем язык на украинский по умолчанию
  const currentLanguage = 'uk'; 
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdMtEMFUW2AGkuZ1nyon4T-sLyCFuPwmM&libraries=places&language=${currentLanguage}`;
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
