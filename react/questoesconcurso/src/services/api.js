import axios from "axios";
import Config from './../config.json';

const api = axios.create({
    baseURL: 'https://localhost:7119/api',
    //baseURL: 'https://apisunsale.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

const token = localStorage.getItem(Config.TOKEN);

if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;