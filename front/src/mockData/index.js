// Centralized mock data exports
export { mockCategories, getMockCategoriesByType, getMockCategoryById } from './categories';
export { mockUserProfile } from './user';
export { mockOrders, getMockOrdersByUserId } from './orders';
export { mockCompanies, getMockCompaniesByCategory } from './companies';

// Helper to check if we should use mock data
export const shouldUseMockData = () => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
         import.meta.env.DEV ||
         !import.meta.env.VITE_API_BASE_URL;
};

