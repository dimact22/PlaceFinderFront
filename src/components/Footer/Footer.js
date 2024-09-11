import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2024 MyApp. All rights reserved.</p>
      <div className={styles.socialLinks}>
        <a href="https://www.facebook.com">Facebook</a> | 
        <a href="https://www.twitter.com">Twitter</a> | 
        <a href="https://www.instagram.com">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;