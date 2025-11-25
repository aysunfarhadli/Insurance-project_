// Centralized API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/authUser/login`,
    REGISTER: `${API_BASE_URL}/authUser/register`,
    LOGOUT: `${API_BASE_URL}/authUser/logout`,
    PROFILE: `${API_BASE_URL}/authUser/profile`,
    UPDATE_PROFILE: (userId) => `${API_BASE_URL}/authUser/update/${userId}`,
  },
  // API endpoints
  API: {
    CATEGORIES: `${API_BASE_URL}/api/categories`,
    CATEGORY_BY_ID: (id) => `${API_BASE_URL}/api/categories/${id}`,
    ORDERS: `${API_BASE_URL}/api/orders`,
    FORMS: `${API_BASE_URL}/api/forms`,
    ORDER_FORM_SPECIFIC: `${API_BASE_URL}/api/order-form-specific`,
  },
};

export default API_BASE_URL;

