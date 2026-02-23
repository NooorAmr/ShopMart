import axios from 'axios';

const BASE_URL = 'https://ecommerce.routemisr.com';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.token = token;
  }
  return config;
});

// AUTH
export const registerUser  = (d) => api.post('/api/v1/auth/signup', d);
export const loginUser     = (d) => api.post('/api/v1/auth/signin', d);
export const forgotPass    = (d) => api.post('/api/v1/auth/forgotPasswords', d);
export const verifyCode    = (d) => api.post('/api/v1/auth/verifyResetCode', d);
export const resetPass     = (d) => api.put('/api/v1/auth/resetPassword', d);
export const changePass    = (d) => api.put('/api/v1/users/changeMyPassword', d);

// PRODUCTS
export const getProducts   = (page = 1, limit = 40) => api.get(`/api/v1/products?page=${page}&limit=${limit}`);
export const getProduct    = (id) => api.get(`/api/v1/products/${id}`);

// CATEGORIES
export const getCategories = () => api.get('/api/v1/categories');
export const getCategory   = (id) => api.get(`/api/v1/categories/${id}`);

// BRANDS
export const getBrands     = () => api.get('/api/v1/brands');
export const getBrand      = (id) => api.get(`/api/v1/brands/${id}`);

// CART
export const getCart       = () => api.get('/api/v1/cart');
export const addToCart     = (productId) => api.post('/api/v1/cart', { productId });
export const updateCart    = (id, count) => api.put(`/api/v1/cart/${id}`, { count });
export const removeCart    = (id) => api.delete(`/api/v1/cart/${id}`);
export const clearCart     = () => api.delete('/api/v1/cart');

// WISHLIST
export const getWishlist    = () => api.get('/api/v1/wishlist');
export const addWishlist    = (productId) => api.post('/api/v1/wishlist', { productId });
export const removeWishlist = (id) => api.delete(`/api/v1/wishlist/${id}`);

// ORDERS
export const getUserOrders  = (userId) => api.get(`/api/v1/orders/user/${userId}`);
export const cashOrder      = (cartId, data) => api.post(`/api/v1/orders/${cartId}`, data);
export const onlineOrder    = (cartId, data) =>
  api.post(`/api/v1/orders/checkout-session/${cartId}?url=${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}`, data);

export default api;
