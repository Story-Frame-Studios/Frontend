import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Pagination, Spin, Empty, Tag, message } from 'antd';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const { Meta } = Card;

const CandidateJobsList = () => {
  const { loginData } = useContext(LoginContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [applicationStatus, setApplicationStatus] = useState({});

  useEffect(() => {
    fetchJobs();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (loginData?.user?.id && jobs.length > 0) {
      checkApplicationStatus();
    }
  }, [jobs, loginData]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs();
      const allJobs = response.data || [];
      
      // For pagination, we would normally use API pagination
      // For mock implementation, we'll do client-side pagination
      setTotalJobs(allJobs.length);
      
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setJobs(allJobs.slice(startIndex, endIndex));
    } catch (error) {
      message.error('Failed to fetch jobs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (!loginData?.user?.id) return;
    
    const candidateId = loginData.user.id;
    const statusMap = {};
    
    try {
      // Check application status for each job
      for (const job of jobs) {
        const response = await applicationService.checkApplicationExists(job.jobId, candidateId);
        statusMap[job.jobId] = response.data.exists;
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

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Job Opportunities</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : jobs.length === 0 ? (
        <Empty description="No jobs available at the moment" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {jobs.map(job => (
              <Col xs={24} sm={12} lg={8} key={job.jobId}>
                <Card
                  hoverable
                  className="h-full flex flex-col"
                  actions={[
                    applicationStatus[job.jobId] ? (
                      <Link to={`/applications/job/${job.jobId}`}>
                        <Button type="default">View Application</Button>
                      </Link>
                    ) : (
                      <Link to={`/job/${job.jobId}/application/new`}>
                        <Button type="primary">Apply Now</Button>
                      </Link>
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
                          <Tag color="green">${job.salary?.toLocaleString() || 'Not specified'}</Tag>
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
    </div>
  );
};

export default CandidateJobsList; 