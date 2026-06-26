import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { 
  Download, Search, FileText, AlertTriangle, CheckCircle, 
  RefreshCw, Sliders, Filter, TrendingUp, DollarSign, 
  PieChart, Trash2, ShieldCheck, Plus, HelpCircle, X, 
  Activity, Percent, Calendar, UserCheck, Printer, Ban, ShieldAlert
} from "lucide-react";

// --- Enterprise Light Theme Directives ---
const DIVIDEND_THEME = {
  primary: '#2563eb',    
  success: '#16a34a',    
  warning: '#ea580c',    
  danger: '#dc2626',     
  bgLight: '#f8fafc',    
  cardBg: '#ffffff',     
  border: '#e2e8f0'
};

const formatCurrency = (val) => "UGX " + (Number(val) || 0).toLocaleString();

const DividendView = () => {
  // --- Active Sub-Tab Context (Equity / Share Classes) ---
  const [activeClassTab, setActiveClassTab] = useState("ORDINARY");

  // --- Central Dividend Ledger Dataset ---
  const [dividendLedger, setDividendLedger] = useState([
    { id: 501, shareClass: "ORDINARY", member: "Ankole Farmers Co-op", sharesHeld: 125000, ratePerShare: 150, grossAmount: 18750000, wht: 2812500, netPayable: 15937500, status: "Approved", signature: "SIG-ORD-88", isFrozen: false, residency: "Local" },
    { id: 502, shareClass: "PREFERENCE", member: "Masaka Agro-Processors", sharesHeld: 50000, ratePerShare: 200, grossAmount: 10000000, wht: 1500000, netPayable: 8500000, status: "Paid", signature: "SIG-PRF-12", isFrozen: false, residency: "Local" },
    { id: 503, shareClass: "ORDINARY", member: "Buganda Investment Club", sharesHeld: 12500, ratePerShare: 150, grossAmount: 1875000, wht: 281250, netPayable: 1593750, status: "Pending", signature: null, isFrozen: false, residency: "Local" },
    { id: 504, shareClass: "INSTITUTIONAL", member: "Western Sacco Apex Fund", sharesHeld: 680000, ratePerShare: 220, grossAmount: 149600000, wht: 22440000, netPayable: 127160000, status: "Approved", signature: null, isFrozen: false, residency: "Foreign" },
    { id: 505, shareClass: "ORDINARY", member: "Elgon Coffee Growers", sharesHeld: 8500, ratePerShare: 150, grossAmount: 1275000, wht: 191250, netPayable: 1083750, status: "Pending", signature: null, isFrozen: true, residency: "Local" },
    { id: 506, shareClass: "INSTITUTIONAL", member: "Victoria Basin Logistics", sharesHeld: 95000, ratePerShare: 220, grossAmount: 20900000, wht: 3135000, netPayable: 17765000, status: "Paid", signature: "SIG-INS-04", isFrozen: false, residency: "Local" }
  ]);

  // --- Control Matrix States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [residencyFilter, setResidencyFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDividendRow, setSelectedDividendRow] = useState(null);
  const [whtRateModifier, setWhtRateModifier] = useState(15); 
  const [globalRateOverride, setGlobalRateOverride] = useState(0); 
  const [toasts, setToasts] = useState([]);

  // --- New Record Fields ---
  const [newPayout, setNewPayout] = useState({ member: "", sharesHeld: "", ratePerShare: "150", shareClass: "ORDINARY", residency: "Local" });

  // FIXED: Guaranteed unique key tracking strategy for high-frequency actions
  const triggerToast = (msg, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // --- Feature Actions Matrix ---
  const handleSignDividendRow = (id) => {
    setDividendLedger(prev => prev.map(row => {
      if (row.id === id) {
        if (row.isFrozen) {
          triggerToast("Action Denied: Node payout parameter is frozen.", "danger");
          return row;
        }
        triggerToast(`Cryptographic payout clearance appended to Node #${id}`, "success");
        return { ...row, signature: `SIG-AUTH-${Date.now().toString().slice(-3)}`, status: "Approved" };
      }
      return row;
    }));
  };

  const handleToggleFreeze = (id) => {
    setDividendLedger(prev => prev.map(row => {
      if (row.id === id) {
        const targetState = !row.isFrozen;
        triggerToast(`Node #${id} operational status set to: ${targetState ? 'FROZEN' : 'ACTIVE'}`, "warning");
        return { ...row, isFrozen: targetState };
      }
      return row;
    }));
  };

  const handleBulkApproveVisible = () => {
    let count = 0;
    setDividendLedger(prev => prev.map(row => {
      const isMatch = row.shareClass === activeClassTab && row.status === "Pending" && !row.isFrozen;
      if (isMatch) {
        count++;
        return { ...row, status: "Approved", signature: `SIG-BULK-${Date.now().toString().slice(-3)}` };
      }
      return row;
    }));
    if(count > 0) triggerToast(`Batch execution matrix signed ${count} pending accounts.`, "success");
    else triggerToast("No eligible pending rows found to batch authorization.", "info");
  };

  const handlePurgeRow = (id) => {
    setDividendLedger(prev => prev.filter(row => row.id !== id));
    triggerToast(`Payout node #${id} removed from buffer.`, "danger");
    if (selectedDividendRow?.id === id) setSelectedDividendRow(null);
  };

  const handleCompilePayout = (e) => {
    e.preventDefault();
    const shares = Number(newPayout.sharesHeld) || 0;
    const baseRate = Number(newPayout.ratePerShare) || 0;
    const finalRate = baseRate + globalRateOverride;
    const gross = shares * finalRate;
    
    const effectiveTaxRate = newPayout.residency === "Foreign" ? (whtRateModifier * 1.3) : whtRateModifier;
    const calculatedWht = gross * (effectiveTaxRate / 100);

    const compiledItem = {
      id: Date.now() % 1000,
      shareClass: newPayout.shareClass,
      member: newPayout.member,
      sharesHeld: shares,
      ratePerShare: finalRate,
      grossAmount: gross,
      wht: calculatedWht,
      netPayable: gross - calculatedWht,
      status: "Pending",
      signature: null,
      isFrozen: false,
      residency: newPayout.residency
    };

    setDividendLedger([compiledItem, ...dividendLedger]);
    setIsModalOpen(false);
    setNewPayout({ member: "", sharesHeld: "", ratePerShare: "150", shareClass: "ORDINARY", residency: "Local" });
    triggerToast(`Manual allocation logged for ${compiledItem.member}`, "success");
  };

  // --- Memoized Multilevel Search & Filter Pipeline ---
  const filteredRows = useMemo(() => {
    return dividendLedger.map(row => {
      const currentRate = row.ratePerShare + globalRateOverride;
      const currentGross = row.sharesHeld * currentRate;
      const effectiveTaxRate = row.residency === "Foreign" ? (whtRateModifier * 1.3) : whtRateModifier;
      const currentWht = currentGross * (effectiveTaxRate / 100);
      return {
        ...row,
        ratePerShare: currentRate,
        grossAmount: currentGross,
        wht: currentWht,
        netPayable: currentGross - currentWht
      };
    }).filter(row => {
      const matchesClass = row.shareClass === activeClassTab;
      const matchesSearch = row.member.toLowerCase().includes(searchTerm.toLowerCase()) || row.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "ALL" || row.status.toUpperCase() === statusFilter;
      const matchesResidency = residencyFilter === "ALL" || row.residency.toUpperCase() === residencyFilter;
      return matchesClass && matchesSearch && matchesStatus && matchesResidency;
    });
  }, [dividendLedger, activeClassTab, searchTerm, statusFilter, residencyFilter, globalRateOverride, whtRateModifier]);

  // FIXED: Restored missing runtime context modeling calculator for the panel adjustments
  const structuralWhtAdjustment = useMemo(() => {
    if (!selectedDividendRow) return 0;
    
    // Find live modified state of the item inside our processing runtime pipeline
    const targetedLiveInstance = filteredRows.find(r => r.id === selectedDividendRow.id);
    if (targetedLiveInstance) return targetedLiveInstance.netPayable;

    const currentRate = selectedDividendRow.ratePerShare + globalRateOverride;
    const currentGross = selectedDividendRow.sharesHeld * currentRate;
    const effectiveTaxRate = selectedDividendRow.residency === "Foreign" ? (whtRateModifier * 1.3) : whtRateModifier;
    return currentGross - (currentGross * (effectiveTaxRate / 100));
  }, [selectedDividendRow, filteredRows, globalRateOverride, whtRateModifier]);

  // --- Analytical Calculations ---
  const financialTotals = useMemo(() => {
    return filteredRows.reduce((acc, r) => {
      acc.gross += r.grossAmount;
      acc.wht += r.wht;
      acc.net += r.netPayable;
      acc.totalShares += r.sharesHeld;
      if (r.status === "Paid") acc.paidAmount += r.netPayable;
      return acc;
    }, { gross: 0, wht: 0, net: 0, totalShares: 0, paidAmount: 0 });
  }, [filteredRows]);

  const payoutProgressPercent = useMemo(() => {
    if (financialTotals.net === 0) return 0;
    return Math.round((financialTotals.paidAmount / financialTotals.net) * 100);
  }, [financialTotals]);

  // --- Datagrid Schema Configuration ---
  const columnsSchema = [
    {
      name: "BENEFICIARY MEMBER ENTITY",
      selector: row => row.member,
      sortable: true,
      cell: row => {
        const isHighEquityHolder = row.sharesHeld >= 100000;
        return (
          <div className="py-2" style={{ opacity: row.isFrozen ? 0.5 : 1 }}>
            <div className="d-flex align-items-center gap-1.5 flex-wrap">
              <span className="font-monospace text-xs text-primary fw-bold">#DIV-{row.id}</span>
              {row.signature && <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '9px', padding: '1px 4px' }}>{row.signature}</span>}
              {row.isFrozen && <span className="badge bg-danger-subtle text-danger font-monospace" style={{ fontSize: '9px', padding: '1px 4px' }}>FROZEN</span>}
              <span className="badge bg-light text-muted font-monospace border" style={{ fontSize: '9px' }}>{row.residency}</span>
            </div>
            <div className="d-flex align-items-center gap-1 mt-0.5">
              <span className="fw-bold text-dark text-sm">{row.member}</span>
              {isHighEquityHolder && <ShieldAlert size={12} className="text-warning" title="Large Block Holder" />}
            </div>
          </div>
        );
      }
    },
    {
      name: "SHARES RECORDED",
      selector: row => row.sharesHeld,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-bold text-dark">{row.sharesHeld.toLocaleString()} Pcs</span>
    },
    {
      name: "CALCULATED RATE",
      selector: row => row.ratePerShare,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace text-muted">{row.ratePerShare} UGX</span>
    },
    {
      name: "NET PAYABLE",
      selector: row => row.netPayable,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-extrabold text-success">{formatCurrency(row.netPayable)}</span>
    },
    {
      name: "STATUS",
      selector: row => row.status,
      sortable: true,
      center: true,
      cell: row => (
        <span className={`badge px-2.5 py-1.5 rounded-2 fw-bold text-xs ${
          row.status === 'Paid' ? 'bg-success text-white' : 
          row.status === 'Approved' ? 'bg-primary text-white' : 'bg-warning-subtle text-warning'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      name: "AUDIT CONTROLS",
      center: true,
      cell: row => (
        <div className="d-flex gap-1">
          <button className="btn btn-xs btn-outline-primary p-1 rounded-2 border-light-subtle text-secondary" onClick={() => setSelectedDividendRow(row)}><Sliders size={12} /></button>
          <button className={`btn btn-xs p-1 rounded-2 border-light-subtle ${row.isFrozen ? 'btn-danger text-white' : 'btn-outline-warning text-warning'}`} onClick={() => handleToggleFreeze(row.id)} title="Toggle Lock Gate"><Ban size={12} /></button>
          <button className="btn btn-xs btn-outline-success p-1 rounded-2 border-light-subtle text-success" disabled={!!row.signature || row.isFrozen} onClick={() => handleSignDividendRow(row.id)}><ShieldCheck size={12} /></button>
          <button className="btn btn-xs btn-outline-danger p-1 rounded-2 border-light-subtle text-danger" onClick={() => handlePurgeRow(row.id)}><Trash2 size={12} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: DIVIDEND_THEME.bgLight, minHeight: '100vh', color: '#334155' }}>
      
      <style>{`
        .cyber-search-wrapper {
          position: relative;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 2px;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .cyber-search-wrapper:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          transform: translateY(-1px);
        }
        .cyber-search-input {
          background: transparent !important;
          color: #0f172a !important;
          font-size: 0.82rem !important;
          font-weight: 500;
          border: none !important;
          padding: 8px 12px 8px 40px !important;
          border-radius: 10px;
        }
        .cyber-search-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-clear-trigger {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          border: none;
          background: transparent;
          padding: 2px;
          border-radius: 50%;
        }
        .search-clear-trigger:hover { color: #dc2626; background: #fee2e2; }

        .rdt_Table { background-color: #ffffff !important; color: #334155 !important; }
        .rdt_TableRow { background-color: #ffffff !important; color: #334155 !important; border-bottom: 1px solid #e2e8f0 !important; }
        .rdt_TableRow:hover { background-color: #f8fafc !important; }
        .rdt_Pagination { background-color: #ffffff !important; color: #64748b !important; border-top: 1px solid #e2e8f0 !important; }
      `}</style>

      {/* Messaging Log System */}
      <div className="position-fixed top-0 end-0 p-3 no-print" style={{ zIndex: 1200, maxWidth: '370px' }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast show shadow-lg mb-2 p-3 border-0 d-flex align-items-center" style={{ borderRadius: '8px', background: '#ffffff', borderLeft: `4px solid ${t.type === 'danger' ? '#dc2626' : '#2563eb'}` }}>
            <div className="toast-body p-0 text-xs fw-semibold text-dark flex-grow-1">{t.msg}</div>
            <button type="button" className="btn-close ms-2" style={{ fontSize: '0.6rem' }} onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}></button>
          </div>
        ))}
      </div>

      {/* Control Header Panel */}
      <div className="card border-0 p-4 mb-4 shadow-sm rounded-4" style={{ background: DIVIDEND_THEME.cardBg, border: `1px solid ${DIVIDEND_THEME.border}` }}>
        <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success text-uppercase text-xs fw-extrabold px-2.5 py-1">Distribution Hub</span>
              <div className="d-flex align-items-center gap-1 font-monospace text-xs text-muted">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '6px', height: '6px' }}></span>
                Gateway Connected
              </div>
            </div>
            <h3 className="fw-extrabold mb-0 tracking-tight text-dark">Dividend Settlement Registry</h3>
            <p className="text-muted small mb-0">Manage allocations, isolate foreign/local tiered withholding taxes, and freeze compromised nodes.</p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="cyber-search-wrapper" style={{ minWidth: '310px' }}>
              <span className="cyber-search-icon"><Search size={14} /></span>
              <input 
                type="text"
                className="form-control cyber-search-input"
                placeholder="Search beneficiary rows, IDs or classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear-trigger" onClick={() => setSearchTerm("")}>
                  <X size={12} />
                </button>
              )}
            </div>

            <button className="btn btn-sm btn-outline-secondary p-2.5 rounded-3 border-light-subtle text-dark" onClick={() => window.print()}><Printer size={13} /></button>
            <button className="btn btn-sm btn-primary fw-bold text-xs px-3 py-2 rounded-3 d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
              <Plus size={12} /> Declare Distribution
            </button>
          </div>
        </div>
      </div>

      {/* Equity Class Sub-Navigation Tab Structure */}
      <div className="card border-0 p-1.5 mb-4 rounded-3 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
        <ul className="nav nav-pills d-flex flex-wrap gap-1 p-0 m-0 list-unstyled">
          {[
            { id: "ORDINARY", label: "Ordinary Share Ledger", icon: <Percent size={14} /> },
            { id: "PREFERENCE", label: "Preference Fixed Pool", icon: <DollarSign size={14} /> },
            { id: "INSTITUTIONAL", label: "Institutional Apex Portfolios", icon: <UserCheck size={14} /> }
          ].map((tab) => (
            <li key={tab.id} className="flex-grow-1 flex-md-grow-0">
              <button 
                className={`nav-link w-100 d-flex align-items-center justify-content-center gap-2 fw-extrabold text-xs px-3 py-2.5 border-0 rounded-2 transition-all ${activeClassTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-muted bg-transparent'}`}
                onClick={() => {
                  setActiveClassTab(tab.id);
                  setSelectedDividendRow(null);
                }}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Core Financial KPI Dashboard Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid ${DIVIDEND_THEME.primary}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Gross Pool Allocations</span>
            <h4 className="fw-extrabold text-dark tracking-tight mb-0 font-monospace">{formatCurrency(financialTotals.gross)}</h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid ${DIVIDEND_THEME.warning}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Withholding Tax Vol</span>
            <h4 className="fw-extrabold text-warning tracking-tight mb-0 font-monospace">{formatCurrency(financialTotals.wht)}</h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid ${DIVIDEND_THEME.success}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Net Settle Requirements</span>
            <h4 className="fw-extrabold text-success tracking-tight mb-0 font-monospace">{formatCurrency(financialTotals.net)}</h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid #94a3b8` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Payout Deployment Speed</span>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <span className="text-xs fw-extrabold text-dark font-monospace">{payoutProgressPercent}% Disbursed</span>
              <div className="progress flex-grow-1 ms-2 bg-light border" style={{ height: '6px', borderRadius: '3px', maxWidth: '100px' }}>
                <div className="progress-bar bg-success" style={{ width: `${payoutProgressPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI Presentation Splitter Block */}
      <div className="row g-4">
        
        {/* Left Hand Registry Ledger Node */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
            <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center border-bottom pb-3 mb-2 gap-2">
              <span className="fw-extrabold text-dark text-base d-flex align-items-center gap-2"><Activity size={16} className="text-primary"/>Execution Matrix ({filteredRows.length} Nodes Mixed)</span>
              
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <select 
                  className="form-select form-select-sm bg-white text-dark border-light-subtle rounded-2 text-xs fw-semibold py-1.5"
                  style={{ width: '120px' }} value={residencyFilter} onChange={(e) => setResidencyFilter(e.target.value)}
                >
                  <option value="ALL">All Regions</option>
                  <option value="LOCAL">Local Nodes</option>
                  <option value="FOREIGN">Foreign Corps</option>
                </select>

                <select 
                  className="form-select form-select-sm bg-white text-dark border-light-subtle rounded-2 text-xs fw-semibold py-1.5"
                  style={{ width: '130px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending Audit</option>
                  <option value="APPROVED">Approved Matrix</option>
                  <option value="PAID">Disbursed Ledger</option>
                </select>

                <button className="btn btn-sm btn-outline-primary fw-extrabold rounded-2 text-xs py-1.5 px-2.5" onClick={handleBulkApproveVisible}>
                  Bulk Sign Pending
                </button>
              </div>
            </div>

            {filteredRows.length === 0 ? (
              <div className="p-5 text-center my-3 bg-light rounded-3 border border-dashed">
                <AlertTriangle size={32} className="text-warning opacity-50 mb-2 mx-auto" />
                <h6 className="fw-bold text-dark mb-1">No Payout Records Available</h6>
                <p className="text-muted text-xs mb-0">No records map to the active parameters configured above.</p>
              </div>
            ) : (
              <DataTable 
                noHeader columns={columnsSchema} data={filteredRows} 
                pagination highlightOnHover responsive
                customStyles={{
                  headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
                  headCells: { style: { color: '#64748b', fontWeight: '800', fontSize: '0.68rem' } }
                }}
              />
            )}
          </div>
        </div>

        {/* Right Hand Parameter Modifier Controls */}
        <div className="col-12 col-lg-4">
          
          <div className="card border-0 p-3 mb-4 rounded-4 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 bg-primary-subtle text-primary rounded-3"><Sliders size={15} /></div>
              <h6 className="fw-extrabold text-dark tracking-tight mb-0">Live Global Rates Overlay</h6>
            </div>

            <div className="vstack gap-3">
              <div>
                <label className="form-label text-muted text-xs d-flex justify-content-between fw-bold mb-1">
                  <span>Base Tax Vector Rate (WHT):</span>
                  <span className="text-primary font-monospace fw-extrabold">{whtRateModifier}% Base</span>
                </label>
                <input 
                  type="range" className="form-range" min="5" max="25" step="2.5" 
                  value={whtRateModifier} onChange={(e) => setWhtRateModifier(Number(e.target.value))} 
                />
                <span className="text-muted font-monospace d-block text-start mt-1" style={{ fontSize: '9px' }}>*Foreign entities inherit a mandatory 1.3x tax modifier multiplier.</span>
              </div>

              <div>
                <label className="form-label text-muted text-xs d-flex justify-content-between fw-bold mb-1">
                  <span>Dynamic Value Rate Shift Override:</span>
                  <span className="text-success font-monospace fw-extrabold">+{globalRateOverride} UGX/Share</span>
                </label>
                <input 
                  type="range" className="form-range" min="-50" max="100" step="5" 
                  value={globalRateOverride} onChange={(e) => setGlobalRateOverride(Number(e.target.value))} 
                />
              </div>

              {!selectedDividendRow ? (
                <div className="p-3 text-center bg-light rounded-3 border border-dashed mt-1">
                  <HelpCircle size={18} className="text-muted opacity-50 mb-1 mx-auto" />
                  <p className="text-muted text-xs mb-0">Select any line item's slider controller to visualize localized tax modifications.</p>
                </div>
              ) : (
                <div className="vstack gap-2 border-top pt-2">
                  <div className="p-2.5 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-xs fw-extrabold text-dark">{selectedDividendRow.member}</span>
                      <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedDividendRow(null)}><X size={13} /></button>
                    </div>
                    <span className="text-muted d-block font-monospace" style={{ fontSize: '10px' }}>Shares Bound: {selectedDividendRow.sharesHeld.toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-dark text-white rounded-3">
                    <span className="text-uppercase text-white-50 d-block font-monospace" style={{ fontSize: '0.6rem' }}>Adjusted Node Payout Value</span>
                    <h4 className="fw-extrabold font-monospace text-info mt-1 mb-0">
                      {formatCurrency(structuralWhtAdjustment)}
                    </h4>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Asset Split Segment Card */}
          <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2 text-sm">
              <PieChart size={15} className="text-primary" /> Share Pool Proportional Density
            </h6>
            <span className="text-muted d-block text-xs mb-2">Total tracked shares inside this filter viewport:</span>
            <div className="p-2.5 bg-light rounded-2 font-monospace fw-bold text-dark border text-center text-sm">
              {financialTotals.totalShares.toLocaleString()} Total Units
            </div>
          </div>

        </div>
      </div>

      {/* Declare Distribution Modal Window Setup */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: DIVIDEND_THEME.cardBg }}>
              <div className="modal-header bg-light text-dark border-bottom p-3">
                <h5 className="modal-title fw-bold text-base d-flex align-items-center gap-2">
                  <FileText size={17} className="text-primary" /> Declare New Dividend Payout Target
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCompilePayout}>
                <div className="modal-body p-4 vstack gap-3 text-dark">
                  <div>
                    <label className="form-label text-xs fw-bold text-muted">Share Classification Type</label>
                    <select 
                      className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2"
                      value={newPayout.shareClass} onChange={(e) => setNewPayout({...newPayout, shareClass: e.target.value})}
                    >
                      <option value="ORDINARY">Ordinary Shares</option>
                      <option value="PREFERENCE">Preference Shares</option>
                      <option value="INSTITUTIONAL">Institutional Portfolios</option>
                    </select>
                  </div>
                  <div className="row g-2">
                    <div className="col-8">
                      <label className="form-label text-xs fw-bold text-muted">Beneficiary Member Title Name</label>
                      <input 
                        type="text" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                        placeholder="e.g., Albertine Regional Network" required
                        value={newPayout.member} onChange={(e) => setNewPayout({...newPayout, member: e.target.value})}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label text-xs fw-bold text-muted">Residency Tag</label>
                      <select 
                        className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2"
                        value={newPayout.residency} onChange={(e) => setNewPayout({...newPayout, residency: e.target.value})}
                      >
                        <option value="Local">Local</option>
                        <option value="Foreign">Foreign</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Total Shares Held</label>
                      <input 
                        type="number" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                        placeholder="10000" required
                        value={newPayout.sharesHeld} onChange={(e) => setNewPayout({...newPayout, sharesHeld: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Declared Rate Per Share</label>
                      <input 
                        type="number" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                        placeholder="150" required
                        value={newPayout.ratePerShare} onChange={(e) => setNewPayout({...newPayout, ratePerShare: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top p-3 bg-light d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary rounded-2 text-dark" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-bold">Commit Declaration</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DividendView;