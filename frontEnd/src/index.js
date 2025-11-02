import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Dashboard2 from './pages/Dashboard/Dashboard2';

import './styles/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/index.css'; // seu CSS com Tailwind
import '@fortawesome/fontawesome-free/css/all.min.css'; // ícones

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
        <Route path="/dashboard2" element={<Dashboard2 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
