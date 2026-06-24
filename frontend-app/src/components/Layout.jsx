import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Footer from './Footer';

export default function Layout() {
  // Modal state toggles
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings configurations states
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  
  // New State for Role-based Navigation
  const [userRole, setUserRole] = useState(null);

  // Hook to handle dark mode DOM body class toggles dynamically
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode-active');
    } else {
      document.body.classList.remove('dark-mode-active');
    }
  }, [darkMode]);

  // Decode role on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  // Navigation Matrix - Admin link is now conditionally filtered
  const navLinks = [
    { path: '/app/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { path: '/app/savings', label: 'Savings', icon: 'bi-wallet2' },
    { path: '/app/loans', label: 'Loans', icon: 'bi-cash-stack' },
    { path: '/app/transactions', label: 'Transactions', icon: 'bi-clock-history' },
    { path: '/app/profile', label: 'Profile', icon: 'bi-person-circle' },
    { path: '/app/admin', label: 'Admin', icon: 'bi-shield-lock', adminOnly: true }
  ].filter(link => !link.adminOnly || userRole === 'admin');


const handleLogout = () => {
  // 1. Clear the token from storage
  localStorage.removeItem("token");
  
  // 2. Clear any other user-related data if necessary
  // localStorage.clear(); 

  // 3. Redirect to login
  window.location.href = "/login";
};


  return (
  <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',     color: darkMode ? '#F1F5F9' : '#0F172A', transition: 'all 0.3s ease' }}>
      
      {/* LEFT FIXED SIDEBAR CONTAINER */}
      <aside 
        className={`border-end position-fixed top-0 start-0 h-100 d-flex flex-column justify-content-between ${darkMode ? 'bg-slate-900 border-secondary' : 'bg-white'}`}
        style={{ width: '260px', zIndex: 1030, backgroundColor: darkMode ? '#1E293B' : '#ffffff', borderColor: darkMode ? '#334155' : '#E2E8F0' }}
      >
        <div>
          {/* Sacco Brand Identity Header */}
          <div className="p-4 border-bottom" style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }}>
            <h4 className="fw-bold mb-0" style={{ letterSpacing: '-0.03em', color: darkMode ? '#38BDF8' : '#0B4687' }}>
              MazaoSACCO
            </h4>
            <span className="text-muted small fw-medium tracking-wider text-uppercase" style={{ fontSize: '0.68rem' }}>
              Member Portal
            </span>
          </div>

          {/* Navigation Matrix Link Strip */}
          <nav className="p-3 d-flex flex-column gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-semibold text-decoration-none transition-all ${
                    isActive 
                      ? 'bg-primary bg-opacity-10 text-primary' 
                      : darkMode ? 'text-slate-400 text-secondary hover-bg-dark' : 'text-secondary hover-bg-light'
                  }`
                }
                style={{ fontSize: '0.92rem', color: darkMode && '#94A3B8' }}
              >
                <i className={`bi ${link.icon} fs-5`}></i>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer User Avatar Identity Widget Badge */}
        <div 
          className="p-3 border-top d-flex align-items-center gap-3" 
          style={{ borderColor: darkMode ? '#334155' : '#E2E8F0', backgroundColor: darkMode ? '#0F172A' : '#F8FAFC' }}
        >
          
            <div className="rounded-circle bg-primary text-white border-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>   
              AK
            </div>
          
          <div className="overflow-hidden flex-grow-1">
            <span className={`fw-bold d-block text-truncate small ${darkMode ? 'text-white' : 'text-dark'}`}>Amara Kiprotich</span>
            <span className="text-muted extra-small d-block" style={{ fontSize: '0.72rem' }}>Silver Member</span>
          </div>
            {/* ... inside your sidebar footer near the profile section ... */}
          <div className="d-flex align-items-center gap-2 mt-2">
            <button 
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ fontSize: '0.75rem' }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>

          {/* Cog Icon to trigger the Settings modal directly */}
          <button 
            type="button" 
            className="btn btn-link p-0 text-secondary" 
            onClick={() => setShowSettings(true)}
            style={{ color: darkMode ? '#94A3B8' : '#64748B' }}
          >
            <i className="bi bi-gear-fill fs-5"></i>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE VIEW COMPONENT SCREEN VIEWPORT */}
      <div className="w-100 h-100" style={{ paddingLeft: '260px' }}>
        
        {/* GLOBAL HEADER TOP BAR */}
        <header 
          className="sticky-top px-4 py-3 d-flex justify-content-between align-items-center border-bottom" 
          style={{ zIndex: 1020, backgroundColor: darkMode ? '#1E293B' : '#ffffff', borderColor: darkMode ? '#334155' : '#E2E8F0' }}
        >
          <div className="position-relative" style={{ width: '320px' }}>
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input 
              type="text" 
              className={`form-control border-1 ps-5 py-2 rounded-pill small ${darkMode ? 'bg-slate-800 text-white' : 'bg-light bg-opacity-50'}`}
              placeholder="Search accounts or features..."
              style={{ fontSize: '0.88rem', width: 700, backgroundColor: darkMode ? '#0F172A' : '#F1F5F9' }}
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn p-1.5 rounded-circle border-1 text-success bg-info btn-outline-secondary" 
              type="button"
              onClick={() => setShowSettings(true)}
              style={{ backgroundColor: darkMode ? '#0F172A' : '#F1F5F9' }}
            >
              <i className="bi bi-sliders fs-5"></i>
            </button>

            <div className="border-start ps-3 d-none d-sm-block" style={{ borderColor: darkMode ? '#334155' : '#E2E8F0' }}>
              <span className="badge bg-secondary text-info fw-bold font-tahoma" style={{ borderRadius: 50 }}>UGX PORTAL ACTIVE</span>
            </div>
          </div>
        </header>

        {/* COMPONENT OUTLET BODY WRAPPER FRAME */}
        <main className="p-4 container-fluid" style={{ maxWidth: '1400px' }}>
          <Outlet context={{ darkMode }} />
        </main>
      </div>

      {/* MODAL SYSTEM SETTINGS */}
      {showSettings && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            onClick={() => setShowSettings(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
              <div 
                className="modal-content border-0 shadow-lg" 
                style={{ 
                  borderRadius: '16px', 
                  backgroundColor: darkMode ? '#1E293B' : '#ffffff',
                  color: darkMode ? '#F1F5F9' : '#0F2942'
                }}
              >
                <div className="modal-header px-4 pt-4 pb-2 border-0 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1.2rem' }}>
                    <i className="bi bi-gear text-primary"></i> Portal Settings
                  </h5>
                  <button type="button" className={`btn-close ${darkMode ? 'btn-close-white' : ''}`} onClick={() => setShowSettings(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body px-4 py-3">
                  <div className="mb-4">
                    <label className="text-muted text-uppercase fw-bold font-monospace d-block mb-2.5" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Appearance</label>
                    <div className="p-3 rounded-3 border d-flex justify-content-between align-items-center" style={{ backgroundColor: darkMode ? '#0F172A' : '#F8FAFC', borderColor: darkMode ? '#334155' : '#E2E8F0' }}>
                      <div className="d-flex align-items-center gap-2.5">
                        <i className={`bi ${darkMode ? 'bi-moon-stars-fill text-info' : 'bi-sun-fill text-warning'} fs-5`}></i>
                        <div><span className="fw-bold small d-block">Dark Display Mode</span></div>
                      </div>
                      <div className="form-check form-switch mb-0 ps-0 fs-4 d-flex align-items-center">
                        <input className="form-check-input ms-auto" type="checkbox" role="switch" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                      </div>
                    </div>
                  </div>
                  {/* Additional sections follow your original structure */}
                </div>
                <div className="modal-footer px-4 pb-4 pt-2 border-0 d-flex gap-2">
                  <button type="button" className={`btn w-100 py-2 fw-bold rounded-3 ${darkMode ? 'btn-secondary bg-slate-700 border-0' : 'btn-light border'}`} onClick={() => setShowSettings(false)}>Dismiss & Save</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    <div className='mt-50'>
      <Footer />
    </div>
  </div>
  );
}