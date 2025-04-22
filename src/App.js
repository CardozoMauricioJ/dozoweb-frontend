//import logo from './logo.svg';
import './App.css';
import React from 'react';
import ListaCervecerias from './components/ListaCervecerias';
import 'leaflet/dist/leaflet.css';
import MapaCervecerias from './components/MapaCervecerias';
import BarNav from './components/BarNav'; 
import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <BarNav /> 
      <div className="container main-content"> 
        <Routes>
          <Route path="/" element={<><MapaCervecerias /><ListaCervecerias /></>} /> 
          <Route path="/cervecerias" element={<><MapaCervecerias /><ListaCervecerias /></>} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
