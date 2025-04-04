import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../components/ContextProvider/LoginContext';
import EmployerDashboard from '@/components/Dashboard/EmployerDashboard';
import CandidateJobsList from '@/components/Jobs/CandidateJobsList';
export const Dashboard = () => {
  const { loginData } = useContext(LoginContext);
  const userRole = loginData?.user?.role;

  const renderAdminDashboard = () => (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
      <Link 
        to="/admin/pending-employers"
        className="block w-64 mx-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center shadow-md"
      >
        Manage Pending Employers
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto">
      {loginData?.user?.role === 'employer' ? (
        <EmployerDashboard />
      ) : (
        <CandidateJobsList />
      )}
    </div>
  );
};
