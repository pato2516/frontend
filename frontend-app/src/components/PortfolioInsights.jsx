import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const PortfolioInsights = ({ data }) => {
  // Guard clause to prevent crashes if data is null
  if (!data || !data.loans || !data.savings) {
    return <div className="p-4 text-center text-muted">Loading insights...</div>;
  }

  // Map your existing API data to chart formats
  const loanData = [
    { name: 'Issued', value: data.loans.total_issued || 0 },
    { name: 'Overdue', value: data.loans.overdue || 0 }
  ];

  const savingsData = data.savingsTrend || [
    { month: 'Current', amount: data.savings.total_amount || 0 }
  ];

  const COLORS = ['#0d6efd', '#dc3545']; // Blue for Issued, Red for Overdue

  return (
    <div className="row g-4 mt-2">
      {/* Loan Distribution */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 15 }}>
          <h5 className="mb-4">Loan Distribution</h5>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={loanData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                  {loanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="d-flex justify-content-center gap-4">
            {loanData.map((item, i) => (
              <div key={i} className="d-flex align-items-center">
                <span style={{height: 10, width: 10, borderRadius: '50%', backgroundColor: COLORS[i], marginRight: 8}}></span>
                <small>{item.name}: {item.value}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Growth Trend */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: 15 }}>
          <h5 className="mb-4">Savings Growth Trend</h5>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInsights;