import React, { useState, useMemo } from 'react';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTxns, setSelectedTxns] = useState([]);

  // Mock data with expanded status variety
  const transactionsData = [
    { id: 1, date: 'Oct 12, 2023', title: 'Monthly Savings', ref: 'MS-88291', type: 'credit', amt: 320000, status: 'Completed', icon: 'bi-piggy-bank', bg: '#DCFCE7' },
    { id: 2, date: 'Oct 08, 2023', title: 'Loan Repayment', ref: 'LN-442', type: 'debit', amt: 185000, status: 'Pending', icon: 'bi-cash-stack', bg: '#FEF9C3' },
    { id: 3, date: 'Oct 02, 2023', title: 'Withdrawal', ref: 'TR-EQU-99', type: 'debit', amt: 100000, status: 'Completed', icon: 'bi-bank', bg: '#E0F2FE' }
  ];

  const filtered = useMemo(() => transactionsData.filter(t => {
    const match = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'Credits') return match && t.type === 'credit';
    if (activeFilter === 'Debits') return match && t.type === 'debit';
    return match;
  }), [searchTerm, activeFilter]);

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* 1. TOP METRICS: Interactive Dashboard Stats */}
      <div className="row g-4 mb-4">
        {['Net Flow', 'Total Credits', 'Total Debits'].map((metric, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className="card border-0 shadow-sm p-4 hover-lift">
              <span className="small text-muted text-uppercase fw-bold">{metric}</span>
              <h3 className="fw-bold mt-2 font-monospace">UGX 35,000</h3>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success">↑ 4.2%</span>
                <span className="text-muted small">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. TRANSACTION BOARD */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0">Recent Activity</h5>
          <div className="d-flex gap-2">
            <input 
              className="form-control form-control-sm" 
              placeholder="Search..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <select className="form-select form-select-sm" onChange={(e) => setActiveFilter(e.target.value)}>
              <option>All</option>
              <option>Credits</option>
              <option>Debits</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Date</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-end pe-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="cursor-pointer">
                  <td className="ps-4 small text-muted">{row.date}</td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3" style={{ background: row.bg }}>
                        <i className={`bi ${row.icon}`}></i>
                      </div>
                      <div>
                        <div className="fw-bold">{row.title}</div>
                        <div className="small text-muted">{row.ref}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${row.status === 'Completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={`text-end pe-4 fw-bold ${row.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                    {row.type === 'credit' ? '+' : '-'} UGX {row.amt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. OPERATIONAL CTAS */}
      <div className="row mt-4 g-4">
        <div className="col-lg-8">
          <div className="card p-4 border-0 text-white" style={{ background: '#0F2942' }}>
            <h4>Audit Compliance Module</h4>
            <p className="opacity-75">Generate official, stamped statements for your records.</p>
            <button className="btn btn-outline-light w-25 mt-2">Download PDF</button>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card p-4 border-success text-success bg-success-subtle">
            <i className="bi bi-shield-lock fs-3 mb-2"></i>
            <h5>Need Assistance?</h5>
            <p className="small">Suspect unauthorized activity? Trigger a security freeze immediately.</p>
            <button className="btn btn-success btn-sm">Report Dispute</button>
          </div>
        </div>
      </div>
    </div>
  );
}