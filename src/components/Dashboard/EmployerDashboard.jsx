import { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('posted');
  
  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'posted'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('posted')}
        >
          Posted Jobs
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'applications'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'company'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('company')}
        >
          Company Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'posted' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Posted Jobs</h2>
            </div>
            <div className="space-y-4">
              {/* Sample job listings */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Senior React Developer</h3>
                <p className="text-gray-600">Posted 2 days ago</p>
                <p className="text-gray-600">Applications: 12</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
            <div className="space-y-4">
              {/* Sample applications */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">John Smith</h3>
                    <p className="text-gray-600">Applied for: Senior React Developer</p>
                    <p className="text-gray-600">Experience: 5 years</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded">
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter industry"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2"
                  rows="4"
                  placeholder="Enter company description"
                ></textarea>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard; 