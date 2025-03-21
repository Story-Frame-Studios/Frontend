// LoginContext.js
import { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem('usertoken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      setLoginData({ token, user });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('user');
    setLoginData(null);
  };

  return (
    <LoginContext.Provider value={{ loginData, setLoginData, logout, loading }}>
      {!loading ? children : null}
    </LoginContext.Provider>
  );
};
