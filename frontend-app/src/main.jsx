import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// 1. Core Bootstrap CSS Framework Styles
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. Bootstrap Icons font packet
import 'bootstrap-icons/font/bootstrap-icons.css';
// 3. Your custom structural spacing definitions 
import './index.css'; 
// 4. Core Bootstrap JS Bundle execution layers
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);