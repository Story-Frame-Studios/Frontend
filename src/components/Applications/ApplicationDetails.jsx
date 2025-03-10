import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, Modal, message } from 'antd';
import { DeleteOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
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

const getResumeIcon = (resumeUrl) => {
  if (resumeUrl.endsWith('.pdf')) {
    return <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />;
  } else if (resumeUrl.endsWith('.doc') || resumeUrl.endsWith('.docx')) {
    return <FileWordOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
  }
  return null;
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginData } = useContext(LoginContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!loginData?.token) {
      message.error('You must be logged in to view applications');
      navigate('/login');
      return;
    }

    fetchApplicationDetails();
  }, [id, loginData, navigate]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getApplicationById(id);
      
      // Check if the application belongs to the current user
      if (response.data.data.candidateId !== loginData.user.id) {
        message.error('You do not have permission to view this application');
        navigate('/applications');
        return;
      }
      
      setApplication(response.data.data);
    } catch (error) {
      message.error('Failed to fetch application details: ' + error.message);
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await applicationService.deleteApplication(id);
      message.success('Application withdrawn successfully');
      navigate('/applications');
    } catch (error) {
      message.error('Failed to withdraw application: ' + error.message);
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

  if (!application) return null;

  // Mock job data (in a real app, this would come from the API)
  const jobData = {
    title: 'Software Developer',
    companyName: 'Tech Company',
    location: 'New York, NY'
  };

  return (
    <div className="container mx-auto p-4">
      <Card
        title={<h1 className="text-2xl font-bold">Application Details</h1>}
        extra={
          <Space>
            <Button 
              danger
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
            >
              Withdraw Application
            </Button>
            <Link to="/applications">
              <Button>Back to Applications</Button>
            </Link>
          </Space>
        }
      >
        <Descriptions title="Job Information" bordered column={1}>
          <Descriptions.Item label="Job Title">{jobData.title}</Descriptions.Item>
          <Descriptions.Item label="Company">{jobData.companyName}</Descriptions.Item>
          <Descriptions.Item label="Location">{jobData.location}</Descriptions.Item>
        </Descriptions>
        
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
              {getResumeIcon(application.resume)}
              <span>{application.resume}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Cover Letter">
            <div className="whitespace-pre-wrap">{application.coverLetter}</div>
          </Descriptions.Item>
          {application.notes && (
            <Descriptions.Item label="Notes">
              <div className="whitespace-pre-wrap">{application.notes}</div>
            </Descriptions.Item>
          )}
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