import React from "react";
import DataTable from "react-data-table-component";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SavingView = () => {
  // Dummy data for charts
  const savingsTrends = [
    { month: "Jun", amount: 1800000 },
    { month: "Jul", amount: 2200000 },
    { month: "Aug", amount: 2500000 },
    { month: "Sep", amount: 2800000 },
    { month: "Oct", amount: 3100000 },
  ];

  // Savings Accounts Data
  const accountsData = [
    { type: "Mandatory Shares", balance: "UGX 12,400,000", accounts: 3240, yield: "12.5%" },
    { type: "Voluntary Savings", balance: "UGX 8,150,000", accounts: 2850, yield: "8.0%" },
    { type: "Fixed Deposits", balance: "UGX 4,300,000", accounts: 412, yield: "14.2%" },
  ];

  const accountsColumns = [
    { name: "Account Type", selector: row => row.type, sortable: true },
    { name: "Total Balance", selector: row => row.balance, sortable: true },
    { name: "Accounts", selector: row => row.accounts, sortable: true },
    { name: "Avg Yield", selector: row => row.yield, sortable: true },
  ];

  // Transactions Data
  const transactions = [
    { name: "Sarah Mwangi", type: "Voluntary Savings", action: "Deposit", amount: "UGX 12,000", time: "10:45 AM" },
    { name: "David Ochieng", type: "Fixed Deposit", action: "Withdraw", amount: "UGX 45,000", time: "09:12 AM" },
    { name: "John K. Doe", type: "Mandatory Shares", action: "Deposit", amount: "UGX 2,500", time: "08:50 AM" },
  ];

  const transactionsColumns = [
    { name: "Member", selector: row => row.name, sortable: true },
    { name: "Type", selector: row => row.type, sortable: true },
    { name: "Action", selector: row => row.action, sortable: true },
    { name: "Amount", selector: row => row.amount, sortable: true },
    { name: "Time", selector: row => row.time, sortable: true },
  ];

  return (
    <div className="container-fluid p-4" 
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1565372918675-4b1e6b6c9b6b')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            backgroundAttachment: "fixed"
        }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold">Apex SACCO Dashboard</h3>
        <p className="text-muted">Institutional management overview</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total Savings Pool</h6>
            <h4 className="fw-bold text-primary">UGX 24,850,000</h4>
            <small className="text-success">+4.2% from last month</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Active Groups</h6>
            <h4 className="fw-bold text-info">142</h4>
            <small className="text-success">8 new this quarter</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Withdrawals (MTD)</h6>
            <h4 className="fw-bold text-warning">UGX 1,120,400</h4>
            <small className="text-danger">-12% vs last month</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Growth Rate</h6>
            <h4 className="fw-bold text-success">15%</h4>
            <small className="text-success">Ahead of annual target</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Savings Accounts Overview */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h6 className="fw-bold mb-0">Savings Accounts Overview</h6>
            </div>
            <DataTable
              columns={accountsColumns}
              data={accountsData}
              pagination
              highlightOnHover
              striped
              responsive
            />
          </div>

          {/* Recent Transactions */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-white border-0">
              <h6 className="fw-bold mb-0">Recent Transactions</h6>
            </div>
            <DataTable
              columns={transactionsColumns}
              data={transactions}
              pagination
              highlightOnHover
              striped
              responsive
            />
          </div>
        </div>

        {/* Savings Groups + Trends */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0">
              <h6 className="fw-bold mb-0">Savings Groups</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="fw-bold mb-1">Unity Women Savers (Gold)</h6>
                <small className="text-muted">24 members active</small><br />
                <small>Goal: UGX 5M House Project (65%)</small><br />
                <small className="text-muted">Next meeting: Oct 15, 2023</small>
              </div>
              <div className="mb-3">
                <h6 className="fw-bold mb-1">Eldoret Tech Hub (Silver)</h6>
                <small className="text-muted">12 members active</small><br />
                <small>Goal: UGX 1.2M Laptops (22%)</small><br />
                <small className="text-muted">Next meeting: Oct 12, 2023</small>
              </div>
              <button className="btn btn-sm btn-primary">Create New Savings Group</button>
            </div>
          </div>

          {/* Savings Trends Chart */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h6 className="fw-bold mb-0">Savings Trends</h6>
            </div>
            <div className="card-body" style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#0d6efd" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingView;
