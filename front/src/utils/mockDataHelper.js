/**
 * Helper utility to check if backend is available and use mock data as fallback
 */

// Check if we should use mock data (when backend is unavailable or in dev mode)
// export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
//                               import.meta.env.DEV;
export const USE_MOCK_DATA = false;
/**
 * Wrapper function that tries API call first, falls back to mock data
 * @param {Function} apiCall - Async function that makes API call
 * @param {Function} mockDataGetter - Function that returns mock data
 * @param {boolean} useMock - Force use mock data
 */
export const withMockFallback = async (apiCall, mockDataGetter, useMock = USE_MOCK_DATA) => {
  if (useMock) {
    console.log('📦 Using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockDataGetter(), isMock: true };
  }

  try {
    const response = await apiCall();
    return { data: response.data || response, isMock: false };
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    // Don't fallback to mock data - throw the error instead
    throw error;
  }
};

/**
 * Check if backend is reachable
 */
export const checkBackendHealth = async () => {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

