import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BarNav.css';
import logo from '../assets/icons/dozoweb-logo.png';

function BarNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary bar-nav fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
        <img src={logo} alt="DozoWeb Logo" height="30" className="d-inline-block align-top" />
        <span className="ms-2">DozoWeb</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/cervecerias">
                Cervecerías
              </Link>
            </li>
            {/*<li className="nav-item">
              <Link className="nav-link" to="/opiniones">
                Opiniones
              </Link>
            </li>
            */} 
            <li className="nav-item">
              <Link className="nav-link" to="/cafe">
                Café (Proximamente)
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sangucherias">
                Sangucherias (Proximamente)
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/boliches">
                Boliches(Proximamente)
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Iniciar Sesión / Registrarse
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default BarNav;