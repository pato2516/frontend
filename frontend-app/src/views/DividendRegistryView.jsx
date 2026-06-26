// frontend-app/src/views/DividendRegistryView.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { Search, FileText, ShieldCheck, Plus, Activity, Wifi, WifiOff, CreditCard, Lock, Download, CheckCircle2 } from "lucide-react";

const DIVIDEND_THEME = { primary: '#2563eb', bgLight: '#f8fafc', cardBg: '#ffffff', border: '#e2e8f0' };
const formatCurrency = (val) => "UGX " + (Number(val) || 0).toLocaleString();

// --- Embedded Resilient Data Layer ---
let MOCK_REMOTE_DB = [
  { id: 501, shareClass: "ORDINARY", member: "Ankole Farmers Co-op", sharesHeld: 125000, ratePerShare: 150, grossAmount: 18750000, wht: 2812500, netPayable: 15937500, status: "Approved", signature: "SIG-ORD-88", isFrozen: false, residency: "Local", routingCode: "BEYONIC-UG-200" },
  { id: 502, shareClass: "PREFERENCE", member: "Masaka Agro-Processors", sharesHeld: 50000, ratePerShare: 200, grossAmount: 10000000, wht: 1500000, netPayable: 8500000, status: "Paid", signature: "SIG-PRF-12", isFrozen: false, residency: "Local", routingCode: "YOPAY-UG-401" },
  { id: 503, shareClass: "ORDINARY", member: "Buganda Investment Club", sharesHeld: 12500, ratePerShare: 150, grossAmount: 1875000, wht: 281250, netPayable: 1593750, status: "Pending", signature: null, isFrozen: false, residency: "Local", routingCode: "BEYONIC-UG-200" }
];

let SEEN_IDEMPOTENCY_KEYS = new Set();
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const apiFetchLedger = async () => {
  await delay(600);
  return [...MOCK_REMOTE_DB];
};

const apiExecuteMutation = async (actionFn, isOnline) => {
  await delay(800);
  if (!isOnline) throw new Error("NETWORK_DISRUPTED: Connection timed out.");
  return actionFn();
};

