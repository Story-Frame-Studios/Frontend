import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { baseUrl } from '../Utils/constants';
import Lottie from 'lottie-react';
import animationData from '../../assets/Job-animation.json';

export const ForgotPassword = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {

      
      
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password reset instructions have been sent to your email");
      } else {
        toast.error(result.error || "Failed to process password reset request");
      }
    } catch (err) {
      toast.error("An error occurred while processing your request");
      console.error(err);
    }
  };

  return (
    <>
    <div className="min-h-screen px-12 flex items-center justify-center primary-bg">
      <div className="md:w-2/3 w-full h-140 flex space-y-8 bg-white rounded-lg shadow-md">
        <div className="md:w-1/2 w-full flex flex-col justify-center h-full p-8 ">
          <h3 className="mt-6 font-normal secondary-text text-3xl">
            Hello,
          </h3>
          <h1 className='text-5xl font-bold secondary-text'>
            Reset Password!
          </h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md space-y-4">
              <div className="relative w-full">
                {/* Left Side Bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 transition-all ${isEmailFocused ? "primary-bg" : "bg-transparent"
                    }`}
                ></div>

                {/* Input Field Container */}
                <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                  {/* Floating Label */}
                  <label
                    className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isEmailFocused ? "text-xs -top-2 text-blue-500" : "text-sm"
                      }`}
                  >
                    Email Address
                  </label>

                  {/* Input Field */}
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
                    placeholder=""
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />

                </div>
              </div>
            </div>

            <div>

              <button type="submit"
                disabled={isSubmitting}
                className='my-4 px-6 py-2 rounded-l text-s font-semibold border-2 transition-all duration-300 ease-in-out text-white outline-blue-700 bg-blue-700 hover:bg-white hover:text-black hover:outline-blue-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300'
              >Submit</button>

        
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