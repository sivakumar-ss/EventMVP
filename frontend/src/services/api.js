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
  getAdminEvents: () => api.get('/admin/events'),
  closeEvent: (id) => api.put(`/admin/events/${id}/close`),
  getParticipants: (id) => api.get(`/admin/events/${id}/participants`),
  verifyRegistration: (registrationId, verified) => api.put(`/admin/registrations/${registrationId}/verify?verified=${verified}`),
};

export const masterAdminApi = {
  getUsers: () => api.get('/master-admin/users'),
  getAdmins: () => api.get('/master-admin/admins'),
  getStudents: () => api.get('/master-admin/students'),
  deleteUser: (id) => api.delete(`/master-admin/users/${id}`),
  toggleRole: (id) => api.put(`/master-admin/users/${id}/toggle-role`),
  changeRole: (id, role) => api.put(`/master-admin/users/${id}/role?role=${role}`),
  getStats: () => api.get('/master-admin/stats'),
};

export const studentApi = {
  registerForEvent: (id, registrationData) => api.post(`/student/events/${id}/register`, registrationData),
  getRegistrations: () => api.get('/student/registrations'),
  getStudentsList: (search = '') => api.get(`/student/network/students?search=${encodeURIComponent(search)}`),
  followStudent: (userId) => api.post(`/student/network/follow/${userId}`),
  unfollowStudent: (userId) => api.post(`/student/network/unfollow/${userId}`),
  getFollowers: () => api.get('/student/network/followers'),
  getFollowing: () => api.get('/student/network/following'),
  getNetworkSummary: () => api.get('/student/network/summary'),
};

export default api;
