import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const eventApi = {
  getAllPublic: () => api.get('/events/public'),
  getById: (id) => api.get(`/events/public/${id}`),
};

export const adminApi = {
  createEvent: (eventData) => api.post('/admin/events', eventData),
  closeEvent: (id) => api.put(`/admin/events/${id}/close`),
  getParticipants: (id) => api.get(`/admin/events/${id}/participants`),
};

export const studentApi = {
  registerForEvent: (id) => api.post(`/student/events/${id}/register`),
  getRegistrations: () => api.get('/student/registrations'),
};

export default api;
