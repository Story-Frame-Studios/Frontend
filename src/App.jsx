import { useContext, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

import { Home } from './pages/Employer/Home.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Login } from './components/Login/Login.jsx';
import { Register } from './components/Login/Register.jsx';
// import { JobDetails } from './components/Home/JobDetails.jsx';
import { Footer } from './components/Footer.jsx';
import { Dashboard } from './Pages/Dashboard.jsx';
import { LoginContext } from './components/ContextProvider/Context';


function App() {

  const {loginData, setLoginData} = useContext(LoginContext)

  

  return (
    <div className="App">
      <Routes>
          {/* <h1 className='text-5xl text-green-600 '>Hello</h1> */}
          <Route path='/' element={<Navbar />}> 
            <Route path='/' element={<Home />}/>
            <Route path='*' element={<Home />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/signup' element={<Register />}/>

            {/* <Route path='/current-job/:id' element={<JobDetails />}/> */}
            <Route path='/dash' element={<Dashboard />}/>
              
          </Route>
          
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
