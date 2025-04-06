import React, { useState, useEffect } from 'react';
import CerveceriasService from '../services/cervecerias';
import OpinionesService from '../services/opiniones';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListaOpiniones.css';

const ListaOpiniones = ({ CerveceriaId }) => {
  const [opiniones, setOpiniones] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevoPuntaje, setNuevoPuntaje] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoOpinion, setEnviandoOpinion] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  useEffect(() => {
    if (CerveceriaId) {
      CerveceriasService.obtenerOpinionesPorCerveceriaId(CerveceriaId)
        .then((response) => {
          setOpiniones(response.data);
        })
        .catch((error) => {
          console.error(error);
          setOpiniones([]);
        });
    } else {
      setOpiniones([]);
    }
  }, [CerveceriaId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'usuario') setNuevoUsuario(value);
    if (name === 'puntaje') setNuevoPuntaje(parseInt(value));
    if (name === 'comentario') setNuevoComentario(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!CerveceriaId) {
      setMensajeEnvio('Error: No se ha especificado la cervecería.');
      return;
    }

    setEnviandoOpinion(true);
    setMensajeEnvio('Enviando opinión...');

    const nuevaOpinion = {
      usuario: nuevoUsuario,
      puntaje: nuevoPuntaje,
      comentario: nuevoComentario,
      cerveceriaId: CerveceriaId,
    };

    try {
      await OpinionesService.crearOpinion(nuevaOpinion);
      CerveceriasService.obtenerOpinionesPorCerveceriaId(CerveceriaId)
        .then((response) => {
          setOpiniones(response.data);
          setNuevoUsuario('');
          setNuevoPuntaje(5);
          setNuevoComentario('');
          setMensajeEnvio('¡Opinión enviada!');
        })
        .catch((error) => {
          console.error('Error al recargar opiniones:', error);
          setMensajeEnvio('Error al mostrar la nueva opinión.');
        });
    } catch (error) {
      console.error('Error al enviar opinión:', error);
      setMensajeEnvio('Error al enviar la opinión.');
    } finally {
      setEnviandoOpinion(false);
      setTimeout(() => setMensajeEnvio(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-AR', options); // Formato específico para Argentina
  };

  return (
    <div className="opiniones-container">
      <h3 className="opiniones-title">Opiniones</h3>

      <div className="agregar-opinion-form">
        <h4>Deja tu opinión</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Tu Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="usuario"
              name="usuario"
              value={nuevoUsuario}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="puntaje" className="form-label">Puntaje (1-5):</label>
            <select
              className="form-select"
              id="puntaje"
              name="puntaje"
              value={nuevoPuntaje}
              onChange={handleInputChange}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5} selected>5</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="comentario" className="form-label">Comentario (opcional):</label>
            <textarea
              className="form-control"
              id="comentario"
              name="comentario"
              value={nuevoComentario}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={enviandoOpinion}>
            {enviandoOpinion ? 'Enviando...' : 'Enviar Opinión'}
          </button>
          {mensajeEnvio && <p className={`mt-2 ${mensajeEnvio.startsWith('Error') ? 'text-danger' : 'text-success'}`}>{mensajeEnvio}</p>}
        </form>
      </div>

      <h4 className="mt-4">Opiniones Existentes</h4>
      {opiniones.length === 0 ? (
        <p className="no-opiniones">Esta cervecería aún no tiene opiniones.</p>
      ) : (
        <ul className="opiniones-list">
          {opiniones.map((opinion) => (
            <li key={opinion.id} className="opiniones-item">
              <span className="opinion-usuario">{opinion.usuario}</span>
              <span className="opinion-puntaje">Puntaje: {opinion.puntaje}</span>
              <span className="opinion-comentario">{opinion.comentario}</span>
              <span className="opinion-fecha">{formatDate(opinion.fecha)}</span> {/* Usar la función de formateo */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaOpiniones;