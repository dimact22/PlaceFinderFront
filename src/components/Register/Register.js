import React, { useState } from "react";
import "./RegistrationForm.css"; // Импортируем CSS файл для стилей
import Header from '../Header/Header';
import { useTranslation } from 'react-i18next';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Состояние для ошибок
  const [isFormValid, setIsFormValid] = useState(false); // Состояние для отслеживания валидности формы
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Валидация при вводе
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'name') {
      if (value.length < 3) {
        newErrors.name = t('name_error');
      } else {
        delete newErrors.name;
      }
    }

    if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailPattern.test(value)) {
        newErrors.email = t('email_error');
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (value.length < 6 || value.length > 30) {
        newErrors.password = t('password_error_length'); 
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = t('password_error_uppercase'); 
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = t('password_error_lowercase'); 
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = t('password_error_digit'); 
      } else if (!/[@$!%*?&#_]/.test(value)) {
        newErrors.password = t('password_error_special'); 
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);

    const formIsValid = Object.keys(newErrors).length === 0 && Object.values(formData).every(value => value.trim() !== "");
    setIsFormValid(formIsValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://192.168.178.61:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      alert('Registration was successful! ' + data.token);
      console.log(data.token)
    } catch (error) {
      alert('Error sending data: ' + error);
      window.location.reload()

    }
  };

  return (
    <div className="pageContainer">
      <Header />
      <div className="form-container">
        <h2 className="form-title">{t("register")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          
          <input
            type="password"
            name="password"
            placeholder={t("pass")}
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
          
          <button type="submit" className="form-button" disabled={!isFormValid}>
            {t('registeration')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;