import React, { useState, useMemo, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area 
} from "recharts";
import { 
  Plus, Download, Search, Landmark, Users, ArrowUpRight, 
  ArrowDownLeft, TrendingUp, Calendar, Info, X, Wallet,
  HelpCircle, CheckCircle, RefreshCw, Layers, ShieldAlert, Sliders
} from "lucide-react";

// --- Custom Internal Styling Configurations ---
const COSMETIC_THEME = {
  primary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#0f172a',
  muted: '#64748b',
  lightBg: '#f8fafc'
};

// --- Financial Currency Format Assistant ---
const formatCurrency = (val) => "UGX " + (Number(val) || 0).toLocaleString();

const SavingView = () => {
  // --- Core State Matrices Driven by Simulated Database Engine ---
  const [accountsData, setAccountsData] = useState([
    { id: 1, type: "Mandatory Shares", balanceRaw: 12400000, accounts: 3240, yield: "12.5%", trendingUp: true },
    { id: 2, type: "Voluntary Savings", balanceRaw: 8150000, accounts: 2850, yield: "8.0%", trendingUp: true },
    { id: 3, type: "Fixed Deposits", balanceRaw: 4300000, accounts: 412, yield: "14.2%", trendingUp: false },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, name: "Sarah Mwangi", type: "Voluntary Savings", action: "Deposit", amount: 125000, time: "10:45 AM", status: "Completed" },
    { id: 2, name: "David Ochieng", type: "Fixed Deposits", action: "Withdraw", amount: 450000, time: "09:12 AM", status: "Completed" },
    { id: 3, name: "Grace Alecho", type: "Mandatory Shares", action: "Deposit", amount: 80000, time: "08:22 AM", status: "Completed" },
    { id: 4, name: "Julius Ssekitoleko", type: "Voluntary Savings", action: "Deposit", amount: 300000, time: "07:05 AM", status: "Pending" },
  ]);

  const [savingsGroups, setSavingsGroups] = useState([
    { id: 1, name: "Unity Women Savers", members: 24, target: 5000000, current: 3250000, date: "Jul 15, 2026" },
    { id: 2, name: "Boda Boda Kampala Co-op", members: 42, target: 12000000, current: 9800000, date: "Aug 12, 2026" }
  ]);

  // --- Utility State Engines ---
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionTab, setTransactionTab] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalcAccount, setSelectedCalcAccount] = useState(null);
  const [calcYears, setCalcYears] = useState(3);
  const [newGroup, setNewGroup] = useState({ name: "", target: "", members: "" });
  const [toasts, setToasts] = useState([]);
  
  // --- Live Micro-Stream Tracking States ---
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());
  const pollingTimerRef = useRef(null);

  // --- Dynamic Simulation Trends ---
  const savingsTrends = [
    { month: "Jan", amount: 18400000 }, 
    { month: "Feb", amount: 21200000 }, 
    { month: "Mar", amount: 24850000 }
  ];

  // --- Action Driven Premium Toast Trigger ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Background Database Heartbeat Emulator ---
  useEffect(() => {
    if (isLivePolling) {
      pollingTimerRef.current = setInterval(() => {
        setLastSyncedTime(new Date());
        // Randomly simulate micro transaction volatility additions to represent live DB state updates
        if (Math.random() > 0.5) {
          const names = ["Mugisha Ben", "Nakamya Jane", "Okwera Patrick", "Atwine Brenda"];
          const types = ["Mandatory Shares", "Voluntary Savings", "Fixed Deposits"];
          const newTx = {
            id: Date.now(),
            name: names[Math.floor(Math.random() * names.length)],
            type: types[Math.floor(Math.random() * types.length)],
            action: Math.random() > 0.3 ? "Deposit" : "Withdraw",
            amount: Math.floor(Math.random() * 50 + 1) * 10000,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "Completed"
          };
          setTransactions(prev => [newTx, ...prev.slice(0, 8)]);
          triggerToast(`Database View Hook: Transaction parsed for ${newTx.name}`, "info");
        }
      }, 7000);
    }
    return () => { if (pollingTimerRef.current) clearInterval(pollingTimerRef.current); };
  }, [isLivePolling]);

  // --- Action Form Submissions ---
  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.target || !newGroup.members) {
      triggerToast("All ledger submission parameters required.", "danger");
      return;
    }
    setSavingsGroups([...savingsGroups, { 
      id: Date.now(), 
      name: newGroup.name,
      target: Number(newGroup.target),
      members: Number(newGroup.members),
      current: 0, 
      date: "Aug 01, 2026" 
    }]);
    setIsModalOpen(false);
    setNewGroup({ name: "", target: "", members: "" });
    triggerToast("Pooled Group registered inside core ledger successfully.", "success");
  };

  const handleExportData = () => {
    const csv = "Type,Balance,Accounts,Yield\n" + accountsData.map(r => `${r.type},${r.balanceRaw},${r.accounts},${r.yield}`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = `SACCO_Savings_Ledger_${Date.now()}.csv`;
    link.click();
    triggerToast("CSV Audit Matrix Compiled and Downloaded.", "success");
  };

  // --- Memoized Pipeline Filters & Mathematical Compilers ---
  const filteredAccounts = useMemo(() => 
    accountsData.filter(acc => acc.type.toLowerCase().includes(searchTerm.toLowerCase())), 
    [accountsData, searchTerm]
  );

  const filteredTransactions = useMemo(() => 
    transactions.filter(tx => 
      (tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || tx.type.toLowerCase().includes(searchTerm.toLowerCase())) && 
      (transactionTab === "ALL" || tx.action.toUpperCase() === transactionTab)
    ), 
    [transactions, searchTerm, transactionTab]
  );

  const calculatedFutureProjection = useMemo(() => {
    if (!selectedCalcAccount) return 0;
    return Math.round(selectedCalcAccount.balanceRaw * Math.pow(1 + parseFloat(selectedCalcAccount.yield) / 100, calcYears));
  }, [selectedCalcAccount, calcYears]);

  const globalAggregations = useMemo(() => {
    const globalVolume = accountsData.reduce((acc, curr) => acc + curr.balanceRaw, 0);
    const poolVolume = savingsGroups.reduce((acc, curr) => acc + curr.current, 0);
    return {
      globalVolume,
      poolVolume,
      totalAssets: globalVolume + poolVolume
    };
  }, [accountsData, savingsGroups]);

  // --- Table Column Definitions ---
  const productColumns = [
    {
      name: "SAVINGS PRODUCT TIER",
      selector: row => row.type,
      sortable: true,
      cell: row => (
        <div className="d-flex align-items-center gap-2 py-2">
          <div className="p-2 bg-light text-primary rounded-3"><Wallet size={16} /></div>
          <div>
            <div className="fw-bold text-dark">{row.type}</div>
            <span className="text-muted text-xs">{row.accounts.toLocaleString()} active registers</span>
          </div>
        </div>
      )
    },
    {
      name: "LEDGER LIQUID BALANCE",
      selector: row => row.balanceRaw,
      sortable: true,
      right: true,
      cell: row => (
        <span className="font-monospace fw-extrabold text-dark">{formatCurrency(row.balanceRaw)}</span>
      )
    },
    {
      name: "EXPECTED YIELD",
      selector: row => row.yield,
      sortable: true,
      center: true,
      cell: row => (
        <span className={`badge px-2.5 py-1.5 rounded-2 fw-bold ${row.trendingUp ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
          {row.yield} p.a.
        </span>
      )
    },
    {
      name: "PROJECTION COMPILER",
      center: true,
      cell: row => (
        <button 
          className="btn btn-xs btn-outline-primary fw-bold text-xs px-2.5 py-1 rounded-2"
          onClick={() => {
            setSelectedCalcAccount(row);
            triggerToast(`Loaded product matrix: ${row.type}`, "info");
          }}
        >
          Simulate
        </button>
      )
    }
  ];

  const transactionColumns = [
    {
      name: "MEMBER ENTITY",
      selector: row => row.name,
      sortable: true,
      cell: row => <span className="fw-bold text-dark">{row.name}</span>
    },
    {
      name: "LEDGER TARGETROUTE",
      selector: row => row.type,
      sortable: true,
      cell: row => <span className="text-muted text-sm">{row.type}</span>
    },
    {
      name: "ACTION MAP",
      selector: row => row.action,
      sortable: true,
      cell: row => (
        <span className={`badge d-inline-flex align-items-center gap-1 text-xs fw-semibold ${row.action === 'Deposit' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
          {row.action === 'Deposit' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
          {row.action}
        </span>
      )
    },
    {
      name: "VALUE CAP",
      selector: row => row.amount,
      sortable: true,
      right: true,
      cell: row => <span className="font-monospace fw-bold text-dark">{formatCurrency(row.amount)}</span>
    },
    {
      name: "TIMESTAMP / STATE",
      selector: row => row.time,
      sortable: true,
      cell: row => (
        <div className="vstack">
          <span className="text-dark small">{row.time}</span>
          <span className="text-muted font-monospace text-xs" style={{ fontSize: '10px' }}>{row.status}</span>
        </div>
      )
    }
  ];

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: COSMETIC_THEME.lightBg, minHeight: '100vh', position: 'relative' }}>
      
      {/* --- Native Fluid Premium Toast Container --- */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100, maxWidth: '380px' }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast show shadow-lg mb-2 p-3 bg-white border-start border-4 border-${t.type === 'success' ? 'success' : t.type === 'danger' ? 'danger' : 'primary'} align-items-center d-flex`} style={{ borderRadius: '8px', animation: 'slideIn 0.2s ease forwards' }}>
            <div className="me-2">
              {t.type === 'success' ? <CheckCircle size={16} className="text-success" /> : <Info size={16} className="text-primary" />}
            </div>
            <div className="toast-body p-0 text-xs fw-semibold text-dark flex-grow-1">{t.message}</div>
            <button type="button" className="btn-close ms-2" style={{ fontSize: '0.6rem' }} onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}></button>
          </div>
        ))}
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

      {/* Control Premium Top Navigation Banner */}
      <div className="card border-0 bg-dark text-white p-4 mb-4 shadow-sm rounded-4 position-relative overflow-hidden">
        <div className="position-absolute end-0 top-0 translate-middle-y opacity-10 text-white p-5"><Landmark size={240} /></div>
        <div className="d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-3 position-relative" style={{ zIndex: 2 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-info text-white text-uppercase tracking-wider fw-bold text-xs px-2 py-1">Enterprise Core</span>
              <div className="d-flex align-items-center gap-1 font-monospace text-xs text-muted">
                <span className="rounded-circle bg-success d-inline-block" style={{ width: '6px', height: '6px' }}></span>
                Sync Node Connected ({lastSyncedTime.toLocaleTimeString()})
              </div>
            </div>
            <h3 className="fw-extrabold mb-0 tracking-tight">Apex Capital Savings Repository</h3>
            <p className="text-muted small mb-0">Unified financial ledger audits, pooled tracking algorithms, and real-time validation components.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-2.5 text-muted"><Search size={14} /></span>
              <input 
                className="form-control form-control-sm ps-5 bg-secondary text-white border-0 py-2 rounded-3 text-xs fw-medium" 
                style={{ minWidth: '220px', backgroundColor: 'rgba(255,255,255,0.15)' }}
                placeholder="Search vaults, entities or route IDs..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <button className="btn btn-sm btn-light p-2 rounded-3 text-dark border-0 shadow-sm" onClick={handleExportData} title="Export Ledger Grid"><Download size={14} /></button>
            <button 
              className={`btn btn-sm px-2.5 py-1.5 rounded-3 fw-bold text-xs d-flex align-items-center gap-1 border-0 ${isLivePolling ? 'btn-outline-warning text-warning' : 'btn-info text-white'}`}
              style={{ backgroundColor: isLivePolling ? 'rgba(245, 158, 11, 0.15)' : '' }}
              onClick={() => {
                setIsLivePolling(!isLivePolling);
                triggerToast(isLivePolling ? "Live API sync suspended." : "Re-initialized real-time engine stream pipeline.", "info");
              }}
            >
              <RefreshCw size={12} className={isLivePolling ? 'spinner-border border-0 p-0' : ''} style={{ animationDuration: '3s' }} />
              {isLivePolling ? 'Live' : 'Frozen'}
            </button>
          </div>
        </div>
      </div>

      {/* Structural Global KPI Overview Metric Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-white p-3 rounded-3" style={{ borderLeft: `4px solid ${COSMETIC_THEME.primary}` }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Total System Liquidity</span>
                <h4 className="fw-extrabold text-dark tracking-tight mb-0">{formatCurrency(globalAggregations.totalAssets)}</h4>
              </div>
              <div className="p-2 bg-light rounded-3 text-primary"><Landmark size={20} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-white p-3 rounded-3" style={{ borderLeft: `4px solid ${COSMETIC_THEME.success}` }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Pooled Cluster Concentration</span>
                <h4 className="fw-extrabold text-dark tracking-tight mb-0">{formatCurrency(globalAggregations.poolVolume)}</h4>
              </div>
              <div className="p-2 bg-light rounded-3 text-success"><Users size={20} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-white p-3 rounded-3" style={{ borderLeft: `4px solid ${COSMETIC_THEME.warning}` }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase text-muted fw-bold d-block text-xs mb-1">Weighted System Yield Mean</span>
                <h4 className="fw-extrabold text-dark tracking-tight mb-0">11.56% <span className="text-success text-xs fw-medium font-monospace">p.a</span></h4>
              </div>
              <div className="p-2 bg-light rounded-3 text-warning"><TrendingUp size={20} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Enterprise Functional Workspace Interface Grid */}
      <div className="row g-4">
        
        {/* Left Operational Segment Block: Ledger Matrix Rows & Transaction Pipeline */}
        <div className="col-12 col-lg-8">
          
          {/* Section Matrix 1: Vault Product Tiers */}
          <div className="card border-0 shadow-sm p-2 bg-white mb-4" style={{ borderRadius: '16px' }}>
            <DataTable 
              title={<div className="fw-extrabold text-dark tracking-tight text-base py-1">Liquidity Product Matrix Tiers</div>} 
              columns={productColumns} 
              data={filteredAccounts} 
              pagination 
              highlightOnHover
              responsive
              customStyles={{
                headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
                headCells: { style: { color: COSMETIC_THEME.muted, fontWeight: '700', fontSize: '0.72rem', letterSpacing: '0.04em' } },
                rows: { style: { minHeight: '56px', borderBottom: '1px solid #f1f5f9' } }
              }}
            />
          </div>

          {/* Section Matrix 2: Live Transact Stream View */}
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center border-bottom pb-2 mb-2 gap-2">
              <div className="vstack">
                <h6 className="fw-extrabold text-dark tracking-tight mb-0">Dynamic Database Ingest Stream</h6>
                <p className="text-muted text-xs mb-0">Reflecting continuous incoming entries extracted from backing logs.</p>
              </div>
              
              {/* Tab Filters */}
              <div className="btn-group p-1 bg-light rounded-3" role="group">
                {["ALL", "DEPOSIT", "WITHDRAW"].map((tab) => (
                  <button 
                    key={tab} 
                    type="button" 
                    className={`btn btn-xs fw-bold px-3 py-1 rounded-2 border-0 ${transactionTab === tab ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                    style={{ fontSize: '0.68rem' }}
                    onClick={() => setTransactionTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <DataTable 
              noHeader 
              columns={transactionColumns} 
              data={filteredTransactions} 
              pagination 
              highlightOnHover
              responsive
              customStyles={{
                headRow: { style: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
                headCells: { style: { color: COSMETIC_THEME.muted, fontWeight: '700', fontSize: '0.72rem' } },
                rows: { style: { minHeight: '50px' } }
              }}
            />
          </div>
        </div>

        {/* Right Segment Block: Projections Engine & Pooled Clusters */}
        <div className="col-12 col-lg-4">
          
          {/* Dynamic Compound Yield Calculator Toolkit */}
          <div className="card border-0 shadow-sm p-3 mb-4 bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 bg-primary-subtle text-primary rounded-3"><Sliders size={16} /></div>
              <h6 className="fw-extrabold text-dark tracking-tight mb-0">Yield Projection Simulation</h6>
            </div>

            {!selectedCalcAccount ? (
              <div className="p-4 border border-dashed rounded-3 text-center bg-light">
                <HelpCircle size={24} className="text-muted opacity-50 mb-2" />
                <p className="text-muted text-xs mb-0">Select an asset balance simulation route from the database tier index above to generate yield analytics forecasts.</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                <div className="p-2.5 bg-light rounded-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-xs fw-bold text-dark">{selectedCalcAccount.type}</span>
                    <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedCalcAccount(null)}><X size={14} /></button>
                  </div>
                  <span className="text-muted text-xs">Principal Base Value: {formatCurrency(selectedCalcAccount.balanceRaw)}</span>
                </div>

                <div>
                  <label className="form-label text-muted text-xs d-flex justify-content-between fw-bold">
                    <span>Maturity Timeline Horizon:</span>
                    <span className="text-primary">{calcYears} Fiscal Years</span>
                  </label>
                  <input 
                    type="range" className="form-range" min="1" max="10" step="1" 
                    value={calcYears} onChange={(e) => setCalcYears(Number(e.target.value))} 
                  />
                </div>

                <div className="p-3 bg-dark text-white rounded-3 position-relative">
                  <span className="text-uppercase text-muted d-block fw-bold font-monospace" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Estimated Future Compounded Yield Value</span>
                  <h4 className="fw-extrabold tracking-tight text-info mt-1 mb-0 font-monospace">
                    {formatCurrency(calculatedFutureProjection)}
                  </h4>
                  <div className="text-muted text-xs mt-1" style={{ fontSize: '11px' }}>
                    Compounded at interest value threshold ${selectedCalcAccount.yield}$ per year.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pooled Target Clusters Panel Module */}
          <div className="card border-0 shadow-sm p-3 mb-4 bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-success-subtle text-success rounded-3"><Users size={16} /></div>
                <h6 className="fw-extrabold text-dark tracking-tight mb-0">Pooled Capital Target Clusters</h6>
              </div>
              <button className="btn btn-xs btn-primary fw-bold text-xs d-flex align-items-center gap-1 px-2.5 py-1.5 rounded-2" onClick={() => setIsModalOpen(true)}>
                <Plus size={12} /> Add Group
              </button>
            </div>

            <div className="vstack gap-3">
              {savingsGroups.map(g => {
                const completionRatio = (g.current / g.target) * 100;
                return (
                  <div key={g.id} className="p-2.5 border rounded-3 hover-bg-light transition-all">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <span className="fw-extrabold text-dark text-sm d-block">{g.name}</span>
                        <span className="text-muted text-xs font-monospace">{g.members} Active Members Joined</span>
                      </div>
                      <span className="badge bg-light text-primary fw-bold text-xs">{completionRatio.toFixed(0)}%</span>
                    </div>

                    <div className="progress mb-2" style={{ height: '6px', borderRadius: '4px' }}>
                      <div 
                        className="progress-bar bg-success rounded-pill" 
                        role="progressbar" 
                        style={{ width: `${Math.min(completionRatio, 100)}%` }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between text-xs font-monospace text-muted" style={{ fontSize: '11px' }}>
                      <span>Has: {formatCurrency(g.current)}</span>
                      <span>Target: {formatCurrency(g.target)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auxiliary Live Velocity Analytics Aggregator Matrix */}
          <div className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: '16px' }}>
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-primary" /> Visual System Growth Margin
            </h6>
            <div style={{ width: '100%', height: '140px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COSMETIC_THEME.primary} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={COSMETIC_THEME.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke={COSMETIC_THEME.muted} />
                  <YAxis tick={{ fontSize: 8 }} stroke={COSMETIC_THEME.muted} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="amount" stroke={COSMETIC_THEME.primary} strokeWidth={2} fillOpacity={1} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* --- Add Cluster Creation Verification Modal Layout --- */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-dark text-white border-0 p-3">
                <h5 className="modal-title fw-bold text-base">Register Pooled Cluster Path</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCreateGroupSubmit}>
                <div className="modal-body p-4 vstack gap-3">
                  <div>
                    <label className="form-label text-xs fw-bold text-dark">Cluster Name Identifier</label>
                    <input 
                      type="text" className="form-control form-control-sm py-2 rounded-2" 
                      placeholder="e.g., Mukono Agricultural Associates"
                      value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-dark">Target Limit (UGX)</label>
                      <input 
                        type="number" className="form-control form-control-sm py-2 rounded-2" 
                        placeholder="7500000"
                        value={newGroup.target} onChange={(e) => setNewGroup({...newGroup, target: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-xs fw-bold text-dark">Expected Core Headcount</label>
                      <input 
                        type="number" className="form-control form-control-sm py-2 rounded-2" 
                        placeholder="15"
                        value={newGroup.members} onChange={(e) => setNewGroup({...newGroup, members: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-3 bg-light d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary rounded-2" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-bold">Commit Route</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SavingView;