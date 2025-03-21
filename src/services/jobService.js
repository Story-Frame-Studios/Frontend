// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';
// Import mockJobs as fallback in case API calls fail
import { mockJobs } from './mockData';

// const API_BASE_URL = process.env.API_BASE_URL;
// router.get('/all-jobs', getJobs); 
// router.post('/post-job', addJob); 
// router.get('/getJobDetails/:id', getJob); 
// router.delete('/delete-job/:id', deleteJob); 
// router.put('/update-job/:id', updateJob);


// eslint-disable-next-line no-unused-vars
const jobPostingRoute = `${baseUrl}/jobPosting`;

const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${jobPostingRoute}/all-jobs`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },
  getJobsByEmployerId: async (employerId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${jobPostingRoute}/getJobsByEmployerId/${employerId}`);
      return {
        data: response.data.jobs
      };
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },

  // Get single job by ID
  getJobDetails: async (jobId) => {
    try {
      // Real implementation with axios
      const response = await axios.get(`${jobPostingRoute}/getJobDetails/${jobId}`);      
      return response.data;
    } catch (error) {
      console.error('Error fetching job details from API, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      const job = mockJobs.find(job => job.jobId === jobId);
      return {
        data: job
      };
    }
  },

  // Create new job
  createJob: async (jobData) => {
    try {
      // Real implementation with axios
      const response = await axios.post(`${jobPostingRoute}/post-job`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    try {
      // Real implementation with axios
      const response = await axios.put(`${jobPostingRoute}/update-job`, {
        jobId,
        ...jobData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      // Real implementation with axios
      const response = await axios.delete(`${jobPostingRoute}/delete-job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getDeletedJobsByEmployerId: async (employerId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${jobPostingRoute}/getDeletedJobPostings/${employerId}`);
      return {
        data: response.data.deletedJobPosting
      };
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },
};

export default jobService; 