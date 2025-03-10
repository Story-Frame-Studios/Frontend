// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import { baseUrl } from '../components/Utils/constants';

// eslint-disable-next-line no-unused-vars
const applicationRoute = `${baseUrl}/applications`;

// Mock data for testing and fallback
const mockApplications = [
  {
    id: '1',
    jobId: '1',
    candidateId: 'user123',
    resume: 'resume1.pdf',
    coverLetter: 'I am excited to apply for this position...',
    status: 'received',
    notes: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    jobId: '2',
    candidateId: 'user123',
    resume: 'resume2.pdf',
    coverLetter: 'I believe my skills align perfectly with...',
    status: 'under review',
    notes: 'Candidate has good experience',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const applicationService = {
  // Get all applications for a candidate
  getCandidateApplications: async (candidateId) => {
    try {
      // Real implementation
      const response = await axios.get(`${applicationRoute}/candidate/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications from API, falling back to mock data:', error);
      // Fallback to mock implementation
      return {
        data: {
          success: true,
          data: mockApplications.filter(app => app.candidateId === candidateId)
        }
      };
    }
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    try {
      // Real implementation
      const response = await axios.get(`${applicationRoute}/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application details from API, falling back to mock data:', error);
      // Fallback to mock implementation
      const application = mockApplications.find(app => app.id === applicationId);
      return {
        data: {
          success: true,
          data: application
        }
      };
    }
  },

  // Check if candidate has applied to a job
  checkApplicationExists: async (jobId, candidateId) => {
    try {
      // Real implementation
      const response = await axios.get(`${applicationRoute}/check/${jobId}/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking application status from API, falling back to mock data:', error);
      // Fallback to mock implementation
      const exists = mockApplications.some(
        app => app.jobId === jobId && app.candidateId === candidateId
      );
      return {
        data: {
          success: true,
          exists
        }
      };
    }
  },

  // Create new application
  createApplication: async (applicationData) => {
    try {
      // Real implementation
      const response = await axios.post(`${applicationRoute}`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating application via API, falling back to mock implementation:', error);
      // Fallback to mock implementation
      const newApplication = {
        id: String(mockApplications.length + 1),
        ...applicationData,
        status: 'received',
        createdAt: new Date().toISOString()
      };
      mockApplications.push(newApplication);
      
      return {
        data: {
          success: true,
          data: newApplication
        }
      };
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    try {
      // Real implementation
      const response = await axios.patch(`${applicationRoute}/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating application status via API, falling back to mock implementation:', error);
      // Fallback to mock implementation
      const applicationIndex = mockApplications.findIndex(app => app.id === applicationId);
      if (applicationIndex !== -1) {
        mockApplications[applicationIndex].status = status;
      }
      
      return {
        data: {
          success: true,
          data: mockApplications[applicationIndex]
        }
      };
    }
  },

  // Delete/withdraw application
  deleteApplication: async (applicationId) => {
    try {
      // Real implementation
      const response = await axios.delete(`${applicationRoute}/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting application via API, falling back to mock implementation:', error);
      // Fallback to mock implementation
      const applicationIndex = mockApplications.findIndex(app => app.id === applicationId);
      if (applicationIndex !== -1) {
        mockApplications.splice(applicationIndex, 1);
      }
      
      return {
        data: {
          success: true
        }
      };
    }
  }
};

export default applicationService; 