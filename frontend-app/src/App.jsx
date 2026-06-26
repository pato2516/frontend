// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Mandatory styles for rendering popups

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout'; 
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import SignUp from './views/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import MemberManagement from './views/MemberManagement';
import LoanApplications from './views/LoanApplications';
import SavingView from './views/SavingView';
import Transfers from './views/Transfers';
import AdminSettings from './views/AdminSetting';
import ReportsView from './views/ReportsView';
import DividendRegistryView from './views/DividendRegistryView'; // <-- Updated to link your 
import Loans from './views/Loans';
import Savings from './views/Savings';
import Profile from './views/Profile';
import Transactions from './views/Transactions';

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
          <Route path="transfers" element={<Transfers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="dividends" element={<DividendRegistryView />} /> {/* <-- Swapped old component view route here */}
        </Route>

        {/* Member Protected Routes */}
        <Route path="/app/*" element={
          <ProtectedRoute allowedRoles={['member']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="loans" element={<Loans />} />
          <Route path="savings" element={<Savings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="transactions" element={<Transactions />} />
          {/* Add other member routes here */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Configuration Host */}
      <ToastContainer 
        position="top-right"
        autoClose={2000} // Automatically fades away after 2 seconds
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}