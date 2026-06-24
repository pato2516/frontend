import React, { useState } from 'react';

export default function Savings() {
  // Interactive state for the dynamic projection engine
  const [monthlyContribution, setMonthlyContribution] = useState(250000);
  
  // Real-time calculation formula for a 1-year projection scenario
  // Current principal + (monthly contribution * 12 months) + estimated compound interest yield
  const currentTotalSavings = 4820500;
  const annualRate = 0.085; // 8.5% p.a.
  const projectedBalance = Math.round(
    currentTotalSavings + (monthlyContribution * 12) + ((currentTotalSavings + (monthlyContribution * 6)) * annualRate)
  );

  return (
    <>
      {/* 1. TOTAL SAVINGS HERO BALANCE BANNER */}
      <div 
        className="p-4 mb-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B4687 0%, #062D59 100%)',
          borderRadius: '14px',
          boxShadow: '0 10px 25px rgba(11, 70, 135, 0.12)'
        }}
      >
        <div>
          <span className="text-uppercase text-white-50 fw-semibold tracking-wider d-flex align-items-center gap-2" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            <i className="bi bi-shield-check"></i> Total Savings Balance
          </span>
          <h1 className="fw-bold my-1 tracking-tight" style={{ fontSize: '2.5rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            UGX 4,820,500
          </h1>
          <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
            <span className="badge border-0 rounded-pill px-2.5 py-1 text-dark fw-bold d-inline-flex align-items-center gap-1" style={{ backgroundColor: '#4ADE80', fontSize: '0.75rem' }}>
              <i className="bi bi-graph-up-arrow"></i> Earning 8.5% p.a.
            </span>
            <span className="text-white-50 small ms-1" style={{ fontSize: '0.8rem' }}>
              + UGX 12,400 earned this month
            </span>
          </div>
        </div>
        
        <div className="mt-4 mt-md-0 position-relative" style={{ zIndex: 1 }}>
          <button 
            className="btn btn-white btn-outline-info bg-white text-dark fw-bold px-4 py-2.5 rounded-5 shadow-sm d-flex align-items-center gap-2"
            style={{ border: 'none', fontSize: '0.9rem' }}
            type="button"
          >
            <i className="bi bi-plus-lg text-primary fw-bold"></i> Deposit
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT BREAKDOWN ROW */}
      <div className="row g-4 mb-4">
        
        {/* Left Core Card: My Accounts Matrix */}
        <div className="col-12 col-lg-8">
          <div className="bg-white border h-100" style={{ borderRadius: '14px' }}>
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ borderColor: '#F1F5F9' }}>
              <h5 className="fw-bold mb-0 text-navy-dark" style={{ color: '#0F2942' }}>My Accounts</h5>
              <a href="/statements" className="text-decoration-none small fw-bold text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                View Statements <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.75rem' }}></i>
              </a>
            </div>

            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase" style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.72rem' }}>
                  <tr>
                    <th className="py-3 ps-4" style={{ width: '40%' }}>Account</th>
                    <th className="py-3">Balance (UGX)</th>
                    <th className="py-3 pe-4" style={{ width: '30%' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: 'Ordinary Savings', meta: 'Instant withdrawal', amt: '3,200,500', goal: '4.5M', pct: '72%', icon: 'bi-piggy-bank text-primary', bg: '#EFF6FF' },
                    { title: 'Fixed Deposit', meta: 'Mature in 120 days', amt: '1,200,000', goal: '1.5M', pct: '88%', icon: 'bi-lock text-secondary', bg: '#F8FAFC' },
                    { title: 'Share Capital', meta: 'Membership equity', amt: '1,200,000', goal: '2.5M', pct: '48%', icon: 'bi-pie-chart text-info', bg: '#F0FDFA' }
                  ].map((row, index) => (
                    <tr key={index} className="border-bottom" style={{ borderColor: '#F8FAFC' }}>
                      {/* Account Meta Description Container */}
                      <td className="py-3.5 ps-4 d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: row.bg }}>
                          <i className={`bi ${row.icon} fs-5`}></i>
                        </div>
                        <div>
                          <span className="fw-bold text-dark d-block small mb-0.5">{row.title}</span>
                          <span className="text-muted extra-small d-block" style={{ fontSize: '0.74rem' }}>{row.meta}</span>
                        </div>
                      </td>
                      {/* Numerical Currency Weight Value */}
                      <td className="py-3.5 fw-bold text-secondary-dark" style={{ color: '#334155' }}>
                        {row.amt}
                      </td>
                      {/* Linear Visual Percentage Target Gauge */}
                      <td className="py-3.5 pe-4">
                        <div className="d-flex justify-content-between align-items-center mb-1 text-muted" style={{ fontSize: '0.72rem' }}>
                          <span>Goal: {row.goal}</span>
                          <span className="fw-bold text-success">{row.pct}</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: row.pct, backgroundColor: '#15803D' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Actionable Side Panel Elements */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          
          {/* Accelerator Upsell Callout Box */}
          <div className="p-4 text-white position-relative overflow-hidden d-flex flex-column justify-content-between" style={{ backgroundColor: '#0B4687', borderRadius: '14px', minHeight: '200px' }}>
            <div className="z-1">
              <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center mb-3" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-lightbulb text-white fs-5"></i>
              </div>
              <h5 className="fw-bold mb-2" style={{ letterSpacing: '-0.01em' }}>Grow your wealth faster</h5>
              <p className="opacity-75 mb-4 lh-sm" style={{ fontSize: '0.8rem' }}>
                You're only UGX 300,000 away from reaching your Fixed Deposit goal. Top up now to lock in the 8.5% rate.
              </p>
            </div>
            <button className="btn btn-light w-100 py-2.5 fw-bold text-primary bg-white border-0 rounded-3 z-1" style={{ fontSize: '0.88rem' }} type="button">
              Top Up Now
            </button>
            {/* Soft decorative background asset structure mockup hint */}
            <div className="position-absolute opacity-10 end-0 bottom-0 pointer-events-none" style={{ transform: 'translate(10%, 10%)' }}>
              <i className="bi bi-piggy-bank" style={{ fontSize: '9rem' }}></i>
            </div>
          </div>

          {/* Interactive Calculator Slat Block */}
          <div className="bg-white border p-4" style={{ borderRadius: '14px' }}>
            <h6 className="fw-bold mb-3 text-dark" style={{ letterSpacing: '-0.01em' }}>Savings Projection</h6>
            
            <div className="mb-3.5">
              <label className="text-muted small d-block mb-1.5" style={{ fontSize: '0.78rem' }}>Monthly Contribution (UGX)</label>
              <input 
                type="range" className="form-range custom-slider" 
                min="10000" max="1000000" step="10000" 
                value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted font-monospace mt-1" style={{ fontSize: '0.68rem' }}>
                <span>10k</span>
                <span className="fw-bold text-primary">UGX {monthlyContribution.toLocaleString()}</span>
                <span>1M</span>
              </div>
            </div>

            {/* Simulated Live Output Container Node */}
            <div className="p-3 rounded-3 mt-1 text-center" style={{ backgroundColor: '#F0FDFA', border: '1px solid #CCFBF1' }}>
              <span className="text-muted text-uppercase d-block mb-0.5" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Projected Balance (1 Year)</span>
              <h4 className="fw-bold text-success mb-0" style={{ letterSpacing: '-0.02em' }}>
                UGX {projectedBalance.toLocaleString()}
              </h4>
            </div>
          </div>

        </div>
      </div>

      {/* 3. RECENT SAVINGS ACTIVITY ACCORDION GRID BLOCK */}
      <div className="bg-white border p-4" style={{ borderRadius: '14px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#0F2942' }}>
            <i className="bi bi-clock-history text-muted"></i> Recent Savings Activity
          </h5>
          <div className="d-flex align-items-center gap-3">
            <a href="/savings/history" className="text-decoration-none small fw-bold text-primary">View All</a>
            <button className="btn btn-success rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }} type="button">
              <i className="bi bi-plus-lg fs-5"></i>
            </button>
          </div>
        </div>

        <div className="d-flex flex-column">
          {[
            { title: 'Interest Earned - August', meta: 'Aug 31, 2023 • Fixed Deposit', value: '+ UGX 8,500', isCredit: true },
            { title: 'Monthly Contribution', meta: 'Aug 25, 2023 • Ordinary Savings', value: '+ UGX 150,000', isCredit: true }
          ].map((item, index) => (
            <div key={index} className={`d-flex justify-content-between align-items-center py-3 ${index !== 1 ? 'border-bottom' : ''}`} style={{ borderColor: '#F8FAFC' }}>
              <div className="d-flex align-items-center gap-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '38px', height: '38px', backgroundColor: item.isCredit ? '#DCFCE7' : '#F1F5F9' }}>
                  <i className={`bi ${item.isCredit ? 'bi-arrow-down-left text-success' : 'bi-plus-lg text-secondary'} fs-5`}></i>
                </div>
                <div>
                  <span className="fw-bold text-dark d-block small mb-0.5">{item.title}</span>
                  <span className="text-muted extra-small d-block" style={{ fontSize: '0.72rem' }}>{item.meta}</span>
                </div>
              </div>
              
              <div className="text-end">
                <span className="fw-bold text-success d-block small">{item.value}</span>
                <span className="badge bg-success-subtle text-success border-0 px-2.5 py-0.5 mt-1 rounded-pill" style={{ fontSize: '0.65rem', fontWeight: '700' }}>Success</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}