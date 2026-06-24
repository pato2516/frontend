import React from 'react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-top py-3 px-4 text-center text-muted small">
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-secondary">&copy; {currentYear} Apex Management. All rights reserved.</span>
        
        <div className="d-flex gap-4">
          <span className="text-secondary text-decoration-none cursor-pointer hover-text-warning">Privacy Policy</span>
          <span className="text-secondary text-decoration-none cursor-pointer hover-text-warning">Terms of Service</span>
          <span className="fw-bold text-dark">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;