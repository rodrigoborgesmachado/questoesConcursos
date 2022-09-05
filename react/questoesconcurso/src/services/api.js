import axios from "axios";

const api = axios.create({
    baseURL: 'http://questoesconcurso.sunsalesystem.com.br/PHP'
})

export default api;