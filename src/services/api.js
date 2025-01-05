import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tournament API endpoints
export const tournaments = {
  getAll: (params) => api.get('/tournaments', { params }),
  getById: (id) => api.get(`/tournaments/${id}`),
  create: (data) => api.post('/tournaments', data),
  update: (id, data) => api.put(`/tournaments/${id}`, data),
  delete: (id) => api.delete(`/tournaments/${id}`),
};

// Registration API endpoints
export const registrations = {
  getAll: (tournamentId) => api.get(`/tournaments/${tournamentId}/registrations`),
  getById: (tournamentId, registrationId) => 
    api.get(`/tournaments/${tournamentId}/registrations/${registrationId}`),
  create: (tournamentId, data) => 
    api.post(`/tournaments/${tournamentId}/registrations`, data),
  update: (registrationId, data) => 
    api.put(`/registrations/${registrationId}`, data),
  delete: (registrationId) => 
    api.delete(`/registrations/${registrationId}`),
  export: (tournamentId) => 
    api.get(`/tournaments/${tournamentId}/registrations/export`, {
      responseType: 'blob',
    }),
  sendEmail: (registrationId) => 
    api.post(`/registrations/${registrationId}/send-email`),
};

// User API endpoints
export const users = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Team API endpoints
export const teams = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, userId) => api.post(`/teams/${teamId}/members`, { userId }),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};

// Match API endpoints
export const matches = {
  getAll: (tournamentId) => api.get(`/tournaments/${tournamentId}/matches`),
  getById: (tournamentId, matchId) => 
    api.get(`/tournaments/${tournamentId}/matches/${matchId}`),
  update: (matchId, data) => api.put(`/matches/${matchId}`, data),
  updateScore: (matchId, data) => api.put(`/matches/${matchId}/score`, data),
};

// Prize API endpoints
export const prizes = {
  getAll: (tournamentId) => api.get(`/tournaments/${tournamentId}/prizes`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/prizes`, data),
  update: (prizeId, data) => api.put(`/prizes/${prizeId}`, data),
  delete: (prizeId) => api.delete(`/prizes/${prizeId}`),
  distribute: (tournamentId) => api.post(`/tournaments/${tournamentId}/prizes/distribute`),
};

export default api; 