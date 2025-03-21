import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

  // Redirect if the user is not a candidate
  useEffect(() => {
    if (!loginData?.user || loginData.user.role !== 'candidate') {
      navigate('/'); // Redirect to home or login page
    }
  }, [loginData, navigate]);

  useEffect(() => {
    if (loginData?.user?.id && loginData?.user?.role === 'candidate') {
      fetchJobDetails();
    }
  }, [id, loginData]);

  useEffect(() => {
    if (loginData?.user?.id && job) {
      checkApplicationStatus();
    }
  }, [job, loginData]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobDetails(id);
      if (response?.data) {
        setJob(response.data);
      } else {
        message.error('No job details found.');
      }
    } catch (error) {
      message.error('Failed to fetch job details: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">{job.title}</h1>}
        extra={
          <Space>
            {checkingApplication ? (
              <Button loading>Checking...</Button>
            ) : hasApplied ? (
              <Link to={`/applications/job/${job.jobId}`}>
                <Button type="default">View Application</Button>
              </Link>
            ) : (
              <Link to={`/job/${job.jobId}/application/new`}>
                <Button type="primary">Apply Now</Button>
              </Link>
            )}
            <Link to="/job-opportunities">
              <Button>Back</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Company Name">{job.companyName}</Descriptions.Item>
          <Descriptions.Item label="Description">{job.description}</Descriptions.Item>
          <Descriptions.Item label="Requirements">{job.requirements}</Descriptions.Item>
          <Descriptions.Item label="Salary">
            {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
          <Descriptions.Item label="Job Type">{job.jobType}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default JobDetails;