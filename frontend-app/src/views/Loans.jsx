import React, { useState } from 'react';

export default function Loans() {
  // Form State for the New Loan Application Card
  const [formData, setFormData] = useState({
    guarantor1: '',
    guarantor2: '',
    collateralType: '',
    collateralValue: '',
    purpose: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      guarantor1: '',
      guarantor2: '',
      collateralType: '',
      collateralValue: '',
      purpose: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting Loan Application Matrix for verification...\nPurpose: ${formData.purpose}`);
  };

  return (
    <>
      {/* 1. OUTSTANDING LOAN BALANCE HERO CARD */}
      <div className="bg-white border p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative" style={{ borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.01)' }}>
        <div className="d-flex align-items-center gap-4">
          {/* Circular Icon Envelope */}
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '64px', height: '64px', backgroundColor: '#0B4687', color: '#ffffff' }}>
            <i className="bi bi-wallet2 fs-3"></i>
          </div>
          <div>
            <span className="text-uppercase text-muted fw-bold tracking-wider" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Outstanding Loan Balance
            </span>
            <h2 className="fw-bold my-1 text-navy-dark" style={{ color: '#0F2942', fontSize: '2.2rem', letterSpacing: '-0.02em' }}>
              UGX 2,500,000
            </h2>
            <div className="text-muted extra-small d-flex gap-4 mt-1" style={{ fontSize: '0.78rem' }}>
              <span>Started: **Jan 15, 2024**</span>
              <span>Maturity: **Dec 15, 2024**</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Slat Right */}
        <div className="mt-4 mt-md-0 text-md-end w-100 w-md-25">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-success fw-bold small">38% repaid</span>
            <span className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>14 payments remaining</span>
          </div>
          <div className="progress mb-3" style={{ height: '8px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '38%', backgroundColor: '#10B981' }}></div>
          </div>
          <button 
            className="btn w-100 py-2 fw-semibold text-white transition-all"
            style={{ backgroundColor: '#0F2942', borderRadius: '8px', fontSize: '0.9rem' }}
            type="button"
          >
            Repay Now
          </button>
        </div>
      </div>

      {/* 2. DUAL LAYOUT GRID: NEW APPLICATION & SIDE ADVOCACY MARKETING BANNER */}
      <div className="row g-4 mb-4">
        {/* Left Column Form Area */}
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit} className="bg-white border p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-navy-dark" style={{ color: '#0F2942' }}>New Loan Application</h5>
              <span className="badge border-0 px-2.5 py-1 text-success bg-success-subtle rounded-pill text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.03em' }}>
                Agric-Growth Facility
              </span>
            </div>

            <div className="row g-3">
              {/* Guarantor 1 Input */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark small mb-1">Guarantor 1 Member ID</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-person"></i></span>
                  <input 
                    type="text" className="form-control bg-light bg-opacity-20 border-start-0 small" 
                    name="guarantor1" placeholder="e.g. MZ-9921" value={formData.guarantor1} onChange={handleInputChange} required
                  />
                </div>
              </div>

              {/* Guarantor 2 Input */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark small mb-1">Guarantor 2 Member ID</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-person"></i></span>
                  <input 
                    type="text" className="form-control bg-light bg-opacity-20 border-start-0 small" 
                    name="guarantor2" placeholder="e.g. MZ-8842" value={formData.guarantor2} onChange={handleInputChange} required
                  />
                </div>
              </div>

              {/* Collateral Type Dropdown */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark small mb-1">Collateral Type</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-shield-lock"></i></span>
                  <select 
                    className="form-select bg-light bg-opacity-20 border-start-0 small" 
                    name="collateralType" value={formData.collateralType} onChange={handleInputChange} required
                  >
                    <option value="">Select an asset</option>
                    <option value="land">Land Title Deed</option>
                    <option value="vehicle">Motor Vehicle Logbook</option>
                    <option value="shares">SACCO Shares Deposit</option>
                  </select>
                </div>
              </div>

              {/* Collateral Value Input */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-dark small mb-1">Estimated Collateral Value (UGX)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-cash-stack"></i></span>
                  <input 
                    type="number" className="form-control bg-light bg-opacity-20 border-start-0 small" 
                    name="collateralValue" placeholder="Enter amount" value={formData.collateralValue} onChange={handleInputChange} required
                  />
                </div>
              </div>

              {/* Application Notes Block */}
              <div className="col-12">
                <label className="form-label fw-semibold text-dark small mb-1">Application Notes & Purpose</label>
                <textarea 
                  className="form-control bg-light bg-opacity-20 small" rows="4" 
                  name="purpose" placeholder="Briefly describe the purpose of this loan (e.g., Farm expansion, fertilizer purchase)..." 
                  value={formData.purpose} onChange={handleInputChange} required
                ></textarea>
              </div>
            </div>

            {/* Submission Interactive Button Rows */}
            <div className="d-flex gap-3 mt-4">
              <button 
                type="submit" className="btn text-white px-4 py-2.5 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                style={{ backgroundColor: '#0B4687', borderRadius: '8px' }}
              >
                Continue Application <i className="bi bi-arrow-right"></i>
              </button>
              <button 
                type="button" onClick={handleClear} className="btn btn-light px-4 py-2.5 fw-semibold text-secondary border"
                style={{ borderRadius: '8px', backgroundColor: '#F1F5F9' }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Right Column Promotional Card Banner */}
        <div className="col-12 col-lg-4">
          <div 
            className="p-4 text-white h-100 d-flex flex-column justify-content-between position-relative overflow-hidden" 
            style={{ 
              borderRadius: '12px',
              backgroundImage: 'linear-gradient(rgba(15, 41, 66, 0.85), rgba(15, 41, 66, 0.95)), url("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '340px'
            }}
          >
            <div>
              <h4 className="fw-bold tracking-tight mb-2" style={{ fontSize: '1.6rem', lineHeight: '1.2' }}>
                Empowering Your Harvest
              </h4>
              <p className="text-white-50 small lh-base" style={{ fontSize: '0.88rem' }}>
                Our loans are designed for the modern farmer. Benefit from competitive interest rates and flexible repayment plans tied to your harvest cycles.
              </p>
            </div>

            {/* Dynamic Card Insider Footer Accent */}
            <div className="p-3 border-0 rounded-3 text-white bg-white bg-opacity-10 backdrop-blur" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="d-flex gap-2.5 align-items-start">
                <i className="bi bi-patch-check-fill text-success fs-5"></i>
                <div>
                  <div className="fw-bold extra-small tracking-wide text-uppercase" style={{ fontSize: '0.7rem', color: '#4ADE80' }}>Member Benefit</div>
                  <p className="mb-0 extra-small opacity-90 mt-0.5" style={{ fontSize: '0.76rem', lineHeight: '1.35' }}>
                    As a Diamond Tier member, you qualify for an instant 1.5% interest rebate upon early repayment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY TABLE LEDGER */}
      <div className="bg-white border p-4" style={{ borderRadius: '12px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0 text-navy-dark" style={{ color: '#0F2942' }}>Recent Activity</h5>
          <a href="/loans/records" className="text-decoration-none small fw-bold text-primary">View All Records</a>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase" style={{ borderBottom: '1px solid #F1F5F9' }}>
              <tr>
                <th className="py-2.5 ps-3">Date</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-end">Amount</th>
                <th className="py-2.5 text-center pe-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Oct 12, 2023', desc: 'Monthly Installment - Loan #4429', meta: 'Auto-debit from Savings Account', amt: 'UGX 150,000', status: 'Success', statusColor: 'success' },
                { date: 'Sep 12, 2023', desc: 'Monthly Installment - Loan #4429', meta: 'Mobile Money Payment', amt: 'UGX 150,000', status: 'Success', statusColor: 'success' },
                { date: 'Aug 28, 2023', desc: 'Emergency Loan Application', meta: 'Application ID: APP-99201', amt: 'UGX 500,000', status: 'Rejected', statusColor: 'danger' }
              ].map((activity, index) => (
                <tr key={index} className="border-bottom" style={{ borderColor: '#F8FAFC' }}>
                  <td className="py-3 ps-3 text-secondary small">{activity.date}</td>
                  <td className="py-3">
                    <div className="fw-bold text-dark small">{activity.desc}</div>
                    <div className="text-muted extra-small" style={{ fontSize: '0.72rem' }}>{activity.meta}</div>
                  </td>
                  <td className="py-3 text-end fw-bold text-dark small">{activity.amt}</td>
                  <td className="py-3 text-center pe-3">
                    <span 
                      className={`badge border-0 px-2.5 py-1 rounded-pill fw-semibold text-capitalize`}
                      style={{ 
                        fontSize: '0.72rem',
                        backgroundColor: activity.statusColor === 'success' ? '#DCFCE7' : '#FEE2E2',
                        color: activity.statusColor === 'success' ? '#15803D' : '#B91C1C'
                      }}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}