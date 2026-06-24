import React, { useEffect, useState } from 'react';
import SystemSnapshot from '../components/SystemSnapshot';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/dashboard/stats') 
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="container-fluid py-4">
      <h1 className="h2 mb-4">Overview</h1>
      
      {/* Metrics Grid */}
      <SystemSnapshot data={stats} />
    </div>
  );
};

export default AdminDashboard;