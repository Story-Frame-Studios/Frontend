// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { LoginContext } from './components/ContextProvider/LoginContext';
import { ToastContainer, toast } from 'react-toastify';
// import { makeServer } from "./mocks/server"

import './index.css'

// if (process.env.NODE_ENV === "development") {
//   makeServer()
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LoginContext>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </LoginContext>
);