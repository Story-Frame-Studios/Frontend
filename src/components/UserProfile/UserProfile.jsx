import { useState, useContext } from 'react';
import { LoginContext } from '../ContextProvider/LoginContext';
import { toast } from 'react-toastify';

export const UserProfile = () => {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: loginData.user?.firstName || '',
    lastName: loginData.user?.lastName || '',
    email: loginData.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Only letters and spaces are allowed';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'currentPassword':
        if (value && value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      case 'newPassword':
        if (value && value.length < 6) {
          error = 'New password must be at least 6 characters';
        }
        break;

      case 'confirmPassword':
        if (value && value !== formData.newPassword) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Validate only profile fields
    const profileFields = ['firstName', 'lastName', 'email'];
    const profileErrors = {};
    profileFields.forEach(field => {
      profileErrors[field] = validateField(field, formData[field]);
    });
    
    if (Object.values(profileErrors).some(error => error !== '')) {
      setErrors(prev => ({ ...prev, ...profileErrors }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginData({
          ...loginData,
          user: {
            ...loginData.user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          },
        });
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate password fields
    const passwordFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    const passwordErrors = {};
    passwordFields.forEach(field => {
      passwordErrors[field] = validateField(field, formData[field]);
    });

    if (Object.values(passwordErrors).some(error => error !== '')) {
      setErrors(prev => ({ ...prev, ...passwordErrors }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.currentPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}; 