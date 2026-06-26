import React, { useState, useMemo } from 'react';

export default function Loans() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [showAmortization, setShowAmortization] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Logic: 12% Annual Rate - Simplified for UI
  const monthlyRepayment = useMemo(() => Math.round((loanAmount * 1.12) / 12), [loanAmount]);

  return (
    <div className="container-fluid py-3">
      <style>{`
        .bg-gradient-sacco { background: linear-gradient(135deg, #0F2942, #1E3A8A); }
        .data-table-row:hover { background: #F8FAFC !important; cursor: pointer; }
        .glass-panel { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toast && <div className="position-fixed top-4 end-4 z-5 alert alert-success shadow border-0">{toast}</div>}

      {/* HERO: LOAN STATUS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="bg-gradient-sacco text-white p-4 rounded-4 shadow-lg d-flex justify-content-between align-items-center">
            <div>
              <span className="text-white-50 text-uppercase small fw-bold tracking-wider">Active Loan Balance</span>
              <h1 className="display-5 fw-extrabold mb-0 font-monospace">UGX 2,500,000</h1>
              <p className="mb-0 small opacity-75">Loan ID: LN-99201-2026 | Due: Dec 15, 2026</p>
            </div>
            <button className="btn btn-warning fw-bold text-dark px-4 py-2" onClick={() => triggerToast("Processing payment gateway...")}>Make Repayment</button>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center">
            <span className="text-muted small fw-bold">DTI (Debt-to-Income) Pulse</span>
            <div className="d-flex align-items-baseline gap-2 mb-2">
              <h2 className="mb-0 text-primary">28%</h2>
              <span className="small text-success fw-bold">Healthy</span>
            </div>
            <div className="progress" style={{ height: '8px' }}><div className="progress-bar bg-primary" style={{ width: '28%' }}></div></div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DATA TABLE LEDGER */}
      <div className="glass-panel p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-navy-dark">Loan Transaction Ledger</h5>
          <div className="btn-group">
            <button className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('active')}>Active</button>
            <button className={`btn btn-sm ${activeTab === 'history' ? 'btn-history' : 'btn-outline-secondary'}`} onClick={() => setActiveTab('history')}>History</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="small text-uppercase">Reference</th>
                <th className="small text-uppercase">Date</th>
                <th className="small text-uppercase">Description</th>
                <th className="small text-uppercase text-end">Amount</th>
                <th className="small text-uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="data-table-row">
                  <td className="small font-monospace">TXN-00{i}82</td>
                  <td className="small">Jun 25, 2026</td>
                  <td className="small">Monthly Installment</td>
                  <td className="small text-end fw-bold">UGX 150,000</td>
                  <td className="text-center"><i className="bi bi-three-dots-vertical"></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION & SIMULATION GRID */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3">Facility Simulation Engine</h5>
            <label className="small fw-bold">Amount: <span className="text-primary">UGX {loanAmount.toLocaleString()}</span></label>
            <input type="range" className="form-range my-3" min="500000" max="10000000" step="500000" onChange={(e) => setLoanAmount(Number(e.target.value))} />
            
            <div className="d-flex justify-content-between bg-light p-3 rounded mt-2">
              <span className="small">Estimated Monthly:</span>
              <span className="fw-bold text-primary font-monospace">UGX {monthlyRepayment.toLocaleString()}</span>
            </div>
            
            <div className="mt-4 d-grid gap-2">
              <button className="btn btn-outline-primary" onClick={() => setShowAmortization(!showAmortization)}>Preview Amortization Schedule</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3">Member Action Hub</h5>
            <div className="row g-2">
              {[
                { icon: 'bi-arrow-up-circle', label: 'Top-up Request' },
                { icon: 'bi-calendar-check', label: 'Reschedule Tenor' },
                { icon: 'bi-shield-lock', label: 'Manage Collateral' },
                { icon: 'bi-file-earmark-pdf', label: 'Statement Export' },
                { icon: 'bi-person-plus', label: 'Add Guarantor' },
                { icon: 'bi-piggy-bank', label: 'Interest Rebate Claim' }
              ].map((act, i) => (
                <div key={i} className="col-6">
                  <button className="btn btn-light w-100 text-start py-2 px-3 small border d-flex align-items-center gap-2" onClick={() => triggerToast(`Initiating ${act.label}...`)}>
                    <i className={`${act.icon}`}></i> {act.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}