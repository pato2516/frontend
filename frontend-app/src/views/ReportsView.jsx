import React, { useState, useMemo, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area, Legend 
} from "recharts";
import { 
  Download, Search, FileText, AlertTriangle, CheckCircle, 
  RefreshCw, Sliders, Filter, TrendingUp, Users, DollarSign, 
  PieChart, Trash2, ShieldAlert, Plus, HelpCircle, X, Layers,
  Activity, Award, ShieldCheck, Zap, Printer
} from "lucide-react";

// --- Enterprise Light Theme Directives ---
const AUDIT_THEME = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#0f172a',
  muted: '#64748b',
  bgLight: '#f8fafc', // Light Canvas Base
  cardBg: '#ffffff',  // Crisp White Cards
  border: '#e2e8f0'
};

const formatCurrency = (val) => "UGX " + (Number(val) || 0).toLocaleString();

const ReportsView = () => {
  // --- Core Active Context State Mapping (The 5 Core Audit Matrices) ---
  const [activeDomainTab, setActiveDomainTab] = useState(() => localStorage.getItem("rpt_active_tab") || "MEMBER");
  
  // --- Central Ledger Dataset Mock Arrays ---
  const [reportData, setReportData] = useState([
    { id: 201, domain: "MEMBER", entity: "Mukono Farmers Union", metricValue: 1250, targetValue: 1000, variance: 250, risk: "Low", status: "Verified", syncScore: 98, signature: null },
    { id: 202, domain: "LOAN", entity: "Sarah Mwangi Portfolio", metricValue: 45000000, targetValue: 50000000, variance: -5000000, risk: "High", status: "Flagged", syncScore: 89, signature: null },
    { id: 203, domain: "SAVINGS", entity: "Mandatory Shares Pool A", metricValue: 124000000, targetValue: 120000000, variance: 4000000, risk: "Low", status: "Verified", syncScore: 95, signature: null },
    { id: 204, domain: "ACCOUNTING", entity: "Kampala Central Operating Cash", metricValue: 32000000, targetValue: 32250000, variance: -250000, risk: "Medium", status: "Pending", syncScore: 78, signature: null },
    { id: 205, domain: "PERFORMANCE", entity: "Quarterly ROI Yield Index", metricValue: 14.2, targetValue: 12.5, variance: 1.7, risk: "Low", status: "Verified", syncScore: 100, signature: null },
    { id: 206, domain: "LOAN", entity: "Boda Boda Cluster Fin", metricValue: 18500000, targetValue: 19000000, variance: -500000, risk: "Medium", status: "Pending", syncScore: 91, signature: null },
    { id: 207, domain: "SAVINGS", entity: "Voluntary Tier-2 Vault", metricValue: 81500000, targetValue: 81500000, variance: 0, risk: "Low", status: "Verified", syncScore: 96, signature: null }
  ]);

  // --- Analytical UI & System Control States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditRow, setSelectedAuditRow] = useState(null);
  const [basisPointModifier, setBasisPointModifier] = useState(15);
  const [varianceAlertThreshold, setVarianceAlertThreshold] = useState(10); // Custom threshold %
  const [toasts, setToasts] = useState([]);
  
  // --- Socket Stream Telemetry Simulation Flags ---
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const liveSyncRef = useRef(null);

  // --- New Custom Row Generation State Matrix ---
  const [newEntry, setNewEntry] = useState({ entity: "", domain: "MEMBER", value: "", target: "", risk: "Low" });

  // --- Cache State on Update ---
  useEffect(() => {
    localStorage.setItem("rpt_active_tab", activeDomainTab);
  }, [activeDomainTab]);

  // --- Real-time Micro-Toast Log Broadcaster ---
  const triggerTelemetryToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // --- Automated Database Background Ingest Emulator ---
  useEffect(() => {
    if (isLiveActive) {
      liveSyncRef.current = setInterval(() => {
        setLastSyncTime(new Date());
        if (Math.random() > 0.65) {
          const domains = ["MEMBER", "LOAN", "SAVINGS", "ACCOUNTING", "PERFORMANCE"];
          const selectedDom = domains[Math.floor(Math.random() * domains.length)];
          const names = ["Arua Micro-SME", "Jinja Cooperative Sub-Node", "EBB Asset Register Base", "Western Region Cash Vault"];
          
          const dynamicPayload = {
            id: Math.floor(Math.random() * 800) + 300,
            domain: selectedDom,
            entity: names[Math.floor(Math.random() * names.length)],
            metricValue: Math.floor(Math.random() * 20000000) + 1000000,
            targetValue: Math.floor(Math.random() * 20000000) + 1000000,
            variance: Math.floor(Math.random() * 1000000) - 500000,
            risk: Math.random() > 0.7 ? "High" : (Math.random() > 0.4 ? "Medium" : "Low"),
            status: Math.random() > 0.6 ? "Verified" : "Pending",
            syncScore: Math.floor(Math.random() * 25) + 75,
            signature: null
          };

          setReportData(prev => [dynamicPayload, ...prev.slice(0, 14)]);
          triggerTelemetryToast(`Ingest Engine parsed fresh node metrics for ${dynamicPayload.domain}`, "info");
        }
      }, 7000);
    }
    return () => { if (liveSyncRef.current) clearInterval(liveSyncRef.current); };
  }, [isLiveActive]);

  // --- Advanced Operations Logic Modules ---
  const handlePurgeSingleRow = (id, e) => {
    e.stopPropagation();
    setReportData(prev => prev.filter(row => row.id !== id));
    triggerTelemetryToast(`Removed node record #${id} from active visual buffer.`, "danger");
    if (selectedAuditRow?.id === id) setSelectedAuditRow(null);
  };

  const handleBulkClearFlagged = () => {
    setReportData(prev => prev.filter(row => row.status !== "Flagged"));
    triggerTelemetryToast("Batch Core Action Executed: Dropped all flagged operational logs.", "warning");
    setSelectedAuditRow(null);
  };

  const handleCryptographicSignRow = (id) => {
    setReportData(prev => prev.map(row => row.id === id ? { ...row, signature: `SIG-VAL-${Date.now().toString().slice(-4)}` } : row));
    triggerTelemetryToast(`Cryptographic compliance stamp appended to Node #${id}`, "success");
    if (selectedAuditRow?.id === id) setSelectedAuditRow(prev => ({ ...prev, signature: "SIGNED" }));
  };

  const handleMacroLedgerRebalance = () => {
    setReportData(prev => prev.map(row => ({
      ...row,
      variance: Math.round(row.variance * 0.1), 
      metricValue: row.targetValue
    })));
    triggerTelemetryToast("Global Ledger Rebalancing Algorithm complete. Variances compressed.", "success");
  };

  const handleCompileFormSubmission = (e) => {
    e.preventDefault();
    if (!newEntry.entity || !newEntry.value || !newEntry.target) {
      triggerTelemetryToast("Form Parameter Gate Block: All values mandatory.", "danger");
      return;
    }
    const derivedVal = Number(newEntry.value);
    const derivedTarget = Number(newEntry.target);
    const compiledItem = {
      id: Date.now() % 1000,
      domain: newEntry.domain,
      entity: newEntry.entity,
      metricValue: derivedVal,
      targetValue: derivedTarget,
      variance: derivedVal - derivedTarget,
      risk: newEntry.risk,
      status: "Pending",
      syncScore: 100,
      signature: null
    };
    setReportData([compiledItem, ...reportData]);
    setIsModalOpen(false);
    setNewEntry({ entity: "", domain: "MEMBER", value: "", target: "", risk: "Low" });
    triggerTelemetryToast(`Dispatched manual record into sub-ledger branch ${compiledItem.domain}`, "success");
  };

  const handleExportTailoredCSV = () => {
    const csvHeader = "Report Node ID,Core Domain Sub-ledger,Entity Identifier,Active Value,Target Value,Calculated Variance,Risk Profile,Audit Status\n";
    const csvContent = filteredReportRows.map(r => 
      `${r.id},${r.domain},${r.entity},${r.metricValue},${r.targetValue},${r.variance},${r.risk},${r.status}`
    ).join("\n");

    const linkEl = document.createElement("a");
    linkEl.href = encodeURI("data:text/csv;charset=utf-8," + csvHeader + csvContent);
    linkEl.download = `Apex_SubLedger_Audit_${activeDomainTab}_2026.csv`;
    linkEl.click();
    triggerTelemetryToast("Target Excel/CSV Cross-Tabulation Matrix Compiled.", "success");
  };

  // --- Memoized Multilevel Pipeline Processing Filters ---
  const filteredReportRows = useMemo(() => {
    return reportData.filter(row => {
      const matchesBranch = row.domain === activeDomainTab;
      const matchesSearch = row.entity.toLowerCase().includes(searchTerm.toLowerCase()) || row.id.toString().includes(searchTerm);
      const matchesRisk = riskFilter === "ALL" || row.risk.toUpperCase() === riskFilter;
      const matchesStatus = statusFilter === "ALL" || row.status.toUpperCase() === statusFilter;
      
      return matchesBranch && matchesSearch && matchesRisk && matchesStatus;
    });
  }, [reportData, activeDomainTab, searchTerm, riskFilter, statusFilter]);

  // --- Telemetry KPI Dashboard Metrics Multi-Calculators ---
  const domainCalculatedKPIs = useMemo(() => {
    const count = filteredReportRows.length;
    if (count === 0) return { grossValue: 0, netVariance: 0, averageSync: 0 };
    
    const grossValue = filteredReportRows.reduce((acc, r) => acc + r.metricValue, 0);
    const netVariance = filteredReportRows.reduce((acc, r) => acc + r.variance, 0);
    const averageSync = Math.round(filteredReportRows.reduce((acc, r) => acc + r.syncScore, 0) / count);

    return { grossValue, netVariance, averageSync };
  }, [filteredReportRows]);

  // --- Adjustable Live Variance Modeler Variable ---
  const realtimeRecalculatedVariance = useMemo(() => {
    if (!selectedAuditRow) return 0;
    return selectedAuditRow.variance + (selectedAuditRow.metricValue * (basisPointModifier / 10000));
  }, [selectedAuditRow, basisPointModifier]);

  const formatTableCellValue = (val, domain) => {
    if (domain === "MEMBER") return `${val.toLocaleString()} Units`;
    if (domain === "PERFORMANCE") return `${val}% ROI`;
    return formatCurrency(val);
  };

  // --- React Data Table Schema Configurations ---
  const reportSchemaColumns = [
    {
      name: "SUB-LEDGER NODE ENTITY",
      selector: row => row.entity,
      sortable: true,
      cell: row => (
        <div className="py-2">
          <div className="d-flex align-items-center gap-1.5">
            <span className="font-monospace text-xs text-primary fw-bold">#RE-{row.id}</span>
            {row.signature && <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '9px', padding: '1px 4px' }}>{row.signature}</span>}
          </div>
          <span className="fw-bold text-dark text-sm d-block mt-0.5">{row.entity}</span>
        </div>
      )
    },
    {
      name: "REGISTERED VALUE",
      selector: row => row.metricValue,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-bold text-dark">{formatTableCellValue(row.metricValue, row.domain)}</span>
    },
    {
      name: "SYSTEM VARIANCE GAP",
      selector: row => row.variance,
      sortable: true,
      right: true,
      cell: row => {
        const percentageDeviation = Math.abs((row.variance / (row.targetValue || 1)) * 100);
        const triggersAlarm = percentageDeviation > varianceAlertThreshold;
        return (
          <div className="text-end font-monospace">
            <span className={`fw-extrabold ${row.variance < 0 ? 'text-danger' : row.variance > 0 ? 'text-success' : 'text-muted'}`}>
              {row.variance > 0 ? "+" : ""}{row.variance.toLocaleString()}
            </span>
            {triggersAlarm && <span className="d-block text-danger fw-bold" style={{ fontSize: '9px' }}><AlertTriangle size={8} className="d-inline me-0.5"/>&gt;{varianceAlertThreshold}% Breach</span>}
          </div>
        );
      }
    },
    {
      name: "DATA PROFILE HEALTH",
      selector: row => row.syncScore,
      sortable: true,
      cell: row => (
        <div className="w-100 vstack gap-1">
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '10px' }}>
            <span>Telemetry</span>
            <span className="text-dark-50">{row.syncScore}%</span>
          </div>
          <div className="progress bg-light-subtle border" style={{ height: '4px', borderRadius: '2px' }}>
            <div className="progress-bar bg-primary" style={{ width: `${row.syncScore}%` }}></div>
          </div>
        </div>
      )
    },
    {
      name: "RISK INDEX",
      selector: row => row.risk,
      sortable: true,
      center: true,
      cell: row => (
        <span className={`badge px-2.5 py-1.5 rounded-2 fw-bold text-xs ${
          row.risk === 'High' ? 'bg-danger text-white' : 
          row.risk === 'Medium' ? 'bg-warning text-dark' : 'bg-success-subtle text-success'
        }`}>
          {row.risk}
        </span>
      )
    },
    {
      name: "OPERATIONS",
      center: true,
      cell: row => (
        <div className="d-flex gap-1">
          <button className="btn btn-xs btn-outline-primary p-1 rounded-2 border-light-subtle text-secondary" onClick={() => setSelectedAuditRow(row)} title="Link Parameters"><Sliders size={12} /></button>
          <button className="btn btn-xs btn-outline-success p-1 rounded-2 border-light-subtle text-success" onClick={() => handleCryptographicSignRow(row.id)} title="Sign Cryptographically"><ShieldCheck size={12} /></button>
          <button className="btn btn-xs btn-outline-danger p-1 rounded-2 border-light-subtle text-danger" onClick={(e) => handlePurgeSingleRow(row.id, e)} title="Drop Row"><Trash2 size={12} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: AUDIT_THEME.bgLight, minHeight: '100vh', color: '#334155' }}>
      
      {/* --- Injected CSS Styling Matrix Blocks --- */}
      <style>{`
        /* Light Custom Styled Clean Input Bar */
        .cyber-search-wrapper {
          position: relative;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 2px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .cyber-search-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }
        .cyber-search-input {
          background: transparent !important;
          color: #0f172a !important;
          font-size: 0.8rem !important;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: none !important;
          padding: 8px 12px 8px 42px !important;
          border-radius: 10px;
        }
        .cyber-search-input::placeholder {
          color: #94a3b8 !important;
          opacity: 1;
        }
        .cyber-search-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: color 0.2s ease;
        }
        .cyber-search-wrapper:focus-within .cyber-search-icon {
          color: #3b82f6;
        }
        .search-matches-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        /* Modern Data Table Styling Customizations */
        .rdt_Table { background-color: #ffffff !important; color: #334155 !important; }
        .rdt_TableRow { background-color: #ffffff !important; color: #334155 !important; border-bottom: 1px solid #e2e8f0 !important; transition: background 0.15s ease; }
        .rdt_TableRow:hover { background-color: #f8fafc !important; }
        .rdt_Pagination { background-color: #ffffff !important; color: #64748b !important; border-top: 1px solid #e2e8f0 !important; }
        .rdt_Pagination button { fill: #64748b !important; }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .card { border: 1px solid #ccc !important; background: transparent !important; }
        }
        @keyframes slideIn { from { transform: translateX(120%); opacity:0; } to { transform: translateX(0); opacity:1; } }
      `}</style>

      {/* --- Ingest Telemetry Toast Portal --- */}
      <div className="position-fixed top-0 end-0 p-3 no-print" style={{ zIndex: 1200, maxWidth: '370px' }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast show shadow-lg mb-2 p-3 border-0 d-flex align-items-center" style={{ borderRadius: '8px', background: '#ffffff', animation: 'slideIn 0.2s ease forwards', borderLeft: '4px solid #3b82f6' }}>
            <div className="me-2"><CheckCircle size={15} className="text-success" /></div>
            <div className="toast-body p-0 text-xs fw-semibold text-dark flex-grow-1">{t.msg}</div>
            <button type="button" className="btn-close ms-2" style={{ fontSize: '0.6rem' }} onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}></button>
          </div>
        ))}
      </div>

      {/* Terminal Command Header Panel */}
      <div className="card border-0 p-4 mb-4 shadow-sm rounded-4 no-print" style={{ background: AUDIT_THEME.cardBg, border: `1px solid ${AUDIT_THEME.border}` }}>
        <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-uppercase text-xs fw-extrabold px-2.5 py-1">HQ Core Analytics</span>
              <div className="d-flex align-items-center gap-1 font-monospace text-xs text-muted">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '6px', height: '6px' }}></span>
                System Stream Live ({lastSyncTime.toLocaleTimeString()})
              </div>
            </div>
            <h3 className="fw-extrabold mb-0 tracking-tight text-dark">Cross-Ledger Intelligence Reporting Node</h3>
            <p className="text-muted small mb-0">Dynamic auditing validation models mapping member metrics, loan tracks, savings profiles, and ROI parameters.</p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Light Cyber-Search Engine Box */}
            <div className="cyber-search-wrapper" style={{ minWidth: '280px' }}>
              <span className="cyber-search-icon"><Search size={14} /></span>
              <input 
                type="text"
                className="form-control cyber-search-input"
                placeholder="Query entity titles, system ID pathways..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <span className="search-matches-badge">{filteredReportRows.length} matches</span>}
            </div>

            <button className="btn btn-sm btn-outline-secondary p-2.5 rounded-3 border-light-subtle text-dark" onClick={() => window.print()} title="Print Audit File"><Printer size={13} /></button>
            <button className="btn btn-sm btn-outline-secondary p-2.5 rounded-3 border-light-subtle text-dark" onClick={handleExportTailoredCSV} title="Export spreadsheet Matrix"><Download size={13} /></button>
            <button 
              className={`btn btn-sm px-2.5 py-1.5 rounded-3 fw-bold text-xs d-flex align-items-center gap-1 border-light-subtle ${isLiveActive ? 'btn-outline-warning text-warning' : 'btn-primary text-white'}`}
              style={{ backgroundColor: isLiveActive ? 'rgba(245,158,11,0.05)' : '' }}
              onClick={() => {
                setIsLiveActive(!isLiveActive);
                triggerTelemetryToast(isLiveActive ? "Listeners frozen." : "Real-time stream linked.", "info");
              }}
            >
              <RefreshCw size={11} className={isLiveActive ? 'spinner-border border-0 p-0' : ''} style={{ animationDuration: '3.5s' }} />
              {isLiveActive ? 'Streaming' : 'Frozen'}
            </button>
            <button className="btn btn-sm btn-primary fw-bold text-xs px-3 py-2 rounded-3 d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
              <Plus size={12} /> Compile Query
            </button>
          </div>
        </div>
      </div>

      {/* Domain Context Multi-Routing Navigation Pills */}
      <div className="card border-0 p-1.5 mb-4 rounded-3 shadow-sm no-print" style={{ background: AUDIT_THEME.cardBg }}>
        <ul className="nav nav-pills d-flex flex-wrap gap-1 p-0 m-0 list-unstyled">
          {[
            { id: "MEMBER", label: "Member Reports", icon: <Users size={14} /> },
            { id: "LOAN", label: "Loan Reports", icon: <DollarSign size={14} /> },
            { id: "SAVINGS", label: "Savings Reports", icon: <Layers size={14} /> },
            { id: "ACCOUNTING", label: "Accounting Reports", icon: <FileText size={14} /> },
            { id: "PERFORMANCE", label: "Performance Analytics", icon: <PieChart size={14} /> }
          ].map((tab) => (
            <li key={tab.id} className="flex-grow-1 flex-md-grow-0">
              <button 
                className={`nav-link w-100 d-flex align-items-center justify-content-center gap-2 fw-extrabold text-xs px-3 py-2.5 border-0 rounded-2 transition-all ${activeDomainTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-muted bg-transparent'}`}
                onClick={() => {
                  setActiveDomainTab(tab.id);
                  setSelectedAuditRow(null);
                }}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Global Telemetry KPI Metrics Line */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: AUDIT_THEME.cardBg, borderLeft: `4px solid ${AUDIT_THEME.primary}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Combined Volume ({activeDomainTab})</span>
            <h4 className="fw-extrabold text-dark tracking-tight mb-0 font-monospace">
              {activeDomainTab === "PERFORMANCE" || activeDomainTab === "MEMBER" ? domainCalculatedKPIs.grossValue.toLocaleString() : formatCurrency(domainCalculatedKPIs.grossValue)}
            </h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: AUDIT_THEME.cardBg, borderLeft: `4px solid ${domainCalculatedKPIs.netVariance < 0 ? AUDIT_THEME.danger : AUDIT_THEME.success}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Net System Variance</span>
            <h4 className={`fw-extrabold tracking-tight mb-0 font-monospace ${domainCalculatedKPIs.netVariance < 0 ? 'text-danger' : 'text-success'}`}>
              {domainCalculatedKPIs.netVariance.toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: AUDIT_THEME.cardBg, borderLeft: `4px solid ${AUDIT_THEME.success}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Mean Data Quality Score</span>
            <h4 className="fw-extrabold text-success tracking-tight mb-0 font-monospace">{domainCalculatedKPIs.averageSync}%</h4>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: AUDIT_THEME.cardBg, borderLeft: `4px solid ${AUDIT_THEME.warning}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Active Actions Pending</span>
            <div className="d-flex align-items-center justify-content-between mt-0.5">
              <h4 className="fw-extrabold text-dark mb-0 font-monospace">{filteredReportRows.length} Rows</h4>
              <button className="btn btn-xs btn-link p-0 text-warning text-xs fw-bold border-0 bg-transparent no-print" onClick={handleMacroLedgerRebalance}><Zap size={11} className="d-inline me-1" />Rebalance</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Interface Layout Splitter */}
      <div className="row g-4">
        
        {/* Left Side Column: Central Datagrid Engine */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ background: AUDIT_THEME.cardBg }}>
            
            <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center border-bottom pb-3 mb-2 gap-2 no-print">
              <span className="fw-extrabold text-dark text-base d-flex align-items-center gap-2"><Activity size={16} className="text-primary"/>Active Registry</span>
              
              <div className="d-flex align-items-center gap-2 flex-wrap w-100-mobile">
                <div className="d-flex align-items-center gap-1.5 bg-light px-2 py-1 rounded-2 border">
                  <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>Alarm Target:</span>
                  <input type="number" className="bg-transparent text-dark border-0 font-monospace fw-bold" style={{ width: '40px', fontSize: '11px' }} value={varianceAlertThreshold} onChange={(e) => setVarianceAlertThreshold(Number(e.target.value) || 0)} />
                  <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>%</span>
                </div>

                <select 
                  className="form-select form-select-sm bg-white text-dark border-light-subtle rounded-2 text-xs fw-semibold py-1.5"
                  style={{ width: '115px' }} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="ALL">All Risks</option>
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>

                <button className="btn btn-sm btn-outline-danger fw-bold rounded-2 text-xs py-1.5" onClick={handleBulkClearFlagged}>
                  Purge Flagged
                </button>
              </div>
            </div>

            {filteredReportRows.length === 0 ? (
              <div className="p-5 text-center my-3 bg-light rounded-3 border border-dashed">
                <ShieldAlert size={32} className="text-warning opacity-50 mb-2 mx-auto" />
                <h6 className="fw-bold text-dark mb-1">Zero Matches Encountered</h6>
                <p className="text-muted text-xs mb-0">No entries correspond with your custom terminal pipeline limits.</p>
              </div>
            ) : (
              <DataTable 
                noHeader columns={reportSchemaColumns} data={filteredReportRows} 
                pagination highlightOnHover responsive
                customStyles={{
                  headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
                  headCells: { style: { color: '#64748b', fontWeight: '800', fontSize: '0.68rem', letterSpacing: '0.03em' } }
                }}
              />
            )}

          </div>
        </div>

        {/* Right Side Column: Operations Control Hardware Panel */}
        <div className="col-12 col-lg-4 no-print">
          
          <div className="card border-0 p-3 mb-4 rounded-4 shadow-sm" style={{ background: AUDIT_THEME.cardBg }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 bg-primary-subtle text-primary rounded-3"><Sliders size={15} /></div>
              <h6 className="fw-extrabold text-dark tracking-tight mb-0">Dynamic Deviation Compensator</h6>
            </div>

            {!selectedAuditRow ? (
              <div className="p-4 text-center bg-light rounded-3 border border-dashed">
                <HelpCircle size={22} className="text-muted opacity-50 mb-2 mx-auto" />
                <p className="text-muted text-xs mb-0">Select the parameter slider on any data table record node to map attributes instantly into this live correction forecast widget.</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-xs fw-extrabold text-dark">#RE-{selectedAuditRow.id} | {selectedAuditRow.entity}</span>
                    <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedAuditRow(null)}><X size={13} /></button>
                  </div>
                  <span className="text-muted d-block text-xs mt-0.5 font-monospace">Raw Delta Gap: {selectedAuditRow.variance.toLocaleString()}</span>
                </div>

                <div>
                  <label className="form-label text-muted text-xs d-flex justify-content-between fw-bold mb-1">
                    <span>Target Basis Points Offset Margin:</span>
                    <span className="text-primary font-monospace fw-extrabold">+{basisPointModifier} Bps</span>
                  </label>
                  <input 
                    type="range" className="form-range" min="0" max="150" step="5" 
                    value={basisPointModifier} onChange={(e) => setBasisPointModifier(Number(e.target.value))} 
                  />
                </div>

                <div className="p-3 bg-dark text-white rounded-3">
                  <span className="text-uppercase text-white-50 d-block font-monospace fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '0.04em' }}>Compensated Variance Forecast</span>
                  <h4 className="fw-extrabold font-monospace text-info mt-1 mb-0">
                    {realtimeRecalculatedVariance.toLocaleString()} UGX
                  </h4>
                </div>
              </div>
            )}
          </div>

          {/* Visual Trend Sub-ledger Projections */}
          <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ background: AUDIT_THEME.cardBg }}>
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 text-sm">
              <TrendingUp size={15} className="text-success" /> Multi-Period Trend Vectors
            </h6>
            
            <div style={{ width: '100%', height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { m: "Apr", val: 42000000 },
                  { m: "May", val: 68000000 },
                  { m: "Jun", val: domainCalculatedKPIs.grossValue > 2000 ? Math.min(domainCalculatedKPIs.grossValue, 150000000) : 95000000 }
                ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 8, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '5px', color: '#000', fontSize: '9px', border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="val" stroke={AUDIT_THEME.primary} fill="rgba(59, 130, 246, 0.05)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* --- Sub-Ledger Parameter Query Compiler Modal Window Layout --- */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: AUDIT_THEME.cardBg, border: '1px solid #e2e8f0' }}>
              <div className="modal-header bg-light text-dark border-bottom p-3">
                <h5 className="modal-title fw-bold text-base d-flex align-items-center gap-2">
                  <FileText size={17} className="text-primary" /> Inject Sub-Ledger Audit Node
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCompileFormSubmission}>
                <div className="modal-body p-4 vstack gap-3 text-dark">
                  <div>
                    <label className="form-label text-xs fw-bold text-muted">Target Sub-Ledger Branch Domain</label>
                    <select 
                      className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2"
                      value={newEntry.domain} onChange={(e) => setNewEntry({...newEntry, domain: e.target.value})}
                    >
                      <option value="MEMBER">Member Reports</option>
                      <option value="LOAN">Loan Reports</option>
                      <option value="SAVINGS">Savings Reports</option>
                      <option value="ACCOUNTING">Accounting Reports</option>
                      <option value="PERFORMANCE">Performance Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label text-xs fw-bold text-muted">Entity Title Identifier</label>
                    <input 
                      type="text" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                      placeholder="e.g., Jinja Retailers Union Cluster" required
                      value={newEntry.entity} onChange={(e) => setNewEntry({...newEntry, entity: e.target.value})}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Active Value Metric</label>
                      <input 
                        type="number" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                        placeholder="52000000" required step="any"
                        value={newEntry.value} onChange={(e) => setNewEntry({...newEntry, value: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Target Bound Benchmark</label>
                      <input 
                        type="number" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" 
                        placeholder="50000000" required step="any"
                        value={newEntry.target} onChange={(e) => setNewEntry({...newEntry, target: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label text-xs fw-bold text-muted">Assigned Risk Index Categorization</label>
                    <select 
                      className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2"
                      value={newEntry.risk} onChange={(e) => setNewEntry({...newEntry, risk: e.target.value})}
                    >
                      <option value="Low">Low Risk Profile Route</option>
                      <option value="Medium">Medium Exposure Warning Check</option>
                      <option value="High">High-Level Discrepancy Escalation</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top p-3 bg-light d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary rounded-2 text-dark" onClick={() => setIsModalOpen(false)}>Abort Input</button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-bold">Commit Query</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsView;