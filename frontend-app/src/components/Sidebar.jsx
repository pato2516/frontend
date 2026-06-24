import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper d-none d-md-flex">
      <div>
        <div className="sidebar-brand d-flex align-items-center gap-2.5">
          <div className="brand-logo-accent">
            <i className="bi bi-flower1 fs-5"></i>
          </div>
          <div>
            <div className="fw-bold fs-5 text-dark lh-1" style={{ letterSpacing: '-0.3px' }}>MazaoSACCO</div>
            <span className="text-muted extra-small" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>Member Portal</span>
          </div>
        </div>
        
        {/* Navigation Link Matrix Using NavLink */}
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </NavLink>
          <NavLink to="/savings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-wallet2"></i> Savings
          </NavLink>
          <NavLink to="/loans" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-cash-stack"></i> Loans
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-clock-history"></i> Transactions
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-person-fill"></i> Profile
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-profile-card d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="rounded-circle border border-2 border-white shadow-sm" width="42" height="42" />
            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
          </div>
          <div>
            <div className="fw-bold text-dark small lh-sm" style={{ fontSize: '0.9rem' }}>Amara Kiprotich</div>
            <div className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>Member #00142</div>
          </div>
        </div>
        <button className="btn btn-link p-1 text-muted text-opacity-50" type="button">
          <i className="bi bi-box-arrow-right fs-5"></i>
        </button>
      </div>
    </div>
  );
}