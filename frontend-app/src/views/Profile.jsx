import React, { useState } from 'react';

export default function Profile() {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <>
      {/* 1. HERO PROFILE BANNER */}
      <div 
        className="p-4 mb-4 text-white d-flex align-items-center position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B4687 0%, #062D59 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(11, 70, 135, 0.15)',
          minHeight: '180px'
        }}
      >
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 z-1">
          <div className="position-relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
              alt="Amara Kiprotich Avatar" 
              className="rounded-circle border border-4 border-white border-opacity-20 shadow"
              width="110" 
              height="110" 
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="text-center text-md-start">
            <h3 className="fw-bold mb-1.5 text-white" style={{ letterSpacing: '-0.02em' }}>Amara Kiprotich</h3>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
              <span className="badge border-1 px-3 py-1.5 fw-bold font-monospace text-uppercase" style={{ backgroundColor: '#10B981', color: '#ffffff', fontSize: '0.72rem', letterSpacing: '0.03em', borderRadius:50 }}>
                MEMBER #00142
              </span>
              <span className="badge border-1 px-3 py-1.5 fw-bold text-uppercase bg-white text-dark bg-opacity-20" style={{ fontSize: '0.72rem', letterSpacing: '0.03em', borderRadius:50 }}>
                PREMIUM TIER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT DATA CORES */}
      <div className="row g-4 mb-4">
        {/* Left Column: Personal Information Summary */}
        <div className="col-12 col-lg-8">
          <div className="bg-white border p-4 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '14px' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#0F2942' }}>
                  <i className="bi bi-file-earmark-person text-primary"></i> Personal Information
                </h5>
                <button className="btn btn-link p-0 text-decoration-none small fw-bold text-primary d-flex align-items-center gap-1" type="button">
                  <i className="bi bi-pencil-square"></i> EDIT
                </button>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>PHONE NUMBER</span>
                  <span className="fw-bold text-dark d-block mt-1" style={{ fontSize: '1.05rem' }}>+256701234567</span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>EMAIL ADDRESS</span>
                  <span className="fw-bold text-dark d-block mt-1" style={{ fontSize: '1.05rem' }}>a.kiprotich@email.com</span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>TOTAL SHARES</span>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>240</span>
                    <span className="badge border-0 bg-success-subtle text-success fw-bold font-monospace" style={{ fontSize: '0.72rem' }}>+5% YoY</span>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>CURRENT SAVINGS</span>
                  <span className="fw-bold text-dark d-block mt-1" style={{ fontSize: '1.05rem' }}>UGX 4,820,500</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-top text-muted font-italic" style={{ fontSize: '0.78rem' }}>
              Member since January 2021 • Last verified: Oct 2023
            </div>
          </div>
        </div>

        {/* Right Column: Security Configurations & Financial Actions */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          
          {/* Security Box Component */}
          <div className="bg-white border p-4" style={{ borderRadius: '14px' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0F2942' }}>
              <i className="bi bi-shield-check text-primary"></i> Security
            </h5>
            
            {/* 2FA Toggle */}
            <div className="p-3 rounded-3 mb-3 border bg-light bg-opacity-40 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold text-dark small">Two factor authentication</div>
                <span className="text-muted extra-small" style={{ fontSize: '0.72rem' }}>Recommended for security</span>
              </div>
              <div className="form-check form-switch ps-0 fs-4 mb-0 d-flex align-items-center">
                <input 
                  className="form-check-input ms-auto" type="checkbox" role="switch" 
                  checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Menu Slat Links */}
            <button className="btn btn-light border w-100 text-start py-2.5 px-3 mb-2 d-flex justify-content-between align-items-center bg-white" style={{ borderRadius: '8px' }} type="button">
              <span className="text-dark fw-bold small">Change Password</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </button>
            <button className="btn btn-light border w-100 text-start py-2.5 px-3 d-flex justify-content-between align-items-center bg-white" style={{ borderRadius: '8px' }} type="button">
              <span className="text-dark fw-bold small">Login Activity</span>
              <i className="bi bi-chevron-right text-muted small"></i>
            </button>
          </div>

          {/* Quick Financial Actions Module Block */}
          <div className="p-4 d-flex flex-column justify-content-between" style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '14px' }}>
            <span className="text-uppercase fw-bold font-monospace text-primary mb-3" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              FINANCIAL ACTIONS
            </span>
            <div className="row g-2">
              <div className="col-6">
                <button className="btn w-100 text-white py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#0F2942', borderRadius: '60px', fontSize: '0.88rem' }} type="button">
                  <i className="bi bi-plus-circle"></i> DEPOSIT
                </button>
              </div>
              <div className="col-6">
                <button className="btn w-100 text-white py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#15803D', borderRadius: '60px', fontSize: '0.88rem' }} type="button">
                  <i className="bi bi-cash-stack"></i> LOAN
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM AUDIT: PROFILE COMPLETION MATRIX COMPONENT */}
      <div className="bg-white border p-4 mb-2" style={{ borderRadius: '14px' }}>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2">
          <h6 className="fw-bold text-dark mb-1 mb-sm-0">Profile Completion</h6>
          <span className="text-success fw-bold font-monospace" style={{ fontSize: '0.85rem' }}>85% COMPLETE</span>
        </div>
        <div className="progress mb-3.5" style={{ height: '8px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
          <div className="progress-bar" role="progressbar" style={{ width: '85%', backgroundColor: '#15803D' }}></div>
        </div>
        
        {/* Verification Check Badges Footer Layout Row */}
        <div className="d-flex flex-wrap gap-x-4 gap-y-2 pt-1 border-top" style={{ borderColor: '#F1F5F9' }}>
          <div className="d-flex align-items-center gap-1.5 text-success small fw-semibold me-3">
            <i className="bi bi-check-circle-fill"></i> Verified Email
          </div>
          <div className="d-flex align-items-center gap-1.5 text-success small fw-semibold me-3">
            <i className="bi bi-check-circle-fill"></i> KRA Pin Linked
          </div>
          <button className="btn btn-link p-0 text-decoration-none small text-muted d-flex align-items-center gap-1.5 fw-semibold" type="button">
            <i className="bi bi-plus-circle text-primary"></i> Add Next of Kin
          </button>
        </div>
      </div>
    </>
  );
}