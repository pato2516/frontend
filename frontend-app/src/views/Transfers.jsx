import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  Search, 
  Eye, 
  RefreshCw,
  XCircle 
} from "lucide-react";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1/transfers",
});

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  
  // Search, Pagination & Status Filter States matching FastAPI query signatures
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("ALL");
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Dedicated server analytical metrics state
  const [metrics, setMetrics] = useState({
    total_processed: 0,
    pending_clearance: 0,
    completed_vault: 0,
    rejected_vault: 0
  });

  // Fetch real-time metrics summary directly from the backend database aggregation endpoint
  const fetchMetricsSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await apiClient.get("/analytics/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error("Failed to load real-time database summary analytics:", error);
    }
  };

  // Combined Server Filter Fetcher Engine
  const fetchTransfers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      setLoading(false);
      return;
    }
    
    try {
      // Build parameters to filter calculations directly on the database query execution layer
      const params = {};
      if (currentTab !== "ALL") params.status = currentTab;
      if (searchTerm.trim() !== "") params.search = searchTerm.trim();

      const response = await apiClient.get("/", {
        headers: { Authorization: `Bearer ${token}` },
        params: params // Appends dynamic query structures (?status=...&search=...)
      });
      
      setTransfers(response.data);
    } catch (error) {
      console.error("Error fetching transfers database:", error);
      toast.error(error.response?.data?.detail || "Failed to load transfers database records.");
    } finally {
      setLoading(false);
    }
  };

  // Refetch database records immediately whenever filters modify or tab context changes
  useEffect(() => {
    fetchTransfers();
    fetchMetricsSummary();
  }, [currentTab, searchTerm]);

  const updateStatus = async (id, newStatus) => {
    setActioningId(id);
    try {
      const token = localStorage.getItem("token");
      await apiClient.patch(`/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Transfer ID #${id} successfully marked as ${newStatus.toLowerCase()}!`);
      
      // Refresh current dataset and total statistics safely following remote action mutation
      fetchTransfers();
      fetchMetricsSummary();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Status transition operational error.");
    } finally {
      setActioningId(null);
    }
  };

  // Fetch complete nested context profiles on row demand using the item ID API path
  const handleViewAuditLog = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await apiClient.get(`/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTransfer(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to view detailed transaction log.");
    }
  };

  const customStyles = {
    header: { style: { minHeight: '56px' } },
    headRow: { style: { backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' } },
    headCells: { style: { fontSize: '0.85rem', fontWeight: '700', color: '#495057', textTransform: 'uppercase' } },
    cells: { style: { fontSize: '0.9rem', color: '#212529', padding: '12px' } },
  };

  const columns = [
    { name: "Reference ID", selector: (row) => `#TXT-${row.id}`, sortable: true, width: "140px" },
    { name: "Member Name", selector: (row) => row.user?.full_name || "Unknown Member", sortable: true },
    { name: "Amount", selector: (row) => `UGX ${row.amount.toLocaleString()}`, sortable: true },
    {
      name: "Status",
      sortable: true,
      cell: (row) => {
        let badgeClass = "bg-warning text-dark";
        if (row.status === "COMPLETED") badgeClass = "bg-success text-white";
        if (row.status === "REJECTED") badgeClass = "bg-danger text-white";
        return (
          <span className={`badge rounded-pill px-3 py-2 text-uppercase font-weight-bold ${badgeClass}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Actions",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "280px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button 
            onClick={() => handleViewAuditLog(row.id)}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            title="View full audit log"
          >
            <Eye size={14} /> View
          </button>
          
          {row.status === "PENDING" && (
            <>
              <button 
                onClick={() => updateStatus(row.id, "COMPLETED")} 
                disabled={actioningId !== null}
                className="btn btn-sm btn-success d-flex align-items-center gap-1"
              >
                Approve
              </button>
              <button 
                onClick={() => updateStatus(row.id, "REJECTED")} 
                disabled={actioningId !== null}
                className="btn btn-sm btn-danger d-flex align-items-center gap-1"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid py-4 bg-light min-vh-screen">
      
      {/* Top Title/Refresh Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Transfer Registry</h2>
          <p className="text-muted small mb-0">Review, audit, and authorize internal institutional fund movements.</p>
        </div>
        <button onClick={() => { fetchTransfers(); fetchMetricsSummary(); }} className="btn btn-white border shadow-sm d-flex align-items-center gap-2">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Registry
        </button>
      </div>

      {/* Metrics Cards Blocks populated using backend responses directly */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <span className="text-uppercase text-muted small fw-bold d-block mb-1">Total Volume Processed</span>
                <h3 className="fw-bold mb-0 text-dark">UGX {metrics.total_processed.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-light text-primary rounded-3"><ArrowUpRight size={24} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <span className="text-uppercase text-muted small fw-bold d-block mb-1">Pending Clearance</span>
                <h3 className="fw-bold mb-0 text-warning">UGX {metrics.pending_clearance.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-warning-subtle text-warning rounded-3"><Clock size={24} /></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <span className="text-uppercase text-muted small fw-bold d-block mb-1">Completed Vault Total</span>
                <h3 className="fw-bold mb-0 text-success">UGX {metrics.completed_vault.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3"><CheckCircle size={24} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Table Control Panel Container */}
      <div className="card shadow-sm border-0 bg-white rounded-3">
        
        {/* Filter Controls Header */}
        <div className="card-header bg-white border-0 pt-4 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          
          {/* Navigation Filter Tabs */}
          <ul className="nav nav-pills bg-light p-1 rounded-3 border">
            {["ALL", "PENDING", "COMPLETED", "REJECTED"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button 
                  onClick={() => setCurrentTab(tab)}
                  className={`nav-link border-0 text-uppercase px-3 py-1.5 small fw-semibold ${currentTab === tab ? "active bg-primary text-white shadow-sm" : "text-secondary"}`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Dynamic Search Input Bar */}
          <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"><Search size={16} /></span>
            <input 
              type="text"
              className="form-control ps-5 py-2 shadow-none border bg-light"
              placeholder="Search member name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Presentation Node */}
        <div className="card-body p-0">
          <DataTable
            columns={columns}
            data={transfers}
            progressPending={loading}
            pagination
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={
              <div className="p-5 text-center text-muted">
                <p className="mb-0 fw-semibold">No record transfers match your configuration metrics.</p>
              </div>
            }
          />
        </div>
      </div>

      {/* --- Detail Audit Modal System Backdrop Overlay --- */}
      {selectedTransfer && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Transfer Transaction Audit Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedTransfer(null)}></button>
              </div>
              <div className="modal-body">
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr><td className="text-muted fw-bold small text-uppercase">Reference Code:</td><td>#TXT-{selectedTransfer.id}</td></tr>
                    <tr><td className="text-muted fw-bold small text-uppercase">Member Name:</td><td>{selectedTransfer.user?.full_name || "N/A"}</td></tr>
                    <tr><td className="text-muted fw-bold small text-uppercase">Email Address:</td><td>{selectedTransfer.user?.email || "N/A"}</td></tr>
                    <tr><td className="text-muted fw-bold small text-uppercase">Volume Value:</td><td className="fw-bold text-dark">UGX {selectedTransfer.amount.toLocaleString()}</td></tr>
                    <tr>
                      <td className="text-muted fw-bold small text-uppercase">Process Status:</td>
                      <td>
                        <span className={`badge rounded-pill ${selectedTransfer.status === "COMPLETED" ? "bg-success" : selectedTransfer.status === "REJECTED" ? "bg-danger" : "bg-warning text-dark"}`}>
                          {selectedTransfer.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedTransfer(null)}>Close Audit File</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transfers;