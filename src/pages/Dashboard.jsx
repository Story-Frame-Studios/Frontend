import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../components/ContextProvider/LoginContext';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {userRole === 'admin' && renderAdminDashboard()}
      {/* {userRole === 'admin' ? <DashboardLayout /> : <DashboardLayout />} */}
    </div>
  );
};
