import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Card, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const { TextArea } = Input;
const { Dragger } = Upload;

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginData } = useContext(LoginContext);
  const [form] = Form.useForm();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!loginData?.token || loginData?.user?.role !== 'candidate') {
      message.error('You must be logged in as a candidate to apply for jobs');
      navigate('/login');
      return;
    }

    fetchJobDetails();
  }, [id, loginData, navigate]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
      
      // Check if already applied
      const checkResponse = await applicationService.checkApplicationExists(
        id, 
        loginData.user.id
      );
      
      if (checkResponse.data.exists) {
        message.info('You have already applied for this job');
        navigate('/applications');
        return;
      }
    } catch (error) {
      message.error('Failed to fetch job details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error('Please upload your resume');
      return;
    }

    setSubmitting(true);
    try {
      // In a real application, we would upload the file to a server
      // and get back a URL. For this mock, we'll just use the file name.
      const resumeUrl = fileList[0].name;
      
      const applicationData = {
        jobId: id,
        candidateId: loginData.user.id,
        resume: resumeUrl,
        coverLetter: values.coverLetter,
        status: 'received',
        notes: '',
        createdAt: new Date().toISOString()
      };
      
      await applicationService.createApplication(applicationData);
      
      message.success('Application submitted successfully');
      navigate('/applications');
    } catch (error) {
      message.error('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.doc,.docx',
    fileList,
    beforeUpload: (file) => {
      // Check file type
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type);
      
      if (!isValidType) {
        message.error('You can only upload PDF or Word documents!');
        return Upload.LIST_IGNORE;
      }
      
      // Check file size (limit to 5MB)
      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        message.error('Resume must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container mx-auto p-4">
      <Card title={<h1 className="text-2xl font-bold">Apply for: {job.title}</h1>}>
        <div className="mb-4">
          <p className="text-lg">Company: {job.companyName}</p>
          <p className="text-gray-600">Location: {job.location}</p>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting}
        >
          <Form.Item
            name="coverLetter"
            label="Cover Letter"
            rules={[
              { required: true, message: 'Please write a cover letter' },
              { min: 100, message: 'Cover letter should be at least 100 characters' }
            ]}
          >
            <TextArea 
              rows={8} 
              placeholder="Explain why you're a good fit for this position..."
            />
          </Form.Item>
          
          <Form.Item
            name="resume"
            label="Resume"
            rules={[{ required: true, message: 'Please upload your resume' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, DOCX. Max file size: 5MB.
              </p>
            </Dragger>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              size="large"
              block
            >
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm; 