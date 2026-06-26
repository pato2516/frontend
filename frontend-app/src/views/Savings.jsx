// frontend-app/src/views/Savings.jsx
import React, { useState, useMemo } from 'react';

export default function Savings() {
  // --- EXISTING CORE STATES ---
  const [monthlyContribution, setMonthlyContribution] = useState(250000);
  const currentTotalSavings = 4820500;
  const annualRate = 0.085; // 8.5% p.a.

  // --- NEW INTERACTIVE FEATURE STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeActionDrawer, setActiveActionDrawer] = useState(null); // 'lock' | 'goal' | 'autoDeduct' | 'drip' | null
  const [showNotification, setShowNotification] = useState(null);
  
  // Interactive Feature Inputs
  const [lockAmount, setLockAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('90');
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [dripEnabled, setDripEnabled] = useState(true);
  const [autoDeductRule, setAutoDeductRule] = useState({ enabled: false, day: '25', channel: 'Mobile Money' });

  // Mock initial goal tracker profiles (Dynamic feature matrix)
  const [memberGoals, setMemberGoals] = useState([
    { title: 'Ordinary Savings', meta: 'Instant withdrawal', amt: 3200500, goal: 4500000, icon: 'bi-piggy-bank text-primary', bg: '#EFF6FF' },
    { title: 'Fixed Deposit', meta: 'Mature in 120 days', amt: 1200000, goal: 1500000, icon: 'bi-lock text-secondary', bg: '#F8FAFC' },
    { title: 'Share Capital', meta: 'Membership equity', amt: 1200000, goal: 2500000, icon: 'bi-pie-chart text-info', bg: '#F0FDFA' }
  ]);

  // Mock ledger data for advanced lookup and auditing
  const ledgerActivities = [
    { title: 'Interest Earned - August', meta: 'Aug 31, 2026 • Fixed Deposit', value: 8500, type: 'interest', isCredit: true },
    { title: 'Monthly Contribution', meta: 'Aug 25, 2026 • Ordinary Savings', value: 150000, type: 'contribution', isCredit: true },
    { title: 'Emergency Share Back-Borrow', meta: 'Jul 10, 2026 • Ordinary Savings', value: -45000, type: 'withdrawal', isCredit: false },
    { title: 'Sacco Dividends Payout', meta: 'Jun 30, 2026 • Share Capital', value: 84000, type: 'dividend', isCredit: true }
  ];

  // --- 1. COMPOUND INTEREST CALCULATION ENGINE ---
  const projectedBalance = useMemo(() => {
    return Math.round(
      currentTotalSavings + (monthlyContribution * 12) + ((currentTotalSavings + (monthlyContribution * 6)) * annualRate)
    );
  }, [monthlyContribution]);

  const projectedThreeYears = useMemo(() => {
    let balance = currentTotalSavings;
    for(let i=0; i<3; i++) {
      balance = balance + (monthlyContribution * 12) + (balance * annualRate);
    }
    return Math.round(balance);
  }, [monthlyContribution]);

  // --- 2. BACK-BORROW COLLATERAL CAPACITY CALCULATION ---
  const collateralLimit = useMemo(() => Math.round(currentTotalSavings * 2.5), [currentTotalSavings]);

  // --- 3. AUDIT SEARCH & FILTER PIPELINE ---
  const filteredActivities = useMemo(() => {
    return ledgerActivities.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.meta.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType]);

  // --- TRIGGER INTERACTIVE UI TOAST NOTIFICATION ---
  const triggerToast = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // --- ACTIONS EXECUTIONS ---
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;
    setMemberGoals([...memberGoals, {
      title: newGoal.name,
      meta: 'Custom Goal Vault',
      amt: 0,
      goal: Number(newGoal.target),
      icon: 'bi-trophy text-warning',
      bg: '#FEF3C7'
    }]);
    setNewGoal({ name: '', target: '' });
    setActiveActionDrawer(null);
    triggerToast("✨ New target sub-account milestone successfully established!");
  };

  return (
    <div className="container-fluid px-1 py-1 text-dark position-relative">
      
      {/* INJECTED ANIMATION AND SEAMLESS UI COMPONENT STYLES */}
      <style>{`
        .hover-lift { transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.06) !important; }
        .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
        .custom-slider::-webkit-slider-thumb { background: #0B4687 !important; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .extra-small { fontSize: 0.72rem; }
      `}</style>

      {/* SYSTEM INTERACTIVE NOTIFICATION ACTION BANNER */}
      {showNotification && (
        <div className="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg animate-slide-down border-0 d-flex align-items-center gap-2.5" style={{ zIndex: 1100, borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#14532D' }}>
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span className="fw-bold small">{showNotification}</span>
        </div>
      )}

      {/* FEATURE 1: TOTAL SAVINGS HERO BALANCE BANNER WITH HOVER INTERACTION */}
      <div 
        className="p-4 mb-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative overflow-hidden shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0B4687 0%, #062D59 100%)',
          borderRadius: '14px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ zIndex: 1 }}>
          <span className="text-uppercase text-white-50 fw-bold tracking-wider d-flex align-items-center gap-2" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
            <i className="bi bi-shield-check text-success"></i> Consolidated Net Asset Registry
          </span>
          <h1 className="fw-extrabold my-1 tracking-tight font-monospace" style={{ fontSize: '2.6rem', letterSpacing: '-0.02em' }}>
            UGX {currentTotalSavings.toLocaleString()}
          </h1>
          <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
            <span className="badge border-0 rounded-pill px-2.5 py-1 text-dark fw-bold d-inline-flex align-items-center gap-1" style={{ backgroundColor: '#4ADE80', fontSize: '0.72rem' }}>
              <i className="bi bi-graph-up-arrow"></i> Capital Yielding 8.5% p.a.
            </span>
            <span className="text-white-50 small ms-1 font-monospace" style={{ fontSize: '0.78rem' }}>
              + UGX 12,400 accumulated this block
            </span>
          </div>
        </div>
        
        {/* INTERACTIVE ACTIONS HUB QUICK BUTTONS */}
        <div className="mt-4 mt-md-0 d-flex flex-wrap gap-2" style={{ zIndex: 2 }}>
          <button 
            className="btn btn-light fw-extrabold px-3.5 py-2 rounded-3 text-primary shadow-sm hover-lift text-xs border-0"
            type="button"
            onClick={() => setActiveActionDrawer(activeActionDrawer === 'lock' ? null : 'lock')}
          >
            <i className="bi bi-lock-fill me-1.5"></i> Lock Funds
          </button>
          <button 
            className="btn btn-success fw-extrabold px-3.5 py-2 rounded-3 text-white shadow-sm hover-lift text-xs border-0"
            type="button"
            onClick={() => triggerToast("🔄 Internal payment node initialized. Redirecting pipeline...")}
          >
            <i className="bi bi-plus-lg me-1.5"></i> Instant Deposit
          </button>
        </div>
      </div>

      {/* DYNAMIC DROPDOWN FOR INTERACTIVE MEMBER SUB-FEATURES */}
      {activeActionDrawer && (
        <div className="card border-primary p-3 mb-4 bg-light-subtle rounded-3 shadow-sm animate-slide-down">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <span className="fw-bold text-primary text-xs text-uppercase tracking-wider">
              <i className="bi bi-sliders me-1.5"></i> Sacco Portal Workspace Framework
            </span>
            <button type="button" className="btn-close" style={{ transform: 'scale(0.75)' }} onClick={() => setActiveActionDrawer(null)}></button>
          </div>

          {/* FEATURE 2: LOCK SAVINGS ASSET WORKFLOW */}
          {activeActionDrawer === 'lock' && (
            <form onSubmit={(e) => { e.preventDefault(); setActiveActionDrawer(null); triggerToast(`🔒 UGX ${Number(lockAmount).toLocaleString()} locked safely for ${lockPeriod} days.`); }} className="row g-2 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label extra-small fw-bold text-muted mb-1">Volume to Liquidate into Fixed Vault (UGX)</label>
                <input type="number" className="form-control form-control-sm bg-white text-dark text-xs font-monospace py-1.5" placeholder="e.g. 500000" value={lockAmount} onChange={(e) => setLockAmount(e.target.value)} required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label extra-small fw-bold text-muted mb-1">Lock Duration Period</label>
                <select className="form-select form-select-sm bg-white text-dark text-xs py-1.5" value={lockPeriod} onChange={(e) => setLockPeriod(e.target.value)}>
                  <option value="90">90 Days Cycle (9.0% p.a.)</option>
                  <option value="180">180 Days Cycle (10.5% p.a.)</option>
                  <option value="365">365 Days Cycle (12.0% p.a.)</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-sm btn-primary w-100 fw-bold text-xs py-1.5">Commit Capital Lock</button>
              </div>
            </form>
          )}

          {/* FEATURE 3: NEW SUB-ACCOUNT SAVINGS GOALS TARGET VAULT */}
          {activeActionDrawer === 'goal' && (
            <form onSubmit={handleCreateGoal} className="row g-2 align-items-end">
              <div className="col-12 col-md-5">
                <label className="form-label extra-small fw-bold text-muted mb-1">Target Milestone Descriptor / Title</label>
                <input type="text" className="form-control form-control-sm bg-white text-dark text-xs py-1.5" placeholder="e.g. Land Acquisition Fund" value={newGoal.name} onChange={(e) => setNewGoal({...newGoal, name: e.target.value})} required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label extra-small fw-bold text-muted mb-1">Target Capital Cap Metric (UGX)</label>
                <input type="number" className="form-control form-control-sm bg-white text-dark text-xs font-monospace py-1.5" placeholder="e.g. 10000000" value={newGoal.target} onChange={(e) => setNewGoal({...newGoal, target: e.target.value})} required />
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-sm btn-success w-100 fw-bold text-xs py-1.5">Launch Sub-Vault</button>
              </div>
            </form>
          )}

          {/* FEATURE 4: AUTO-DEDUCT RECURRING SWEEP ADJUSTER */}
          {activeActionDrawer === 'autoDeduct' && (
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-4">
                <div className="form-check form-switch ps-0 fs-6 d-flex align-items-center justify-content-between border p-2 bg-white rounded">
                  <span className="fw-bold text-xs ms-2">Automated Monthly Standing Order</span>
                  <input className="form-check-input me-1" type="checkbox" role="switch" checked={autoDeductRule.enabled} onChange={(e) => setAutoDeductRule({...autoDeductRule, enabled: e.target.checked})} />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <select className="form-select form-select-sm bg-white text-dark text-xs py-1.5" disabled={!autoDeductRule.enabled} value={autoDeductRule.day} onChange={(e) => setAutoDeductRule({...autoDeductRule, day: e.target.value})}>
                  <option value="25">Every 25th Day (Payroll Sweep)</option>
                  <option value="30">Every 30th Day (End of Month)</option>
                  <option value="01">Every 1st Day (Cycle Start)</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <button type="button" className="btn btn-sm btn-primary w-100 fw-bold text-xs py-1.5" onClick={() => { setActiveActionDrawer(null); triggerToast(`⚙️ Auto sweep preference synchronized.`); }}>Save Routine Rule</button>
              </div>
            </div>
          )}

          {/* FEATURE 5: DIVIDENDS REINVESTMENT CONTROLLER (DRIP) */}
          {activeActionDrawer === 'drip' && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-2 bg-white rounded border">
              <div>
                <span className="fw-bold text-xs d-block text-dark">Dividends Auto-Compounding Module (DRIP)</span>
                <span className="text-muted extra-small d-block">When enabled, your annual dividend payments are routed instantly into share capital assets.</span>
              </div>
              <div className="form-check form-switch fs-5 mb-0">
                <input className="form-check-input" type="checkbox" checked={dripEnabled} onChange={(e) => { setDripEnabled(e.target.checked); triggerToast(e.target.checked ? "📈 Dividend auto-reinvestment framework activated." : "⚠️ DRIP deactivated. Yields will disperse to liquid cash."); }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAIN TWO-COLUMN FRAMEWORK */}
      <div className="row g-3 mb-4">
        
        {/* LEFT COLUMN: CORE ACCOUNT METRICS VIEW AND MATRIX */}
        <div className="col-12 col-lg-8">
          <div className="bg-white border h-100 hover-lift" style={{ borderRadius: '14px' }}>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center px-4 py-3 border-bottom gap-2" style={{ borderColor: '#F1F5F9' }}>
              <div>
                <h5 className="fw-extrabold mb-0" style={{ color: '#0F2942' }}>Trackable Allocation Tiers</h5>
                <span className="text-muted extra-small">Dynamic individual asset segmentation registries</span>
              </div>
              <button 
                onClick={() => setActiveActionDrawer(activeActionDrawer === 'goal' ? null : 'goal')}
                className="btn btn-sm btn-outline-primary fw-bold text-xs rounded-3"
              >
                <i className="bi bi-folder-plus me-1.5"></i> Setup Target Sub-Account
              </button>
            </div>

            {/* FEATURE 6: DYNAMIC GOAL MILESTONES PROGRESS MATRIX */}
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase" style={{ borderBottom: '1px solid #F1F5F9', fontSize: '0.68rem' }}>
                  <tr>
                    <th className="py-2.5 ps-4" style={{ width: '40%' }}>Account Portfolio Nodes</th>
                    <th className="py-2.5">Balance (UGX)</th>
                    <th className="py-2.5 pe-4" style={{ width: '35%' }}>Milestone Goal Allocation Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {memberGoals.map((row, index) => {
                    const currentPct = Math.min(100, Math.round((row.amt / row.goal) * 100));
                    return (
                      <tr key={index} className="border-bottom" style={{ borderColor: '#F8FAFC' }}>
                        <td className="py-3 ps-4 d-flex align-items-center gap-3">
                          <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', backgroundColor: row.bg }}>
                            <i className={`bi ${row.icon} fs-5`}></i>
                          </div>
                          <div>
                            <span className="fw-extrabold text-dark d-block text-xs mb-0.5">{row.title}</span>
                            <span className="text-muted extra-small d-block">{row.meta}</span>
                          </div>
                        </td>
                        <td className="py-3 fw-bold text-dark font-monospace text-xs">
                          {row.amt.toLocaleString()}
                        </td>
                        <td className="py-3 pe-4">
                          <div className="d-flex justify-content-between align-items-center mb-1 text-muted" style={{ fontSize: '0.68rem' }}>
                            <span>Target: <strong className="text-dark font-monospace">{(row.goal/1000000).toFixed(1)}M</strong></span>
                            <span className="fw-extrabold text-success font-monospace">{currentPct}%</span>
                          </div>
                          <div className="progress" style={{ height: '5px', borderRadius: '10px', backgroundColor: '#E2E8F0' }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: `${currentPct}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE SIDEBAR DECISION INTERFACES */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          
          {/* INTERACTIVE WORKSPACE ADVANCED UTILITY HUD */}
          <div className="bg-white border p-3 rounded-3 shadow-sm">
            <span className="text-uppercase text-muted fw-bold d-block mb-2 tracking-wider" style={{ fontSize: '0.65rem' }}>Automated Sweep Frameworks</span>
            <div className="vstack gap-2">
              <button className="btn btn-sm btn-light text-dark text-start py-2 px-2.5 rounded border d-flex justify-content-between align-items-center" onClick={() => setActiveActionDrawer('autoDeduct')}>
                <div className="d-flex align-items-center gap-2 text-xs fw-semibold"><i className="bi bi-arrow-repeat text-primary"></i> Scheduled Monthly Sweep</div>
                <span className={`badge ${autoDeductRule.enabled ? 'bg-success' : 'bg-secondary'} text-xs font-monospace`}>{autoDeductRule.enabled ? 'Live' : 'Off'}</span>
              </button>
              <button className="btn btn-sm btn-light text-dark text-start py-2 px-2.5 rounded border d-flex justify-content-between align-items-center" onClick={() => setActiveActionDrawer('drip')}>
                <div className="d-flex align-items-center gap-2 text-xs fw-semibold"><i className="bi bi-graph-up text-success"></i> DRIP Compound Engine</div>
                <span className={`badge ${dripEnabled ? 'bg-primary' : 'bg-secondary'} text-xs font-monospace`}>{dripEnabled ? 'Active' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* ACCELERATOR PROJECTION WORKSPACE BLOCK WITH ACCUMULATOR INTERACTION */}
          <div className="bg-white border p-3.5 hover-lift" style={{ borderRadius: '14px' }}>
            <h6 className="fw-extrabold mb-2.5 text-dark">Predictive Growth Simulator</h6>
            
            <div className="mb-3">
              <label className="text-muted extra-small d-block mb-1">Adjust Contribution Allocation Volume (UGX)</label>
              <input 
                type="range" className="form-range custom-slider accent-primary" 
                min="50000" max="2000000" step="50000" 
                value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted font-monospace mt-1 extra-small">
                <span>50k</span>
                <span className="fw-extrabold text-primary bg-primary bg-opacity-10 px-1.5 py-0.5 rounded">UGX {monthlyContribution.toLocaleString()} / mo</span>
                <span>2M</span>
              </div>
            </div>

            {/* FEATURE 7: EXPANDED COMPOUND INTEREST TIMELINE ENGINE MATRIX */}
            <div className="p-3 rounded-3 bg-light border text-center mb-2">
              <span className="text-muted text-uppercase d-block mb-0.5" style={{ fontSize: '0.62rem', letterSpacing: '0.04em' }}>Projected Equity Balance (12 Months Yield)</span>
              <h4 className="fw-extrabold text-success mb-0 font-monospace" style={{ letterSpacing: '-0.02em' }}>
                UGX {projectedBalance.toLocaleString()}
              </h4>
            </div>

            <div className="p-2 rounded bg-success bg-opacity-10 text-center d-flex justify-content-between align-items-center px-2.5">
              <span className="extra-small text-dark fw-medium">3-Year Long Term Forecast:</span>
              <strong className="text-success font-monospace text-xs">UGX {projectedThreeYears.toLocaleString()}</strong>
            </div>
          </div>

          {/* FEATURE 8: INLINE EMERGENCY LIQUID BACK-BORROWING ESTIMATOR */}
          <div className="p-3 bg-dark bg-gradient text-white rounded-3 shadow-sm position-relative overflow-hidden">
            <div style={{ zIndex: 2, position: 'relative' }}>
              <span className="text-uppercase text-white-50 fw-bold d-block" style={{ fontSize: '0.62rem', letterSpacing: '0.04em' }}>Collateral Leverage Capacity</span>
              <h5 className="fw-extrabold text-warning my-0.5 font-monospace">UGX {collateralLimit.toLocaleString()}</h5>
              <p className="mb-0 text-white-50 lh-sm" style={{ fontSize: '0.68rem' }}>
                Based on historical equity benchmarks, you qualify to back-borrow up to 250% of savings collateral instantly.
              </p>
            </div>
            <i className="bi bi-lightning-charge-fill position-absolute end-0 bottom-0 text-white opacity-10" style={{ fontSize: '4.5rem', transform: 'translate(10%, 20%)' }}></i>
          </div>

        </div>
      </div>

      {/* AUDIT LOG ACCORDION BLOCK + INTERACTIVE SEARCH LAYERS */}
      <div className="bg-white border p-4 hover-lift" style={{ borderRadius: '14px' }}>
        
        {/* FEATURE 9: DYNAMIC MULTI-FIELD SEARCH & CATEGORY LEDGER FILTERING */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h5 className="fw-extrabold mb-0 text-dark d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-muted"></i> Historical Savings Audit Log
            </h5>
            <span className="text-muted extra-small">Verified digital cryptographic accounting trace entries</span>
          </div>
          
          {/* FEATURE 10: INTERACTIVE COMPLIANCE PDF EXPORT PIPELINE */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <input 
              type="text" className="form-control form-control-sm bg-light text-dark text-xs border rounded-3 px-2.5 py-1.5"
              placeholder="Search descriptor node..." style={{ maxWidth: '200px' }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="form-select form-select-sm bg-light text-dark text-xs py-1.5 rounded-3" style={{ maxWidth: '140px' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Tiers</option>
              <option value="contribution">Contributions</option>
              <option value="interest">Yield Earnings</option>
              <option value="dividend">Dividends</option>
            </select>
            <button 
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-2.5 py-1.5 text-xs fw-semibold rounded-3"
              onClick={() => triggerToast("📄 Generating cryptographically signed ledger file. Download payload ready inside workspace...")}
            >
              <i className="bi bi-download"></i> Export Data
            </button>
          </div>
        </div>

        {/* LEDGER RENDER ENGINE CONTAINER */}
        <div className="d-flex flex-column">
          {filteredActivities.length === 0 ? (
            <div className="text-center p-4 text-muted extra-small">No ledger logs matched the search criteria filter matrix.</div>
          ) : (
            filteredActivities.map((item, index) => (
              <div key={index} className={`d-flex justify-content-between align-items-center py-3 ${index !== filteredActivities.length - 1 ? 'border-bottom' : ''}`} style={{ borderColor: '#F8FAFC' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '36px', height: '36px', backgroundColor: item.isCredit ? '#DCFCE7' : '#F1F5F9' }}>
                    <i className={`bi ${item.isCredit ? 'bi-arrow-down-left text-success' : 'bi-arrow-up-right text-danger'} text-xs fw-bold`}></i>
                  </div>
                  <div>
                    <span className="fw-extrabold text-dark d-block text-xs mb-0.5">{item.title}</span>
                    <span className="text-muted extra-small d-block">{item.meta}</span>
                  </div>
                </div>
                
                <div className="text-end">
                  <span className={`fw-extrabold font-monospace d-block text-xs ${item.isCredit ? 'text-success' : 'text-danger'}`}>
                    {item.isCredit ? '+' : ''} UGX {item.value.toLocaleString()}
                  </span>
                  <span className="badge bg-success-subtle text-success border-0 px-2 py-0.5 mt-1 rounded-pill" style={{ fontSize: '0.6rem', fontWeight: '800' }}>RECONCILED</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COMPLIANCE AND TAX OVERLAY FOOTNOTE */}
        <div className="mt-3 pt-2.5 border-top d-flex flex-wrap justify-content-between align-items-center text-muted extra-small" style={{ fontSize: '0.68rem' }}>
          <span><i className="bi bi-info-circle me-1"></i> 15% statutory withholding tax is applied directly to annualized dividend nodes upon final allocation.</span>
          <span className="fw-bold text-dark font-monospace">Status: Audit Reconciled Secure</span>
        </div>
      </div>

    </div>
  );
}