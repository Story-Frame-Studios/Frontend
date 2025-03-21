import { useState, useEffect, useContext } from "react";
import { FaBriefcase, FaUsers, FaClipboardList, FaRegListAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { LoginContext } from "../ContextProvider/LoginContext";
import applicationService from "../../services/applicationService";
import jobService from "../../services/jobService";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState(0);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [applicantsNumber, setApplicantsNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginData } = useContext(LoginContext);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const key = "loading"; // Unique key for message updates

      // Show loading message
      messageApi.open({ key, type: "loading", content: "Loading dashboard data..." });

      try {
        const [applicationsRes, jobsRes, applicantsRes] = await Promise.all([
          applicationService.getApplicationNumber(loginData?.user?.id),
          jobService.getJobsByEmployerId(loginData?.user?.id),
          applicationService.getApplicantsForEmployer(loginData?.user?.id),
        ]);

        // Set state for each data type
        setApplications(applicationsRes.applications || []);
        setApplicationNumber(applicationsRes.applications?.length || 0);
        setReceivedApplications(applicationsRes.applications?.filter(app => app.status === "received") || []);

        setJobs(jobsRes.data || []);

        if (applicantsRes?.applicants) {
          setApplicants(applicantsRes.applicants);
        } else {
          setApplicants([]);
        }

        setApplicantsNumber(applicantsRes.totalApplicants || 0);

       
        if (!jobsRes.data) {
          messageApi.open({ key, type: "error", content: "No Jobs are posted, Please Post a Job!!", duration: 2.5 });
        } else {
          // Show success message
          messageApi.open({ key, type: "success", content: "Applicants data loaded successfully!", duration: 2.5 });
        }
       
      } catch (error) {
        messageApi.error({ key, content: "Failed to load dashboard data.", duration: 2.5 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loginData, messageApi]);

  // Sample data for the chart
  const data = [
    { name: "Jobs", count: jobs.length },
    { name: "Applicants", count: applicationNumber },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {contextHolder} {/* Required for Ant Design messages to work */}
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
            {
              icon: <FaBriefcase className="text-blue-500 text-3xl" />,
              label: "Total Jobs",
              value: `${jobs.length}`,
              onClick: () => navigate("/jobs", { state: { jobs } }),
            },
            {
              icon: <FaRegListAlt className="text-purple-500 text-3xl" />,
              label: "Total Applications",
              value: `${applicationNumber}`,
              onClick: () => navigate("/allAppliedApplications", { state: { applications } }),
            },
            {
              icon: <FaUsers className="text-green-500 text-3xl" />,
              label: "Total Applicants",
              value: `${applicantsNumber}`,
              onClick: () => navigate("/applicants", { state: { applicants } }),
            },
            {
              icon: <FaClipboardList className="text-red-500 text-3xl" />,
              label: "Pending Reviews",
              value: `${receivedApplications.length}`,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"
              onClick={stat.onClick}
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
