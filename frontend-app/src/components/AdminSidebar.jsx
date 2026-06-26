import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Landmark,
  PiggyBank,
  FileText,
  Send,
  Percent,
  Share2,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import SettingsModal from '../views/SettingsModal'; // Import the modal component

const AdminSidebar = () => {
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/app/admin', icon: LayoutDashboard },
    { name: 'Member Management', path: '/app/admin/members', icon: Users },
    { name: 'Loan Applications', path: '/app/admin/loan-applications', icon: Landmark },
    { name: 'Savings Portfolios', path: '/app/admin/saving-portfolios', icon: PiggyBank },
    { name: 'Transfers', path: '/app/admin/transfers', icon: Send },
    { name: 'Dividends', path: '/app/admin/dividends', icon: Percent },
    { name: 'Share Holders', path: '/app/admin/shareholders', icon: Share2 },
    { name: 'Reports', path: '/app/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/app/admin/settings', icon: Settings },
  ];

  return (
    <>
      <aside
        className="bg-dark text-white d-flex flex-column"
        style={{ width: '260px', height: '100vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="p-4 border-bottom border-secondary fs-5 fw-bold text-white sticky-top bg-dark">
          Apex Management
        </div>

        {/* Navigation */}
        <nav className="nav flex-column mt-3 flex-grow-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/app/admin'}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-4 py-3 text-decoration-none ${
                  isActive ? 'bg-success text-light fw-bold' : 'text-secondary hover-bg-warning'
                }`
              }
            >
              <item.icon className="me-3" size={20} />
              {item.name}
            </NavLink>
          ))}

          {/* Settings as Modal Trigger */}
          <button
            className="nav-link d-flex align-items-center px-4 py-3 text-secondary border-0 bg-transparent"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="me-3" size={20} /> Settings
          </button>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-top border-secondary sticky-bottom bg-dark">
          <NavLink
            to="/app/admin/support"
            className="nav-link text-secondary d-flex align-items-center mb-3"
          >
            <HelpCircle className="me-2" size={18} /> Support
          </NavLink>
          <NavLink
            to="/logout"
            className="nav-link text-secondary d-flex align-items-center"
          >
            <LogOut className="me-2" size={18} /> Logout
          </NavLink>
        </div>
      </aside>

      {/* Settings Modal */}
      {/* <SettingsModal show={showSettings} onClose={() => setShowSettings(false)} /> */}
    </>
  );
};

export default AdminSidebar;
