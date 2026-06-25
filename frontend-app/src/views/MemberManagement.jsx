import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Eye, Check, Trash2, Shield, UserX, UserCheck, 
  Download, Printer, UserPlus, Search, RefreshCw, 
  Landmark, Info, AlertCircle, History, BarChart3
} from 'lucide-react';

const MemberManagement = () => {
  // --- Component State ---
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [currentTab, setCurrentTab] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewingAuditLog, setViewingAuditLog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newMember, setNewMember] = useState({ 
    full_name: '', 
    national_id: '', 
    phone_number: '+256', 
    email: '', 
    password: 'TemporarySacco123!'
  });

  // --- Core Data Fetcher ---
  const fetchMembers = async (isManualRefresh = false) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/users', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : (data.users || []));
      
      if (isManualRefresh) {
        toast.success("Member workspace state updated successfully.", { autoClose: 2000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to recover member database entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- Single Action Handlers ---
  const handleCreateMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(newMember)
      });

      if (response.ok) {
        toast.success("New member profile created successfully!", { autoClose: 2000 });
        setShowCreateModal(false);
        setNewMember({ 
          full_name: '', 
          national_id: '', 
          phone_number: '+256', 
          email: '', 
          password: 'TemporarySacco123!' 
        });
        fetchMembers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to create new member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error encountered during creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/approve-user/${id}`, {
        method: 'PATCH',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.ok) {
        toast.success("Account identity verification approved.", { autoClose: 2000 });
        setMembers(prev => prev.map(m => m.id === id ? { ...m, is_approved: true, is_active: true } : m));
      } else {
        toast.error("Approval workflow failed.");
      }
    } catch (err) { 
      console.error(err); 
      toast.error("An error occurred during approval.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    const nextStatus = !currentStatus;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/admin/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextStatus })
      });
      if (response.ok) {
        toast.success(nextStatus ? "Member account reactivated." : "Member operational status suspended.", { autoClose: 2000 });
        setMembers(prev => prev.map(m => m.id === id ? { ...m, is_active: nextStatus } : m));
      } else {
        toast.error("Failed to alter account status configuration.");
      }
    } catch (err) { 
      toast.error("Failed to alter member account state."); 
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const token = localStorage.getItem("token");
    const safeRole = currentRole === 'admin' ? 'admin' : 'member';
    const targetRole = safeRole === 'admin' ? 'member' : 'admin';
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/dashboard/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole })
      });
      
      if (response.ok) {
        toast.success(`Access level changed to ${targetRole.toUpperCase()} successfully.`, { autoClose: 2000 });
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role: targetRole } : m));
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to alter role access clearance.");
      }
    } catch (err) { 
      console.error(err);
      toast.error("Network error modifying privilege rules."); 
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to completely expunge this member profile?")) {
      fetch(`http://127.0.0.1:8000/api/v1/auth/admin/users/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) {
          toast.success("Account profile purged from registry.", { autoClose: 2000 });
          setMembers(prev => prev.filter(m => m.id !== id));
        } else {
          toast.error("Profile purge rejected.");
        }
      })
      .catch(err => console.error(err));
    }
  };

  // --- Enterprise Bulk Action Processing Engines ---
  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const executeBulkApproval = async () => {
    if (!window.confirm(`Authorize join validation clearance for ${selectedRows.length} selected profiles?`)) return;
    const token = localStorage.getItem("token");
    let succ = 0;

    for (const member of selectedRows) {
      if (!member.is_approved) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/v1/auth/approve-user/${member.id}`, {
            method: 'PATCH',
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
          });
          if (res.ok) succ++;
        } catch (e) { console.error(e); }
      }
    }
    toast.success(`Successfully batch validated ${succ} member accounts.`, { autoClose: 2500 });
    setToggleCleared(!toggleCleared);
    fetchMembers();
  };

  const executeBulkSuspension = async () => {
    if (!window.confirm(`Force terminate current active status tokens for ${selectedRows.length} members?`)) return;
    const token = localStorage.getItem("token");
    let succ = 0;

    for (const member of selectedRows) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/auth/admin/users/${member.id}/toggle-status`, {
          method: 'PATCH',
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: false })
        });
        if (res.ok) succ++;
      } catch (e) { console.error(e); }
    }
    toast.warning(`Batch restricted ${succ} user operational sessions.`, { autoClose: 2500 });
    setToggleCleared(!toggleCleared);
    fetchMembers();
  };

  // --- Multi-Field Advanced Filtering Logic ---
  const filteredItems = useMemo(() => {
    return members.filter(item => {
      const targetQuery = filterText.toLowerCase();
      const matchesSearch = 
        (item.full_name?.toLowerCase().includes(targetQuery)) ||
        (item.email?.toLowerCase().includes(targetQuery)) ||
        (item.phone_number?.includes(targetQuery)) ||
        (item.national_id?.includes(targetQuery));
      
      if (currentTab === 'PENDING') return matchesSearch && !item.is_approved;
      if (currentTab === 'ACTIVE') return matchesSearch && item.is_active && item.is_approved;
      if (currentTab === 'SUSPENDED') return matchesSearch && !item.is_active;
      return matchesSearch;
    });
  }, [members, filterText, currentTab]);

  // --- Analytical Calculations Memos ---
  const stats = useMemo(() => {
    const pending = members.filter(m => !m.is_approved).length;
    const active = members.filter(m => m.is_active && m.is_approved).length;
    const suspended = members.filter(m => !m.is_active).length;
    return { total: members.length, pending, active, suspended };
  }, [members]);

  const analyticalTrends = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate growth trajectory grouped by last 6 months
    const monthlyGroups = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize past 5 months + current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyGroups[label] = 0;
    }

    members.forEach(m => {
      if (!m.created_at) return;
      const d = new Date(m.created_at);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyGroups[label] !== undefined) {
        monthlyGroups[label]++;
      }
    });

    const chartData = Object.keys(monthlyGroups).map(key => ({
      month: key,
      Registrations: monthlyGroups[key]
    }));

    return {
      chartData,
      joinedThisMonth: members.filter(m => {
        if (!m.created_at) return false;
        const d = new Date(m.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length,
      systemUtilizationRate: members.length 
        ? Math.round((members.filter(m => m.is_approved && m.is_active).length / members.length) * 100) 
        : 0
    };
  }, [members]);

  // Dynamic pie slice data
  const pieData = [
    { name: 'Active', value: stats.active, color: '#10b981' },
    { name: 'Pending Review', value: stats.pending, color: '#0ea5e9' },
    { name: 'Suspended', value: stats.suspended, color: '#ef4444' }
  ].filter(slice => slice.value > 0); // Hide empty blocks

  // --- Export Drivers ---
  const downloadCSV = () => {
    try {
      const csv = Papa.unparse(members);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "SACCO_Member_Registry.csv");
      link.click();
      toast.success("CSV download initiated.", { autoClose: 2000 });
    } catch (err) { toast.error("Failed to generate CSV export file."); }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("SACCO Member Registry Audit File", 14, 15);
      doc.autoTable({
        startY: 20,
        head: [['System ID', 'Full Name', 'Email Address', 'Role Security', 'Status']],
        body: members.map(m => [m.id, m.full_name, m.email, m.role?.toUpperCase(), m.is_active ? 'ACTIVE' : 'SUSPENDED']),
      });
      doc.save('SACCO_Members.pdf');
      toast.success("PDF document compiled and downloaded.", { autoClose: 2000 });
    } catch (err) { toast.error("Failed to generate PDF audit file."); }
  };

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('SACCO Management');
      sheet.columns = [
        { header: 'System ID', key: 'id', width: 12 },
        { header: 'Full Name', key: 'full_name', width: 28 },
        { header: 'Email Target', key: 'email', width: 32 },
        { header: 'Role Constraint', key: 'role', width: 15 }
      ];
      sheet.addRows(members);
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = 'SACCO_Members_Master.xlsx';
      link.click();
      toast.success("Excel ledger document processing complete.", { autoClose: 2000 });
    } catch (err) { toast.error("Failed to process Excel spreadsheet structure."); }
  };

  // --- Data Table Custom Structural Styles ---
  const customStyles = {
    headRow: { style: { backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' } },
    headCells: { style: { fontSize: '0.8rem', fontWeight: '700', color: '#495057', textTransform: 'uppercase' } },
    cells: { style: { fontSize: '0.9rem', padding: '12px' } },
  };

  const columns = [
    { name: 'Member Profile', selector: row => row.full_name, sortable: true, cell: row => (
        <div>
          <div className="fw-semibold text-dark">{row.full_name}</div>
          <div className="text-muted small">ID: #SMC-{row.id}</div>
        </div>
      )
    },
    { name: 'Contact Metadata', cell: row => (
        <div>
          <div className="text-dark small">{row.email}</div>
          <div className="text-muted text-xs">{row.phone_number || 'No Phone'}</div>
        </div>
      )
    },
    { name: 'Role Security', sortable: true, cell: row => (
        <span className={`badge ${row.role === 'admin' ? 'bg-dark' : 'bg-light text-secondary'} border`}>
          {row.role || 'member'}
        </span>
      )
    },
    { name: 'Status', sortable: true, cell: row => {
        let badgeClass = "bg-warning text-dark";
        if (!row.is_approved) badgeClass = "bg-info text-white";
        else if (row.is_active) badgeClass = "bg-success text-white";
        else if (!row.is_active) badgeClass = "bg-danger text-white";
        return (
          <span className={`badge px-2.5 py-1.5 text-uppercase ${badgeClass}`}>
            {!row.is_approved ? 'Pending Review' : row.is_active ? 'Active' : 'Suspended'}
          </span>
        );
      }
    },
    { name: 'Registry Date', selector: row => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A', sortable: true },
    {
      name: 'System Actions',
      width: '260px',
      cell: row => (
        <div className="d-flex gap-1">
          <button 
            onClick={() => {
              setSelectedMember(row);
              toast.info(`Inspecting profile for user #${row.id}`, { autoClose: 1500 });
            }} 
            className="btn btn-sm btn-outline-secondary" 
            title="View Profile"
          >
            <Eye size={14} />
          </button>

          <button 
            onClick={() => setViewingAuditLog(row)} 
            className="btn btn-sm btn-outline-info" 
            title="System Change Logs"
          >
            <History size={14} />
          </button>
          
          {!row.is_approved ? (
            <button onClick={() => handleApprove(row.id)} className="btn btn-sm btn-success" title="Authorize Join"><Check size={14} /></button>
          ) : (
            <button 
              onClick={() => handleToggleStatus(row.id, row.is_active)} 
              className={`btn btn-sm ${row.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
              title={row.is_active ? "Suspend System Access" : "Activate Account"}
            >
              {row.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
            </button>
          )}

          <button 
            onClick={() => handleToggleRole(row.id, row.role)} 
            className="btn btn-sm btn-outline-dark" 
            title="Toggle Admin Privilege"
          >
            <Shield size={14} />
          </button>
          
          <button onClick={() => handleDelete(row.id)} className="btn btn-sm btn-outline-danger" title="Purge Record"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid py-4 bg-light min-vh-screen">
      
      {/* Top Statistical Overviews */}
      <div className="row g-3 mb-4 no-print">
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 bg-white">
            <span className="text-muted small fw-bold text-uppercase">Total Registry</span>
            <h4 className="fw-bold mb-0 text-dark">{stats.total}</h4>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 bg-white">
            <span className="text-muted small fw-bold text-uppercase text-info">Awaiting Review</span>
            <h4 className="fw-bold mb-0 text-info">{stats.pending}</h4>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 bg-white">
            <span className="text-muted small fw-bold text-uppercase text-success">Active Clearance</span>
            <h4 className="fw-bold mb-0 text-success">{stats.active}</h4>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 p-3 bg-white">
            <span className="text-muted small fw-bold text-uppercase text-danger">Suspended Units</span>
            <h4 className="fw-bold mb-0 text-danger">{stats.suspended}</h4>
          </div>
        </div>
      </div>

      {/* Mass Action Management Banner */}
      {selectedRows.length > 0 && (
        <div className="alert alert-primary d-flex align-items-center justify-content-between p-3 border-0 shadow-sm mb-4 animate-fadeIn no-print">
          <div className="d-flex align-items-center gap-2">
            <AlertCircle size={20} />
            <div>
              <strong className="me-1">{selectedRows.length}</strong> members checked for batch updates.
            </div>
          </div>
          <div className="d-flex gap-2">
            <button onClick={executeBulkApproval} className="btn btn-sm btn-success fw-bold px-3">Mass Validate</button>
            <button onClick={executeBulkSuspension} className="btn btn-sm btn-danger fw-bold px-3">Mass Suspend</button>
          </div>
        </div>
      )}

      {/* Core Registry Card Workspace */}
      <div className="card shadow-sm border-0 bg-white rounded-3">
        
        {/* Table Filters & Operations Header */}
        <div className="card-header bg-white border-0 pt-4 px-4 d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3 no-print">
          <div className="d-flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setCurrentTab(tab)}
                className={`btn btn-sm rounded-2 fw-semibold px-3 ${currentTab === tab ? 'btn-primary shadow-sm' : 'btn-light border text-secondary'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Pill-shaped Search Component */}
            <div className="input-group position-relative" style={{ width: '240px' }}>
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ zIndex: 5, pointerEvents: 'none' }}>
                <Search size={15} />
              </span>
              <input 
                type="text" 
                className="form-control form-control-sm ps-5 bg-white shadow-sm" 
                placeholder="Search name, phone, ID..." 
                value={filterText} 
                onChange={(e) => setFilterText(e.target.value)} 
                style={{ 
                  borderRadius: '50px', 
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease-in-out'
                }} 
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Document Export Toolkit */}
            <div className="btn-group border rounded shadow-sm">
              <button onClick={downloadCSV} className="btn btn-sm btn-white text-secondary border-0" title="Export CSV"><Download size={15} /></button>
              <button onClick={downloadExcel} className="btn btn-sm btn-white text-secondary border-0" title="Export Excel"><Landmark size={15} /></button>
              <button onClick={downloadPDF} className="btn btn-sm btn-white text-secondary border-0" title="Export PDF"><Info size={15} /></button>
              <button 
                onClick={() => {
                  toast.info("Preparing layout sequence initialization...", { autoClose: 1500 });
                  window.print();
                }} 
                className="btn btn-sm btn-white text-secondary border-0" 
                title="Print File"
              >
                <Printer size={15} />
              </button>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 shadow-sm fw-semibold">
              <UserPlus size={15} /> New Member
            </button>
          </div>
        </div>

        {/* Paginated Data Component View */}
        <div className="card-body p-0">
          <DataTable 
            columns={columns} 
            data={filteredItems} 
            pagination 
            selectableRows
            clearSelectedRows={toggleCleared}
            onSelectedRowsChange={handleSelectedRowsChange}
            highlightOnHover 
            progressPending={loading}
            customStyles={customStyles}
            progressComponent={
              <div className="p-5 text-center text-muted">
                <RefreshCw className="animate-spin mb-2" />
                <div>Loading Ledger Profiles...</div>
              </div>
            }
          />
        </div>
      </div>

      {/* --- Visual Graphs & Analytical Metrics Row --- */}
      <div className="row g-3 mt-3 no-print">
        {/* Line Chart: Registration Trends */}
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm border-0 bg-white p-4 rounded-3 h-100">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <BarChart3 size={16} className="text-primary" /> Onboarding Trajectory & Growth Velocity
            </h6>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={analyticalTrends.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '6px', color: '#fff', fontSize: '12px', border: 'none' }} />
                  <Line type="monotone" dataKey="Registrations" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart: Operational Distribution Status */}
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm border-0 bg-white p-4 rounded-3 h-100">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Shield size={16} className="text-warning" /> Account Lifecycle Composition
            </h6>
            <div className="d-flex align-items-center justify-content-center flex-sm-row flex-column gap-2" style={{ height: 220 }}>
              {pieData.length > 0 ? (
                <>
                  <div style={{ width: 140, height: 140 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="vstack gap-2 justify-content-center">
                    {pieData.map((slice, index) => (
                      <div key={index} className="d-flex align-items-center gap-2 small">
                        <span className="rounded-circle d-inline-block" style={{ width: 10, height: 10, backgroundColor: slice.color }}></span>
                        <span className="text-muted text-xs">{slice.name}:</span>
                        <strong className="text-dark">{slice.value}</strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted small py-4">No structural metrics data loaded.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Deep Audit Modal */}
      {selectedMember && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2"><Info size={18} /> Deep Audit Ledger Profile</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedMember(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div className="avatar-placeholder bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-3 mb-2" style={{ width: '64px', height: '64px' }}>
                    {selectedMember.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="fw-bold text-dark mb-0">{selectedMember.full_name}</h5>
                  <span className="text-muted small">{selectedMember.email}</span>
                </div>
                <table className="table table-sm table-borderless border rounded p-2 bg-light">
                  <tbody>
                    <tr><td className="text-muted small text-uppercase fw-bold ps-3 py-2">System Profile Token:</td><td className="py-2">#SMC-{selectedMember.id}</td></tr>
                    <tr><td className="text-muted small text-uppercase fw-bold ps-3 py-2">National NID:</td><td className="py-2 font-monospace">{selectedMember.national_id || 'Not Provided'}</td></tr>
                    <tr><td className="text-muted small text-uppercase fw-bold ps-3 py-2">Role Authority:</td><td className="py-2 text-uppercase fw-semibold">{selectedMember.role || 'member'}</td></tr>
                    <tr><td className="text-muted small text-uppercase fw-bold ps-3 py-2">Audit Compliance:</td><td className="py-2">{selectedMember.is_approved ? 'Verified Base' : 'Awaiting Approval'}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer border-0 bg-light">
                <button type="button" className="btn btn-secondary w-100" onClick={() => setSelectedMember(null)}>Dismiss Audit Scope</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Trace Audit Modification Logs Modal */}
      {viewingAuditLog && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2"><History size={18} /> System Activity Log</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingAuditLog(null)}></button>
              </div>
              <div className="modal-body p-3">
                <p className="small text-muted mb-3">Historical change metrics trace for <strong>{viewingAuditLog.full_name}</strong></p>
                <div className="vstack gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  <div className="p-2 border rounded bg-white text-xs d-flex justify-content-between">
                    <div>👤 Profile Initialization Registry Event</div>
                    <span className="text-muted">{viewingAuditLog.created_at ? new Date(viewingAuditLog.created_at).toLocaleDateString() : 'Today'}</span>
                  </div>
                  <div className="p-2 border rounded bg-white text-xs d-flex justify-content-between">
                    <div>🔐 Authorization Token Assigned</div>
                    <span className="text-muted">System Automator</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-sm btn-secondary w-100" onClick={() => setViewingAuditLog(null)}>Close Trace Stream</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Member Modal Overlay */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-dark">Register New SACCO Member</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateMember}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-uppercase text-muted fw-bold small">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g., John Doe"
                      value={newMember.full_name}
                      onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-uppercase text-muted fw-bold small">National ID Number</label>
                    <input 
                      type="text" 
                      maxLength={8}
                      pattern="\d{8}"
                      className="form-control" 
                      placeholder="e.g., 12345678 (8 digits)"
                      value={newMember.national_id}
                      onChange={(e) => setNewMember({...newMember, national_id: e.target.value.replace(/\D/g, '')})}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-uppercase text-muted fw-bold small">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="+256 712 345 678"
                      value={newMember.phone_number}
                      onChange={(e) => setNewMember({...newMember, phone_number: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-uppercase text-muted fw-bold small">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="name@example.com"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      required 
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-uppercase text-muted fw-bold small">Assigned System Security Key</label>
                    <input 
                      type="text" 
                      className="form-control bg-light text-muted fw-mono text-center" 
                      value={newMember.password}
                      onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Profile...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;