import React from 'react';
import { Users, Landmark, PiggyBank, Briefcase } from 'lucide-react';
import PortfolioInsights from './PortfolioInsights';

// 1. Updated StatCard to handle Bootstrap color classes correctly
const StatCard = ({ title, value, subValue, icon: Icon, colorClass }) => (
  <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 15 }}>
    <div className="card-body p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem' }}>{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
        {/* Directly apply the color class passed from the parent */}
        <div className={colorClass}>
          <Icon size={28} />
        </div>
      </div>
      <div className="mt-2">
        <small className="text-secondary">{subValue}</small>
      </div>
    </div>
  </div>
);

// 2. Updated SystemSnapshot with clean color class naming
const SystemSnapshot = ({ data }) => {
  console.log("Current Data Object:", data);
  if (!data || !data.members) {
    return <div className="text-center p-4">Loading dashboard data...</div>;
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6 col-lg-3">
        <StatCard 
          title="TOTAL MEMBERS" 
          value={data.members.total} 
          subValue={`Active: ${data.members.active}`} 
          icon={Users} 
          colorClass="text-primary" 
        />
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <StatCard 
          title="ACTIVE LOANS" 
          value={data.loans.total_issued} 
          subValue={`Overdue: ${data.loans.overdue}`} 
          icon={Landmark} 
          colorClass="text-danger" 
        />
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <StatCard 
          title="TOTAL SAVINGS" 
          value={data.savings.total_amount} 
          subValue={`Accounts: ${data.savings.accounts_count}`} 
          icon={PiggyBank} 
          colorClass="text-info" 
        />
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <StatCard 
          title="SHARE CAPITAL" 
          value={data.share_capital.total_amount} 
          subValue={`Holders: ${data.share_capital.shareholders_count}`} 
          icon={Briefcase} 
          colorClass="text-dark" 
        />
      </div>
      {/* 2. Portfolio Insights (Charts) */}
      <h5 className="mt-4 mb-3">Portfolio Insights</h5>
      <PortfolioInsights data={ data }/>

      {/* 3. Fixed Assets Tracking Table */}
      <div className="card border-0 shadow-sm mt-4 p-4" style={{ borderRadius: 15 }}>
        <h5>Fixed Assets Tracking</h5>
        <table className="table table-hover mt-3">
          {/* ... your table code mapping data.assets ... */}
        </table>
      </div>

    </div>
    
  );
};

export default SystemSnapshot;