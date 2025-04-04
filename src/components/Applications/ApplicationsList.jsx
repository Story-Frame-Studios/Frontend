import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Space, Tag, Modal, message, Input, Select, DatePicker } from 'antd';
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
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [deletedApplications, setDeletedApplications] = useState([]);
  const [filteredDeletedApplications, setFilteredDeletedApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (loginData?.user?.id) {
      fetchApplications();
      fetchDeletedApplications();
    }
  }, [loginData]);

  const fetchApplications = async () => {
    setLoading(true);
    const key = 'loading';
    messageApi.open({ key, type: 'loading', content: 'Loading Applications data For You...' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await applicationService.getCandidateApplications(loginData.user.id);
      if (response.success) {
        setApplications(response.applications || []);
        setFilteredApplications(response.applications || []);
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
    const key = 'loading';
    messageApi.open({ key, type: 'loading', content: 'Loading Deleted Applications data For You...' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await applicationService.getDeletedApplications(loginData.user.id);
      if (response?.data?.success) {
        setDeletedApplications(response?.data?.deletedApplications || []);
        setFilteredDeletedApplications(response?.data?.deletedApplications || []);
      }
      messageApi.open({ key, type: 'success', content: 'Deleted applications loaded successfully!', duration: 3 });
    } catch (error) {
      messageApi.open({ key, type: 'error', content: 'Failed to load deleted applications: ' + error.message, duration: 2 });
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
      await fetchApplications();
      await fetchDeletedApplications();
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

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterApplications(value, filterStatus, filterDateRange); // Filter for active applications
    filterDeletedApplications(value, filterStatus, filterDateRange);  // Apply filter to deleted applications
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    filterApplications(searchTerm, value, filterDateRange);
    filterDeletedApplications(searchTerm, value, filterDateRange);  // Apply filter to deleted applications
  };

  const handleDateFilter = (dates) => {
    setFilterDateRange(dates);
    filterApplications(searchTerm, filterStatus, dates);
    filterDeletedApplications(searchTerm, filterStatus, dates);  // Apply filter to deleted applications
  };

  const filterApplications = (searchTerm, filterStatus, filterDateRange) => {
    let filtered = applications;
  
    if (searchTerm) {
      filtered = filtered.filter(application => {
        const jobTitle = application.job?.title?.toLowerCase() || '';  // Safely access job title
        const companyName = application.job?.companyName?.toLowerCase() || '';  // Safely access company name
        const searchLower = searchTerm.toLowerCase();
  
        return jobTitle.includes(searchLower) || companyName.includes(searchLower);
      });
    }
  
    if (filterStatus) {
      filtered = filtered.filter(application => application.status === filterStatus);
    }
  
    if (filterDateRange && filterDateRange.length === 2) {
      const [startDate, endDate] = filterDateRange;
      filtered = filtered.filter(application => {
        const createdAt = new Date(application.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      });
    }
  
    setFilteredApplications(filtered);
  };
  
  const filterDeletedApplications = (searchTerm, filterStatus, filterDateRange) => {
    let filtered = deletedApplications;
  
    if (searchTerm) {
      filtered = filtered.filter(application => {
        const jobTitle = application.jobTitle?.toLowerCase() || '';  // Safely access job title in deleted applications
        const companyName = application.companyName?.toLowerCase() || '';  // Safely access company name in deleted applications
        const searchLower = searchTerm.toLowerCase();
  
        return jobTitle.includes(searchLower) || companyName.includes(searchLower);
      });
    }
  
    if (filterStatus) {
      filtered = filtered.filter(application => application.status === filterStatus);
    }
  
    if (filterDateRange && filterDateRange.length === 2) {
      const [startDate, endDate] = filterDateRange;
      filtered = filtered.filter(application => {
        const deletedAt = new Date(application.deletedAt);
        return deletedAt >= startDate && deletedAt <= endDate;
      });
    }
  
    setFilteredDeletedApplications(filtered);
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

  const deletedColumns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Withdrawn On',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => reason || 'No reason provided',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="flex items-center space-x-4">
          <Input.Search
            placeholder="Search by job title or company"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Status"
            onChange={handleStatusFilter}
            style={{ width: 200 }}
            allowClear
          >
            <Select.Option value="received">Received</Select.Option>
            <Select.Option value="under review">Under Review</Select.Option>
            <Select.Option value="interview">Interview</Select.Option>
            <Select.Option value="hired">Hired</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
          <DatePicker.RangePicker
            style={{ width: 250 }}
            onChange={handleDateFilter}
            format="YYYY-MM-DD"
            allowClear
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredApplications}
        loading={loading}
        rowKey="id"
      />

      {deletedApplications.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8">Withdrawn Applications</h2>
          <Table
            columns={deletedColumns}
            dataSource={filteredDeletedApplications}
            rowKey="id"
          />
        </>
      )}

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
