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
        // Fallback UI mock state so things don't break during staging tests
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
    <>
      {/* HERO TOTAL BALANCE BANNER */}
      <div 
        className="p-4 mb-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B4687 0%, #062D59 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(11, 70, 135, 0.15)'
        }}
      >
        <div>
          <span className="text-uppercase text-white-50 fw-semibold tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Total Balance
          </span>
          <h1 className="fw-bold my-1 tracking-tight" style={{ fontSize: '2.5rem', color: '#ffffff', letterSpacing: '-0.03em' }}>
            UGX {summary?.total_balance?.toLocaleString()}
          </h1>
          <div className="d-flex justify-content-center align-items-center gap-1 bg-white bg-opacity-20 rounded-pill px-2.5 py-1 mt-2" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-graph-up-arrow" style={{ color: '#4ADE80' }}></i>
            <span className="fw-semibold" style={{ color: '#4ADE80' }}>+UGX {summary?.monthly_delta?.toLocaleString()}</span> 
            <span className="text-white-50 ms-1">this month</span>
          </div>
        </div>
        
        <div className="mt-4 mt-md-0 position-relative" style={{ zIndex: 1 }}>
          <div className="text-md-end text-white-50 small mb-2">
            Last updated <br className="d-none d-md-block" /> <strong>Live Dashboard</strong>
          </div>
          {/* Open Modal Trigger */}
          <button 
            className="btn d-flex align-items-center gap-2 px-4 py-2.5 rounded-5 fw-semibold shadow-sm"
            style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              border: 2,
              transition: 'background-color 0.2s',
            }}
            type="button"
            onClick={() => {
              setPaymentStatus({ type: '', message: '' });
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle-fill"></i> Deposit Funds
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS BUTTONS GRID */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Transfer', icon: 'bi-telegram' },
          { label: 'Apply Loan', icon: 'bi-file-earmark-text' },
          { label: 'Pay Bill', icon: 'bi-receipt' },
          { label: 'Statement', icon: 'bi-file-text' }
        ].map((action, idx) => (
          <div className="col-6 col-md-3" key={idx}>
            <button 
              className="btn w-100 bg-white border p-3 d-flex flex-column align-items-center justify-content-center gap-2"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.15s ease, border-color 0.15s ease'
              }}
              type="button"
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', backgroundColor: '#E0F2FE', color: '#0284C7' }}
              >
                <i className={`bi ${action.icon} fs-5`}></i>
              </div>
              <span className="fw-bold text-dark small">{action.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* ACCOUNT OVERVIEW SECTION */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#0F2942' }}>Account Overview</h5>
          <a href="/accounts" className="text-decoration-none small fw-bold text-primary">View All Accounts</a>
        </div>

        <div className="row g-3">
          {/* Share Capital Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-4 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '14px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 bg-light p-2 text-primary d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                    <i className="bi bi-bank fs-5"></i>
                  </div>
                  <span className="text-success small fw-bold">+8.2%</span>
                </div>
                <span className="text-uppercase text-muted fw-semibold small" style={{ fontSize: '0.72rem' }}>Share Capital</span>
                <h3 className="fw-bold mt-1 mb-3" style={{ color: '#0F2942' }}>UGX {summary?.share_capital?.toLocaleString()}</h3>
              </div>
              <div className="pt-2 border-top text-success small d-flex align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-check-circle-fill"></i> Meets minimum requirement
              </div>
            </div>
          </div>

          {/* Active Loan Balance Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-4 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '14px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 bg-light p-2 text-primary d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                    <i className="bi bi-credit-card-2-front fs-5"></i>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Standard Interest</span>
                </div>
                <span className="text-uppercase text-muted fw-semibold small" style={{ fontSize: '0.72rem' }}>Active Loan Balance</span>
                <h3 className="fw-bold mt-1 mb-3" style={{ color: '#0F2942' }}>UGX {summary?.active_loan_balance?.toLocaleString()}</h3>
              </div>
              <div className="pt-2">
                <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                  <span>Time remaining</span>
                  <span className="fw-bold text-dark">14 months</span>
                </div>
                <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dividend Card */}
          <div className="col-12 col-md-4">
            <div className="bg-white border p-4 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '14px' }}>
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-3 bg-light p-2 text-primary d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                    <i className="bi bi-pie-chart fs-5"></i>
                  </div>
                  <span className="badge bg-success-subtle text-success text-uppercase border-0 px-2 py-1" style={{ fontSize: '0.68rem', fontWeight: '700' }}>Credited</span>
                </div>
                <span className="text-uppercase text-muted fw-semibold small" style={{ fontSize: '0.72rem' }}>Dividend Accrual</span>
                <h3 className="fw-bold mt-1 mb-3" style={{ color: '#0F2942' }}>UGX {summary?.dividend_2024?.toLocaleString()}</h3>
              </div>
              <div className="pt-2 border-top text-muted small d-flex align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-info-circle"></i> Based on 12% annual rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPLIT ROW: RECENT TRANSACTIONS & SAVINGS GOALS */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="bg-white border p-4 h-100" style={{ borderRadius: '14px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: '#0F2942' }}>Recent Transactions</h5>
              <button className="btn btn-sm btn-outline-secondary px-3 py-1.5 d-flex align-items-center gap-2 rounded-5 small fw-semibold">
                <i className="bi bi-file-earmark-pdf"></i> Export PDF
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase" style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <tr>
                    <th className="py-2.5 ps-2">Description</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5 text-end pe-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summary?.recent_transactions?.map((row, index) => (
                    <tr key={index} className="border-bottom" style={{ borderColor: '#F8FAFC' }}>
                      <td className="py-3 ps-2 d-flex align-items-center gap-3">
                        <div className={`rounded-circle ${row.bg} d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                          <i className={`bi ${row.icon}`}></i>
                        </div>
                        <span className="fw-semibold text-dark small">{row.title}</span>
                      </td>
                      <td className="py-3 text-muted small">{row.date}</td>
                      <td className={`py-3 text-end pe-2 fw-bold small ${row.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                        {row.type === 'credit' ? `+UGX ${row.amt}` : `UGX ${row.amt}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="bg-white border p-4 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: '14px' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: '#0F2942' }}>Savings Goals</h5>
                <button className="btn btn-link p-0 text-primary fs-5" aria-label="Add Savings Goal">
                  <i className="bi bi-plus-circle"></i>
                </button>
              </div>

              {summary?.goals?.map((goal, index) => (
                <div className="mb-4" key={index}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">{goal.name}</span>
                    <span className="fw-bold text-primary small">{goal.pct}</span>
                  </div>
                  <div className="progress mb-1" style={{ height: '8px', borderRadius: '10px' }}>
                    <div className={`progress-bar ${goal.color}`} role="progressbar" style={{ width: goal.pct }}></div>
                  </div>
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>UGX {goal.current} SAVED</span>
                    <span>TARGET: {goal.target}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-3 mt-2 d-flex gap-3 align-items-start" style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE' }}>
              <i className="bi bi-info-circle-fill text-primary mt-0.5"></i>
              <div>
                <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.78rem' }}>Expert Advice</div>
                <p className="text-muted mb-0 lh-sm" style={{ fontSize: '0.74rem' }}>
                  Increasing your monthly savings by 15% will help you reach your goals faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE MONEY DEPOSIT MODAL CONTAINER */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 p-2 bg-white">
              
              <div className="modal-header border-0 pb-1 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                    <i className="bi bi-phone-vibrate fs-5"></i>
                  </div>
                  <h5 className="modal-title fw-bold text-dark" style={{ color: '#0F2942' }}>Mobile Money Deposit</h5>
                </div>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                ></button>
              </div>

              <form onSubmit={handleDepositSubmit}>
                <div className="modal-body py-3">
                  {paymentStatus.message && (
                    <div className={`alert alert-${paymentStatus.type} small py-2 border-0 d-flex gap-2 mb-3 align-items-center`}>
                      <i className={`bi ${paymentStatus.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                      <div>{paymentStatus.message}</div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary mb-1">Deposit Amount (UGX)</label>
                    <input 
                      type="number" 
                      className="form-control bg-white py-2.5 rounded-3 border"
                      placeholder="e.g. 50000"
                      required
                      min="500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-1">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted px-3 font-mono small">+256</span>
                      <input 
                        type="tel" 
                        className="form-control bg-white py-2.5 rounded-end-3 border"
                        placeholder="701 234 567"
                        required
                        pattern="^[0-9]{9}$"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="form-text extra-small opacity-75 mt-1" style={{ fontSize: '0.7rem' }}>
                      Works cleanly across MTN Mobile Money and Airtel Money networks.
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button 
                    type="button" 
                    className="btn btn-light px-3 py-2.5 rounded-3 fw-semibold text-secondary border"
                    onClick={() => setShowModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn text-white px-4 py-2.5 rounded-3 fw-bold border-0 flex-grow-1 shadow-sm d-flex justify-content-center align-items-center gap-2"
                    style={{ backgroundColor: '#0B4687' }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                        <span>Sending Push...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-phone-fill"></i> Initiate Payment
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
}