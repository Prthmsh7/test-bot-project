import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        if (response.ok) {
          setStatus('Backend connection successful! 🎉');
        } else {
          setStatus('Backend connection failed 😢');
        }
      } catch (error) {
        setStatus(`Connection error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h3>Backend Connection Status:</h3>
      <p>{status}</p>
      <p>Connected to: {API_BASE_URL}</p>
    </div>
  );
}

export default TestConnection; 