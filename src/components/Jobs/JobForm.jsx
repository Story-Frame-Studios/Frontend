import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const JobForm = () => {
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
      // Simulate API call
      const jobData = {
        id: '1',
        title: 'Senior React Developer',
        description: 'We are looking for a senior React developer...',
        requirements: '5+ years of experience with React...',
        salary: 120000,
        location: 'New York',
        jobType: 'Full-time',
        status: 'active',
      };
      form.setFieldsValue(jobData);
    } catch (error) {
      message.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      console.log('Form values:', values);
      message.success(`Job ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/jobs');
    } catch (error) {
      message.error(`Failed to ${isEditing ? 'update' : 'create'} job`);
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
          name="description"
          label="Job Description"
          rules={[{ required: true, message: 'Please enter job description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Requirements"
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
            <Select.Option value="Full-time">Full-time</Select.Option>
            <Select.Option value="Part-time">Part-time</Select.Option>
            <Select.Option value="Contract">Contract</Select.Option>
            <Select.Option value="Internship">Internship</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="closed">Closed</Select.Option>
            <Select.Option value="draft">Draft</Select.Option>
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