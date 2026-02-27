import Config from '../../config.json';
import { mapAdminValueToRole } from '../../auth/roles';

function normalizeSession(rawSession) {
  if (!rawSession || !rawSession.token) {
    return null;
  }

  return {
    isLogged: rawSession.isLogged === '1' || rawSession.isLogged === 1,
    username: rawSession.username || '',
    name: rawSession.name || '',
    token: rawSession.token || '',
    admin: rawSession.admin ?? '',
    role: mapAdminValueToRole(rawSession.admin),
    tempo: rawSession.tempo || 0,
  };
}

export const sessionStorageService = {
  getSession() {
    const session = {
      isLogged: localStorage.getItem(Config.LOGADO),
      username: localStorage.getItem(Config.USUARIO),
      name: localStorage.getItem(Config.Nome),
      token: localStorage.getItem(Config.TOKEN),
      admin: localStorage.getItem(Config.ADMIN),
      tempo: localStorage.getItem(Config.TEMPO_PARAM),
    };

    return normalizeSession(session);
  },

  setSession(session) {
    if (!session) {
      this.clearSession();
      return;
    }

    localStorage.setItem(Config.LOGADO, 1);
    localStorage.setItem(Config.USUARIO, session.username || '');
    localStorage.setItem(Config.Nome, session.name || '');
    localStorage.setItem(Config.TOKEN, session.token || '');
    localStorage.setItem(Config.ADMIN, session.admin ?? '');
    localStorage.setItem(Config.TEMPO_PARAM, session.tempo ?? 0);
  },

  clearSession() {
    localStorage.removeItem(Config.LOGADO);
    localStorage.removeItem(Config.USUARIO);
    localStorage.removeItem(Config.Nome);
    localStorage.removeItem(Config.TOKEN);
    localStorage.removeItem(Config.ADMIN);
  },

  getToken() {
    return localStorage.getItem(Config.TOKEN) || '';
  },

  getRole() {
    const admin = localStorage.getItem(Config.ADMIN);
    return mapAdminValueToRole(admin);
  },
};
