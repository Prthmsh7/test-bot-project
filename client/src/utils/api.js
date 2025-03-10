const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 