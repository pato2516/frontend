// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout'; // Import your new AdminLayout
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import SignUp from './views/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import MemberManagement from './views/MemberManagement';
import LoanApplications from './views/LoanApplications';
import SavingView from './views/SavingView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Admin Protected Routes */}
        <Route path="/app/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="loan-applications" element={<LoanApplications />} />
          <Route path="saving-portfolios" element={<SavingView/>} />
        </Route>

        {/* Member Protected Routes */}
        <Route path="/app/*" element={
          <ProtectedRoute allowedRoles={['member']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add other member routes here */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}