import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Sample data - replace with actual API call
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const sampleJobs = [
        {
          id: '1',
          title: 'Senior React Developer',
          location: 'New York',
          salary: 120000,
          jobType: 'Full-time',
          status: 'active',
          createdAt: '2024-03-20',
        },
        // Add more sample jobs as needed
      ];
      
      setJobs(sampleJobs);
    } catch (error) {
      message.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const showDeleteConfirm = (job) => {
    setJobToDelete(job);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      // Simulate API call
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      message.success('Job deleted successfully');
    } catch (error) {
      message.error('Failed to delete job');
    } finally {
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setJobToDelete(null);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => `$${salary.toLocaleString()}`,
    },
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'active' ? 'green' : 'red',
          textTransform: 'capitalize'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/jobs/${record.id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/jobs/edit/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <Link to="/jobs/new">
          <Button type="primary">Post New Job</Button>
        </Link>
      </div>
      <Table 
        columns={columns} 
        dataSource={jobs} 
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Delete Job"
        open={!!jobToDelete}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the job posting "{jobToDelete?.title}"?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default JobsList; 