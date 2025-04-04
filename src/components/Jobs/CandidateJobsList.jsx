import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Pagination, Spin, Empty, Tag, message, Select, Input, Slider, Divider } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const { Meta } = Card;
const { Option } = Select;

const CandidateJobsList = () => {
  const { loginData } = useContext(LoginContext);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [applicationStatus, setApplicationStatus] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  // Filter and search states
  const [jobType, setJobType] = useState('All');
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Set initial filter values from URL
    const typeParam = params.get('jobType');
    const minSalaryParam = params.get('minSalary');
    const maxSalaryParam = params.get('maxSalary');
    const searchParam = params.get('search');
    const pageParam = params.get('page');
    const pageSizeParam = params.get('pageSize');

    if (typeParam) setJobType(typeParam);
    if (minSalaryParam && maxSalaryParam) {
      setSalaryRange([parseInt(minSalaryParam), parseInt(maxSalaryParam)]);
    }
    if (searchParam) setSearchQuery(searchParam);
    if (pageParam) setCurrentPage(parseInt(pageParam));
    if (pageSizeParam) setPageSize(parseInt(pageSizeParam));
  }, [location.search]);

  // Fetch jobs on initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (allJobs.length > 0) {
      const filteredResults = applyFiltersAndSearch();
      setFilteredJobs(filteredResults);
      setTotalJobs(filteredResults.length);
    }
  }, [allJobs, jobType, salaryRange, searchQuery]);

  // Apply pagination when filtered jobs or pagination settings change
  useEffect(() => {
    if (filteredJobs.length > 0 || filteredJobs.length === 0) {
      const paginatedJobs = applyPagination();
      setDisplayedJobs(paginatedJobs);
    }
  }, [filteredJobs, currentPage, pageSize]);

  // Check application status when displayed jobs change
  useEffect(() => {
    if (loginData?.user?.id && displayedJobs.length > 0) {
      const jobIds = displayedJobs.map(job => job.jobId).join(','); // Create a unique key for the current jobs
      checkApplicationStatus();
    }
  }, [displayedJobs.map(job => job.jobId).join(','), loginData?.user?.id]);

  // Update URL with current filter state
  useEffect(() => {
    const params = new URLSearchParams();

    if (jobType !== 'All') params.set('jobType', jobType);
    if (salaryRange[0] > 0) params.set('minSalary', salaryRange[0]);
    if (salaryRange[1] < 200000) params.set('maxSalary', salaryRange[1]);
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage !== 1) params.set('page', currentPage);
    if (pageSize !== 6) params.set('pageSize', pageSize);

    const newSearch = params.toString();
    if (location.search !== `?${newSearch}`) {
      navigate({ search: newSearch ? `?${newSearch}` : '' }, { replace: true });
    }
  }, [jobType, salaryRange, searchQuery, currentPage, pageSize, navigate, location.search]);

  const fetchJobs = async () => {
    setLoading(true);
    const key = "loading";

    // Show loading message
    messageApi.open({ key, type: "loading", content: "Loading Jobs data For You..." });

    // Ensure loading message appears before API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await jobService.getAllJobs();
      console.log(response);

      const jobs = response.data || [];
      setAllJobs(jobs);

      // Initial filtering and pagination
      const initialFiltered = applyFiltersAndSearch(jobs);
      setFilteredJobs(initialFiltered);
      setTotalJobs(initialFiltered.length);

      const initialPaginated = applyPagination(initialFiltered);
      setDisplayedJobs(initialPaginated);

      // Update message to success
      messageApi.open({ key, type: 'success', content: 'Jobs loaded successfully!', duration: 2 });
    } catch (error) {
      // Update message to error
      messageApi.open({ key, type: 'error', content: 'Failed to load jobs: ' + error.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = (jobs = allJobs) => {
    let result = [...jobs];
    let filtersApplied = false;

    // Apply job type filter
    if (jobType !== 'All') {
      result = result.filter(job => job.jobType === jobType);
      filtersApplied = true;
    }

    // Apply salary range filter
    if (salaryRange[0] > 0 || salaryRange[1] < 200000) {
      result = result.filter(job => {
        // Handle salary range format "min-max"
        if (typeof job.salary === 'string' && job.salary.includes('-')) {
          const [minSalary, maxSalary] = job.salary.split('-').map(s => parseInt(s.trim()));

          // Check if either min or max salary falls within filter range
          return (minSalary >= salaryRange[0] && minSalary <= salaryRange[1]) ||
            (maxSalary >= salaryRange[0] && maxSalary <= salaryRange[1]) ||
            (minSalary <= salaryRange[0] && maxSalary >= salaryRange[1]);
        }

        // Handle single number format
        const salary = typeof job.salary === 'string'
          ? parseInt(job.salary.replace(/[^0-9]/g, ''))
          : job.salary;

        // Include jobs with invalid salary format
        if (isNaN(salary)) {
          return true;
        }

        return salary >= salaryRange[0] && salary <= salaryRange[1];
      });
      filtersApplied = true;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        (job.title && job.title.toLowerCase().includes(query)) ||
        (job.companyName && job.companyName.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        (job.description && job.description.toLowerCase().includes(query))
      );
      filtersApplied = true;
    }

    // Only reset to first page when filters are actually applied
    if (filtersApplied) {
      setCurrentPage(1);
    }

    return result;
  };

  const applyPagination = (jobs = filteredJobs) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return jobs.slice(startIndex, endIndex);
  };

  const checkApplicationStatus = async () => {
    if (!loginData?.user?.id) return;

    const candidateId = loginData.user.id;
    const statusMap = {};

    try {
      // Check application status for each job
      for (const job of displayedJobs) {
        const response = await applicationService.checkApplicationExists(job.jobId, candidateId);
        console.log(response);

        // Store both the status and the applicationId
        statusMap[job.jobId] = {
          hasApplied: response.success,
          applicationId: response.applicationId, // Assuming the API returns applicationId
        };
      }

      setApplicationStatus(statusMap);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleJobTypeChange = (value) => {
    setJobType(value);
  };

  const handleSalaryRangeChange = (value) => {
    setSalaryRange(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const filteredResults = applyFiltersAndSearch();
    setFilteredJobs(filteredResults);
    setTotalJobs(filteredResults.length);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatSalary = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const handleCardClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-6">Available Job Opportunities</h1>

      {/* Search Bar - Top Section */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <div className="mb-2">Search Jobs</div>
        <Input
          placeholder="Search by title, company, location..."
          value={searchQuery}
          onChange={handleSearchChange}
          onPressEnter={handleSearch}
          size="large"
          suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
        />
      </div>

      {/* Main Content - Two Column Layout */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Filters */}
        <Col xs={24} md={8} lg={6}>
          <div className="bg-white p-4 rounded shadow sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <Button
                size="small"
                onClick={() => {
                  setJobType('All');
                  setSalaryRange([0, 200000]);
                  setSearchQuery('');
                }}
                disabled={jobType === 'All' && salaryRange[0] === 0 && salaryRange[1] === 200000 && !searchQuery}
              >
                Clear All
              </Button>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* Job Type Filter */}
            <div className="mb-6">
              <div className="font-medium mb-2">Job Type</div>
              <Select
                style={{ width: '100%' }}
                value={jobType}
                onChange={handleJobTypeChange}
              >
                <Option value="All">All Types</Option>
                <Option value="Full-Time">Full-Time</Option>
                <Option value="Part-Time">Part-Time</Option>
              </Select>
            </div>

            {/* Salary Range Filter */}
            <div className="mb-6">
              <div className="font-medium mb-2">Salary Range</div>
              <Slider
                range
                min={0}
                max={200000}
                step={1000}
                value={salaryRange}
                onChange={handleSalaryRangeChange}
                tipFormatter={formatSalary}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{formatSalary(salaryRange[0])}</span>
                <span>{formatSalary(salaryRange[1])}</span>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* Filter Status */}
            <div className="text-sm text-gray-600">
              {jobType !== 'All' || salaryRange[0] > 0 || salaryRange[1] < 200000 || searchQuery ? (
                <><FilterOutlined /> Filters Applied: {totalJobs} results found</>
              ) : (
                <span>Showing all {totalJobs} jobs</span>
              )}
            </div>
          </div>
        </Col>

        {/* Right Column - Job Listings */}
        <Col xs={24} md={16} lg={18}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : displayedJobs.length === 0 ? (
            <Empty description="No jobs match your search criteria" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {displayedJobs.map(job => (
                  <Col xs={24} sm={12} lg={8} key={job.jobId}>
                    <Card
                      hoverable
                      className="h-full flex flex-col"
                      onClick={() => handleCardClick(job.jobId)}
                      actions={[
                        applicationStatus[job.jobId]?.hasApplied ? (
                            <Button
                              type="default"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop event propagation
                                navigate(`/applications/${applicationStatus[job.jobId].applicationId}`);
                              }}
                            >
                              View Application
                            </Button> 
                        ) : (
                            <Button
                              type="primary"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop event propagation
                                navigate(`/job/${job.jobId}/application/new`);
                              }}
                            >
                              Apply Now
                            </Button>
                        )
                      ]}
                    >
                      <Meta
                        title={job.title}
                        description={
                          <div>
                            <p className="text-gray-500 mb-2">{job.companyName} • {job.location}</p>
                            <p className="mb-2">
                              <Tag color="blue">{job.jobType}</Tag>
                              <Tag color="green">${typeof job.salary === 'number' ? job.salary.toLocaleString() : job.salary || 'Not specified'}</Tag>
                            </p>
                            <p className="text-gray-700">{truncateText(job.description)}</p>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalJobs}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['6', '12', '24']}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CandidateJobsList;