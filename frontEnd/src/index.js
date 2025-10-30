import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';

import './styles/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ============================================
// 🔥 App completo em um único arquivo
// ============================================

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
