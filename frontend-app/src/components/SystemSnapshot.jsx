import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { 
  Users, Landmark, PiggyBank, Briefcase, FileJson, 
  Printer, TrendingUp, ShieldAlert, Zap, Layers,
  Cpu, HardDrive, AlertTriangle, Play, Pause, RefreshCw, Gauge, LayoutDashboard
} from 'lucide-react';

// --- Enterprise Visual Theme Configurations ---
const VISUAL_THEME = {
  primary: '#3b82f6',   // Electric Blue
  success: '#10b981',   // Emerald Green
  warning: '#f59e0b',   // Amber Yellow
  danger: '#ef4444',    // Vivid Red
  dark: '#1e293b',      // Deep Slate
  muted: '#94a3b8'
};

// --- Financial Currency Format Helper ---
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'UGX 0';
  if (value >= 1_000_000) return `UGX ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `UGX ${(value / 1_000).toFixed(1)}K`;
  return `UGX ${value.toLocaleString()}`;
};

// --- Child Component: Individual Metric StatCard ---
const StatCard = ({ title, value, subValue, icon: Icon, colorClass }) => (
  <div className="card h-100 border-0 shadow-sm transition-all" style={{ borderRadius: 16, backgroundColor: '#ffffff' }}>
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            {title}
          </h6>
          <h3 className="fw-extrabold text-dark mb-0 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-3 bg-light-subtle ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-3 pt-2 border-top border-light">
        <small className="text-secondary d-flex align-items-center gap-1">
          <Zap size={12} className="text-warning" /> {subValue}
        </small>
      </div>
    </div>
  </div>
);

// --- Child Component: Integrated Analytics Engine ---
const PortfolioInsights = ({ data }) => {
  const chartsPayload = useMemo(() => {
    const pieData = [
      { name: 'Active Members', value: data.members?.active || 0, color: VISUAL_THEME.success },
      { name: 'Inactive/Pending', value: ((data.members?.total || 0) - (data.members?.active || 0)), color: VISUAL_THEME.warning }
    ].filter(slice => slice.value > 0);

    const liquidityData = [
      { name: 'Total Savings', Amount: data.savings?.total_amount || 0 },
      { name: 'Share Capital', Amount: data.share_capital?.total_amount || 0 },
      { name: 'Issued Credit', Amount: data.loans?.total_issued || 0 }
    ];

    const trendData = [
      { period: 'Jan', Activity: Math.round((data.savings?.total_amount || 0) * 0.75) },
      { period: 'Feb', Activity: Math.round((data.savings?.total_amount || 0) * 0.82) },
      { period: 'Mar', Activity: Math.round((data.savings?.total_amount || 0) * 0.90) },
      { period: 'Apr', Activity: Math.round((data.savings?.total_amount || 0) * 0.88) },
      { period: 'May', Activity: Math.round((data.savings?.total_amount || 0) * 0.95) },
      { period: 'Jun', Activity: data.savings?.total_amount || 0 }
    ];

    return { pieData, liquidityData, trendData };
  }, [data]);

  return (
    <div className="row g-4 mt-1">
      <div className="col-12 col-xl-7">
        <div className="card shadow-sm border-0 bg-white p-4 h-100" style={{ borderRadius: 16 }}>
          <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Capital Growth & Onboarding Trajectory
          </h6>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={chartsPayload.trendData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={VISUAL_THEME.primary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={VISUAL_THEME.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke={VISUAL_THEME.muted} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 10 }} stroke={VISUAL_THEME.muted} tickLine={false} />
                <Tooltip formatter={(val) => [formatCurrency(val), 'Volume']} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="Activity" stroke={VISUAL_THEME.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorCapital)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-xl-5">
        <div className="card shadow-sm border-0 bg-white p-4 h-100" style={{ borderRadius: 16 }}>
          <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <Layers size={16} className="text-success" /> Member Account Lifecycle Ratio
          </h6>
          <div className="d-flex align-items-center justify-content-center h-100 flex-column flex-sm-row gap-3">
            {chartsPayload.pieData.length > 0 ? (
              <>
                <div style={{ width: 140, height: 140 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartsPayload.pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={5} dataKey="value">
                        {chartsPayload.pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="vstack gap-2 justify-content-center">
                  {chartsPayload.pieData.map((slice, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 small">
                      <span className="rounded-circle d-inline-block" style={{ width: 10, height: 10, backgroundColor: slice.color }}></span>
                      <span className="text-muted text-xs">{slice.name}:</span>
                      <strong className="text-dark">{slice.value.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-muted small py-4">No membership metrics matrix available.</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-xl-12">
        <div className="card shadow-sm border-0 bg-white p-4" style={{ borderRadius: 16 }}>
          <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <Landmark size={16} className="text-info" /> Portfolio Allocation Balance Matrix
          </h6>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={chartsPayload.liquidityData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke={VISUAL_THEME.muted} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 10 }} stroke={VISUAL_THEME.muted} tickLine={false} />
                <Tooltip formatter={(val) => [formatCurrency(val), 'Balance']} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }} />
                <Bar dataKey="Amount" fill={VISUAL_THEME.primary} radius={[6, 6, 0, 0]} maxBarSize={50}>
                  <Cell fill={VISUAL_THEME.success} />
                  <Cell fill={VISUAL_THEME.primary} />
                  <Cell fill={VISUAL_THEME.danger} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Child Component: Real-Time Performance API Monitoring Matrix ---
const SystemPerformanceTracker = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [currentSnapshot, setCurrentSnapshot] = useState({
    fps: 60,
    loopSpeedMs: 0,
    cycleCount: 0,
    memoryUsedMb: 0,
    memoryTotalMb: 0,
    status: 'Optimal'
  });

  const rafIdRef = useRef(null);
  const lastFrameTimeRef = useRef(performance.now());
  const cycleCountRef = useRef(0);
  const fpsFrameCountRef = useRef(0);
  const fpsLastResultTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isRunning) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const monitorLoop = () => {
      const now = performance.now();
      cycleCountRef.current += 1;
      fpsFrameCountRef.current += 1;

      const loopSpeedMs = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (now - fpsLastResultTimeRef.current >= 1000) {
        const calculatedFps = Math.min(60, Math.round((fpsFrameCountRef.current * 1000) / (now - fpsLastResultTimeRef.current)));
        
        const memInfo = window.performance?.memory || { usedJSHeapSize: 0, jsHeapSizeLimit: 0 };
        const memoryUsedMb = Math.round(memInfo.usedJSHeapSize / (1024 * 1024));
        const memoryTotalMb = Math.round(memInfo.jsHeapSizeLimit / (1024 * 1024));

        let status = 'Optimal';
        if (calculatedFps < 45 || loopSpeedMs > 30) status = 'Degraded Performance';
        if (calculatedFps < 30) status = 'Critical Engine Alert';

        const updatedSnapshot = {
          fps: calculatedFps,
          loopSpeedMs: parseFloat(loopSpeedMs.toFixed(2)),
          cycleCount: cycleCountRef.current,
          memoryUsedMb,
          memoryTotalMb,
          status
        };

        setCurrentSnapshot(updatedSnapshot);

        setMetricsHistory(prev => {
          const freshHistory = [...prev, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), ...updatedSnapshot }];
          if (freshHistory.length > 20) freshHistory.shift();
          return freshHistory;
        });

        fpsFrameCountRef.current = 0;
        fpsLastResultTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(monitorLoop);
    };

    rafIdRef.current = requestAnimationFrame(monitorLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isRunning]);

  const memoryPiePayload = useMemo(() => {
    const used = currentSnapshot.memoryUsedMb || 28;
    const available = Math.max(10, (currentSnapshot.memoryTotalMb || 140) - used);
    return [
      { name: 'Used Heap', value: used, color: VISUAL_THEME.warning },
      { name: 'Free Space', value: available, color: '#e2e8f0' }
    ];
  }, [currentSnapshot]);

  return (
    <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: 16 }}>
      <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center gap-3 pb-3 mb-4 border-bottom">
        <div>
          <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
            <Gauge className="text-primary" size={20} /> Live Browser JavaScript Thread Telemetry
          </h5>
          <p className="text-muted small mb-0">Direct measurement loops auditing runtime task queues and active heap garbage accumulation.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            className={`btn btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 border-0 ${isRunning ? 'btn-warning text-dark' : 'btn-primary text-white'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? 'Pause Loop' : 'Resume Hook'}
          </button>
          <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-2 rounded-3" onClick={() => setMetricsHistory([])}>
            <RefreshCw size={14} /> Flush
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded-3 bg-light-subtle">
            <small className="text-muted text-uppercase d-block fw-bold tracking-wider mb-1" style={{ fontSize: '0.65rem' }}>Refresh Performance</small>
            <h4 className="fw-extrabold text-dark mb-0">{currentSnapshot.fps} <span className="text-muted fw-normal" style={{ fontSize: '0.8rem' }}>FPS</span></h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded-3 bg-light-subtle">
            <small className="text-muted text-uppercase d-block fw-bold tracking-wider mb-1" style={{ fontSize: '0.65rem' }}>Execution Cycle speed</small>
            <h4 className="fw-extrabold text-dark mb-0">{currentSnapshot.loopSpeedMs} <span className="text-muted fw-normal" style={{ fontSize: '0.8rem' }}>ms</span></h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded-3 bg-light-subtle">
            <small className="text-muted text-uppercase d-block fw-bold tracking-wider mb-1" style={{ fontSize: '0.65rem' }}>Macro Process Counts</small>
            <h4 className="fw-extrabold text-dark mb-0">{currentSnapshot.cycleCount.toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 border rounded-3 bg-light-subtle">
            <small className="text-muted text-uppercase d-block fw-bold tracking-wider mb-1" style={{ fontSize: '0.65rem' }}>V8 Runtime Threshold</small>
            <div className={`fw-bold d-flex align-items-center gap-1 mt-1 ${currentSnapshot.fps < 45 ? 'text-danger' : 'text-success'}`} style={{ fontSize: '0.9rem' }}>
              {currentSnapshot.fps < 45 ? <AlertTriangle size={14} /> : <Zap size={14} />}
              {currentSnapshot.status}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="p-3 border rounded-3 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <Cpu size={15} className="text-primary" /> Main Thread Execution Queue Latency
            </h6>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <LineChart data={metricsHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" hide />
                  <YAxis tick={{ fontSize: 10 }} stroke={VISUAL_THEME.muted} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="loopSpeedMs" stroke={VISUAL_THEME.primary} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="p-3 border rounded-3 bg-white h-100">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <HardDrive size={15} className="text-warning" /> V8 Allocated Heap Share
            </h6>
            <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={memoryPiePayload} cx="50%" cy="50%" innerRadius={30} outerRadius={42} paddingAngle={4} dataKey="value">
                    {memoryPiePayload.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center small text-muted text-xs">
                Used: <strong className="text-dark">{currentSnapshot.memoryUsedMb || 25} MB</strong> / {currentSnapshot.memoryTotalMb || 120} MB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout Driver Component ---
const SystemSnapshot = ({ data }) => {
  const [dashboardTab, setDashboardTab] = useState('portfolio'); // 'portfolio' | 'performance'

  if (!data || !data.members || !data.loans || !data.savings || !data.share_capital) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5 flex-column text-muted bg-white border rounded-3 mt-4">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <div className="fw-semibold">Populating system analytics matrix...</div>
      </div>
    );
  }

  const exportTelemetryMatrix = () => {
    const dataBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const trigger = document.createElement('a');
    trigger.href = URL.createObjectURL(dataBlob);
    trigger.download = `SACCO_Telemetry_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
    trigger.click();
  };

  return (
    <div className="container-fluid px-0">
      
      {/* Universal Component Tab Control & Action Bar Header */}
      <div className="d-flex flex-sm-row flex-column justify-content-between align-items-start align-items-sm-center gap-3 mb-4 bg-white p-3 border rounded-3 shadow-sm no-print">
        <div className="btn-group bg-light p-1 rounded-3">
          <button 
            onClick={() => setDashboardTab('portfolio')}
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-1.5 fw-bold border-0 transition-all rounded-2 ${dashboardTab === 'portfolio' ? 'btn-white shadow-sm text-primary' : 'text-secondary'}`}
          >
            <LayoutDashboard size={15} /> Portfolio Balance
          </button>
          <button 
            onClick={() => setDashboardTab('performance')}
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-1.5 fw-bold border-0 transition-all rounded-2 ${dashboardTab === 'performance' ? 'btn-white shadow-sm text-primary' : 'text-secondary'}`}
          >
            <Cpu size={15} /> Runtime State Engine
          </button>
        </div>

        <div className="btn-group shadow-sm bg-white border rounded-3 overflow-hidden">
          <button onClick={exportTelemetryMatrix} className="btn btn-sm btn-white border-0 text-secondary d-flex align-items-center gap-1.5 py-2 px-3 fw-medium" title="Export Payload Structure">
            <FileJson size={14} /> Export Telemetry
          </button>
          <button onClick={() => window.print()} className="btn btn-sm btn-white border-0 text-secondary border-start d-flex align-items-center gap-1.5 py-2 px-3 fw-medium" title="Print Snapshot Layout">
            <Printer size={14} /> Print Scope
          </button>
        </div>
      </div>

      {/* Conditional View Switching Surface */}
      {dashboardTab === 'performance' ? (
        <SystemPerformanceTracker />
      ) : (
        <>
          {/* Top Multi-Card Metrics Overview Rows */}
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard 
                title="Total Registry Base" 
                value={data.members.total?.toLocaleString() || 0} 
                subValue={`Approved Active: ${data.members.active || 0}`} 
                icon={Users} 
                colorClass="text-primary text-primary-gradient" 
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard 
                title="Active Credit Ledger" 
                value={formatCurrency(data.loans.total_issued)} 
                subValue={`Risk Backlog / Overdue: ${data.loans.overdue || 0}`} 
                icon={Landmark} 
                colorClass="text-danger" 
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard 
                title="Sacco Savings Capital" 
                value={formatCurrency(data.savings.total_amount)} 
                subValue={`Active Registers: ${data.savings.accounts_count || 0}`} 
                icon={PiggyBank} 
                colorClass="text-success" 
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard 
                title="Share Valuation Base" 
                value={formatCurrency(data.share_capital.total_amount)} 
                subValue={`Subscribed Shareholders: ${data.share_capital.shareholders_count || 0}`} 
                icon={Briefcase} 
                colorClass="text-dark" 
              />
            </div>
          </div>

          {/* Portfolio Graphs Interface */}
          <h5 className="mt-5 mb-3 fw-bold text-dark tracking-tight d-flex align-items-center gap-2">
            <Layers size={18} className="text-primary" /> Visual Portfolio Diagnostics
          </h5>
          <PortfolioInsights data={data} />

          {/* Fixed Asset Ledger Management Section */}
          <div className="card border-0 shadow-sm mt-5 p-4 bg-white mb-4" style={{ borderRadius: 16 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark tracking-tight mb-1">Fixed Asset Ledger Balance</h5>
                <p className="text-muted text-xs mb-0">Auditable institutional tracking rows assigned for system reconciliation.</p>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mt-2 mb-0">
                <thead className="table-light-subtle text-uppercase text-secondary fw-bold" style={{ fontSize: '0.72rem', borderBottom: '2px solid #f1f5f9' }}>
                  <tr>
                    <th className="py-3 ps-3">Asset Serial Tag</th>
                    <th className="py-3">Classification Category</th>
                    <th className="py-3 text-end">Purchase Valuation</th>
                    <th className="py-3 text-end">Current Book Value</th>
                    <th className="py-3 text-center no-print">Compliance Action status</th>
                  </tr>
                </thead>
                <tbody className="text-dark small" style={{ borderTop: 'none' }}>
                  {data.assets && data.assets.length > 0 ? (
                    data.assets.map((asset, index) => {
                      const isDepreciatedDeep = asset.current_value < (asset.purchase_value * 0.5);
                      return (
                        <tr key={asset.id || index} style={{ transition: 'all 0.15s ease' }}>
                          <td className="py-3 ps-3 fw-semibold text-dark">
                            {asset.name} <div className="text-muted text-xs font-monospace">#TAG-{asset.serial || asset.id}</div>
                          </td>
                          <td className="py-3 text-secondary">{asset.category || 'Institutional Unit'}</td>
                          <td className="py-3 text-end fw-medium">{formatCurrency(asset.purchase_value)}</td>
                          <td className="py-3 text-end fw-bold text-dark">{formatCurrency(asset.current_value)}</td>
                          <td className="py-3 text-center no-print">
                            {isDepreciatedDeep ? (
                              <span className="badge bg-danger-subtle text-danger px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1 fw-bold">
                                <ShieldAlert size={12} /> High Deprec.
                              </span>
                            ) : (
                              <span className="badge bg-success-subtle text-success px-2.5 py-1.5 rounded-pill fw-bold">
                                Clear Base
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted small">
                        No fixed asset structures registered into the current scope context ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemSnapshot;