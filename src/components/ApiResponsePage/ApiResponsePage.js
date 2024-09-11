import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ApiResponsePage.module.css';
import MunichMap from '../Map/Map.js';
import Header from '../Header/Header';
import ApartmentCard from '../ApartmentCard/ApartmentCard';
import { useTranslation } from 'react-i18next';

const ApiResponsePage = () => {
    const { t } = useTranslation(); // Хук t используется для перевода текстов
    const location = useLocation();
    const navigate = useNavigate();
    const apiResponse_all = location.state?.data;
    const apiResponse = apiResponse_all.slice(0, -2);
    const lat_long = apiResponse_all.slice(-2).map(item => parseFloat(item));
    const rad = location.state?.rad;

    const [isMapVisible, setIsMapVisible] = useState(false);
    const [filteredApartments, setFilteredApartments] = useState(apiResponse);
    const [isFiltered, setIsFiltered] = useState(false);

    const toggleMapVisibility = () => {
        setIsMapVisible(prevState => !prevState);
    };

    const handleMarkerClick = (address) => {
        setIsMapVisible(false);
        const filtered = apiResponse.filter(apartment => apartment.address === address);
        setFilteredApartments(filtered);
        setIsFiltered(true);
    };

    const handleResetFilter = () => {
        setFilteredApartments(apiResponse);
        setIsFiltered(false);
    };

    const handleApartmentClick = (apartment, walking, transit, car, adress) => {
        const url = new URL(window.location.origin + '/apartment');
        url.searchParams.append('name', apartment.name);
        url.searchParams.append('address', apartment.address);
        url.searchParams.append('type', apartment.type);
        url.searchParams.append('dist', apartment.dist.calculated);
        url.searchParams.append('walking', walking);
        url.searchParams.append('transit', transit);
        url.searchParams.append('car', car);
        url.searchParams.append('address_distanze', adress);
        window.open(url.href, '_blank');
    };

    useEffect(() => {
        document.body.className = styles.body;
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.apiResponse}>
                <h3>{t('apartments')}</h3>
                <div className={styles.filters}>{t('filters2')}</div>

                <button 
                    className={styles.mapToggleButton} 
                    onClick={toggleMapVisibility}
                >
                    {isMapVisible ? t('hideMap') : t('showMap')}
                </button>

                {isFiltered && (
                    <button 
                        className={styles.mapToggleButton}  
                        onClick={handleResetFilter}
                    >
                        {t('resetFilter')}
                    </button>
                )}

                {isMapVisible && (
                    <div className={styles.mapContainer}>
                        <MunichMap rad={rad} lat_long={lat_long} app={apiResponse} onMarkerClick={handleMarkerClick} />
                    </div>
                )}

                {filteredApartments && filteredApartments.length > 0 ? (
                    filteredApartments.map((apartment, index) => (
                        <ApartmentCard 
                            key={index} 
                            apartment={apartment} 
                            address={location.state?.query}
                            onClick={handleApartmentClick}
                        />
                    ))
                ) : (
                    <p>{t('noData')}</p>
                )}
            </div>
        </div>
    );
};

export default ApiResponsePage;
