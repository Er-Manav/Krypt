import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import './index.css'
import {TransactionProvider } from './context/TransactionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionProvider>

  <BrowserRouter basename={window.location.pathname || ''}>
    <App />
  </BrowserRouter>
  
  </TransactionProvider>
)
