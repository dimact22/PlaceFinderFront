import React from 'react';
import ReactDOM from 'react-dom/client'; // Обновленный импорт
import App from './App';
import './index.css';

// Найдите корневой элемент
const rootElement = document.getElementById('root');

// Создайте корневой элемент с помощью createRoot
const root = ReactDOM.createRoot(rootElement);

// Рендеринг приложения
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);