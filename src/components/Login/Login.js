import React, { useState } from "react";
import "./Login.css"; 
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import showIcon from './Icon_Show.svg'; 
import hideIcon from './Icon Hide.svg'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailPattern.test(value)) {
        newErrors.email = "Невірна електронна адреса";
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (value.length < 6 || value.length > 30) {
        newErrors.password = "Пароль повинен містити від 6 до 30 символів";
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
      const response = await fetch(`http://127.0.0.1:8000/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.log(errorData);
        throw new Error(errorData.detail || 'Мережева помилка');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); 
      navigate('/profile');

    } catch (error) {
      alert('Помилка входу: ' + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div className="pageContainer">
      <Header />
      <div className="form-container2center">
        <div className="form-container2">
          <h1 className="form-title">Вхід</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Електронна пошта"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span onClick={togglePasswordVisibility} className="password-toggle">
                {showPassword ? (
                  <img src={hideIcon} alt="Приховати пароль" />
                ) : (
                  <img src={showIcon} alt="Показати пароль" />
                )}
              </span>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}

            <button type="submit" className="form-button" disabled={!isFormValid}>
              Увійти
            </button>
          </form>

          <p className="forgot-password" onClick={() => navigate('/forgot-password')}>
            Забули пароль?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
