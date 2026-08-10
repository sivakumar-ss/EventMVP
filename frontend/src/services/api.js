import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If the API returns HTML (e.g. because of incorrect VITE_API_URL returning index.html), reject it
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      console.error('API returned HTML instead of JSON. Check VITE_API_URL.');
      return Promise.reject(new Error('Invalid API URL configuration'));
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/student/login';
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
  getAll: () => api.get('/admin/events'),
  getById: (id) => api.get(`/events/public/${id}`),
  create: (data) => api.post('/admin/events', data),
  update: (id, data) => api.put(`/admin/events/${id}`, data),
  delete: (id) => api.delete(`/admin/events/${id}`)
};

export const postApi = {
  createPost: (formData) => api.post('/student/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updatePost: (id, formData) => api.put(`/student/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getFeed: () => api.get('/student/posts/feed'),
  toggleLike: (id) => api.post(`/student/posts/${id}/like`),
  addComment: (id, content) => api.post(`/student/posts/${id}/comments`, { content }),
  deleteComment: (commentId) => api.delete(`/student/posts/comments/${commentId}`)
};

export const adminApi = {
  createEvent: (eventData) => api.post('/admin/events', eventData),
  updateEvent: (id, eventData) => api.put(`/admin/events/${id}`, eventData),
  getAdminEvents: () => api.get('/admin/events'),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  closeEvent: (id) => api.put(`/admin/events/${id}/close`),
  getParticipants: (id) => api.get(`/admin/events/${id}/participants`),
  exportCsv: (id) => api.get(`/admin/events/${id}/participants/export`, { responseType: 'blob' }),
  verifyRegistration: (registrationId, verified) => api.put(`/admin/registrations/${registrationId}/verify?verified=${verified}`),
  grantCertificate: (registrationId) => api.post(`/admin/registrations/${registrationId}/grant-certificate`),
  createSupportTicket: (ticketData) => api.post('/admin/support-tickets', ticketData),
  getMySupportTickets: () => api.get('/admin/support-tickets'),
  getReports: () => api.get('/admin/reports'),
};

export const masterAdminApi = {
  getUsers: () => api.get('/master-admin/users'),
  getAdmins: () => api.get('/master-admin/admins'),
  getStudents: () => api.get('/master-admin/students'),
  deleteUser: (userId) => api.delete(`/master-admin/users/${userId}`),
  toggleRole: (userId) => api.put(`/master-admin/users/${userId}/toggle-role`),
  changeRole: (userId, role) => api.put(`/master-admin/users/${userId}/role?role=${role}`),
  getDashboardStats: () => api.get('/master-admin/dashboard-stats'),
  getAllSupportTickets: () => api.get('/master-admin/support-tickets'),
  resolveSupportTicket: (ticketId) => api.put(`/master-admin/support-tickets/${ticketId}/resolve`),
  getAdminRequests: () => api.get('/master-admin/admin-requests'),
  approveAdminRequest: (id) => api.put(`/master-admin/admin-requests/${id}/approve`),
  rejectAdminRequest: (id) => api.put(`/master-admin/admin-requests/${id}/reject`),
};

export const networkApi = {
  searchStudents: (search = '') => api.get(`/student/network/students?search=${search}`),
  searchColleges: (search = '') => api.get(`/student/network/colleges?search=${search}`),
  followStudent: (id) => api.post(`/student/network/follow/${id}`),
  unfollowStudent: (id) => api.post(`/student/network/unfollow/${id}`),
  getFollowers: () => api.get('/student/network/followers'),
  getFollowing: () => api.get('/student/network/following'),
  getFollowingColleges: () => api.get('/student/network/colleges/following'),
  getSummary: () => api.get('/student/network/summary'),
};

export const studentApi = {
  getEvents: () => api.get('/student/events'),
  registerForEvent: (eventId, paymentDetails) => api.post(`/student/events/${eventId}/register`, paymentDetails),
  getRegistrations: () => api.get('/student/registrations'),
  claimCertificate: (registrationId) => api.post(`/student/registrations/${registrationId}/claim-certificate`, {}, { responseType: 'blob' }),
  requestAdminRole: (payload) => api.post('/student/request-admin', payload),
  getAdminRequestStatus: () => api.get('/student/admin-request-status'),
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  subscribePush: (subscriptionData) => api.post('/notifications/subscribe', subscriptionData)
};

export default api;
