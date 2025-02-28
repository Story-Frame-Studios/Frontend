import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message } from 'antd';
import jobService from '../../services/jobService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

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

  if (!job) return null;

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">{job.title}</h1>}
        loading={loading}
        extra={
          <Space>
            <Link to={`/jobs/edit/${job.jobId}`}>
              <Button type="primary">Edit</Button>
            </Link>
            <Link to="/jobs">
              <Button>Back to List</Button>
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
          <Descriptions.Item label="Applications">
            {job.applications?.length || 0} applications received
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default JobDetails; 