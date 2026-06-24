import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LoanReview from '../components/LoanReview';

const LoanApplications = () => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/v1/loans/all-loans');
        setLoans(response.data);
      } catch (err) {
        setError('Failed to load applications. Ensure the database service is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReviewClick = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  // Export Functions
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(loans);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loans");
    XLSX.writeFile(workbook, "loans.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Loan Applications", 14, 10);
    doc.autoTable({
      head: [['Member Name', 'Type', 'Amount']],
      body: loans.map(loan => [loan.name, loan.type, loan.amt]),
    });
    doc.save("loans.pdf");
  };

  const exportPrint = () => {
    const printContent = loans.map(loan => `${loan.name} - ${loan.type} - UGX ${loan.amt}`).join("\n");
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<pre>' + printContent + '</pre>');
    printWindow.document.close();
    printWindow.print();
  };

  // Table Columns
  const columns = [
    { name: 'MEMBER NAME', selector: row => row.name, sortable: true, cell: row => <div className="fw-bold">{row.name}</div> },
    { name: 'TYPE', selector: row => row.type, sortable: true, cell: row => <span className="badge bg-info text-dark">{row.type}</span> },
    { name: 'AMOUNT', selector: row => row.amt, sortable: true, cell: row => <div className="fw-bold">UGX {row.amt}</div> },
    { name: 'ACTION', cell: row => <button className="btn btn-sm btn-outline-primary" onClick={() => handleReviewClick(row)}>Review</button>, ignoreRowClick: true }
  ];

  const filteredLoans = loans.filter(
    loan => loan.name && loan.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (isLoading) return <div className="p-5 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-5 text-center text-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Loans Management</h4>
          <p className="text-muted small">Real-time overview of portfolio performance.</p>
        </div>
      </div>

      {/* DataTable */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 p-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Pending Applications</h6>
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control form-control-sm d-inline-block w-auto me-2" 
              placeholder="Search by name..." 
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              Export
            </button>
            {showExportOptions && (
              <div className="dropdown-menu show mt-2">
                <CSVLink data={loans} filename={"loans.csv"} className="dropdown-item">Export CSV</CSVLink>
                <button className="dropdown-item" onClick={exportExcel}>Export Excel</button>
                <button className="dropdown-item" onClick={exportPDF}>Export PDF</button>
                <button className="dropdown-item" onClick={exportPrint}>Print</button>
              </div>
            )}
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredLoans}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="name"
        />
      </div>

      {/* Modal (unchanged) */}
      {showModal && (
        <div className="modal d-block" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered animate__animated animate__fadeInDown">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white border-0 rounded-top">
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  <i className="bi bi-file-earmark-text me-2"></i> Review Loan Application
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4 bg-light">
             {/* Applicant Profile */}
                <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body d-flex align-items-center">
                        <img 
                        src={selectedLoan.avatarUrl && selectedLoan.avatarUrl.trim() !== "" 
                            ? selectedLoan.avatarUrl 
                            : "https://www.w3schools.com/howto/img_avatar.png"} 
                        alt="Profile" 
                        className="rounded-circle me-3" 
                        width="50" 
                        height="50" 
                        />
                        <div>
                        <h6 className="fw-bold mb-0">{selectedLoan.name}</h6>
                        <small className="text-muted">Member ID: {selectedLoan.id}</small>
                        </div>
                    </div>
                </div>



                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body">
                    <LoanReview loan={selectedLoan} />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 p-3">
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <input type="text" className="form-control w-50 rounded-pill shadow-sm" placeholder="Enter review notes..." />
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-danger px-4 d-flex align-items-center"><i className="bi bi-x-circle me-1"></i> Reject</button>
                    <button className="btn btn-outline-secondary px-4 d-flex align-items-center"><i className="bi bi-question-circle me-1"></i> Clarify</button>
                    <button className="btn btn-success px-4 fw-bold d-flex align-items-center"><i className="bi bi-check-circle me-1"></i> Approve</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplications;
