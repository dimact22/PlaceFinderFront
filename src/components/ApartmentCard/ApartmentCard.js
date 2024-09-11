import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ApartmentCard.module.css';
import walkingIcon from './R.jfif';
import transitIcon from './OIP.jfif';
import i18n from '../../i18n.js'; // Импортируем i18n для доступа к текущему языку
import carIcon from './R.png';

const ApartmentCard = ({ address, apartment, onClick }) => {
    const { t } = useTranslation(); // Подключение функции перевода
    const [travelTimes, setTravelTimes] = useState({
        walkingTime: null,
        transitTime: null,
        carTime: null,
    });

    // Состояние для отслеживания загрузки Google Maps API
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

    useEffect(() => {
        const loadGoogleMapsAPI = () => {
            if (!window.google || !window.google.maps) {
                const currentLanguage = i18n.language || 'de';
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=...&language=${currentLanguage}`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    setIsGoogleMapsLoaded(true);
                };
                document.head.appendChild(script);
            } else {
                setIsGoogleMapsLoaded(true);
            }
        };

        loadGoogleMapsAPI();
    }, []);

    useEffect(() => {
        if (isGoogleMapsLoaded) {
            const getTravelTime = (mode, key) => {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route(
                    {
                        origin: apartment.address,
                        destination: address,
                        travelMode: mode,
                    },
                    (result, status) => {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            setTravelTimes((prevState) => ({
                                ...prevState,
                                [key]: result.routes[0].legs[0].duration.text,
                            }));
                        } else {
                            console.error(`Error fetching directions: ${status}`);
                        }
                    }
                );
            };

            getTravelTime(window.google.maps.TravelMode.WALKING, 'walkingTime');
            getTravelTime(window.google.maps.TravelMode.TRANSIT, 'transitTime');
            getTravelTime(window.google.maps.TravelMode.DRIVING, 'carTime');
        }
    }, [isGoogleMapsLoaded, apartment.address, address]);

    return (
        <div
            className={styles.apartmentCard}
            onClick={() => onClick(apartment, travelTimes.walkingTime, travelTimes.transitTime, travelTimes.carTime, address)}
            style={{ cursor: 'pointer' }}
        >
            <h2>{apartment.name}</h2>
            <p>
                <strong>{t('address')}:</strong>{' '}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    {apartment.address}
                </a>
            </p>
            <p><strong>{t('type')}:</strong> {apartment.type}</p>
            <p>
                <strong>{t('distance')}:</strong> {(apartment.dist.calculated / 1000).toFixed(2)} km
            </p>
            <div className={styles.iconsContainer}>
                <div className={styles.iconWithDistance}>
                    <img src={walkingIcon} alt="Walking" className={styles.icon} />
                    <span>{travelTimes.walkingTime || '...'}</span>
                </div>
                <div className={styles.iconWithDistance}>
                    <img src={carIcon} alt="Car" className={styles.icon} />
                    <span>{travelTimes.transitTime || '...'}</span>
                </div>
                <div className={styles.iconWithDistance}>
                    <img src={transitIcon} alt="Transit" className={styles.icon} />
                    <span>{travelTimes.carTime || '...'}</span>
                </div>
            </div>
        </div>
    );
};

export default ApartmentCard;
