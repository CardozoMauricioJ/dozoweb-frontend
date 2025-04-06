import axios from 'axios';

const API_URL_OPINIONES = 'https://localhost:7060/api/Opiniones';

const OpinionesService = {
  crearOpinion: (opinion) => {
    return axios.post(API_URL_OPINIONES, opinion);
  },
};

export default OpinionesService;