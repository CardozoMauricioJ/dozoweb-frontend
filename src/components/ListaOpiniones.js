import React, { useState, useEffect } from 'react';
import CerveceriasService from '../services/cervecerias';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListaOpiniones.css';

const ListaOpiniones = ({ cerveceriaId }) => {
  const [opiniones, setOpiniones] = useState([]);

  useEffect(() => {
    CerveceriasService.obtenerOpinionesPorCerveceriaId(cerveceriaId)
      .then((response) => {
        setOpiniones(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cerveceriaId, opiniones]); // Agregar 'opiniones' como dependencia

  return (
    <div className="opiniones-container">
      <h3 className="opiniones-title">Opiniones</h3>
      {opiniones.length === 0 ? (
        <p className="no-opiniones">Esta cervecería aún no tiene opiniones.</p>
      ) : (
        <ul className="opiniones-list">
          {opiniones.map((opinion) => (
            <li key={opinion.id} className="opiniones-item">
              <span className="opinion-usuario">{opinion.usuario}</span>
              <span className="opinion-puntaje">Puntaje: {opinion.puntaje}</span>
              <span className="opinion-comentario">{opinion.comentario}</span>
              <span className="opinion-fecha">{new Date(opinion.fecha).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaOpiniones;