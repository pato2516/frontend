// frontend-app/src/views/Dashboard.jsx
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  // Core Dashboard State Hooks
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📱 Mobile Money Modal Form States
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ type: '', message: '' });

  // ⚡ Extended Dynamic Quick Action Side-Pane States
  const [activeActionPane, setActiveActionPane] = useState(null); // 'Transfer' | 'Apply Loan' | 'Pay Bill' | 'Statement' | null
  const [actionInput, setActionInput] = useState({ target: '', detail: '', amount: '' });

  // Fetch Data from your FastAPI Endpoints on Component Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://127.0.0.1:8000/api/v1/accounting/dashboard-summary', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to load live metrics.');
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        // Fallback UI mock state matching your schema
        setSummary({
          total_balance: 4820500,
          monthly_delta: 320000,
          share_capital: 1200000,
          active_loan_balance: 2500000,
          dividend_2024: 84000,
          recent_transactions: [
            { title: 'Monthly savings', date: 'May 15, 2026', amt: '320,000', type: 'credit', icon: 'bi-piggy-bank text-success', bg: 'bg-success-subtle' },
            { title: 'Umeme Bill Payment', date: 'May 12, 2026', amt: '-45,000', type: 'debit', icon: 'bi-lightning-charge text-danger', bg: 'bg-danger-subtle' },
            { title: 'Loan Disbursement', date: 'May 01, 2026', amt: '2,500,000', type: 'credit', icon: 'bi-cash-stack text-success', bg: 'bg-success-subtle' },
            { title: 'Account Maintenance', date: 'Apr 30, 2026', amt: '-2,500', type: 'debit', icon: 'bi-arrow-repeat text-secondary', bg: 'bg-light' }
          ],
          goals: [
            { name: 'Emergency fund', current: '1.2M', target: '2.0M', pct: '62%', color: 'bg-primary' },
            { name: 'School fees', current: '2.6M', target: '3.0M', pct: '88%', color: 'bg-success' },
            { name: 'Land purchase', current: '3.5M', target: '15.0M', pct: '24%', color: 'bg-info' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 💸 Handle Mobile Money Form Submission
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus({ type: '', message: '' });

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://127.0.0.1:8000/api/v1/mobile-money/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phone_number: `+256${phoneNumber.replace(/\s/g, '')}`
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Mobile money request failed.');

      setPaymentStatus({ 
        type: 'success', 
        message: 'STK Push prompt sent successfully! Please check your handset to authorize the transaction.' 
      });
      setAmount('');
      setPhoneNumber('');
    } catch (err) {
      setPaymentStatus({ type: 'danger', message: err.message || 'Network communication fault.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // ⚡ Execute Contextual Quick Action Workflow Form submissions
  const handleExecuteQuickAction = (e) => {
    e.preventDefault();
    alert(`Pipeline action initiated: [${activeActionPane}] for amount UGX ${Number(actionInput.amount).toLocaleString() || 0}. Process pending approval.`);
    setActionInput({ target: '', detail: '', amount: '' });
    setActiveActionPane(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Syncing Core Ledgers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-1 py-2 text-dark">
      
      {/* HERO TOTAL BALANCE BANNER */}
      <div 
        className="p-4 mb-3 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B4687 0%, #062D59 100%)',
          borderRadius: '14px',
          boxShadow: '0 8px 20px rgba(11, 70, 135, 0.12)'
        }}
      >
        <div>
          <span className="text-uppercase text-white-50 fw-bold tracking-wider" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
            Aggregated Net Ledger Balance
          </span>
          <h2 className="fw-extrabold my-1 tracking-tight text-white font-monospace" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}>
            UGX {summary?.total_balance?.toLocaleString()}
          </h2>
          <div className="d-inline-flex align-items-center gap-1.5 bg-white bg-opacity-15 rounded-pill px-2.5 py-0.5 mt-1" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-graph-up-arrow text-success"></i>
            <span className="fw-bold text-success">+UGX {summary?.monthly_delta?.toLocaleString()}</span> 
            <span className="text-white-50">accumulated this cycle</span>
          </div>
        </div>
        
        <div className="mt-3 mt-md-0 d-flex flex-row flex-md-column justify-content-between align-items-md-end gap-2" style={{ zIndex: 1 }}>
          <div className="text-md-end text-white-50 small font-monospace" style={{ fontSize: '0.72rem' }}>
            Operational Node: <strong className="text-white">Active Secure</strong>
          </div>
          <button 
            className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-bold text-xs text-white shadow-sm border-0"
            type="button"
            onClick={() => {
              setPaymentStatus({ type: '', message: '' });
              setShowModal(true);
            }}
          >
            <i className="bi bi-phone-vibrate-fill"></i> Mobile Money Deposit
          </button>
        </div>
      </div>

      {/* INTERACTIVE QUICK ACTIONS ACTION PIPELINE */}
      <div className="row g-2 mb-3">
        {[
          { label: 'Transfer', icon: 'bi-telegram', color: '#0284C7', bg: '#E0F2FE' },
          { label: 'Apply Loan', icon: 'bi-file-earmark-text', color: '#B45309', bg: '#FEF3C7' },
          { label: 'Pay Bill', icon: 'bi-receipt', color: '#6D28D9', bg: '#EDE9FE' },
          { label: 'Statement', icon: 'bi-file-text', color: '#0F766E', bg: '#CCFBF1' }
        ].map((action, idx) => (
          <div className="col-6 col-md-3" key={idx}>
            <button 
              className={`btn w-100 bg-white border p-2.5 d-flex align-items-center gap-3 text-start ${activeActionPane === action.label ? 'border-primary shadow-sm' : ''}`}
              style={{ borderRadius: '10px', transition: 'all 0.15s ease' }}
              type="button"
              onClick={() => setActiveActionPane(activeActionPane === action.label ? null : action.label)}
            >
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '38px', height: '38px', backgroundColor: action.bg, color: action.color }}
              >
                <i className={`bi ${action.icon} fs-5`}></i>
              </div>
              <div className="overflow-hidden">
                <span className="fw-bold text-dark d-block text-xs mb-0">{action.label}</span>
                <span className="text-muted extra-small d-block" style={{ fontSize: '0.65rem' }}>Open Tool</span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* DYNAMIC ACTION DRAWER INTERFACE CONTAINER */}
      {activeActionPane && (
        <div className="card border-primary p-3 mb-3 bg-light-subtle rounded-3 shadow-sm animate-fade-in">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <span className="fw-bold text-primary text-xs text-uppercase tracking-wider">
              <i className="bi bi-sliders me-1.5"></i> Execution Stream: Internal {activeActionPane} Workflow
            </span>
            <button type="button" className="btn-close" style={{ transform: 'scale(0.75)' }} onClick={() => setActiveActionPane(null)}></button>
          </div>
          <form onSubmit={handleExecuteQuickAction} className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label extra-small fw-bold text-muted mb-1">
                {activeActionPane === 'Pay Bill' ? 'Utility/Biller Code' : activeActionPane === 'Statement' ? 'Target File Format' : 'Counterparty Account'}
              </label>
              {activeActionPane === 'Statement' ? (
                <select className="form-select form-select-sm bg-white text-dark text-xs py-1.5" value={actionInput.target} onChange={(e) => setActionInput({...actionInput, target: e.target.value})} required>
                  <option value="">Select format...</option>
                  <option value="csv">Standard Ledger Audit Spreadsheet (.CSV)</option>
                  <option value="pdf">Cleared Corporate Statement Archive (.PDF)</option>
                </select>
              ) : (
                <input type="text" className="form-control form-control-sm bg-white text-dark text-xs py-1.5" placeholder="Enter routing reference ID..." value={actionInput.target} onChange={(e) => setActionInput({...actionInput, target: e.target.value})} required />
              )}
            </div>
            {activeActionPane !== 'Statement' && (
              <div className="col-12 col-md-3">
                <label className="form-label extra-small fw-bold text-muted mb-1">Execution Volume (UGX)</label>
                <input type="number" className="form-control form-control-sm bg-white text-dark text-xs py-1.5 font-monospace" placeholder="e.g. 100000" value={actionInput.amount} onChange={(e) => setActionInput({...actionInput, amount: e.target.value})} required />
              </div>
            )}
            <div className="col-12 col-md-3">
              <label className="form-label extra-small fw-bold text-muted mb-1">Operational Description / Remarks</label>
              <input type="text" className="form-control form-control-sm bg-white text-dark text-xs py-1.5" placeholder="Reference note text..." value={actionInput.detail} onChange={(e) => setActionInput({...actionInput, detail: e.target.value})} />
            </div>
            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-sm btn-primary w-100 fw-bold text-xs py-1.5">Commit Engine</button>
            </div>
          </form>
        </div>
      )}

      {/* ACCOUNT OVERVIEW SECTION */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-xs text-uppercase tracking-wider text-muted">Core Portfolio Metrics</span>
          <a href="/accounts" className="text-decoration-none extra-small fw-bold text-primary">View Ledger Registry →</a>
        </div>

        <div className="row g-2">
          {/* Share Capital Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-3 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '10px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="rounded bg-light p-1.5 text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-bank fs-6"></i>
                  </div>
                  <span className="text-success extra-small fw-extrabold font-monospace bg-success-subtle px-1.5 py-0.5 rounded">+8.2% YoY</span>
                </div>
                <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.65rem' }}>Share Capital Asset Pool</span>
                <h4 className="fw-extrabold mt-1 mb-2 font-monospace text-dark">UGX {summary?.share_capital?.toLocaleString()}</h4>
              </div>
              <div className="pt-2 border-top text-success extra-small d-flex align-items-center gap-1.5" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-shield-check"></i> Meets statutory threshold parameters
              </div>
            </div>
          </div>

          {/* Active Loan Balance Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-3 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '10px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="rounded bg-light p-1.5 text-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-credit-card-2-front fs-6"></i>
                  </div>
                  <span className="badge text-uppercase bg-warning-subtle text-warning extra-small border-0 px-1.5 py-0.5">Amortizing</span>
                </div>
                <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.65rem' }}>Outstanding Loan Liability</span>
                <h4 className="fw-extrabold mt-1 mb-2 font-monospace text-dark">UGX {summary?.active_loan_balance?.toLocaleString()}</h4>
              </div>
              <div className="pt-1">
                <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: '0.68rem' }}>
                  <span>Term Maturity Track</span>
                  <span className="fw-bold text-dark">14 Months Left</span>
                </div>
                <div className="progress" style={{ height: '5px', borderRadius: '10px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dividend Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-3 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '10px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="rounded bg-light p-1.5 text-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-pie-chart fs-6"></i>
                  </div>
                  <span className="badge bg-success-subtle text-success text-uppercase border-0 px-2 py-0.5" style={{ fontSize: '0.62rem', fontWeight: '800' }}>Reconciled</span>
                </div>
                <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.65rem' }}>Dividend Yield Accrual</span>
                <h4 className="fw-extrabold mt-1 mb-2 font-monospace text-dark">UGX {summary?.dividend_2024?.toLocaleString()}</h4>
              </div>
              <div className="pt-2 border-top text-muted extra-small d-flex align-items-center gap-1.5" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-info-circle-fill"></i> Calculated at 12.00% weighted rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANVAS DUAL INTERNALS ROW */}
      <div className="row g-3">
        {/* RECENT TRANSACTIONS TABLE PANEL */}
        <div className="col-12 col-lg-7">
          <div className="bg-white border p-3 h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-xs text-uppercase tracking-wider text-muted">Recent Transaction Vault</span>
              <button className="btn btn-xs btn-outline-secondary px-2.5 py-1 d-flex align-items-center gap-1.5 rounded-3 text-xs fw-semibold">
                <i className="bi bi-file-earmark-pdf"></i> Export Audit Log
              </button>
            </div>

            <div className="table-responsive" style={{ maxHeight: '235px' }}>
              <table className="table table-sm table-borderless align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase sticky-top" style={{ borderBottom: '1px solid #E2E8F0', top: 0 }}>
                  <tr>
                    <th className="py-2 ps-1 text-xs fw-extrabold">Description Node</th>
                    <th className="py-2 text-xs fw-extrabold">Value Date</th>
                    <th className="py-2 text-end pe-1 text-xs fw-extrabold">Amount Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.recent_transactions?.map((row, index) => (
                    <tr key={index} className="border-bottom" style={{ borderColor: '#F1F5F9' }}>
                      <td className="py-2 ps-1 d-flex align-items-center gap-2">
                        <div className={`rounded ${row.bg} d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '30px', height: '30px' }}>
                          <i className={`bi ${row.icon}`} style={{ fontSize: '0.9rem' }}></i>
                        </div>
                        <span className="fw-bold text-dark text-xs text-truncate" style={{ maxWidth: '160px' }}>{row.title}</span>
                      </td>
                      <td className="py-2 text-muted font-monospace" style={{ fontSize: '0.7rem' }}>{row.date}</td>
                      <td className={`py-2 text-end pe-1 font-monospace text-xs fw-extrabold ${row.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {row.type === 'credit' ? `+UGX ${row.amt}` : `UGX ${row.amt}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SAVINGS GOALS CONTEXT MONITOR */}
        <div className="col-12 col-lg-5">
          <div className="bg-white border p-3 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '12px' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-xs text-uppercase tracking-wider text-muted">Target Allocation Tracks</span>
                <button className="btn btn-link p-0 text-primary border-0 bg-transparent" aria-label="Add Allocation Goal">
                  <i className="bi bi-plus-circle-fill fs-5"></i>
                </button>
              </div>

              <div className="vstack gap-2.5">
                {summary?.goals?.map((goal, index) => (
                  <div key={index} className="border rounded p-2 bg-light-subtle">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark text-xs">{goal.name}</span>
                      <span className="badge bg-primary-subtle text-primary font-monospace fw-extrabold text-xs">{goal.pct}</span>
                    </div>
                    <div className="progress mb-1" style={{ height: '6px', borderRadius: '10px' }}>
                      <div className={`progress-bar ${goal.color}`} role="progressbar" style={{ width: goal.pct }}></div>
                    </div>
                    <div className="d-flex justify-content-between font-monospace text-muted" style={{ fontSize: '0.65rem' }}>
                      <span>Settle: UGX {goal.current}</span>
                      <span>Cap: {goal.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-3 mt-3 d-flex gap-2.5 align-items-start" style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE' }}>
              <i className="bi bi-info-circle-fill text-primary fs-6 mt-0.5"></i>
              <div>
                <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.74rem' }}>Predictive Engine Insight</div>
                <p className="text-muted mb-0 lh-sm" style={{ fontSize: '0.68rem' }}>
                  Increasing structural capital deposits by 15.00% advances milestone goals by 4 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MONEY DEPOSIT CHALLENGE OVERLAY MODAL */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-1 bg-white">
              
              <div className="modal-header border-0 pb-1 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                    <i className="bi bi-phone-vibrate fs-5"></i>
                  </div>
                  <h6 className="modal-title fw-extrabold text-dark">Mobile Money Integration</h6>
                </div>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                ></button>
              </div>

              <form onSubmit={handleDepositSubmit}>
                <div className="modal-body py-2">
                  {paymentStatus.message && (
                    <div className={`alert alert-${paymentStatus.type} extra-small py-2 border-0 d-flex gap-2 mb-2 align-items-center`}>
                      <i className={`bi ${paymentStatus.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'}`}></i>
                      <div className="text-dark fw-semibold" style={{ fontSize: '0.7rem' }}>{paymentStatus.message}</div>
                    </div>
                  )}

                  <div className="mb-2">
                    <label className="form-label extra-small fw-bold text-muted mb-1">Deposit Amount (UGX)</label>
                    <input 
                      type="number" 
                      className="form-control form-control-sm bg-white font-monospace text-dark py-2 rounded-3 border"
                      placeholder="e.g. 50000"
                      required
                      min="500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="mb-1">
                    <label className="form-label extra-small fw-bold text-muted mb-1">Mobile Handset MSISDN</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light border-end-0 text-muted px-2.5 font-monospace text-xs">+256</span>
                      <input 
                        type="tel" 
                        className="form-control bg-white font-monospace text-dark py-2 rounded-end-3 border"
                        placeholder="701 234 567"
                        required
                        pattern="^[0-9]{9}$"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="form-text opacity-75 mt-1" style={{ fontSize: '0.65rem' }}>
                      Standard API gateway execution for MTN & Airtel routing profiles.
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-1.5 d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-light px-3 py-2 rounded-3 fw-bold text-secondary border"
                    onClick={() => setShowModal(false)}
                    disabled={isProcessing}
                  >
                    Abort
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-sm text-white px-3 py-2 rounded-3 fw-extrabold border-0 flex-grow-1 shadow-sm d-flex justify-content-center align-items-center gap-2"
                    style={{ backgroundColor: '#0B4687' }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                        <span style={{ fontSize: '0.72rem' }}>Piping API Call...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-phone-fill text-white"></i> Send Network Push Prompt
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}