// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';

// eslint-disable-next-line no-unused-vars
const applicationRoute = `${baseUrl}/application`;


const applicationService = {
  // Get all applications for a candidate
  // Get all applications for a candidate
  getCandidateApplications: async (candidateId) => {
    const response = await axios.post(`${applicationRoute}/getApplicationsByCandidateId`, {
      headers: { 'Content-Type': 'application/json' }, // Set headers explicitly
      candidateId: candidateId ,  // Force body in GET request
    });

    return response.data;
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    console.log(applicationId)
    const response = await axios.get(`${applicationRoute}/getApplicationByApplicationId/${applicationId}`);
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
    
    // Append all fields to FormData
    Object.keys(applicationData).forEach((key) => {
      if (key === "resume" && applicationData[key] instanceof File) {
        formData.append("resume", applicationData[key]);
      } else {
        // Convert non-string values to strings (e.g., objects, arrays)
        formData.append(key, applicationData[key] instanceof Object ? JSON.stringify(applicationData[key]) : applicationData[key]);
      }
    });
    console.log(formData,"formData")
    try {
      const response = await axios.post(`${applicationRoute}/addApplication`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  },
  
  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    const response = await axios.patch(`${applicationRoute}/${applicationId}/status`, { status });
    return response.data;
  },

  // Delete/withdraw application
  deleteApplication: async (applicationId) => {
    const response = await axios.delete(`${applicationRoute}/deleteApplication/${applicationId}`);
    return response.data;
  }
};

export default applicationService; 