// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';
import { LoginContext } from "../components/ContextProvider/LoginContext";

// eslint-disable-next-line no-unused-vars
const applicationRoute = `${baseUrl}/application`;


const applicationService = {

  // Get all applications for a candidate
  // Get all applications for a candidate
  getCandidateApplications: async (candidateId) => {
    const response = await axios.get(`${applicationRoute}/getApplicationsByCandidateId/${candidateId}`);

    return response.data;
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
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
      if ((key === "resume") && applicationData[key] instanceof File) {
        formData.append("resume", applicationData[key]);
      } else if (key === "coverLetter" && applicationData[key] instanceof File) {
        formData.append("coverLetter", applicationData[key]);
      } else {
        // Convert non-string values to strings (e.g., objects, arrays)
        formData.append(key, applicationData[key] instanceof Object ? JSON.stringify(applicationData[key]) : applicationData[key]);
      }
    });
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
  updateApplicationStatus: async (employerId, applicationId, newStatus) => {
    const response = await axios.post(`${applicationRoute}/changeApplicationStatus/${employerId}/${applicationId}`, { status: newStatus });
    return response.data;
  },
  // Delete/withdraw application
  deleteApplication: async (applicationId) => {
    const response = await axios.delete(`${applicationRoute}/deleteApplication/${applicationId}`);
    return response.data;
  },
  getApplicationNumber: async (employerId) => {
    const response = await axios.get(`${applicationRoute}/getApplicationsByEmployerId/${employerId}`);
    return response.data;
  },

  getApplicantsForEmployer: async (employerId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${applicationRoute}/getApplicantsForEmployer/${employerId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },

  getDeletedApplications: async (candidateId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${applicationRoute}/getDeletedApplications/${candidateId}`);

      return {
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },
  getDeletedApplicationsForEmployer: async (employerId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${applicationRoute}/getDeletedApplicationsForEmployer/${employerId}`);

      return {
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching jobs from AP  I, falling back to mock data:', error);
      // Fallback to mock data if API call fails
      return {
        data: mockJobs
      };
    }
  },
  getApplicationsByEmployerId: async (employerId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${applicationRoute}/getApplicationsByEmployerId/${employerId}`);

      return response.data
    } catch (error) {
      console.error('Error fetching jobs from API', error);
    }
  },
  getApplicationDetailForEmployer: async (employerId, applicationId) => {
    try {
      // Real implementation with axios    
      const response = await axios.get(`${applicationRoute}/getApplicationDetailForEmployer/${employerId}/${applicationId}`);

      return response.data
    } catch (error) {
      console.error('Error fetching jobs from API', error);
    }
  }
};
export default applicationService; 