import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
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

const ApplicationsList = () => {
  const { loginData } = useContext(LoginContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  useEffect(() => {
    if (loginData?.user?.id) {
      fetchApplications();
    }
  }, [loginData]);

  const fetchApplications = async () => {    
    setLoading(true);
    try {
      const response = await applicationService.getCandidateApplications(loginData.user.id);
      console.log(response,"responeee")
      if(response.success){
        setApplications(response.applications || []);
      }
    
    } catch (error) {
      message.error('Failed to fetch applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (application) => {
    setApplicationToDelete(application);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;
    try {
      await applicationService.deleteApplication(applicationToDelete.applicationId);
      message.success('Application withdrawn successfully');
      await fetchApplications(); // Refresh the list
    } catch (error) {
      message.error('Failed to withdraw application: ' + error.message);
    } finally {
      setApplicationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setApplicationToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (_, record) => record.job?.title || 'Unknown Job',
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (_, record) => record.job?.companyName || 'Unknown Company',
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
  
        <Space>
          <Link to={`/applications/${record.applicationId}`}>
            <Button icon={<EyeOutlined />} type="primary">View</Button>
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => showDeleteConfirm(record)}
          >
            Withdraw
          </Button>
        </Space>
      ),
    },
  ];



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Applications</h1>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={applications} 
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Withdraw Application"
        open={!!applicationToDelete}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
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

export default ApplicationsList; 