import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

import { 
  FileJson, Printer, Search, RefreshCw, Layers, ShieldAlert, 
  CheckCircle, Landmark, AlertTriangle, Filter, Eye, Activity, 
  SlidersHorizontal, Check, X, HelpCircle, Info, Bell
} from 'lucide-react';
import LoanReview from '../components/LoanReview';

// --- Enterprise Visual Color Configuration Matrix ---
const COSMETIC_THEME = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#1e293b',
  muted: '#64748b',
  lightBg: '#f8fafc'
};

// --- Financial Currency Format Assistant ---
const formatUgandanShillings = (value) => {
  const numericValue = Number(value) || 0;
  if (numericValue >= 1_000_000) return `UGX ${(numericValue / 1_000_000).toFixed(1)}M`;
  if (numericValue >= 1_000) return `UGX ${(numericValue / 1_000).toFixed(1)}K`;
  return `UGX ${numericValue.toLocaleString()}`;
};

// --- Sub-Component: Financial Snapshot Analytics Banner ---
const OperationalAnalyticCard = ({ label, total, description, icon: AssetIcon, borderHue }) => (
  <div className="card h-100 border-0 shadow-sm bg-white" style={{ borderRadius: '14px', borderLeft: `5px solid ${borderHue}` }}>
    <div className="card-body p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <span className="text-uppercase fw-bold text-muted d-block mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>{label}</span>
          <h4 className="fw-extrabold text-dark tracking-tight mb-1">{total}</h4>
        </div>
        <div className="p-2 rounded-3 bg-light text-secondary">
          <AssetIcon size={18} style={{ color: borderHue }} />
        </div>
      </div>
      <p className="text-muted text-xs mb-0 mt-2 d-flex align-items-center gap-1">
        <Activity size={11} className="text-success" /> {description}
      </p>
    </div>
  </div>
);

