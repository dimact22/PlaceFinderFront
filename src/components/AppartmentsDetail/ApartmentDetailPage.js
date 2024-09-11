import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ApartmentDetailPage.module.css';
import Header from '../Header/Header';
import walkingIcon from '../ApartmentCard/R.png';
import transitIcon from '../ApartmentCard/OIP.jfif';
import carIcon from '../ApartmentCard/R.jfif';
import { useTranslation } from 'react-i18next';

const ApartmentDetailPage = () => {
    const { t } = useTranslation(); // Хук t используется для перевода текстов
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const name = params.get('name');
    const address = params.get('address');
    const type = params.get('type');
    const dist = params.get('dist');
    const walking = params.get('walking');
    const transit = params.get('transit');
    const car = params.get('car');
    const address_distanze = params.get('address_distanze');

    if (!name || !address || !type || !dist) {
        return <p>{t('noData')}</p>;
    }

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.detailContainer}>
                <h1>{name}</h1>
                <p><strong>{t('address')}:</strong> <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">{address}</a></p>
                <p><strong>{t('type')}:</strong> {type}</p>
                <p><strong>{t('distance')}:</strong> {(parseFloat(dist) / 1000).toFixed(2)} km {t('to')} <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address_distanze)}`} target="_blank" rel="noopener noreferrer">{address_distanze}</a></p>
                <div className={styles.iconsContainer}>
                    <div className={styles.iconWithDistance}>
                        <img src={walkingIcon} alt="Walking" className={styles.icon} />
                        <span>{walking || '...'}</span>
                    </div>
                    <div className={styles.iconWithDistance}>
                        <img src={transitIcon} alt="Transit" className={styles.icon} />
                        <span>{car || '...'}</span>
                    </div>
                    <div className={styles.iconWithDistance}>
                        <img src={carIcon} alt="Car" className={styles.icon} />
                        <span>{transit || '...'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApartmentDetailPage;
