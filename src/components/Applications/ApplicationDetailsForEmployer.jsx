import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, Modal, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import applicationService from '../../services/applicationService';

const { Option } = Select;

const getStatusColor = (status) => {
  const statusColors = {
    'received': 'blue',
    'under review': 'orange',
    'interview': 'purple',
    'hired': 'green',
    'rejected': 'red',
    'withdrawn': 'gray'
  };
  
  return statusColors[status] || 'default';
};

const ApplicationDetailsforEmployer = () => {
  const { employerId, applicationId } = useParams();
  const navigate = useNavigate();
  const { loginData } = useContext(LoginContext);
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applicationToUpdate, setApplicationToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!loginData?.token) {
      message.error('You must be logged in to view applications');
      navigate('/login');
      return;
    }
    fetchApplicationDetails();
  }, [employerId, applicationId, loginData, navigate]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getApplicationDetailForEmployer(employerId, applicationId);
      if (response.success) {
        setApplication(response.application);
        setJob(response.job);
        setSelectedStatus(response.application.status);
        console.log(response);
        
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Failed to fetch application details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async () => {
    if (!applicationToUpdate || !selectedStatus || !loginData?.user?.id) return;
    try {
      await applicationService.updateApplicationStatus(loginData.user.id, applicationToUpdate.applicationId, selectedStatus);
      message.success('Application status updated successfully');
      fetchApplicationDetails();
    } catch (error) {
      message.error(error.message);
    } finally {
      setApplicationToUpdate(null);
    }
  };

  const handleCancel = () => {
    setApplicationToUpdate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!application || !job) return null;

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">Application Details</h1>}
        extra={
          <Space>
            <Link to="/allAppliedApplications">
              <Button>Back to Applications</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions title="Job Information" bordered column={1}>
          <Descriptions.Item label="Job Title">{job.title}</Descriptions.Item>
          <Descriptions.Item label="Company Name">{job.companyName}</Descriptions.Item>
          <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
          <Descriptions.Item label="Salary">{job.salary}</Descriptions.Item>
          <Descriptions.Item label="Job Type">{job.jobType}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="Candidate Information" bordered column={1} className="mt-6">
          <Descriptions.Item label="First Name">{application.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{application.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{application.email}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Tag>
            <Button icon={<EditOutlined />} type="default" onClick={() => setApplicationToUpdate(application)} className="ml-2">
              Change Status
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="Applied On">{formatDate(application.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Resume">
            <a href={application.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
          </Descriptions.Item>
          <Descriptions.Item label="Cover Letter">
            {application.coverLetter.includes('http') ? (
              <a href={application.coverLetter} target="_blank" rel="noopener noreferrer">View Cover Letter</a>
            ) : (
              <div className="whitespace-pre-wrap">{application.coverLetter}</div>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal title="Change Application Status" visible={!!applicationToUpdate} onOk={handleStatusUpdate} onCancel={handleCancel} okText="Update Status" cancelText="Cancel">
        <p>Select a new status for this application:</p>
        <Select value={selectedStatus} onChange={(value) => setSelectedStatus(value)} style={{ width: '100%' }}>
          <Option value="received">Received</Option>
          <Option value="under review">Under Review</Option>
          <Option value="interview">Interview</Option>
          <Option value="hired">Hired</Option>
          <Option value="rejected">Rejected</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default ApplicationDetailsforEmployer;
