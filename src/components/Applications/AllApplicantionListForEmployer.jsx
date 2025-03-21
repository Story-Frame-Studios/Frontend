import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Tag, Modal, message, Select } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
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

const ApplicationsList = () => {
  const { loginData } = useContext(LoginContext);
  const [applications, setApplications] = useState([]);
  const [deletedApplications, setDeletedApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationToUpdate, setApplicationToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const key = "loading";

  useEffect(() => {
    if (loginData?.user?.id) {
      fetchApplications();
      fetchDeletedApplications();
    }
  }, [loginData]);

  const fetchApplications = async () => {
    setLoading(true);
    messageApi.open({ key, type: "loading", content: "Loading Applications data For You..." });
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await applicationService.getApplicationsByEmployerId(loginData.user.id);
      if (response.success) {
        setApplications(response.applications || []);
      }
      messageApi.open({ key, type: 'success', content: 'Applications loaded successfully!', duration: 2 });
    } catch (error) {
      messageApi.open({ key, type: 'error', content: 'Failed to load applications: ' + error.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedApplications = async () => {
    setLoading(true);
    messageApi.open({ key, type: "loading", content: "Loading Withdrawn Applications..." });
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const response = await applicationService.getDeletedApplicationsForEmployer(loginData.user.id);
      if (response?.data?.success) {
        setDeletedApplications(response?.data?.deletedApplications || []);
      }
      messageApi.open({ key, type: 'success', content: 'Withdrawn applications loaded successfully!', duration: 2 });
    } catch (error) {
      messageApi.open({ key, type: 'error', content: 'Failed to load applications: ' + error.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const showStatusChangeModal = (application) => {
    setApplicationToUpdate(application);
    setSelectedStatus(application.status);    
  };

  const handleStatusUpdate = async () => {
    if (!applicationToUpdate || !selectedStatus || !loginData?.user?.id) return;

    const employerId = loginData.user.id;  // Ensure employerId is set

    try {
      await applicationService.updateApplicationStatus(employerId, applicationToUpdate.applicationId, selectedStatus);
      message.success('Application status updated successfully');
      await fetchApplications(); // Refresh the list of applications
    } catch (error) {
      message.error(error.message); // Use the error thrown from the API
    } finally {
      setApplicationToUpdate(null); // Clear the application selection
    }
  };

  const handleCancel = () => {
    setApplicationToUpdate(null);
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
        <Tag color={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/getApplicationDetailForEmployer/${loginData?.user?.id}/${record.applicationId}`}>
            <Button icon={<EyeOutlined />} type="primary">View</Button>
          </Link>
          <Button
            icon={<EditOutlined />}
            type="default"
            onClick={() => showStatusChangeModal(record)}
          >
            Change Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Applications</h1>
      </div>

      <h2 className="text-xl font-bold">Active Applications</h2>
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="applicationId"
      />

      <Modal
        title="Change Application Status"
        open={!!applicationToUpdate}
        onOk={handleStatusUpdate}
        onCancel={handleCancel}
        okText="Update Status"
        cancelText="Cancel"
      >
        <p>Select a new status for this application:</p>
        <Select
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: '100%' }}
        >
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

export default ApplicationsList;
