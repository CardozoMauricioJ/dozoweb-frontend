import React, { useState, useEffect } from 'react';
import CerveceriasService from '../services/cervecerias';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListaCervecerias.css';
import ListaOpiniones from './ListaOpiniones';

const ListaCervecerias = () => {
  const [cervecerias, setCervecerias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [orderBy, setOrderBy] = useState('Nombre');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cerveceriaSeleccionada, setCerveceriaSeleccionada] = useState(null);

  useEffect(() => {
    CerveceriasService.obtenerCervecerias(pagina, orderBy, orderDirection)
      .then((response) => {
        setCervecerias(response.data.items);
        setTotalPaginas(response.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [pagina, orderBy, orderDirection]);

  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const cambiarOrden = (nuevoOrden) => {
    if (orderBy === nuevoOrden) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(nuevoOrden);
      setOrderDirection('asc');
    }
  };

  const cambiarDireccion = () => {
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  const verOpiniones = (CerveceriaId) => {
    setCerveceriaSeleccionada(CerveceriaId);
  };

  return (
    <div className="container custom-container">
      <h2>Lista de Cervecerías</h2>
      <table className="table table-striped table-hover custom-table">
        <thead>
          <tr className="custom-table-header">
            <th>
              <button className="btn btn-link custom-header-button" onClick={() => cambiarOrden('Nombre')}>
                Nombre
              </button>
              <button className="btn btn-link custom-header-button" onClick={() => cambiarDireccion()}>
                {orderDirection === 'asc' ? '▲' : '▼'}
              </button>
            </th>
            <th>Dirección</th>
            <th>Precio Promedio</th>
            <th>Opiniones</th>
          </tr>
        </thead>
        <tbody>
          {cervecerias.map((cerveceria) => (
            <tr key={cerveceria.id}>
              <td>{cerveceria.nombre}</td>
              <td>{cerveceria.direccion}</td>
              <td>{cerveceria.precioPromedio}</td>
              <td>
                <button className="btn btn-primary custom-opinion-button" onClick={() => verOpiniones(cerveceria.id)}>
                  Ver Opiniones
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary custom-pagination-button" disabled={pagina === 1} onClick={() => cambiarPagina(pagina - 1)}>
          Anterior
        </button>
        <span>{`Página ${pagina} de ${totalPaginas}`}</span>
        <button className="btn btn-primary custom-pagination-button" disabled={pagina === totalPaginas} onClick={() => cambiarPagina(pagina + 1)}>
          Siguiente
        </button>
      </div>
      {cerveceriaSeleccionada && <ListaOpiniones CerveceriaId={cerveceriaSeleccionada} />}
    </div>
  );
};

export default ListaCervecerias;