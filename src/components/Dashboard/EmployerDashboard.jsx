import { useState } from "react";
import { FaBriefcase, FaUsers, FaEye, FaClipboardList } from "react-icons/fa";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample data for the chart
  const data = [
    { name: "Jobs", count: 7 },
    { name: "Applicants", count: 123 },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">


      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row items-center bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Welcome Back, Employer!</h1>
            <p className="text-gray-200">Manage your jobs and applicants efficiently.</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            { icon: <FaBriefcase className="text-blue-500 text-3xl" />, label: "Total Jobs", value: "07" },
            { icon: <FaUsers className="text-green-500 text-3xl" />, label: "Total Applicants", value: "123" },
            { icon: <FaEye className="text-yellow-500 text-3xl" />, label: "Total Views", value: "1.7k" },
            { icon: <FaClipboardList className="text-red-500 text-3xl" />, label: "Pending Reviews", value: "04" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4"
            >
              {stat.icon}
              <div>
                <h2 className="text-lg font-semibold">{stat.value}</h2>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Job Listings vs Applicants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4A90E2" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
