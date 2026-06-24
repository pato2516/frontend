import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import { FaEye, FaEdit, FaCheck, FaTrash } from 'react-icons/fa';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  // Fetch Members
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch('http://127.0.0.1:8000/api/v1/auth/users', {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMembers(Array.isArray(data) ? data : (data.users || []));
        setLoading(false);
      })
      .catch(err => { console.error("Error fetching users:", err); setLoading(false); });
  }, []);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return members.filter(item => 
      (item.full_name?.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email?.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [members, filterText]);

  // API Actions
  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/approve-user/${id}`, {
        method: 'PATCH',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (response.ok) { window.location.reload(); } else { alert("Approval failed"); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure?")) {
      fetch(`http://127.0.0.1:8000/api/v1/auth/admin/users/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.ok ? window.location.reload() : alert("Error deleting"))
      .catch(err => console.error(err));
    }
  };

  // Export Functions
  const downloadCSV = () => {
    const csv = Papa.unparse(members);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'members.csv'; a.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Email', 'Status']],
      body: members.map(m => [m.full_name, m.email, m.is_active ? 'Active' : 'Inactive']),
    });
    doc.save('members.pdf');
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Members');
    sheet.columns = [{ header: 'Name', key: 'full_name' }, { header: 'Email', key: 'email' }];
    sheet.addRows(members);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'members.xlsx'; a.click();
  };

  const columns = [
    { name: 'Member Name', selector: row => row.full_name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Status', cell: row => <span className={`badge ${row.is_active ? 'bg-success' : 'bg-warning'}`}>{row.is_active ? 'Active' : 'Inactive'}</span> },
    { name: 'Join Date', selector: row => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A' },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-primary" title="View"><FaEye /></button>
          <button className="btn btn-sm btn-outline-warning" title="Edit"><FaEdit /></button>
          {!row.is_approved && (
            <button onClick={() => handleApprove(row.id)} className="btn btn-sm btn-success" title="Approve"><FaCheck /></button>
          )}
          <button onClick={() => handleDelete(row.id)} className="btn btn-sm btn-danger" title="Delete"><FaTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <h3 className="mb-0">Member Management</h3>
        <div className="d-flex gap-2">
          <input type="text" className="form-control" placeholder="Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          <div className="d-flex gap-1">
             <button onClick={downloadCSV} className="btn btn-sm btn-outline-secondary">CSV</button>
             <button onClick={downloadExcel} className="btn btn-sm btn-outline-secondary">EXCEL</button>
             <button onClick={downloadPDF} className="btn btn-sm btn-outline-secondary">PDF</button>
             <button onClick={() => window.print()} className="btn btn-sm btn-dark">PRINT</button>
          </div>
          <button className="btn btn-primary btn-sm">+ Add Member</button>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <DataTable columns={columns} data={filteredItems} pagination highlightOnHover progressPending={loading} />
      </div>
    </div>
  );
};

export default MemberManagement;