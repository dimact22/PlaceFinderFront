import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiResponsePage from './components/ApiResponsePage/ApiResponsePage.js';
import AddressSearch from './components/AddressSearch/AddressSearch.js';
import AboutUs from './components/About_us/AboutUs.js';
import Register from './components/Register/Register.js';
import ApartmentDetailPage from './components/AppartmentsDetail/ApartmentDetailPage.js';
import './i18n';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AddressSearch />} />
                <Route path="/response" element={<ApiResponsePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/apartment" element={<ApartmentDetailPage />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;