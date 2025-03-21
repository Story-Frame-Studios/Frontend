import { createContext, useState, useEffect, useContext } from "react";
import applicationService from "../../services/applicationService";
import jobService from "../../services/jobService";
import { LoginContext } from "./LoginContext";

export const EmployerContext = createContext();

export const EmployerProvider = ({ children }) => {
  const { loginData } = useContext(LoginContext);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState(0);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [applicantsNumber, setApplicantsNumber] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginData?.user?.id) return;

    const fetchEmployerData = async () => {
      setLoading(true);
      try {
        const [applicationsRes, jobsRes, applicantsRes] = await Promise.all([
          applicationService.getApplicationNumber(loginData?.user?.id),
          jobService.getJobsByEmployerId(loginData?.user?.id),
          applicationService.getApplicantsForEmployer(loginData?.user?.id),
        ]);

        setApplications(applicationsRes.applications || []);
        setApplicationNumber(applicationsRes.applications?.length || 0);
        setReceivedApplications(applicationsRes.applications?.filter(app => app.status === "received") || []);

        setJobs(jobsRes.data || []);

        if (applicantsRes?.data?.applicants) {
          setApplicants(applicantsRes.data.applicants);
        } else {
          setApplicants([]);
        }

        setApplicantsNumber(applicantsRes.data.totalApplicants || 0);
      } catch (error) {
        console.error("Error fetching employer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, [loginData]);

  return (
    <EmployerContext.Provider value={{ jobs, applicants, applications, applicationNumber, receivedApplications, applicantsNumber, loading }}>
      {children}
    </EmployerContext.Provider>
  );
};
