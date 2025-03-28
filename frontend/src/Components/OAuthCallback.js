import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
        window.location.reload();
      } else {
        // Handle error scenario
        navigate('/login');
      }
    };
    
    handleOAuthCallback();
  }, [navigate]);
  
  return <div>Processing login...</div>;
};

export default OAuthCallback;