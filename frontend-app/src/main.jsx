// frontend-app/Main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- Added TanStack Query Hooks
import App from './App.jsx';

// 1. Core Bootstrap CSS Framework Styles
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. Bootstrap Icons font packet
import 'bootstrap-icons/font/bootstrap-icons.css';
// 3. Your custom structural spacing definitions 
import './index.css'; 
// 4. Core Bootstrap JS Bundle execution layers
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Initialize the resilient caching engine configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // Retries failing requests once before surfacing error blocks
      refetchOnWindowFocus: false, // Prevents sudden UI data flashes when moving browser windows
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your global application inside the query cache provider shell */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);