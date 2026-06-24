import React, { useState } from 'react';

export default function Transactions() {
  // State management for searching and filtering the transaction table matrix
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Static transactional data ledger standardized to UGX currency
  const transactionsData = [
    { id: 1, date: 'Oct 12, 2023', title: 'Monthly savings', ref: 'Reference: MS-88291', type: 'credit', amt: '320,000', status: 'Completed', icon: 'bi-piggy-bank text-success', bg: '#DCFCE7' },
    { id: 2, date: 'Oct 08, 2023', title: 'Loan repayment', ref: 'Agri-Input Loan #442', type: 'debit', amt: '-185,000', status: 'Completed', icon: 'bi-cash-stack text-danger', bg: '#FEE2E2' },
    { id: 3, date: 'Oct 02, 2023', title: 'Withdrawal', ref: 'Bank Transfer to Equity', type: 'debit', amt: '-100,000', status: 'Completed', icon: 'bi-bank text-primary', bg: '#E0F2FE' }
  ];

  // Dynamic filter engine logic with safe fallbacks
  const filteredTransactions = (transactionsData || []).filter(item => {
    if (!item) return false;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.ref || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilter === 'All' || 
                          (activeFilter === 'Credits' && item.type === 'credit') || 
                          (activeFilter === 'Debits' && item.type === 'debit');
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* 1. THREE-COLUMN METRICS SUMMARY SLATS */}
      <div className="row g-3 mb-4">
        {/* Net Monthly Flow Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white border p-3.5 h-100" style={{ borderRadius: '12px' }}>
            <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              Net Monthly Flow
            </span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-navy-dark" style={{ color: '#0F2942', fontSize: '1.75rem' }}>UGX 35,000</h3>
              <span className="text-success fw-bold extra-small" style={{ fontSize: '0.75rem' }}>+12%</span>
            </div>
            <div className="progress mt-2.5" style={{ height: '4px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
              <div className="progress-bar bg-success" role="progressbar" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Total Credits Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white border p-3.5 h-100" style={{ borderRadius: '12px' }}>
            <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              Total Credits
            </span>
            <h3 className="fw-bold mt-1 mb-0 text-success" style={{ fontSize: '1.75rem' }}>UGX 320,000</h3>
            <span className="text-muted d-block mt-1" style={{ fontSize: '0.74rem' }}>From 1 source this month</span>
          </div>
        </div>

        {/* Total Debits Card */}
        <div className="col-12 col-md-4">
          <div className="bg-white border p-3.5 h-100" style={{ borderRadius: '12px' }}>
            <span className="text-uppercase text-muted fw-bold font-monospace d-block" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              Total Debits
            </span>
            <h3 className="fw-bold mt-1 mb-0" style={{ color: '#B91C1C', fontSize: '1.75rem' }}>UGX 285,000</h3>
            <span className="text-muted d-block mt-1" style={{ fontSize: '0.74rem' }}>2 major repayments/withdrawals</span>
          </div>
        </div>
      </div>

      {/* 2. TRANSACTION HISTORY CENTRAL MATRIX BOARD */}
      <div className="bg-white border mb-4" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
        {/* Component Slat Header */}
        <div className="p-4 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3" style={{ borderColor: '#F1F5F9' }}>
          <div>
            <h5 className="fw-bold mb-0 text-navy-dark" style={{ color: '#0F2942' }}>Transaction History</h5>
            <p className="text-muted mb-0 small mt-0.5">Review your recent financial activities and statements.</p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {/* Embedded Search Filter Interaction */}
            <input 
              type="text" className="form-control form-control-sm bg-light bg-opacity-40 px-3 py-1.5 small" 
              placeholder="Search text description..." style={{ width: '200px', borderRadius: '6px' }}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 rounded-2 small" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-funnel"></i> {activeFilter}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border small">
                <li><button type="button" className="dropdown-item" onClick={() => setActiveFilter('All')}>All Actions</button></li>
                <li><button type="button" className="dropdown-item" onClick={() => setActiveFilter('Credits')}>Credits Only</button></li>
                <li><button type="button" className="dropdown-item" onClick={() => setActiveFilter('Debits')}>Debits Only</button></li>
              </ul>
            </div>

            <button className="btn btn-sm text-white px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 rounded-2 small" style={{ backgroundColor: '#0F2942' }} type="button">
              <i className="bi bi-download"></i> Statement
            </button>
          </div>
        </div>

        {/* Main Data View Table Grid */}
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead className="table-light text-muted fw-bold font-monospace text-uppercase" style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <tr>
                <th className="py-3 ps-4" style={{ width: '18%' }}>Date</th>
                <th className="py-3">Description</th>
                <th className="py-3 text-center" style={{ width: '15%' }}>Status</th>
                <th className="py-3 text-end pe-4" style={{ width: '25%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((row) => (
                  <tr key={row.id} className="border-bottom" style={{ borderColor: '#F8FAFC' }}>
                    <td className="py-3.5 ps-4 text-secondary small">{row.date}</td>
                    <td className="py-3.5 d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', backgroundColor: row.bg }}>
                        <i className={`bi ${row.icon} fs-5`}></i>
                      </div>
                      <div>
                        <span className="fw-bold text-dark d-block small mb-0.5">{row.title}</span>
                        <span className="text-muted extra-small d-block" style={{ fontSize: '0.74rem' }}>{row.ref}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="badge border-0 px-2.5 py-1 text-success bg-success-subtle rounded-3 text-uppercase font-monospace fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.04em' }}>
                        {row.status}
                      </span>
                    </td>
                    <td className={`py-3.5 text-end pe-4 fw-bold small ${row.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                      {row.type === 'credit' ? `+UGX ${row.amt}` : `UGX ${row.amt}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted small">
                    <i className="bi bi-folder-x d-block fs-2 mb-2 opacity-50"></i>
                    No matches found matching criteria statements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Interface Footer Component */}
        <div className="px-4 py-3 bg-light bg-opacity-40 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2" style={{ borderColor: '#F1F5F9', fontSize: '0.8rem' }}>
          <span className="text-muted">Showing {filteredTransactions.length} of {transactionsData.length} transactions</span>
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm mb-0 rounded gap-1">
              <li className="page-item disabled"><span className="page-link border bg-light px-2.5 py-1"><i className="bi bi-chevron-left"></i></span></li>
              <li className="page-item active"><span className="page-link px-3 py-1 border-0" style={{ backgroundColor: '#0F2942', cursor: 'pointer' }}>1</span></li>
              <li className="page-item"><span className="page-link border text-dark px-3 py-1" style={{ cursor: 'pointer' }}>2</span></li>
              <li className="page-item"><span className="page-link border text-dark px-3 py-1" style={{ cursor: 'pointer' }}>3</span></li>
              <li className="page-item"><span className="page-link border text-dark px-2.5 py-1" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-right"></i></span></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 3. LOWER SPLIT MODULE: AUDIT CTAS & SECURITY ACTION BOX BANNER */}
      <div className="row g-4">
        {/* Left Interactive Audit Card Block */}
        <div className="col-12 col-lg-8">
          <div 
            className="p-4 text-white d-flex flex-column justify-content-between position-relative overflow-hidden shadow-sm"
            style={{ 
              borderRadius: '12px', 
              backgroundColor: '#002D5A', 
              minHeight: '220px',
              backgroundImage: 'radial-gradient(circle at 90% 90%, rgba(11, 70, 135, 0.4) 0%, transparent 70%)'
            }}
          >
            <div className="w-100 w-md-75 z-1">
              <h4 className="fw-bold tracking-tight mb-2" style={{ fontSize: '1.6rem' }}>Need a detailed audit?</h4>
              <p className="opacity-75 small lh-base" style={{ fontSize: '0.88rem' }}>
                Request an official certified SACCO statement for the last 12 months delivered directly to your verified email address system repository.
              </p>
            </div>
            
            <div className="z-1 mt-3">
              <button 
                className="btn text-white px-4 py-2.5 fw-semibold shadow-sm transition-all"
                style={{ backgroundColor: '#016838', border: 'none', borderRadius: '8px', fontSize: '0.88rem' }}
                type="button"
              >
                Request Certified Statement
              </button>
            </div>
            
            <div className="position-absolute end-0 bottom-0 opacity-10 pe-4 pb-2 text-white pointer-events-none d-none d-md-block" style={{ fontSize: '7.5rem' }}>
              <i className="bi bi-file-earmark-text"></i>
            </div>
          </div>
        </div>

        {/* Right Cybersecurity Flag Warning Block */}
        <div className="col-12 col-lg-4">
          <div className="p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#99F6B4', borderRadius: '12px', border: '1px solid #4ADE80' }}>
            <div>
              <div className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm mb-3.5" style={{ width: '38px', height: '38px', color: '#16A34A' }}>
                <i className="bi bi-shield-lock-fill fs-5"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2" style={{ letterSpacing: '-0.01em' }}>Security Notice</h5>
              <p className="text-dark opacity-75 small lh-sm" style={{ fontSize: '0.82rem' }}>
                Did not recognize a transaction? Secure your account instantly or open a support portal query directly to our compliance officer line.
              </p>
            </div>
            
            <button className="btn btn-link p-0 fw-bold text-success text-decoration-none mt-4 text-start small d-flex align-items-center gap-1.5 transition-all" type="button">
              Report Dispute <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}