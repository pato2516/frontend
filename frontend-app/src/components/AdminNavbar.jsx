import React from 'react';
import { Bell, Settings, Search, UserCircle } from 'lucide-react';

const AdminNavBar = () => {
  return (
    <header className="navbar navbar-expand navbar-light bg-white border-bottom px-4" style={{ height: '64px' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* 1. Global Search */}
      <div 
        className="input-group shadow-sm" 
        style={{ 
          border: '1px solid #ced4da', 
          borderRadius: '50px', 
          overflow: 'hidden' // This ensures the border styling doesn't overlap
        }}
      >
        <input
          type="text"
          className="form-control border-0 bg-light shadow-sm"
          placeholder="Search"
          style={{ 
            paddingLeft: '20px'
          }}
        />
        <button
          className="btn border-0 bg-secondary text-white"
          type="button"
          style={{ 
            paddingRight: '20px',
            paddingLeft: '20px',
            borderLeft: '1px solid #ced4da' // This creates the vertical line in image_d5f327.png
          }}
        >
          <i className="bi bi-search text-white" style={{ color: '#6c757d' }}></i>
        </button>
      </div>

        {/* 2. Admin Actions & Profile */}
        <div className="d-flex align-items-center">
          <button className="btn btn-link text-secondary text-decoration-none p-2">
            <Bell size={24} />
          </button>
          <button className="btn btn-link text-secondary text-decoration-none p-2">
            <Settings size={24} />
          </button>
          
          <div className="d-flex align-items-center border-start ps-4 ms-3">
            <div className="text-end me-3">
              <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.875rem' }}>Admin Portal</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>SUPER ADMINISTRATOR</p>
            </div>
            <UserCircle size={40} className="text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;