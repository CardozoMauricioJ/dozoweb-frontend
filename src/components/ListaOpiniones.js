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
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const opinionsPerPage = 5; 

  useEffect(() => {
    if (CerveceriaId) {
      setCurrentPage(1); 
      fetchOpiniones(CerveceriaId, 1, opinionsPerPage); 
    } else {
      setOpiniones([]);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [CerveceriaId, opinionsPerPage]); 

  const fetchOpiniones = async (cerveceriaId, page, pageSize) => {
    try {
      const response = await CerveceriasService.obtenerOpinionesPorCerveceriaId(cerveceriaId, page, pageSize);
      setOpiniones(response.data);
      setTotalPages(parseInt(response.headers['x-total-pages']) || 1);
      setCurrentPage(page); 
    } catch (error) {
      console.error('Error al obtener opiniones:', error);
      setOpiniones([]);
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'usuario') setNuevoUsuario(value);
    if (name === 'puntaje') setNuevoPuntaje(parseInt(value));
    if (name === 'comentario') setNuevoComentario(value);
    setErroresFormulario({ ...erroresFormulario, [name]: '' });
  };

  const validarFormulario = () => {
    let errores = {};
    if (!nuevoUsuario.trim()) {
      errores.usuario = 'El nombre es requerido.';
    }
    if (nuevoPuntaje < 1 || nuevoPuntaje > 5) {
      errores.puntaje = 'El puntaje debe estar entre 1 y 5.';
    }
    setErroresFormulario(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) {
      return;
    }

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
      fetchOpiniones(CerveceriaId, 1, opinionsPerPage);
      setNuevoUsuario('');
      setNuevoPuntaje(5);
      setNuevoComentario('');
      setMensajeEnvio('¡Opinión enviada!');
      setErroresFormulario({});
      setCurrentPage(1);
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
    return date.toLocaleDateString('es-AR', options);
  };

  const renderStars = (puntaje) => {
    const fullStars = '★'.repeat(puntaje);
    const emptyStars = '☆'.repeat(5 - puntaje);
    return <span className="opinion-stars">{fullStars}{emptyStars}</span>;
  };

  const handlePageChange = (newPage) => {
    //setCurrentPage(newPage);
    fetchOpiniones(CerveceriaId, newPage, opinionsPerPage);
  };

  const renderPaginationControls = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
          </li>
        </ul>
      </nav>
    );
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
            {erroresFormulario.usuario && <div className="text-danger">{erroresFormulario.usuario}</div>}
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
            {erroresFormulario.puntaje && <div className="text-danger">{erroresFormulario.puntaje}</div>}
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
              <div className="opinion-rating">
                <span className="opinion-label">Puntaje:</span>
                {renderStars(opinion.puntaje)}
              </div>
              <span className="opinion-comentario">{opinion.comentario}</span>
              <span className="opinion-fecha">{formatDate(opinion.fecha)}</span>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && renderPaginationControls()}
    </div>
  );
};

export default ListaOpiniones;