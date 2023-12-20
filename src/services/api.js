import axios from "axios";
import Config from './../config.json';
import { toast } from 'react-toastify';

const api = axios.create({
    //baseURL: 'https://localhost:7119/api',
    baseURL: 'https://apisunsale.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

const token = localStorage.getItem(Config.TOKEN);

if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add an interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 500) ) {
        localStorage.setItem(Config.LOGADO, 0);
        localStorage.setItem(Config.USUARIO, '');
        localStorage.setItem(Config.TOKEN, '');
        localStorage.setItem(Config.ADMIN, '');
        localStorage.setItem(Config.TEMPO_PARAM, 0);
        localStorage.removeItem(Config.LOGADO);
        localStorage.removeItem(Config.USUARIO);
        localStorage.removeItem(Config.TOKEN);
        localStorage.removeItem(Config.ADMIN);
      }
      return Promise.reject(error);
  }
);

export default api;