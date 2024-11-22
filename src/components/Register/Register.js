import React, { useState } from "react";
import "./RegistrationForm.css"; 
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import show from "./Icon_Show.svg";
import hide from "./Icon Hide.svg";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+380",
    password: "",
    passwordRepeat: ""
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Разрешить только цифры после "+380"
      if (value.startsWith("+380") && /^\+380\d*$/.test(value)) {
        setFormData({ ...formData, phone: value });
        validateField(name, value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'firstName') {
      if (value.length < 3) {
        newErrors.firstName = "Ім'я повинно містити більше 3 символів";
      } else {
        delete newErrors.firstName;
      }
    }

    if (name === 'lastName') {
      if (value.length < 3) {
        newErrors.lastName = "Прізвище повинно містити більше 3 символів";
      } else {
        delete newErrors.lastName;
      }
    }

    if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailPattern.test(value)) {
        newErrors.email = "Невірна електронна адреса";
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'phone') {
      if (value.length < 13) {
        newErrors.phone = "Номер телефону повинен містити не менше 13 символів";
      } else {
        delete newErrors.phone;
      }
    }

    if (name === 'password') {
      if (value.length < 6 || value.length > 30) {
        newErrors.password = "Пароль повинен містити від 6 до 30 символів";
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = "Пароль повинен містити хоча б одну велику літеру";
      } else if (!/[a-z]/.test(value)) {
        newErrors.password = "Пароль повинен містити хоча б одну малу літеру";
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = "Пароль повинен містити хоча б одну цифру";
      } else if (!/[@$!%*?&#_]/.test(value)) {
        newErrors.password = "Пароль повинен містити хоча б один спеціальний символ";
      } else {
        delete newErrors.password;
      }
    }

    if (name === 'passwordRepeat') {
      if (value !== formData.password) {
        newErrors.passwordRepeat = "Паролі не збігаються";
      } else {
        delete newErrors.passwordRepeat;
      }
    }

    setErrors(newErrors);

    const formIsValid = Object.keys(newErrors).length === 0 && Object.values(formData).every(value => value.trim() !== "");
    setIsFormValid(formIsValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { passwordRepeat, ...submitData } = formData;
      console.log(submitData);
      const response = await fetch(`http://127.0.0.1:8000/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.detail || 'Network error');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate("/profile"); 

    } catch (error) {
      alert('Помилка під час надсилання даних: ' + error.message);
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
          <h1 className="form-title2">Ласкаво просимо!</h1>
          <h2 className="form-title">Реєстрація</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="Ім'я"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.firstName && <p className="error-message">{errors.firstName}</p>}

            <input
              type="text"
              name="lastName"
              placeholder="Прізвище"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}

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

            <input
              type="text"
              name="phone"
              placeholder="Номер телефону"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}

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
                {showPassword ? <img src={show} alt="Показати" /> : <img src={hide} alt="Приховати" />}
              </span>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="passwordRepeat"
                placeholder="Повторіть пароль"
                value={formData.passwordRepeat}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span onClick={togglePasswordVisibility} className="password-toggle">
                {showPassword ? <img src={show} alt="Показати" /> : <img src={hide} alt="Приховати" />}
              </span>
            </div>
            {errors.passwordRepeat && <p className="error-message">{errors.passwordRepeat}</p>}

            <button type="submit" className="form-button" disabled={!isFormValid}>
              Зареєструватися
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
