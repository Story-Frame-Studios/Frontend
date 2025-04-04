import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import applicationService from '../../services/applicationService';

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

const isValidUrl = (string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)'+ // protocol
    '(([A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\\.)+[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?' + // domain...
    '|((\\d{1,3}\\.){3}\\d{1,3}))'+ // ...or ipv4
    '(\\:\\d+)?(\\/[-A-Z0-9+&@#/%=~_|$,;]*[A-Z0-9+&@#/%=~_|$])?'+ // port and path
    '(\\?[;&A-Z0-9+_=%]*)?'+ // query string
    '(\\#[-A-Z0-9_]*)?$','i' // fragment locator
  );
  return !!pattern.test(string);
};

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loginData } = useContext(LoginContext);
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!loginData?.token) {
      navigate('/login');
      return;
    }

    fetchApplicationDetails();
  }, [id, loginData]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    messageApi.open({ key: 'loading', type: 'loading', content: 'Loading Application details...', duration: 2 });
    await new Promise(resolve => setTimeout(resolve, 500));  // Simulating delay for UX
    try {
      const response = await applicationService.getApplicationById(id);

      if (response.success) {
        // Ensure the logged-in user is the one who created this application
        if (response.application.userId !== loginData.userId) {
          messageApi.open({ key: 'loading', type: 'error', content: 'You are not authorized to view this application.', duration: 2 });
          navigate('/myApplications');
          return;
        }

        setApplication(response.application);
        setJob(response.job);
        messageApi.open({ key: 'loading', type: 'success', content: 'Application details loaded successfully!', duration: 2 });
      }
    } catch (error) {
      messageApi.open({ key: 'loading', type: 'error', content: 'Error occurred while loading application details', duration: 2 });
      navigate('/myApplications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    messageApi.open({ type: 'loading', content: 'Please wait...', duration: 0 });

    try {
      await applicationService.deleteApplication(id);
      messageApi.open({ type: 'success', content: 'Application withdrawn successfully!', duration: 2 });
      navigate('/myApplications');
    } catch (error) {
      messageApi.open({ type: 'error', content: 'Failed to withdraw application', duration: 2 });
    } finally {
      setShowDeleteModal(false);
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
      {contextHolder} {/* Make sure this is in the returned JSX */}
      <Card
        title={<h1 className="text-2xl font-bold">Application Details</h1>}
        loading={loading}
        extra={
          <Space>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
            >
              Withdraw Application
            </Button>
            <Link to="/myApplications">
              <Button>Back to Applications</Button>
            </Link>
          </Space>
        }
      >
        {/* Job Information */}
        <Descriptions title="Job Information" bordered column={1}>
          <Descriptions.Item label="Job Title">{job.title}</Descriptions.Item>
          <Descriptions.Item label="Company Name">{job.companyName}</Descriptions.Item>
          <Descriptions.Item label="Salary">{job.salary}</Descriptions.Item>
          <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
          <Descriptions.Item label="Job Type">{job.jobType}</Descriptions.Item>
        </Descriptions>

        {/* Application Information */}
        <Descriptions title="Application Information" bordered column={1} className="mt-6">
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Applied On">
            {formatDate(application.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Resume">
            <Space>
              <a href={application.resume} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </Space>
          </Descriptions.Item>

          {/* Conditional Rendering for Cover Letter */}
          <Descriptions.Item label="Cover Letter">
            {
              application.coverLetter.includes('http') ? (
                <a href={application.coverLetter} target="_blank" rel="noopener noreferrer">
                  View Cover Letter
                </a>
              ) : (
                <div className="whitespace-pre-wrap">{application.coverLetter}</div>
              )
            }
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Withdraw Application"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        okText="Yes, Withdraw"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to withdraw this application?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ApplicationDetails;
