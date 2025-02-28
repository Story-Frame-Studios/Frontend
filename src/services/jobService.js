import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';

// const API_BASE_URL = process.env.API_BASE_URL;
// router.get('/all-jobs', getJobs); 
// router.post('/post-job', addJob); 
// router.get('/current-job/:id', getJob); 
// router.delete('/delete-job/:id', deleteJob); 
// router.put('/update-job/:id', updateJob);


const jobPostingRoute = `${baseUrl}/jobPosting`;



const jobService = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await axios.get(`${jobPostingRoute}/all-jobs`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single job by ID
  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`${jobPostingRoute}/current-job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new job
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${jobPostingRoute}/post-job`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    try {
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
      const response = await axios.delete(`${jobPostingRoute}/current-job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default jobService; 