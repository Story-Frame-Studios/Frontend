import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Card, Spin, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { LoginContext } from '../ContextProvider/LoginContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginData } = useContext(LoginContext);
  const [form] = Form.useForm();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [coverLetterType, setCoverLetterType] = useState('text');
  const [coverLetterFile, setCoverLetterFile] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!loginData?.token || loginData?.user?.role !== 'candidate') {
      messageApi.error('You must be logged in as a candidate to apply for jobs');
      navigate('/login');
      return;
    }
    fetchJobDetails();
  }, [id, loginData, navigate]); // Removed messageApi from dependencies

  const fetchJobDetails = async () => {
    setLoading(true);
    const hideLoading = messageApi.loading('Loading job details...', 0);
    try {
      const response = await jobService.getJobDetails(id);
      setJob(response.data);

      const checkResponse = await applicationService.checkApplicationExists(id, loginData.user.id);
      if (checkResponse.data.exists) {
        messageApi.info('You have already applied for this job');
        navigate('/myApplications');
        return;
      }
    } catch (error) {
      messageApi.error('Failed to fetch job details: ' + error.message);
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      messageApi.error('Please upload your resume');
      return;
    }

    if (coverLetterType === 'file' && coverLetterFile.length === 0) {
      messageApi.error('Please upload your cover letter');
      return;
    }

    setSubmitting(true);
    const hideLoading = messageApi.loading('Submitting application...', 0);
    try {
      const applicationData = {
        jobId: id,
        candidateId: loginData.user.id,
        resume: fileList[0],
        coverLetter: coverLetterType === "text" ? values.coverLetter : coverLetterFile[0],
        status: 'received',
        notes: '',
        createdAt: new Date().toISOString(),
      };

      await applicationService.createApplication(applicationData);
      hideLoading();
      messageApi.success('Application submitted successfully');
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/myApplications');
    } catch (error) {
      hideLoading();
      messageApi.error(error.response?.data?.message || 'Failed to submit application: ' + (error.message || 'Please try again.'));
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
      const isValidType = ['.pdf', '.doc', '.docx'].includes(file.name.slice(-4).toLowerCase());
      if (!isValidType) {
        messageApi.error('You can only upload PDF or Word documents!');
        return Upload.LIST_IGNORE;
      }
      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        messageApi.error('Resume must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => setFileList([]),
  };

  const coverLetterUploadProps = {
    name: "coverLetter",
    multiple: false,
    accept: ".pdf,.doc,.docx",
    fileList: coverLetterFile,
    beforeUpload: (file) => {
      const isValidType = ['.pdf', '.doc', '.docx'].includes(file.name.slice(-4).toLowerCase());
      if (!isValidType) {
        messageApi.error("You can only upload PDF or Word documents!");
        return Upload.LIST_IGNORE;
      }
      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        messageApi.error("Cover letter must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      setCoverLetterFile([file]);
      return false;
    },
    onRemove: () => setCoverLetterFile([]),
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
      {contextHolder}
      <Card title={<h1 className="text-2xl font-bold">Apply for: {job.title}</h1>}>
        <div className="mb-4">
          <p className="text-lg">Company: {job.companyName}</p>
          <p className="text-gray-600">Location: {job.location}</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={submitting}>
          <Form.Item name="resume" label="Upload Resume" rules={[{ required: true, message: 'Please upload your resume' }]}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for PDF, DOC, DOCX. Max file size: 5MB.</p>
            </Dragger>
          </Form.Item>

          <Form.Item name="coverLetterType" label="Cover Letter Type">
            <Select defaultValue="text" onChange={(value) => {
              setCoverLetterType(value);
              setCoverLetterFile([]); // Reset coverLetterFile when type changes
            }}>
              <Option value="text">Write Cover Letter</Option>
              <Option value="file">Upload Cover Letter</Option>
            </Select>
          </Form.Item>

          {coverLetterType === 'text' ? (
            <Form.Item name="coverLetter" label="Cover Letter" rules={[{ required: true, message: 'Please write a cover letter' }]}>
              <TextArea rows={8} placeholder="Explain why you're a good fit for this position..." />
            </Form.Item>
          ) : (
            <Form.Item name="coverLetterFile" label="Upload Cover Letter" rules={[{ required: true, message: 'Please upload your cover letter' }]}>
              <Dragger {...coverLetterUploadProps}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for PDF, DOC, DOCX. Max file size: 5MB.</p>
              </Dragger>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} size="large" block>Submit Application</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;