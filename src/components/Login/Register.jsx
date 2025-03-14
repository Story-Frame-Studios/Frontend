// components/Login/Login.jsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginContext } from '../ContextProvider/LoginContext';
import { baseUrl } from '../Utils/constants';
import { Eye, EyeOff } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '../../assets/Job-animation.json';

export const Register = () => {

    // register page state
    const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
    const [isLastNameFocused, setIsLastNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { setLoginData } = useContext(LoginContext);
    const navigate = useNavigate();



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {

                setLoginData({ token: result.token, user: result.user });
                toast.success("Registration successful");
                navigate('/dashboard');
            } else {
                toast.error(result.error || "Registration failed");
            }

        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "An error occurred during registration");
        }
    };

    return (
        <>

            {/* Register Page */}

            <div className="min-h-screen px-12 py-12 flex items-center justify-center primary-bg">
                <div className="md:w-2/3 w-full  flex space-y-8 bg-white rounded-lg shadow-md">

                    {/* image half */}
                    <div className="md:w-1/2 w-full  m-auto p-12 md:flex md:flex-col md:items-center hidden overflow-hidden">
                        <Lottie animationData={animationData} />
                    </div>

                    {/* form half */}
                    <div className="md:w-1/2 w-full flex flex-col justify-center h-full p-8 ">
                        <h3 className="mt-6 font-normal secondary-text text-3xl">
                            Hello,
                        </h3>
                        <h1 className='text-5xl font-bold secondary-text'>
                            Create Account!
                        </h1>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

                            <div className="rounded-md space-y-4">

                                {/* first name and last name field */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className="relative">
                                        {/* Left Side Bar */}
                                        <div
                                            className={`absolute left-0 top-0 h-full w-1 transition-all ${isFirstNameFocused ? "primary-bg" : "bg-transparent"
                                                }`}
                                        ></div>

                                        {/* Input Field Container */}
                                        <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                                            {/* Floating Label */}
                                            <label
                                                className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isFirstNameFocused ? "text-xs -top-2 text-blue-500" : "text-sm"
                                                    }`}
                                            >
                                                First Name
                                            </label>

                                            {/* Input Field */}
                                            <input
                                                id="firstName"
                                                type="text"
                                                className="w-full bg-transparent focus:outline-none text-gray-900 pt-2"
                                                placeholder=""
                                                {...register("firstName", {
                                                    required: "First name is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "First name must be at least 2 characters"
                                                    }
                                                })}

                                                onFocus={() => setIsFirstNameFocused(true)}
                                                onBlur={() => setIsFirstNameFocused(false)}
                                            />

                                        </div>
                                    </div>
                                    <div className="relative">
                                        {/* Left Side Bar */}
                                        <div
                                            className={`absolute left-0 top-0 h-full w-1 transition-all ${isLastNameFocused ? "primary-bg" : "bg-transparent"
                                                }`}
                                        ></div>

                                        {/* Input Field Container */}
                                        <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                                            {/* Floating Label */}
                                            <label
                                                className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isLastNameFocused ? "text-xs -top-2 text-blue-500" : "text-sm"
                                                    }`}
                                            >
                                                Last Name
                                            </label>

                                            {/* Input Field */}
                                            <input
                                                id="lastName"
                                                type="text"
                                                className="w-full bg-transparent focus:outline-none text-gray-900 pt-2"
                                                placeholder=""
                                                {...register("lastName", {
                                                    required: "Last name is required",
                                                    minLength: {
                                                        value: 2,
                                                        message: "Last name must be at least 2 characters"
                                                    }
                                                })}
                                                onFocus={() => setIsLastNameFocused(true)}
                                                onBlur={() => setIsLastNameFocused(false)}
                                            />

                                        </div>
                                    </div>
                                </div>

                                {/* email id field */}
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
                                            className="w-full bg-transparent focus:outline-none text-gray-900 pt-2"
                                            placeholder=""
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            onFocus={() => setIsEmailFocused(true)}
                                            onBlur={() => setIsEmailFocused(false)}
                                        />

                                    </div>
                                </div>

                                {/* password and confirm password field */}
                                <div className="relative w-full">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-1 transition-all ${isPasswordFocused ? "primary-bg" : "bg-transparent"
                                            }`}
                                    ></div>

                                    {/* Input Field Container */}
                                    <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                                        {/* Floating Label */}
                                        <label
                                            className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isPasswordFocused ? "text-xs -top-2 text-blue-500" : "text-sm"
                                                }`}
                                        >
                                            Password
                                        </label>

                                        {/* Input Field */}
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="w-full bg-transparent focus:outline-none text-gray-900 pt-2 pr-10"
                                            placeholder=""
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters"
                                                },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                                                }
                                            })}
                                            onFocus={() => setIsPasswordFocused(true)}
                                            onBlur={() => setIsPasswordFocused(false)}
                                        />

                                        {/* Eye Icon for Toggling Password Visibility */}
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-full text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative w-full">
                                    <div
                                        className={`absolute left-0 top-0 h-full w-1 transition-all ${isConfirmPasswordFocused ? "primary-bg" : "bg-transparent"
                                            }`}
                                    ></div>

                                    {/* Input Field Container */}
                                    <div className="relative border border-gray-300 rounded-md px-3 pt-3 pb-2 focus-within:border-blue-500">
                                        {/* Floating Label */}
                                        <label
                                            className={`absolute left-3 top-2 text-gray-500 text-sm transition-all ${isConfirmPasswordFocused ? "text-xs -top-2 text-blue-500" : "text-sm"
                                                }`}
                                        >
                                            Confirm Password
                                        </label>

                                        {/* Input Field */}
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="w-full bg-transparent focus:outline-none text-gray-900 pt-2 pr-10"
                                            placeholder=""
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: value => value === watch('password') || "Passwords do not match"
                                            })}
                                            onFocus={() => setIsConfirmPasswordFocused(true)}
                                            onBlur={() => setIsConfirmPasswordFocused(false)}
                                        />
                                        

                                        {/* Eye Icon for Toggling Password Visibility */}
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-full text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                                    )}

                                {/* role field */}
                                <div className="relative w-full">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        {...register("role", {
                                            required: "Please select a role"
                                        })}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">Select a role</option>
                                        <option value="candidate">Candidate</option>
                                        <option value="employer">Employer</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                                    )}
                                </div>

                                <button type="submit"
                                    disabled={isSubmitting}
                                    className='my-4 px-6 py-2 rounded-l text-s font-semibold border-2 transition-all duration-300 ease-in-out text-white outline-blue-700 bg-blue-700 hover:bg-white hover:text-black hover:outline-blue-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300'
                                >Sign up</button>

                                <button
                                    className='my-4 px-6 py-2 rounded-l text-s font-semibold border-2 transition-all duration-300 ease-in-out text-blue-700 bg-white hover:bg-blue-700 hover:text-white hover:outline-blue-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300'
                                > <Link to="/login">
                                        Sign in
                                    </Link></button>
                            </div>


                        </form>
                    </div>

                </div>
            </div>

        </>

    );
};