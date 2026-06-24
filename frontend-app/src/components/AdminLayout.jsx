// Ensure you have these imports
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavBar from './AdminNavBar';
import AdminFooter from './AdminFooter';

// THIS MUST BE A FUNCTIONAL COMPONENT
const AdminLayout = () => {
  return (
    <div className="d-flex vh-100 overflow-hidden">
      <AdminSidebar />
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <AdminNavBar />
        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout; // MUST HAVE THIS