const LoanApplications = () => {
  // --- Core State Driven Directly By FastAPI Database Views ---
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  
  // --- Native Premium Toast State Engine ---
  const [toasts, setToasts] = useState([]);

  // --- Advanced Filtering States ---
  const [filterText, setFilterText] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedRiskThreshold, setSelectedRiskThreshold] = useState('ALL');

  // --- Real-Time Dynamic Stream States ---
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());
  const pollingTimerRef = useRef(null);

  // --- Action-Driven Premium Toast Trigger ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // --- Live Database Extraction Hook ---
  const fetchLoanDataEngine = async (suppressLoader = false) => {
    if (!suppressLoader) setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/loans/all-loans');
      
      const rawData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.loans || response.data?.data || response.data?.results || []);

      // Clean mapping translating database view structure into standard dashboard properties
      const normalizedPayload = rawData.map(item => {
        let cleanAmount = 0;
        if (item.amount !== undefined) cleanAmount = item.amount;
        else if (item.amt !== undefined) cleanAmount = item.amt;
        
        // Sanitation pass for raw strings coming from view joins
        if (typeof cleanAmount === 'string') {
          cleanAmount = Number(cleanAmount.replace(/[^0-9.-]+/g, ""));
        }

        return {
          id: String(item.id || item._id || ''),
          name: item.user_name || item.name || item.applicant_name || `Member Account #${item.user_id || 'Unknown'}`, 
          type: item.loan_type || item.type || item.category || 'Unspecified Product', 
          amt: Number(cleanAmount || 0),                 
          status: item.status || 'Pending',
          created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
          avatarUrl: item.avatarUrl || item.avatar || ''
        };
      });

      setLoans(normalizedPayload);
      setLastSyncedTime(new Date());
      setError(null);
    } catch (err) {
      setError('Operational pipeline interrupted. Verify backing API server nodes are active.');
      console.error('Data acquisition loop failed:', err);
    } finally {
      if (!suppressLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanDataEngine(false);

    if (isLivePolling) {
      pollingTimerRef.current = setInterval(() => {
        fetchLoanDataEngine(true);
      }, 8000);
    }

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isLivePolling]);

  const handleReviewClick = (loan) => {
    setSelectedLoan(loan);
    setReviewComment('');
    setShowModal(true);
  };

  // --- Processing Engine (Pushes Mutation Signals back to FastAPI Endpoint) ---
  const handleLoanAction = async (actionType) => {
    if (!selectedLoan) return;
    setIsSubmittingAction(true);

    const cleanNumericId = parseInt(selectedLoan.id.replace('LN-', ''), 10);
    
    if (isNaN(cleanNumericId)) {
      triggerToast("Invalid ID metadata structure. Unable to parse numeric key.", "danger");
      setIsSubmittingAction(false);
      return;
    }

    let endpointAction = '';
    let requestPayload = {};

    if (actionType.toLowerCase().includes('approve') || actionType.toLowerCase().includes('authorize')) {
      endpointAction = 'approve';
      requestPayload = { counter_amount: null }; 
    } else if (actionType.toLowerCase().includes('reject')) {
      endpointAction = 'reject';
      requestPayload = { reason: reviewComment || "No specific rejection reason provided." };
    } else if (actionType.toLowerCase().includes('clarify') || actionType.toLowerCase().includes('clarification')) {
      endpointAction = 'clarify';
      requestPayload = { question: reviewComment || "Further account profile clarification required." };
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      };

      await axios.post(
        `http://localhost:8000/api/v1/loans/${cleanNumericId}/${endpointAction}`, 
        requestPayload,
        config
      );

      triggerToast(`Application workflow executed successfully: ${actionType}`, "success");
      setShowModal(false);
      await fetchLoanDataEngine(true); 
    } catch (err) {
      console.error("Action pipeline failed:", err);
      triggerToast(err.response?.data?.detail || 'Handshake failed during remote ledger ledger validation updates.', "danger");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // --- Dynamic Database Aggregation Logic ---
  const aggregatedStats = useMemo(() => {
    const totalVolume = loans.reduce((acc, curr) => acc + curr.amt, 0);
    const highRiskApplications = loans.filter(l => l.amt >= 10000000).length;
    const businessVolume = loans.filter(l => l.type?.toUpperCase().includes('BUSINESS')).length;
    
    return {
      totalVolume: formatUgandanShillings(totalVolume),
      activeCount: loans.length,
      highRiskCount: highRiskApplications,
      businessRatio: loans.length ? Math.round((businessVolume / loans.length) * 100) : 0
    };
  }, [loans]);

  // --- Dynamic Filtering Controls ---
  const filteredRecords = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = loan.name?.toLowerCase().includes(filterText.toLowerCase()) || 
                            loan.type?.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesType = selectedTypeFilter === 'ALL' || 
                          loan.type?.toUpperCase() === selectedTypeFilter.toUpperCase();

      let matchesRisk = true;
      if (selectedRiskThreshold === 'HIGH') matchesRisk = loan.amt >= 10000000;
      if (selectedRiskThreshold === 'MODERATE') matchesRisk = loan.amt >= 2500000 && loan.amt < 10000000;
      if (selectedRiskThreshold === 'STANDARD') matchesRisk = loan.amt < 2500000;

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [loans, filterText, selectedTypeFilter, selectedRiskThreshold]);

  // --- Derived Direct Database Chart Aggregator Matrix ---
  const productExposureChartData = useMemo(() => {
    const trackingMap = filteredRecords.reduce((acc, curr) => {
      const normalizedKey = curr.type || 'Unspecified Product';
      acc[normalizedKey] = (acc[normalizedKey] || 0) + curr.amt;
      return acc;
    }, {});

    return Object.entries(trackingMap).map(([name, Amount]) => ({
      name: name.toUpperCase(),
      Amount: Amount
    }));
  }, [filteredRecords]);

  const rawDatabaseVelocityData = useMemo(() => {
    return filteredRecords.slice(-6).map((record, index) => ({
      tick: record.name.split(' ')[0] || `Ref #${index + 1}`,
      Value: record.amt
    }));
  }, [filteredRecords]);

  // --- Export Protocols ---
  const exportExcel = () => {
    const formattedData = filteredRecords.map(l => ({
      "Loan ID": l.id,
      "Applicant Name": l.name,
      "Loan Product": l.type,
      "Amount (UGX)": l.amt,
      "Status": l.status,
      "Submission Date": l.created_at
    }));
    const workingSheet = XLSX.utils.json_to_sheet(formattedData);
    const structuralBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(structuralBook, workingSheet, "Active Pipeline Analytics");
    XLSX.writeFile(structuralBook, `SACCO_Loan_Register_${new Date().toISOString().split('T')[0]}.xlsx`);
    triggerToast('Excel spreadsheet workbook downloaded.', "info");
  };

  const exportPDF = () => {
    const structuralDoc = new jsPDF();
    structuralDoc.setFont("helvetica", "bold");
    structuralDoc.text("SACCO LOAN AUDIT REGISTER MATRIX", 14, 15);
    structuralDoc.setFont("helvetica", "normal");
    structuralDoc.setFontSize(9);
    structuralDoc.text(`Generated Timeline Scope: ${new Date().toLocaleString()}`, 14, 22);

    structuralDoc.autoTable({
      startY: 28,
      head: [['ID Reference', 'Applicant Identity', 'Product Classification', 'Underwritten Value (UGX)', 'Pipeline Status']],
      body: filteredRecords.map(loan => [loan.id, loan.name, loan.type, loan.amt.toLocaleString(), loan.status]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] }
    });
    structuralDoc.save("SACCO_Loan_Portfolio.pdf");
    triggerToast('PDF Audit Ledger compiled and exported.', "info");
  };

  const exportPrint = () => {
    const textualPrintMap = filteredRecords.map(loan => `REF-${loan.id.padEnd(8)} | ${loan.name.padEnd(30)} | ${loan.type.padEnd(15)} | UGX ${loan.amt.toLocaleString().padEnd(12)} | ${loan.status}`).join("\n");
    const localizedWindow = window.open('', '', 'height=700,width=900');
    localizedWindow.document.write(`<html><head><title>Print Out Audit</title></head><body style="font-family:monospace; padding:30px;"><H3>PORTFOLIO RECONCILIATION SUMMARY</H3><hr/><pre>${textualPrintMap}</pre></body></html>`);
    localizedWindow.document.close();
    localizedWindow.print();
  };

  // --- Table Layout Blueprints ---
  const tableColumnMappingSchema = [
    { 
      name: 'APPLICANT MEMBER COHORT', 
      selector: row => row.name, 
      sortable: true, 
      flex: 1.5,
      cell: row => (
        <div className="d-flex align-items-center gap-2 py-2">
          <img 
            src={row.avatarUrl?.trim() ? row.avatarUrl : "https://www.w3schools.com/howto/img_avatar.png"} 
            alt="Cohort Avatar" 
            className="rounded-circle border"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>{row.name}</div>
            <span className="text-muted text-xs font-monospace">{row.id}</span>
          </div>
        </div>
      ) 
    },
    { 
      name: 'PRODUCT CLASSIFICATION', 
      selector: row => row.type, 
      sortable: true,
      flex: 1,
      cell: row => {
        let badgeStyle = "bg-secondary text-white";
        if (row.type?.toUpperCase().includes('BUSINESS')) badgeStyle = "bg-primary-subtle text-primary";
        if (row.type?.toUpperCase().includes('EMERGENCY')) badgeStyle = "bg-danger-subtle text-danger";
        if (row.type?.toUpperCase().includes('AGRICULTURE')) badgeStyle = "bg-success-subtle text-success";
        
        return <span className={`badge px-2.5 py-1.5 rounded-2 fw-semibold text-xs uppercase ${badgeStyle}`}>{row.type}</span>;
      } 
    },
    { 
      name: 'UNDERWRITTEN CAPITAL VALUE', 
      selector: row => row.amt, 
      sortable: true,
      flex: 1,
      right: true,
      cell: row => {
        const structuralRiskWarning = row.amt >= 10000000;
        return (
          <div className="text-end py-1">
            <div className={`fw-extrabold ${structuralRiskWarning ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '0.92rem' }}>
              {formatUgandanShillings(row.amt)}
            </div>
            {structuralRiskWarning && (
              <span className="text-danger font-monospace fw-bold d-inline-flex align-items-center gap-0.5 text-xs">
                <ShieldAlert size={10} /> Escalated Tier
              </span>
            )}
          </div>
        );
      } 
    },
    {
      name: 'WORKFLOW STATE',
      selector: row => row.status,
      sortable: true,
      flex: 0.8,
      cell: row => {
        let statusBadge = "bg-warning-subtle text-warning";
        if (row.status?.toLowerCase().includes('clarification') || row.status?.toLowerCase().includes('clarify')) statusBadge = "bg-info-subtle text-info";
        if (row.status?.toLowerCase().includes('approved') || row.status?.toLowerCase().includes('authorize')) statusBadge = "bg-success-subtle text-success";
        if (row.status?.toLowerCase().includes('reject')) statusBadge = "bg-danger-subtle text-danger";

        return <span className={`badge px-2 py-1 rounded-pill text-xs fw-bold ${statusBadge}`}>{row.status}</span>;
      }
    },
    { 
      name: 'PIPELINE GATE ACTION', 
      flex: 0.8,
      center: true,
      ignoreRowClick: true,
      cell: row => (
        <button 
          className="btn btn-sm btn-white border shadow-sm px-3 py-1.5 rounded-2 text-primary d-flex align-items-center gap-1 fw-bold text-xs hover-bg-light"
          onClick={() => handleReviewClick(row)}
        >
          <Eye size={12} /> Audit Profile
        </button>
      ) 
    }
  ];

  const subHeaderSearchElement = useMemo(() => {
    return (
      <div className="w-100 vstack gap-3 pt-2 pb-1 no-print">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4 position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><Search size={14} /></span>
            <input 
              type="text" 
              className="form-control form-control-sm ps-5 bg-light border-0 py-2 text-sm rounded-3" 
              placeholder="Search via names or tags..." 
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3 d-flex align-items-center gap-1">
            <span className="text-muted text-xs text-nowrap"><Filter size={12} /> Product:</span>
            <select className="form-select form-select-sm bg-light border-0 py-2 rounded-3 text-xs fw-semibold" value={selectedTypeFilter} onChange={e => setSelectedTypeFilter(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="BUSINESS">Business</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="PERSONAL">Personal</option>
              <option value="AGRICULTURE">Agriculture</option>
            </select>
          </div>
          <div className="col-6 col-md-3 d-flex align-items-center gap-1">
            <span className="text-muted text-xs text-nowrap"><SlidersHorizontal size={12} /> Exposure:</span>
            <select className="form-select form-select-sm bg-light border-0 py-2 rounded-3 text-xs fw-semibold" value={selectedRiskThreshold} onChange={e => setSelectedRiskThreshold(e.target.value)}>
              <option value="ALL">All Risk Margins</option>
              <option value="HIGH">High (≥ 10M UGX)</option>
              <option value="MODERATE">Moderate (2.5M - 10M)</option>
              <option value="STANDARD">Standard (&lt; 2.5M)</option>
            </select>
          </div>
          <div className="col-12 col-md-2 text-md-end text-start">
            <div className="position-relative d-inline-block w-100">
              <button className="btn btn-sm btn-dark w-100 py-2 rounded-3 text-xs fw-bold d-flex align-items-center justify-content-center gap-1" onClick={() => setShowExportOptions(!showExportOptions)}>
                <Layers size={13} /> Output Matrix
              </button>
              {showExportOptions && (
                <div className="dropdown-menu dropdown-menu-end show shadow-lg border-0 mt-1 p-1 position-absolute end-0" style={{ zIndex: 1050, minWidth: '160px', borderRadius: '8px' }}>
                  <CSVLink data={filteredRecords} filename="SACCO_Export.csv" className="dropdown-item py-2 text-xs rounded-2" onClick={() => triggerToast('CSV database matrix exported.', 'info')}><FileJson size={12} className="me-1" /> Export raw CSV</CSVLink>
                  <button className="dropdown-item py-2 text-xs rounded-2" onClick={exportExcel}><Layers size={12} className="me-1" /> Export formatting xlsx</button>
                  <button className="dropdown-item py-2 text-xs rounded-2" onClick={exportPDF}><AlertTriangle size={12} className="me-1" /> Compile PDF Ledger</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item py-2 text-xs rounded-2" onClick={exportPrint}><Printer size={12} className="me-1" /> Send to Printer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [filterText, selectedTypeFilter, selectedRiskThreshold, showExportOptions, filteredRecords]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column p-5 bg-white border rounded-4 mt-5 shadow-sm" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary border-3 mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        <div className="fw-bold text-dark tracking-tight">Synchronizing Active Underwriting Queues...</div>
        <p className="text-muted text-xs mt-1">Acquiring current portfolio snapshots from ledger core APIs.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center bg-white my-5 rounded-4 mx-auto" style={{ maxWidth: '560px' }}>
        <div className="p-3 bg-danger-subtle text-danger d-inline-block rounded-circle mx-auto mb-3" style={{ width: 'fit-content' }}>
          <AlertTriangle size={32} />
        </div>
        <h5 className="fw-bold text-dark">Data Feed Disruption</h5>
        <p className="text-muted text-sm px-3">{error}</p>
        <button className="btn btn-primary btn-sm px-4 py-2 mt-2 rounded-3 fw-bold mx-auto d-flex align-items-center gap-1.5" onClick={() => fetchLoanDataEngine(false)}>
          <RefreshCw size={14} /> Re-initialize Stream
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: COSMETIC_THEME.lightBg, minHeight: '100vh', position: 'relative' }}>
      
      {/* --- Floating Action Toast Notifications --- */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100, maxWidth: '380px' }}>
        {toasts.map((toast) => {
          let alertBg = 'bg-white text-dark border-start border-4';
          let AlertIcon = Info;
          if (toast.type === 'success') { alertBg += ' border-success'; AlertIcon = CheckCircle; }
          if (toast.type === 'danger') { alertBg += ' border-danger'; AlertIcon = ShieldAlert; }
          if (toast.type === 'warning') { alertBg += ' border-warning'; AlertIcon = AlertTriangle; }
          if (toast.type === 'info') { alertBg += ' border-primary'; AlertIcon = Bell; }

          return (
            <div key={toast.id} className={`toast show shadow-lg mb-2 p-3 ${alertBg} align-items-center`} style={{ borderRadius: '8px', display: 'flex', animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <div className="me-2 d-flex align-items-center">
                <AlertIcon size={18} className={toast.type === 'info' ? 'text-primary' : `text-${toast.type}`} />
              </div>
              <div className="toast-body p-0 text-xs fw-semibold flex-grow-1">{toast.message}</div>
              <button type="button" className="btn-close ms-2" style={{ fontSize: '0.65rem' }} onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}></button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      {/* Control Dashboard Header Panel */}
      <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center gap-3 mb-4 border-bottom pb-3 no-print">
        <div>
          <h4 className="fw-extrabold text-dark tracking-tight mb-1">Portfolio Underwriting Dashboard</h4>
          <p className="text-muted small mb-0">Auditable framework sorting organizational lines and active risk metrics.</p>
        </div>
        
        <div className="d-flex align-items-center gap-2 bg-white p-2 border rounded-3 shadow-sm">
          <div className="vstack text-end">
            <span className="text-muted font-monospace" style={{ fontSize: '0.65rem' }}>
              Heartbeat: {lastSyncedTime.toLocaleTimeString()}
            </span>
            <span className="text-xs fw-bold text-dark d-flex align-items-center justify-content-end gap-1">
              <span className={`rounded-circle ${isLivePolling ? 'bg-success' : 'bg-secondary'}`} style={{ width: '7px', height: '7px', display: 'inline-block' }}></span>
              {isLivePolling ? 'Polling Hook Active' : 'Feed Frozen'}
            </span>
          </div>
          <button 
            className={`btn btn-xs fw-bold px-2.5 py-1.5 rounded-2 border-0 ${isLivePolling ? 'btn-light text-warning' : 'btn-primary text-white'}`}
            style={{ fontSize: '0.7rem' }}
            onClick={() => setIsLivePolling(!isLivePolling)}
          >
            {isLivePolling ? 'Halt Loop' : 'Hook Live'}
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <OperationalAnalyticCard label="Total Exposure Pipeline" total={aggregatedStats.totalVolume} description="Aggregated ledger risk value" icon={Landmark} borderHue={COSMETIC_THEME.primary} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <OperationalAnalyticCard label="Active Registers Pending" total={aggregatedStats.activeCount} description="Total profiles requiring review" icon={Layers} borderHue={COSMETIC_THEME.warning} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <OperationalAnalyticCard label="High-Risk Exposure Tiers" total={aggregatedStats.highRiskCount} description="Applications exceeding 10M UGX" icon={ShieldAlert} borderHue={COSMETIC_THEME.danger} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <OperationalAnalyticCard label="Commercial Leverage" total={`${aggregatedStats.businessRatio}%`} description="Business account ratio concentration" icon={CheckCircle} borderHue={COSMETIC_THEME.success} />
        </div>
      </div>

      {/* Table Interface Module */}
      <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '16px' }}>
        <DataTable
          columns={tableColumnMappingSchema}
          data={filteredRecords}
          pagination
          highlightOnHover
          responsive
          subHeader
          subHeaderComponent={subHeaderSearchElement}
          customStyles={{
            table: { style: { backgroundColor: '#ffffff' } },
            header: { style: { display: 'none' } },
            headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', borderRadius: '6px' } },
            headCells: { style: { color: COSMETIC_THEME.muted, fontWeight: '700', fontSize: '0.72rem', letterSpacing: '0.04em', padding: '12px' } },
            rows: { style: { minHeight: '52px', borderBottom: '1px solid #f1f5f9', '&:hover': { backgroundColor: '#f8fafc !important' } } },
            pagination: { style: { borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: COSMETIC_THEME.muted } }
          }}
        />
      </div>

      {/* Database Driven Visual Analytical Charts */}
      <div className="row g-4 mt-2">
        <div className="col-12 col-xl-6" style={{ minWidth: 0 }}>
          <div className="card shadow-sm border-0 bg-white p-4" style={{ borderRadius: 16 }}>
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <Layers size={16} className="text-primary" /> Active Product Exposure Split
            </h6>
            <div style={{ width: '100%', height: '220px', minWidth: '0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productExposureChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke={COSMETIC_THEME.muted} tickLine={false} />
                  <YAxis tickFormatter={formatUgandanShillings} tick={{ fontSize: 9 }} stroke={COSMETIC_THEME.muted} tickLine={false} />
                  <Tooltip formatter={(val) => [formatUgandanShillings(val), 'Volume']} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '11px', border: 'none' }} />
                  <Bar dataKey="Amount" fill={COSMETIC_THEME.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6" style={{ minWidth: 0 }}>
          <div className="card shadow-sm border-0 bg-white p-4" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                <Activity size={16} className="text-success" /> Live Stream Ingest Velocity
              </h6>
              <span className="badge bg-light text-muted font-monospace text-xs">
                {filteredRecords.length} Files Cached
              </span>
            </div>
            <div style={{ width: '100%', height: '220px', minWidth: '0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rawDatabaseVelocityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COSMETIC_THEME.success} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COSMETIC_THEME.success} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="tick" tick={{ fontSize: 10 }} stroke={COSMETIC_THEME.muted} tickLine={false} />
                  <YAxis tickFormatter={formatUgandanShillings} tick={{ fontSize: 9 }} stroke={COSMETIC_THEME.muted} tickLine={false} />
                  <Tooltip formatter={(val) => [formatUgandanShillings(val), 'Principal']} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '11px', border: 'none' }} />
                  <Area type="monotone" dataKey="Value" stroke={COSMETIC_THEME.success} strokeWidth={2} fillOpacity={1} fill="url(#streamGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal Wrapper */}
      {showModal && selectedLoan && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.45)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header bg-dark text-white border-0 p-3">
                <h5 className="modal-title fw-bold text-base d-flex align-items-center gap-2 mb-0">
                  <Layers size={18} className="text-primary" /> Core Profile Credit Assessment Matrix
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4" style={{ backgroundColor: '#f8fafc' }}>
                <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <img 
                      src={selectedLoan.avatarUrl?.trim() ? selectedLoan.avatarUrl : "https://www.w3schools.com/howto/img_avatar.png"} 
                      alt="Account Identity" 
                      className="rounded-circle border" 
                      width="54" 
                      height="54" 
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="fw-extrabold text-dark mb-1">{selectedLoan.name}</h5>
                      <div className="d-flex align-items-center gap-2 text-xs text-muted">
                        <span className="font-monospace fw-bold bg-light px-2 py-0.5 rounded text-dark">ID: {selectedLoan.id}</span>
                        <span>•</span>
                        <span className="text-primary fw-medium text-uppercase">{selectedLoan.type} Ledger Route</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <div className="card-body p-0">
                    <LoanReview loan={selectedLoan} />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-0 p-3 bg-white d-flex justify-content-between align-items-center">
                <input 
                  type="text" 
                  className="form-control form-control-sm border-light bg-light w-50 py-2 rounded-3 text-sm" 
                  placeholder="Append structural review evaluation logs..." 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  disabled={isSubmittingAction}
                />
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-danger px-3 py-2 fw-bold rounded-3 d-flex align-items-center gap-1" 
                    onClick={() => handleLoanAction('Rejected')}
                    disabled={isSubmittingAction}
                  >
                    <X size={14} /> Reject
                  </button>
                  <button 
                    className="btn btn-sm btn-light border px-3 py-2 fw-bold text-secondary rounded-3 d-flex align-items-center gap-1" 
                    onClick={() => handleLoanAction('Clarification')}
                    disabled={isSubmittingAction}
                  >
                    <HelpCircle size={14} /> Clarification
                  </button>
                  <button 
                    className="btn btn-sm btn-success px-4 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center gap-1" 
                    onClick={() => handleLoanAction('Approved')}
                    disabled={isSubmittingAction}
                  >
                    <Check size={14} /> Authorize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplications;