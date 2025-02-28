import { Link } from 'react-router-dom';
import { Table, Button, Space, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import jobService from '../../services/jobService';
import { useState, useEffect } from 'react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs();
      setJobs(response.data || []);
    } catch (error) {
      message.error('Failed to fetch jobs: ' + error.message);
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
      await jobService.deleteJob(jobToDelete.jobId);
      message.success('Job deleted successfully');
      fetchJobs(); // Refresh the list
    } catch (error) {
      message.error('Failed to delete job: ' + error.message);
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
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
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
      render: (salary) => `$${salary?.toLocaleString() || 'Not specified'}`,
    },
    {
      title: 'Job Type',
      dataIndex: 'jobType',
      key: 'jobType',
    },
    {
      title: 'Applications',
      dataIndex: 'applications',
      key: 'applications',
      render: (applications) => applications?.length || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/jobs/${record.jobId}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Link to={`/jobs/edit/${record.jobId}`}>
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
        rowKey="jobId"
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