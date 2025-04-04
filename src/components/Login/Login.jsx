import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import { LoginContext } from '../ContextProvider/LoginContext';
import { baseUrl } from '../Utils/constants';
import { Eye, EyeOff } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '../../assets/Job-animation.json';
import { Button } from '../ui/button';

export const Login = () => {
  const { setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Use Ant Design's message API
  const [messageApi, contextHolder] = message.useMessage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();

      // Show loading message
      messageApi.open({
        key: "loading",
        type: 'loading',
        content: 'Logging in...',
      });

      if (result.success) {
        // Show success message and delay the navigation
        messageApi.open({
          key: "success",
          type: 'success',
          content: 'Login successful',
          duration: 2, // Duration of the success message
        });

        // Store the login data
        localStorage.setItem("usertoken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setLoginData({ token: result.token, user: result.user });

        // Delay the navigation after the success message
        await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for the success message to show fully
        navigate('/dashboard'); // Navigate after the delay
      } else {
        messageApi.open({
          key: "error",
          type: 'error',
          content: result.message || "Login failed",
          duration: 2,
        });
      }
    } catch (err) {
      messageApi.open({
        key: "error",
        type: 'error',
        content: "An error occurred during login",
        duration: 2,
      });
      console.error(err);
    }
  };

  return (
    <>
      {/* Render the contextHolder here to make it work */}
      {contextHolder}

      <div className="min-h-screen px-12 flex items-center justify-center primary-bg">
        <div className="md:w-2/3 w-full h-140 flex space-y-8 bg-white rounded-lg shadow-md">
          <div className="md:w-1/2 w-full flex flex-col justify-center h-full p-8 ">
            <h3 className="mt-6 font-normal secondary-text text-3xl">
              Hello,
            </h3>
            <h1 className='text-5xl font-bold secondary-text'>
              Welcome!
            </h1>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-md space-y-4">
                <div className="relative w-full">
                  <div
                    className={`absolute left-0 top-0 h-full w-1 transition-all ${isEmailFocused ? "primary-bg" : "bg-transparent"}`}
                  ></div>
                  <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                    <label
                      className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isEmailFocused ? "text-xs -top-2 text-blue-500" : "text-sm"}`}
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full bg-transparent focus:outline-none text-gray-900 pt-2"
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                    />
                  </div>
                  {errors.email && (
                    <div>
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    </div>
                  )}
                </div>

                <div className="relative w-full">
                  <div
                    className={`absolute left-0 top-0 h-full w-1 transition-all ${isPasswordFocused ? "primary-bg" : "bg-transparent"}`}
                  ></div>
                  <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                    <label
                      className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isPasswordFocused ? "text-xs -top-2 text-blue-500" : "text-sm"}`}
                    >
                      Password *
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className="w-full bg-transparent focus:outline-none text-gray-900 pt-2 pr-10"
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div>
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button size="lg" type="submit" variant="blue" disabled={isSubmitting}> Sign In </Button>
                <Button variant="blueOutline" size="lg">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </form>
          </div>
          <div className="md:w-1/2 w-full m-auto p-12 md:flex md:flex-col md:items-center hidden overflow-hidden">
            <Lottie animationData={animationData} />
          </div>
        </div>
      </div>
    </>
  );
};
