import { useState } from 'react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  
  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'jobs'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('jobs')}
        >
          Available Jobs
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'applications'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profile'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Available Jobs</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="border rounded-lg px-4 py-2"
                />
                <select className="border rounded-lg px-4 py-2">
                  <option>All Categories</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Full Stack</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {/* Sample job listings */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Senior React Developer</h3>
                    <p className="text-gray-600">Company XYZ</p>
                    <p className="text-gray-600">Location: Remote</p>
                    <p className="text-gray-600">Salary: $100k - $150k</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Applications</h2>
            <div className="space-y-4">
              {/* Sample applications */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold">Senior React Developer</h3>
                <p className="text-gray-600">Company XYZ</p>
                <p className="text-gray-600">Applied: 2 days ago</p>
                <p className="text-gray-600">Status: Under Review</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Enter your skills"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Years of experience"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">About Me</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2"
                  rows="4"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Resume</label>
                <input
                  type="file"
                  className="w-full border rounded-lg px-4 py-2"
                  accept=".pdf,.doc,.docx"
                />
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

export default CandidateDashboard; 