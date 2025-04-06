import axios from 'axios';

const API_URL = 'https://localhost:7060/api/Cervecerias';

const CerveceriasService = {
  // Obtener todas las cervecerías (con paginación y ordenamiento)
  obtenerCervecerias: (pagina = 1, orderBy = 'Nombre', orderDirection = 'asc') => {
    return axios.get(API_URL, {
      params: {
        page: pagina,
        orderBy: orderBy,
        orderDirection: orderDirection,
      },
    });
  },

  // Obtener una cervecería por ID
  obtenerCerveceriaPorId: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  // Filtrar cervecerías por precio
  filtrarCerveceriasPorPrecio: (precioMinimo, precioMaximo) => {
    return axios.get(`${API_URL}/FiltrarPorPrecio`, {
      params: {
        precioMinimo,
        precioMaximo,
      },
    });
  },

  // Buscar cervecerías por nombre o dirección
  buscarCervecerias: (terminoBusqueda) => {
    return axios.get(`${API_URL}/Buscar`, {
      params: {
        terminoBusqueda,
      },
    });
  },

  // Buscar cervecerías por ubicación
  buscarCerveceriasPorUbicacion: (latitud, longitud, radio) => {
    return axios.get(`${API_URL}/BuscarPorUbicacion`, {
      params: {
        latitud,
        longitud,
        radio,
      },
    });
  },

  // Crear una nueva cervecería
  crearCerveceria: (cerveceria) => {
    return axios.post(API_URL, cerveceria);
  },

  // Actualizar una cervecería existente
  actualizarCerveceria: (id, cerveceria) => {
    return axios.put(`${API_URL}/${id}`, cerveceria);
  },

  // Eliminar una cervecería por ID
  eliminarCerveceria: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },

  // Obtener opiniones por ID de cervecería
  obtenerOpinionesPorCerveceriaId: (CerveceriaId) => {
    return axios.get(`${API_URL}/${CerveceriaId}/Opiniones`);
  },

  // Crear opinion
  crearOpinion: (CerveceriaId, opinion) => {
    return axios.post(`${API_URL}/${CerveceriaId}/Opiniones`, opinion);
  },
};

export default CerveceriasService;