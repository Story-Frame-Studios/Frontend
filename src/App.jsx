// App.js
import { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { LoginProvider, LoginContext } from './components/ContextProvider/LoginContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { ForgotPassword } from './components/Login/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Footer } from './components/Footer';
import { UserProfile } from './components/UserProfile/UserProfile';
import JobsList from './components/Jobs/EmployerJobsList';
import JobForm from './components/Jobs/JobForm';
import JobDetails from './components/Jobs/JobDetails';
import CandidateJobsList from './components/Jobs/CandidateJobsList';
import ApplicationForm from './components/Applications/ApplicationForm';
import ApplicationsList from './components/Applications/ApplicationsList';
import ApplicationDetails from './components/Applications/ApplicationDetails';
import PageNotFound from './pages/PageNotFound';
import Applicants from './components/Applications/Applicants';
import AllApplicationListForEmployer from './components/Applications/AllApplicantionListForEmployer';
import ApplicationDetailsforEmployer from './components/Applications/ApplicationDetailsForEmployer';
// Protected Route Component


const ProtectedRoute = () => {
  const { loginData, loading } = useContext(LoginContext);

  if (loading) return null;
  // console.log(loginData);


  return loginData?.token ? <Outlet /> : <Navigate to="/login" />;
};

const CandidateRoute = () => {
  const { loginData, loading } = useContext(LoginContext);

  if (loading) return null;

  if (loginData?.token && loginData?.user?.role === 'candidate') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

const EmployerRoute = () => {
  const { loginData, loading } = useContext(LoginContext);

  if (loading) return null;


  if (loginData?.token && loginData?.user?.role === 'employer') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

// Public Route Component (prevents authenticated users from accessing login/register)
const PublicRoute = () => {
  const { loginData, loading } = useContext(LoginContext);

  if (loading) return null;

  return !loginData?.token ? <Outlet /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <LoginProvider>
      <div className="App min-h-screen flex flex-col">
        <ToastContainer position="top-right" />
        <Routes>
          <Route element={<Navbar />}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            {/* Auth routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* New route */}
              <Route path="/account-settings" element={<UserProfile />} />

            </Route>

            {/* Employer routes */}
            <Route element={<EmployerRoute />}>
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/jobs/new" element={<JobForm />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/edit/:id" element={<JobForm />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/allAppliedApplications" element={<AllApplicationListForEmployer />} />
              <Route path="/getApplicationDetailForEmployer/:employerId/:applicationId" element={<ApplicationDetailsforEmployer />} />
            </Route>

            {/* Candidate routes */}
            <Route element={<CandidateRoute />}>
              <Route path="/job-opportunities" element={<CandidateJobsList />} />
              <Route path="/job/:id/application/new" element={<ApplicationForm />} />
              <Route path="/myApplications" element={<ApplicationsList />} />
              <Route path="/applications/:id" element={<ApplicationDetails />} />
              <Route path="/applications/job/:jobId" element={<ApplicationsList />} />
              <Route path="/job/:id" element={<JobDetails />} />
            </Route>

            {/* Job details can be viewed by both candidates and employers */}

            {/* Catch all route */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </LoginProvider>
  );
}

export default App;