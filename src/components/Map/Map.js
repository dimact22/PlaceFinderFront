import React, { useEffect, useRef } from 'react';
import loadGoogleMapsApi from '../GoogleMapsLoader';
import styles from './MunichMap.module.css';
import { useTranslation } from 'react-i18next';

const MunichMap = ({ rad, lat_long, app, onMarkerClick }) => {
    const mapRef = useRef(null);
    let activeInfoWindow = null; // Глобальная переменная для отслеживания активного InfoWindow
    const { t } = useTranslation(); // Хук t используется для перевода текстов

    useEffect(() => {
        const initializeMap = (google) => {
            if (mapRef.current && google) {
                const radiusInKm = parseInt(rad, 10);
                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: lat_long[0], lng: lat_long[1] },
                    zoom: 10,
                    scrollwheel: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    zoomControl: true,
                });

                new google.maps.Marker({
                    position: { lat: lat_long[0], lng: lat_long[1] },
                    map: map,
                    title: t('selectedLocation'), // Перевод строки 'Der Ort, den Sie gewählt haben'
                });

                new google.maps.Circle({
                    map: map,
                    radius: radiusInKm * 1000 + 50,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    center: { lat: lat_long[0], lng: lat_long[1] },
                });

                app.forEach((apartment) => {
                    const lat = apartment.location.coordinates[0];
                    const lng = apartment.location.coordinates[1];
                    const address = apartment.address;
                    const name = apartment.name;
                    const type = apartment.type;

                    const marker = new google.maps.Marker({
                        position: { lat, lng },
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                            scaledSize: new google.maps.Size(32, 32),
                        },
                        map: map,
                        title: name,
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div>
                            <h3>${name}</h3>
                            <p>
                                <strong>${t('address')}:</strong> 
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" 
                                   target="_blank" 
                                   rel="noopener noreferrer">
                                    ${address}
                                </a>
                            </p>
                            <p><strong>${t('type')}:</strong> ${type}</p>
                            <button id="select-${address}">${t('showAllUnderAddress')}</button>
                        </div>
                    `,
                    });

                    marker.addListener('click', () => {
                        // Закрываем предыдущее InfoWindow, если оно открыто
                        if (activeInfoWindow) {
                            activeInfoWindow.close();
                        }

                        // Открываем новое InfoWindow
                        infoWindow.open(map, marker);
                        activeInfoWindow = infoWindow; // Устанавливаем текущее InfoWindow

                        // Обработчик для кнопки внутри InfoWindow
                        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                            const button = document.getElementById(`select-${address}`);
                            if (button) {
                                button.onclick = () => onMarkerClick(address);
                            }
                        });
                    });
                });
            } else {
                console.error(t('googleMapsApiNotAvailable')); // Перевод сообщения об ошибке
            }
        };

        loadGoogleMapsApi(initializeMap);
    }, [lat_long, rad, app, onMarkerClick, t]);

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.map} ref={mapRef}></div>
        </div>
    );
};

export default MunichMap;