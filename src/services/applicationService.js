// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';

// eslint-disable-next-line no-unused-vars
const applicationRoute = `${baseUrl}/application`;


const applicationService = {
  // Get all applications for a candidate
  // Get all applications for a candidate
  getCandidateApplications: async (candidateId) => {
    const response = await axios.get(`${applicationRoute}/getApplicationsByCandidateId`, {
      headers: { 'Content-Type': 'application/json' }, // Set headers explicitly
      data: { candidateId },  // Force body in GET request
    });

    return response.data;
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    const response = await axios.get(`${applicationRoute}/${applicationId}`);
    return response.data;
  },

  // Check if candidate has applied to a job
  checkApplicationExists: async (jobId, candidateId) => {
    const response = await axios.get(`${applicationRoute}/check/${jobId}/${candidateId}`);
    return response.data;
  },

  // Create new application
  createApplication: async (applicationData) => {
    const formData = new FormData();
    
    // Add all application data to FormData
    Object.keys(applicationData).forEach(key => {
      // If it's a file object, add it directly
      if (key === 'resume' && applicationData[key] instanceof File) {
        formData.append('resume', applicationData[key]);
      } else {
        formData.append(key, applicationData[key]);
      }
    });
    
    const response = await axios.post(`${applicationRoute}/addApplication`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    const response = await axios.patch(`${applicationRoute}/${applicationId}/status`, { status });
    return response.data;
  },

  // Delete/withdraw application
  deleteApplication: async (applicationId) => {
    const response = await axios.delete(`${applicationRoute}/${applicationId}`);
    return response.data;
  }
};

export default applicationService; 