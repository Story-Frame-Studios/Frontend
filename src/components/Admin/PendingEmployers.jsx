import { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../ContextProvider/LoginContext';
import { toast } from 'react-toastify';
import { baseUrl } from '../Utils/constants';

const PendingEmployers = () => {
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loginData } = useContext(LoginContext);

  const fetchPendingEmployers = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/pending-employers`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Response data:', data); // Debug log to see what we're getting back
      
      if (data.success) {
        setPendingEmployers(data.employers);
      } else {
        toast.error('Failed to fetch pending employers');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching pending employers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (email, action) => {
    try {
      const response = await fetch(`${baseUrl}/auth/verify-employer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({ email, action })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchPendingEmployers();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error processing request');
    }
  };

  useEffect(() => {
    if (loginData?.token) {
      fetchPendingEmployers();
    }
  }, [loginData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Employer Approvals</h1>
      
      {pendingEmployers.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow">
          No pending approvals at this time.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingEmployers.map((employer) => (
            <div 
              key={employer.id} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {employer.firstName} {employer.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{employer.email}</p>
                  <p className="text-sm text-gray-500 mt-2">User ID: {employer.userId}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleVerification(employer.email, 'approve')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(employer.email, 'reject')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingEmployers; 