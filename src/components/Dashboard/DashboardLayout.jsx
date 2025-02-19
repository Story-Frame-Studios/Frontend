import { useContext } from 'react';
import { LoginContext } from '../ContextProvider/LoginContext';
import EmployerDashboard from './EmployerDashboard';
import CandidateDashboard from './CandidateDashboard';

const DashboardLayout = () => {
  const { loginData } = useContext(LoginContext);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {loginData?.user?.firstName} {loginData?.user?.lastName}!
      </h1>
      
      {loginData?.user?.role === 'employer' ? (
        <EmployerDashboard />
      ) : (
        <CandidateDashboard />
      )}
    </div>
  );
};

export default DashboardLayout; 