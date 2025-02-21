// App.js
import { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { LoginProvider, LoginContext } from './components/ContextProvider/LoginContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { ForgotPassword } from './components/Login/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Footer } from './components/Footer';
import { UserProfile } from './components/UserProfile/UserProfile';

// Protected Route Component
const ProtectedRoute = () => {
  const { loginData, loading } = useContext(LoginContext);
  
  if (loading) return null;
  
  return loginData?.token ? <Outlet /> : <Navigate to="/login" />;
};

// Public Route Component (prevents authenticated users from accessing login/register)
const PublicRoute = () => {
  const { loginData, loading } = useContext(LoginContext);
  
  if (loading) return null;
  
  return !loginData?.token ? <Outlet /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <LoginProvider>
      <div className="App min-h-screen flex flex-col">
        <ToastContainer position="top-right" />
        <Routes>
          <Route element={<Navbar />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* New route */}
            <Route path="/account-settings" element={<UserProfile />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </LoginProvider>
  );
}

export default App;