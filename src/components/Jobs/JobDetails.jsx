import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, message } from 'antd';

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
      // Simulate API call
      const jobData = {
        id: '1',
        title: 'Senior React Developer',
        description: 'We are looking for a senior React developer...',
        requirements: '5+ years of experience with React...',
        salary: 120000,
        location: 'New York',
        jobType: 'Full-time',
        status: 'active',
        createdAt: '2024-03-20',
        applications: [],
      };
      setJob(jobData);
    } catch (error) {
      message.error('Failed to fetch job details');
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
            <Link to={`/jobs/edit/${id}`}>
              <Button type="primary">Edit</Button>
            </Link>
            <Link to="/jobs">
              <Button>Back to List</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Description">
            {job.description}
          </Descriptions.Item>
          <Descriptions.Item label="Requirements">
            {job.requirements}
          </Descriptions.Item>
          <Descriptions.Item label="Salary">
            ${job.salary.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {job.location}
          </Descriptions.Item>
          <Descriptions.Item label="Job Type">
            {job.jobType}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span style={{ 
              color: job.status === 'active' ? 'green' : 'red',
              textTransform: 'capitalize'
            }}>
              {job.status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Posted On">
            {new Date(job.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Applications">
            {job.applications.length}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default JobDetails; 