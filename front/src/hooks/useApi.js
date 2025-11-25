import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';

/**
 * Custom hook for API calls with loading and error states
 * @param {string} url - API endpoint URL
 * @param {object} options - Axios request options (method, data, etc.)
 * @param {boolean} immediate - Whether to fetch immediately
 */
export const useApi = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (customOptions = {}) => {
    if (!url) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const config = { ...options, ...customOptions };
      const method = config.method || 'get';
      const response = method === 'get' 
        ? await apiClient.get(url, config)
        : await apiClient[method](url, config.data || config.body, config);
      
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Xəta baş verdi';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [immediate, url, execute]);

  return { data, loading, error, execute };
};

/**
 * Hook for fetching user profile
 */
export const useUserProfile = () => {
  const { data, loading, error, execute } = useApi(API_ENDPOINTS.AUTH.PROFILE, {}, false);
  
  const fetchProfile = useCallback(async () => {
    return await execute();
  }, [execute]);

  return { user: data?.user, loading, error, fetchProfile };
};

