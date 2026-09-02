import axios from 'axios';
import toast from 'react-hot-toast';

export function setupInterceptors() {
  const handleUnauthorized = () => {
    const currentPath = window.location.pathname;
    // Do not trigger redirect loop if already on auth pages
    if (currentPath !== '/login' && currentPath !== '/' && currentPath !== '/signup') {
      
      // Clear all auth related storage
      localStorage.removeItem('token');
      localStorage.removeItem('Token');
      localStorage.removeItem('user');
      localStorage.removeItem('Role');
      
      toast.error('Session expired. Please log in again.');
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  // 1. Intercept Global Fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        handleUnauthorized();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 2. Intercept Global Axios
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleUnauthorized();
      }
      return Promise.reject(error);
    }
  );
}
