import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Table, Button, Space, message, Modal, Typography, Card, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';

const { Title } = Typography;
const { Option } = Select;

const EmployerJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [deletedJobs, setDeletedJobs] = useState([]);
  const [filteredDeletedJobs, setFilteredDeletedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const { loginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobType, setFilterJobType] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState(""); // Initialize with empty string

  // Fetch jobs when component mounts or loginData changes
  useEffect(() => {
    if (loginData?.user?.id) {
      fetchJobs();
      fetchDeletedJobs();
    }
  }, [loginData]);

  // Apply filters whenever searchTerm, filterJobType, or selectedSalaryRange changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterJobType, selectedSalaryRange, jobs, deletedJobs]);

  const fetchJobs = async () => {
    setLoading(true);
    const key = "loading";
    messageApi.open({ key, type: "loading", content: "Loading Jobs data For You..." });
    await new Promise(resolve => setTimeout(resolve, 750));

    try {
      const response = await jobService.getJobsByEmployerId(loginData?.user?.id);
      if (response.data) {
        setJobs(response.data);
        setFilteredJobs(response.data);
      }
      messageApi.open({ key, type: 'success', content: 'Jobs loaded successfully!', duration: 2 });
    } catch (error) {
      messageApi.open({ key, type: 'error', content: 'Failed to load jobs: ' + error.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedJobs = async () => {
    setLoading(true);
    const key = "loading";
    messageApi.open({ key, type: "loading", content: "Loading Jobs data For You..." });
    await new Promise(resolve => setTimeout(resolve, 1300));

    try {
      const response = await jobService.getDeletedJobsByEmployerId(loginData?.user?.id);
      if (response?.data) {
        setDeletedJobs(response.data);
        setFilteredDeletedJobs(response.data);
      }
      messageApi.open({ key, type: 'success', content: 'Deleted Jobs loaded successfully!', duration: 2 });
    } catch (error) {
      messageApi.open({ key, type: 'error', content: 'Failed to load deleted jobs: ' + error.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log("innnnnn", selectedSalaryRange)
    // Filter active jobs
    let filteredActiveJobs = jobs;
    if (searchTerm) {
      filteredActiveJobs = filteredActiveJobs.filter(job => {
        const jobTitle = job.title?.toLowerCase() || '';
        const companyName = job.companyName?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        return jobTitle.includes(searchLower) || companyName.includes(searchLower);
      });
    }
    if (filterJobType) {
      filteredActiveJobs = filteredActiveJobs.filter(job => job.jobType === filterJobType);
    }
    // Filter by salary range
    if (selectedSalaryRange) {
      const [minSalary, maxSalary] = selectedSalaryRange;
      filteredActiveJobs = filteredActiveJobs.filter(job => {
        const salary = parseFloat(job.salary) || 0; // Convert salary to a number
        return salary >= minSalary && salary <= maxSalary;
      });
    }
    setFilteredJobs(filteredActiveJobs);

    // Filter deleted jobs
    let filteredDeleted = deletedJobs;
    if (searchTerm) {
      filteredDeleted = filteredDeleted.filter(job => {
        const jobTitle = job.title?.toLowerCase() || '';
        const companyName = job.companyName?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        return jobTitle.includes(searchLower) || companyName.includes(searchLower);
      });
    }
    if (filterJobType) {
      filteredDeleted = filteredDeleted.filter(job => job.jobType === filterJobType);
    }
    // Filter by salary range for deleted jobs
    if (selectedSalaryRange) {
      const [minSalary, maxSalary] = selectedSalaryRange;
      filteredDeleted = filteredDeleted.filter(job => {
        const salary = parseFloat(job.salary) || 0; // Convert salary to a number
        return salary >= minSalary && salary <= maxSalary;
      });
    }
    setFilteredDeletedJobs(filteredDeleted);
  };

  const showDeleteConfirm = (job) => {
    setJobToDelete(job);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      await jobService.deleteJob(jobToDelete.jobId);
      message.success('Job deleted successfully');
      fetchJobs();
      fetchDeletedJobs();
    } catch (error) {
      message.error('Failed to delete job: ' + error.message);
    } finally {
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setJobToDelete(null);
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
  };

  const handleJobTypeFilter = (value) => {
    setFilterJobType(value);
  };

  const handleSalaryRangeChange = (value) => {
    console.log(value, "clalall")
    setSelectedSalaryRange(value === undefined ? "" : value); // Set to empty string if value is undefined
  };

  const jobColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => `$${salary?.toLocaleString() || 'Not specified'}`
    },
    { title: 'Job Type', dataIndex: 'jobType', key: 'jobType' },
    {
      title: 'Applications',
      dataIndex: 'applications',
      key: 'applications',
      render: (applications) => applications?.length || 0
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
          <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(record)} />
        </Space>
      ),
    },
  ];

  const deletedJobColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Company', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Deleted On',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      render: (date) => formatDate(date)
    }
  ];

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <div className="flex justify-between mb-4">
        <Title level={2}>Job Listings</Title>
        <Link to="/jobs/new">
          <Button type="primary">Post New Job</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input.Search
          placeholder="Search jobs by title or company"
          onChange={(e) => handleSearch(e.target.value)}  // Live search
          enterButton
          allowClear
          style={{ width: 300, marginRight: 16 }}
        />
        <Select
          placeholder="Filter by job type"
          value={filterJobType}
          onChange={handleJobTypeFilter}
          style={{ width: 150, marginRight: 16 }}
        >
          <Option value="">All Job Types</Option>
          <Option value="Full-Time">Full-Time</Option>
          <Option value="Part-Time">Part-Time</Option>
        </Select>
        <Select
          placeholder="Filter by salary range"
          value={selectedSalaryRange ? JSON.stringify(selectedSalaryRange) : ""}
          onChange={(value) => handleSalaryRangeChange(value ? JSON.parse(value) : null)}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="">All Salaries</Option>
          <Option value={JSON.stringify([0, 50000])}>0 - 50000</Option>
          <Option value={JSON.stringify([50000, 100000])}>50000 - 100000</Option>
          <Option value={JSON.stringify([100000, 150000])}>100000 - 150000</Option>
          <Option value={JSON.stringify([150000, Infinity])}>150000+</Option>
        </Select>

      </div>

      <Card className="mb-6 shadow-md">
        <Table columns={jobColumns} dataSource={filteredJobs} loading={loading} rowKey="jobId" />
      </Card>

      {filteredDeletedJobs.length > 0 && (
        <Card className="shadow-md">
          <Title level={3}>Deleted Job Postings</Title>
          <Table columns={deletedJobColumns} dataSource={filteredDeletedJobs} rowKey="jobId" />
        </Card>
      )}

      <Modal
        title="Delete Job"
        open={!!jobToDelete}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this job posting?</p>
      </Modal>
    </div>
  );
};

export default EmployerJobList;
