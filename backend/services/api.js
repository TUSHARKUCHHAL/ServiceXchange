// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Create axios instance with base URL
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Auth services
// export const authService = {
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   googleLogin: (token) => api.post('/auth/google-login', { token }),
//   sendOTP: (userData) => api.post('/auth/send-otp', userData),
//   verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
//   googleSignup: (token) => api.post('/auth/google-signup', { token }),
//   verifyGoogleOTP: (email, otp) => api.post('/auth/verify-google-otp', { email, otp }),
//   forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
//   resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { newPassword }),
// };

// export default api;