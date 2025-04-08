//import logo from './logo.svg';
import './App.css';
import React from 'react';
import ListaCervecerias from './components/ListaCervecerias';
import 'leaflet/dist/leaflet.css';
import MapaCervecerias from './components/MapaCervecerias';

function App() {
  return (
    <div className="App">
      <MapaCervecerias />
      <ListaCervecerias />
    </div>
  );
}

export default App;
