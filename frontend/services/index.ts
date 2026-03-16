import apiClient from './apiClient';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  signup: (email: string, password: string, name: string) =>
    apiClient.post('/auth/signup', { email, password, name }),

  logout: () => apiClient.post('/auth/logout'),

  getCurrentUser: () => apiClient.get('/auth/me'),

  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

export const stationService = {
  getStations: (params?: any) =>
    apiClient.get('/stations', { params }),

  getStationById: (id: number) =>
    apiClient.get(`/stations/${id}`),

  searchStations: (query: string, lat?: number, lng?: number) =>
    apiClient.get('/stations/search', {
      params: { query, lat, lng },
    }),

  getNearbyStations: (lat: number, lng: number, radius?: number) =>
    apiClient.get('/stations/nearby', {
      params: { lat, lng, radius },
    }),

  getStationAvailability: (id: number) =>
    apiClient.get(`/stations/${id}/availability`),
};

export const bookingService = {
  createBooking: (data: any) =>
    apiClient.post('/bookings', data),

  getBookings: (params?: any) =>
    apiClient.get('/bookings', { params }),

  getBookingById: (id: number) =>
    apiClient.get(`/bookings/${id}`),

  updateBooking: (id: number, data: any) =>
    apiClient.put(`/bookings/${id}`, data),

  cancelBooking: (id: number) =>
    apiClient.delete(`/bookings/${id}`),

  getBookingHistory: () =>
    apiClient.get('/bookings/history'),
};

export const paymentService = {
  getPaymentMethods: () =>
    apiClient.get('/payment-methods'),

  addPaymentMethod: (data: any) =>
    apiClient.post('/payment-methods', data),

  updatePaymentMethod: (id: number, data: any) =>
    apiClient.put(`/payment-methods/${id}`, data),

  deletePaymentMethod: (id: number) =>
    apiClient.delete(`/payment-methods/${id}`),

  processPayment: (bookingId: number, paymentMethodId: number) =>
    apiClient.post('/payments', { bookingId, paymentMethodId }),

  getInvoices: () =>
    apiClient.get('/invoices'),
};

export const userService = {
  getProfile: () =>
    apiClient.get('/users/profile'),

  updateProfile: (data: any) =>
    apiClient.put('/users/profile', data),

  getPreferences: () =>
    apiClient.get('/users/preferences'),

  updatePreferences: (data: any) =>
    apiClient.put('/users/preferences', data),

  getFavoriteStations: () =>
    apiClient.get('/users/favorites'),

  addFavoriteStation: (stationId: number) =>
    apiClient.post('/users/favorites', { stationId }),

  removeFavoriteStation: (stationId: number) =>
    apiClient.delete(`/users/favorites/${stationId}`),
};

export default {
  authService,
  stationService,
  bookingService,
  paymentService,
  userService,
};
