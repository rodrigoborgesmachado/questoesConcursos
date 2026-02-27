import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import { sessionStorageService } from '../session/sessionStorageService';
import { stringToHash } from '../../utils/auth/passwordHash';

export const authService = {
  async login({ email, password }) {
    const hashedPassword = `${stringToHash(password)}`;
    const response = await axios.post(`${API_BASE_URL}/Token`, {
      username: email,
      password: hashedPassword,
    });

    const nextSession = {
      username: response.data.username,
      name: response.data.nome,
      token: response.data.token,
      admin: response.data.admin,
      isLogged: 1,
      tempo: 0,
    };

    this.saveSession(nextSession);

    return nextSession;
  },

  getSession() {
    return sessionStorageService.getSession();
  },

  saveSession(session) {
    sessionStorageService.setSession(session);
    return sessionStorageService.getSession();
  },

  clearSession() {
    sessionStorageService.clearSession();
  },

  logout({ redirectToLogin = false, reason = '' } = {}) {
    this.clearSession();

    if (redirectToLogin) {
      const query = reason ? `?reason=${reason}` : '';
      window.location.assign(`/login${query}`);
    }
  },

  getToken() {
    return sessionStorageService.getToken();
  },

  isAuthenticated() {
    const session = this.getSession();
    return !!session?.token;
  },
};