// Helper to compile ISO 20022 XML Pain.001 structure
const generateISO20022XML = (record) => {
  const timeStamp = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-${Date.now()}</MsgId>
      <CreDtTm>${timeStamp}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <InitgPty><Nm>Dividend Registry Engine</Nm></InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-INF-${record.id}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>${timeStamp.split('T')[0]}</ReqdExctnDt>
      <Dbtr><Nm>Treasury Settle Pool</Nm></Dbtr>
      <CdtTrfTxInf>
        <PmtId><EndToEndId>E2E-${record.id}-${crypto.randomUUID().slice(0,8)}</EndToEndId></PmtId>
        <Amt><InstdAmt Ccy="UGX">${record.netPayable}</InstdAmt></Amt>
        <CdtrAgt><FinInstnId><BICFI>${record.routingCode || 'UNKNOWN'}</BICFI></FinInstnId></CdtrAgt>
        <Cdtr><Nm>${record.member}</Nm></Cdtr>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`.trim();
};

export default function DividendRegistryView() {
  const queryClient = useQueryClient();
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [activeClassTab, setActiveClassTab] = useState("ORDINARY");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // MFA Orchestration State Machine
  const [mfaTargetRow, setMfaTargetRow] = useState(null);
  const [mfaTokenInput, setMfaTokenInput] = useState("");

  const triggerToast = (msg, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  };

  const { data: ledgerDataset = [], isLoading } = useQuery({
    queryKey: ["dividendLedger"],
    queryFn: apiFetchLedger,
  });

  const signMutation = useMutation({
    mutationFn: ({ id, idempotencyKey }) => apiExecuteMutation(() => {
      if (SEEN_IDEMPOTENCY_KEYS.has(idempotencyKey)) throw new Error("REDUNDANT_GATE: Token already processed.");
      SEEN_IDEMPOTENCY_KEYS.add(idempotencyKey);
      MOCK_REMOTE_DB = MOCK_REMOTE_DB.map(r => r.id === id ? { ...r, status: "Approved", signature: `SIG-AUTH-${idempotencyKey.slice(0,4).toUpperCase()}` } : r);
      return { id, idempotencyKey };
    }, isSystemOnline),
    onMutate: async ({ id, idempotencyKey }) => {
      await queryClient.cancelQueries({ queryKey: ["dividendLedger"] });
      const previousLedger = queryClient.getQueryData(["dividendLedger"]);
      queryClient.setQueryData(["dividendLedger"], (old) => 
        old?.map(r => r.id === id ? { ...r, status: "Approved", signature: `SIG-PEND-${idempotencyKey.slice(0,4).toUpperCase()}` } : r)
      );
      return { previousLedger };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["dividendLedger"], context.previousLedger);
      triggerToast(`Verification Failed: ${err.message}`, "danger");
    },
    onSuccess: (data) => triggerToast(`Signature anchored for Node #${data.id}`, "success"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["dividendLedger"] })
  });

  const declareMutation = useMutation({
    mutationFn: ({ newRecord, idempotencyKey }) => apiExecuteMutation(() => {
      if (SEEN_IDEMPOTENCY_KEYS.has(idempotencyKey)) throw new Error("Duplicate submission blocked.");
      SEEN_IDEMPOTENCY_KEYS.add(idempotencyKey);
      const formatted = { id: Date.now() % 1000, ...newRecord, status: "Pending", signature: null, isFrozen: false };
      MOCK_REMOTE_DB = [formatted, ...MOCK_REMOTE_DB];
      return formatted;
    }, isSystemOnline),
    onMutate: async ({ newRecord, idempotencyKey }) => {
      await queryClient.cancelQueries({ queryKey: ["dividendLedger"] });
      const previousLedger = queryClient.getQueryData(["dividendLedger"]);
      const optimisticPlaceholder = { id: 999, ...newRecord, status: "Pending", signature: "SYNCING...", isFrozen: false, routingCode: "BEYONIC-UG-200" };
      queryClient.setQueryData(["dividendLedger"], (old) => [optimisticPlaceholder, ...(old || [])]);
      return { previousLedger };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["dividendLedger"], context.previousLedger);
      triggerToast(`Declaration Aborted: Local buffer rolled back.`, "danger");
    },
    onSuccess: (data) => triggerToast(`Manual allocation committed for ${data.member}`, "success"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["dividendLedger"] })
  });

  // Disbursal Mutation Orchestration
  const disburseMutation = useMutation({
    mutationFn: ({ id, idempotencyKey }) => apiExecuteMutation(() => {
      if (SEEN_IDEMPOTENCY_KEYS.has(idempotencyKey)) throw new Error("Transaction collision avoided.");
      SEEN_IDEMPOTENCY_KEYS.add(idempotencyKey);
      let localizedRecord = null;
      MOCK_REMOTE_DB = MOCK_REMOTE_DB.map(r => {
        if (r.id === id) {
          localizedRecord = { ...r, status: "Paid" };
          return localizedRecord;
        }
        return r;
      });
      return localizedRecord;
    }, isSystemOnline),
    onSuccess: (data) => {
      triggerToast(`Disbursal executed. ISO 20022 message compiled for ${data.member}`, "success");
      // Prompt direct download capability of ISO financial file
      const xmlContents = generateISO20022XML(data);
      const dataUri = 'data:text/xml;charset=utf-8,'+ encodeURIComponent(xmlContents);
      const anchorNode = document.createElement('a');
      anchorNode.setAttribute("href", dataUri);
      anchorNode.setAttribute("download", `ISO20022_PAIN_001_${data.id}.xml`);
      document.body.appendChild(anchorNode);
      anchorNode.click();
      anchorNode.remove();
    },
    onError: (err) => {
      triggerToast(`Gateway Error: ${err.message}`, "danger");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dividendLedger"] });
    }
  });

  const handleSignRow = (id) => {
    signMutation.mutate({ id, idempotencyKey: crypto.randomUUID() });
  };

  const initMfaDisbursalChallenge = (row) => {
    setMfaTargetRow(row);
    setMfaTokenInput("");
    triggerToast(`MFA Out-of-Band Challenge Issued. Code is simulated as '0000'`, "warning");
  };

  const handleVerifyMfaChallenge = (e) => {
    e.preventDefault();
    if (mfaTokenInput === "0000") {
      const targetsId = mfaTargetRow.id;
      setMfaTargetRow(null);
      disburseMutation.mutate({ id: targetsId, idempotencyKey: crypto.randomUUID() });
    } else {
      triggerToast("Verification Failed: Cryptographic token is out of sync or invalid.", "danger");
    }
  };

  const handleCompilePayout = (e) => {
    e.preventDefault();
    const dataFormData = new FormData(e.target);
    const shares = Number(dataFormData.get("sharesHeld")) || 0;
    const rate = Number(dataFormData.get("ratePerShare")) || 0;
    const gross = shares * rate;

    const newRecord = {
      shareClass: dataFormData.get("shareClass"),
      member: dataFormData.get("member"),
      sharesHeld: shares,
      ratePerShare: rate,
      grossAmount: gross,
      wht: gross * 0.15,
      netPayable: gross * 0.85,
      residency: dataFormData.get("residency"),
      routingCode: dataFormData.get("routingCode")
    };

    setIsModalOpen(false);
    declareMutation.mutate({ newRecord, idempotencyKey: crypto.randomUUID() });
  };

  const filteredRows = useMemo(() => {
    return ledgerDataset.filter(row => {
      const matchesClass = row.shareClass === activeClassTab;
      const matchesSearch = row.member.toLowerCase().includes(searchTerm.toLowerCase()) || row.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "ALL" || row.status.toUpperCase() === statusFilter;
      return matchesClass && matchesSearch && matchesStatus;
    });
  }, [ledgerDataset, activeClassTab, searchTerm, statusFilter]);

  const financials = useMemo(() => {
    return filteredRows.reduce((acc, r) => { acc.gross += r.grossAmount; acc.net += r.netPayable; return acc; }, { gross: 0, net: 0 });
  }, [filteredRows]);

  const columnsSchema = [
    {
      name: "BENEFICIARY MEMBER ENTITY",
      selector: row => row.member,
      sortable: true,
      cell: row => (
        <div className="py-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="font-monospace text-xs text-primary fw-bold">#DIV-{row.id}</span>
            {row.signature && <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '9px' }}>{row.signature}</span>}
          </div>
          <span className="fw-bold text-dark text-sm d-block mt-1">{row.member}</span>
          <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>Gateway Bic: {row.routingCode}</span>
        </div>
      )
    },
    {
      name: "SHARES UNITS",
      selector: row => row.sharesHeld,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-bold text-dark">{row.sharesHeld.toLocaleString()}</span>
    },
    {
      name: "NET SETTLE AMOUNT",
      selector: row => row.netPayable,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-bold text-success">{formatCurrency(row.netPayable)}</span>
    },
    {
      name: "STATUS",
      selector: row => row.status,
      sortable: true,
      center: true,
      cell: row => (
        <span className={`badge px-2.5 py-1.5 rounded-2 fw-bold text-xs ${row.status === 'Paid' ? 'bg-success text-white' : row.status === 'Approved' ? 'bg-primary text-white' : 'bg-warning-subtle text-warning'}`}>
          {row.status}
        </span>
      )
    },
    {
      name: "CLEARANCE OPERATIONS",
      center: true,
      cell: row => (
        <div className="d-flex gap-1.5">
          <button className="btn btn-xs btn-outline-success p-1.5 rounded-2 text-success" disabled={!!row.signature || signMutation.isPending} onClick={() => handleSignRow(row.id)} title="Sign Record Layout"><ShieldCheck size={14} /></button>
          <button 
            className="btn btn-xs btn-primary p-1.5 rounded-2 d-flex align-items-center gap-1 text-white fw-bold" 
            disabled={row.status !== "Approved" || disburseMutation.isPending} 
            onClick={() => initMfaDisbursalChallenge(row)}
            title="Trigger Secure Out-Of-Band Disbursal Gate"
          >
            <CreditCard size={14}/>
            <span style={{ fontSize: '10px' }}>Disburse</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: DIVIDEND_THEME.bgLight, minHeight: '100vh', color: '#334155' }}>
      
      {/* Toasts */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1200, maxWidth: '370px' }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast show shadow-lg mb-2 p-3 border-0 d-flex align-items-center" style={{ borderRadius: '8px', background: '#ffffff', borderLeft: `4px solid ${t.type === 'danger' ? '#dc2626' : t.type === 'warning' ? '#f59e0b' : '#2563eb'}` }}>
            <div className="toast-body p-0 text-xs fw-semibold text-dark flex-grow-1">{t.msg}</div>
            <button type="button" className="btn-close ms-2" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}></button>
          </div>
        ))}
      </div>

      {/* Control Header */}
      <div className="card border-0 p-4 mb-4 shadow-sm rounded-4" style={{ background: DIVIDEND_THEME.cardBg, border: `1px solid ${DIVIDEND_THEME.border}` }}>
        <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success text-uppercase text-xs fw-extrabold px-2.5 py-1">Clearing Node V2</span>
              <button 
                className={`btn btn-xs d-flex align-items-center gap-1 font-monospace border-0 p-0 text-xs fw-bold ${isSystemOnline ? 'text-success' : 'text-danger'}`}
                onClick={() => {
                  setIsSystemOnline(!isSystemOnline);
                  triggerToast(`System toggled to: ${!isSystemOnline ? 'ONLINE' : 'OFFLINE SIMULATION'}`, !isSystemOnline ? "success" : "danger");
                }}
              >
                {isSystemOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span>{isSystemOnline ? "Gateway Online" : "Gateway Offline (Simulated)"}</span>
              </button>
            </div>
            <h3 className="fw-extrabold mb-0 tracking-tight text-dark">Dividend Settlement Registry</h3>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="position-relative bg-white border rounded-3" style={{ minWidth: '260px' }}>
              <span className="position-absolute top-50 translate-middle-y start-0 ms-3 text-muted"><Search size={13}/></span>
              <input type="text" className="form-control form-control-sm border-0 ps-5 text-xs py-2 text-dark bg-transparent" placeholder="Query entities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="btn btn-sm btn-primary fw-bold text-xs px-3 py-2 rounded-3 d-flex align-items-center gap-1" onClick={() => setIsModalOpen(true)}>
              <Plus size={12} /> Declare Distribution
            </button>
          </div>
        </div>
      </div>

      {/* Equity Class Tabs */}
      <div className="card border-0 p-1.5 mb-4 rounded-3 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
        <ul className="nav nav-pills d-flex flex-wrap gap-1 p-0 m-0 list-unstyled">
          {["ORDINARY", "PREFERENCE", "INSTITUTIONAL"].map((tab) => (
            <li key={tab} className="flex-grow-1 flex-md-grow-0">
              <button className={`nav-link w-100 d-flex align-items-center justify-content-center gap-2 fw-extrabold text-xs px-3 py-2 border-0 rounded-2 ${activeClassTab === tab ? 'bg-primary text-white shadow-sm' : 'text-muted bg-transparent'}`} onClick={() => setActiveClassTab(tab)}>{tab} Class Pool</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Financial Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid ${DIVIDEND_THEME.primary}` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Gross Allocation Buffer</span>
            <h4 className="fw-extrabold text-dark tracking-tight mb-0 font-monospace">{formatCurrency(financials.gross)}</h4>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm p-3 rounded-3" style={{ background: DIVIDEND_THEME.cardBg, borderLeft: `4px solid #16a34a` }}>
            <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Net Payable Stream</span>
            <h4 className="fw-extrabold text-success tracking-tight mb-0 font-monospace">{formatCurrency(financials.net)}</h4>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="card border-0 p-3 rounded-4 shadow-sm" style={{ background: DIVIDEND_THEME.cardBg }}>
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-2">
          <span className="fw-extrabold text-dark text-base d-flex align-items-center gap-2"><Activity size={16} className="text-primary"/>Execution Pipeline Matrix</span>
          <select className="form-select form-select-sm bg-white text-dark border-light-subtle rounded-2 text-xs fw-semibold py-1.5" style={{ width: '130px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Audit</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid Cleared</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-5 text-center text-muted text-xs font-monospace">Synchronizing with ledger...</div>
        ) : filteredRows.length === 0 ? (
          <div className="p-5 text-center bg-light rounded-3 border border-dashed text-muted text-xs">No entries found.</div>
        ) : (
          <DataTable 
            noHeader columns={columnsSchema} data={filteredRows} pagination highlightOnHover responsive
            customStyles={{
              headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
              headCells: { style: { color: '#64748b', fontWeight: '800', fontSize: '0.68rem' } }
            }}
          />
        )}
      </div>

      {/* MFA Authorization Challenge Gate Modal */}
      {mfaTargetRow && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4 text-dark" style={{ background: DIVIDEND_THEME.cardBg }}>
              <div className="modal-body p-4 text-center">
                <div className="mx-auto mb-3 text-warning bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <Lock size={24} />
                </div>
                <h5 className="fw-extrabold mb-1">MFA Clearance Gate</h5>
                <p className="text-muted text-xs mb-3">Authorizing payment of <span className="fw-bold text-success">{formatCurrency(mfaTargetRow.netPayable)}</span> to {mfaTargetRow.member}.</p>
                
                <form onSubmit={handleVerifyMfaChallenge}>
                  <input 
                    type="text" 
                    className="form-control text-center tracking-widest fw-bold font-monospace bg-light border-0 mb-3 py-2.5 text-lg" 
                    placeholder="Enter 4-digit Token" 
                    maxLength={4}
                    value={mfaTokenInput}
                    onChange={(e) => setMfaTokenInput(e.target.value)}
                    required
                  />
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary w-100 rounded-2 text-dark" onClick={() => setMfaTargetRow(null)}>Cancel</button>
                    <button type="submit" className="btn btn-sm btn-success w-100 fw-bold rounded-2 text-white">Verify & clear</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ background: DIVIDEND_THEME.cardBg }}>
              <div className="modal-header bg-light text-dark border-bottom p-3">
                <h5 className="modal-title fw-bold text-base d-flex align-items-center gap-2"><FileText size={17} className="text-primary" /> Declare Distribution Target</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCompilePayout}>
                <div className="modal-body p-4 vstack gap-3 text-dark">
                  <input type="hidden" name="shareClass" value={activeClassTab} />
                  <div>
                    <label className="form-label text-xs fw-bold text-muted">Beneficiary Name</label>
                    <input type="text" name="member" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" required />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Total Shares Held</label>
                      <input type="number" name="sharesHeld" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" required />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Rate Per Share</label>
                      <input type="number" name="ratePerShare" className="form-control form-control-sm bg-white text-dark border-light-subtle py-2 rounded-2" defaultValue="150" required />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Residency Classification</label>
                      <select name="residency" className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2">
                        <option value="Local">Local</option>
                        <option value="Foreign">Foreign</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-muted">Clearing Provider BIC</label>
                      <select name="routingCode" className="form-select form-select-sm bg-white text-dark border-light-subtle py-2 rounded-2">
                        <option value="BEYONIC-UG-200">Beyonic Aggregator</option>
                        <option value="YOPAY-UG-401">Yo! Payments Gateway</option>
                        <option value="STANBIC-UG-XXX">Stanbic EFT Node</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top p-3 bg-light d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary text-dark" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-primary fw-bold" disabled={declareMutation.isPending}>Commit Transaction</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}