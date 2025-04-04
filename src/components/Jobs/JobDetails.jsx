import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message, Spin } from 'antd';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const JobDetails = () => {
  const { id } = useParams();
  const { loginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  // Redirect if the user is not logged in
  useEffect(() => {
    if (!loginData?.user) {
      navigate('/');
    }
  }, [loginData, navigate]);

  const fetchJobDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobDetails(id);
      if (response?.data) {
        setJob(response.data);
      } else {
        message.error('No job details found.');
      }
    } catch (error) {
      console.error("Job fetch error:", error);
      message.error(`Error fetching job details: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const checkApplicationStatus = async () => {
    setCheckingApplication(true);
    try {
      const response = await applicationService.getApplicationStatus(loginData.user.id, id);
      if (response?.applied) {
        setHasApplied(true);
      }
    } catch (error) {
      message.error('Error checking application status.');
    } finally {
      setCheckingApplication(false);
    }
  };

  useEffect(() => {
    if (loginData?.user?.role === 'candidate' && job && !hasApplied) {
      checkApplicationStatus();
    }
  }, [loginData?.user?.role, job, hasApplied]);

  const renderActionButtons = () => {
    if (loginData?.user?.role === "candidate") {
      return checkingApplication ? (
        <Button loading>Checking...</Button>
      ) : hasApplied ? (
        <Link to={`/applications/job/${job.jobId}`}>
          <Button type="default">View Application</Button>
        </Link>
      ) : (
        <Link to={`/job/${job.jobId}/application/new`}>
          <Button type="primary">Apply Now</Button>
        </Link>
      );
    }

    if (loginData?.user?.role === "employer") {
      return (
        <Link to={`/jobs/edit/${job.jobId}`}>
          <Button type="default">Edit Job</Button>
        </Link>
      );
    }

    return null;
  };

  if (loading || !job) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">{job.title}</h1>}
        extra={
          <Space>
            {renderActionButtons()}
            <Button onClick={() => navigate(loginData?.user?.role === "employer" ? "/jobs" : "/job-opportunities")}>
              Back
            </Button>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Company Name">{job.companyName}</Descriptions.Item>
          <Descriptions.Item label="Description">{job.description}</Descriptions.Item>
          <Descriptions.Item label="Requirements">{job.requirements}</Descriptions.Item>
          <Descriptions.Item label="Salary">
            {job.salary ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.salary) : 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
          <Descriptions.Item label="Job Type">{job.jobType}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default JobDetails;
