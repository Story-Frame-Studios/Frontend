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
import { Context } from './components/ContextProvider/Context';
import { ToastContainer, toast } from 'react-toastify';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Context>
);