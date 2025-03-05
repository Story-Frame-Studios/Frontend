import { useState, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import jobService from '../../services/jobService';
import { LoginContext } from '../ContextProvider/LoginContext';


const JobForm = () => {
  const { loginData } = useContext(LoginContext);

  const userId = loginData?.user?.id;
  
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(id);
      const jobData = response.data;
      form.setFieldsValue(jobData);
    } catch (error) {
      message.error('Failed to fetch job details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const valuesWithEmpId = {
      ...values,
      employerId: userId
    }
    setLoading(true);
    try {
      if (isEditing) {
        await jobService.updateJob(id, valuesWithEmpId);
        message.success('Job updated successfully');
      } else {
        await jobService.createJob(valuesWithEmpId);
        message.success('Job created successfully');
      }
      navigate('/jobs');
    } catch (error) {
      message.error(`Failed to ${isEditing ? 'update' : 'create'} job: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Job' : 'Post New Job'}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-2xl"
      >
        <Form.Item
          name="title"
          label="Job Title"
          rules={[{ required: true, message: 'Please enter job title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Job Description"
          rules={[{ required: true, message: 'Please enter job description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Requirements"
          rules={[{ required: true, message: 'Please enter job requirements' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="salary"
          label="Salary"
          rules={[{ required: true, message: 'Please enter salary' }]}
        >
          <InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: 'Please enter location' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="jobType"
          label="Job Type"
          rules={[{ required: true, message: 'Please select job type' }]}
        >
          <Select>
            <Select.Option value="Full-Time">Full-time</Select.Option>
            <Select.Option value="Part-Time">Part-time</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Update Job' : 'Create Job'}
          </Button>
          <Button 
            className="ml-2" 
            onClick={() => navigate('/jobs')}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default JobForm; 