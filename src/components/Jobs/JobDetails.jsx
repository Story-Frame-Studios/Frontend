import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message, Spin } from 'antd';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const JobDetails = () => {
  const { id } = useParams();
  const { loginData } = useContext(LoginContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (loginData?.user?.id && loginData?.user?.role === 'candidate' && job) {
      checkApplicationStatus();
    }
  }, [job, loginData]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (error) {
      message.error('Failed to fetch job details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    setCheckingApplication(true);
    try {
      const response = await applicationService.checkApplicationExists(id, loginData.user.id);
      setHasApplied(response.data.exists);
    } catch (error) {
      console.error('Error checking application status:', error);
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

  const isEmployer = loginData?.user?.role === 'employer';
  const isCandidate = loginData?.user?.role === 'candidate';

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">{job.title}</h1>}
        loading={loading}
        extra={
          <Space>
            {isEmployer && (
              <Link to={`/jobs/edit/${job.jobId}`}>
                <Button type="primary">Edit</Button>
              </Link>
            )}
            {isCandidate && (
              checkingApplication ? (
                <Button loading>Checking...</Button>
              ) : hasApplied ? (
                <Link to={`/applications/job/${job.jobId}`}>
                  <Button type="default">View Application</Button>
                </Link>
              ) : (
                <Link to={`/job/${job.jobId}/application/new`}>
                  <Button type="primary">Apply Now</Button>
                </Link>
              )
            )}
            <Link to={isEmployer ? "/jobs" : "/"}>
              <Button>Back</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Company Name">
            {job.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {job.description}
          </Descriptions.Item>
          <Descriptions.Item label="Requirements">
            {job.requirements}
          </Descriptions.Item>
          <Descriptions.Item label="Salary">
            ${job.salary?.toLocaleString() || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {job.location}
          </Descriptions.Item>
          <Descriptions.Item label="Job Type">
            {job.jobType}
          </Descriptions.Item>
          {isEmployer && (
            <Descriptions.Item label="Applications">
              {job.applications?.length || 0} applications received
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default JobDetails; 