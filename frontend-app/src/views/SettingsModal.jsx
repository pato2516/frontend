import React, { useState, useEffect } from "react";

const SettingsModal = ({ show, onClose, onSave, initialSettings }) => {
  const [organizationName, setOrganizationName] = useState("");
  const [currency, setCurrency] = useState("UGX");
  const [theme, setTheme] = useState("light");

  // Load initial settings when modal opens
  useEffect(() => {
    if (initialSettings) {
      setOrganizationName(initialSettings.organizationName || "");
      setCurrency(initialSettings.currency || "UGX");
      setTheme(initialSettings.theme || "light");
    }
  }, [initialSettings, show]);

  if (!show) return null;

  const handleSave = () => {
    const settings = { organizationName, currency, theme };
    if (onSave) {
      onSave(settings); // send settings back to parent
    }
    onClose(); // ✅ close modal immediately after saving
  };

  return (
    <div
      className="modal d-block"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          {/* Header */}
          <div className="modal-header bg-primary text-white border-0 rounded-top">
            <h5 className="modal-title fw-bold d-flex align-items-center">
              <i className="bi bi-gear me-2"></i> Settings
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-light">
            <form>
              <div className="mb-3">
                <label className="form-label fw-bold">Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SACCO name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Currency</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="UGX">UGX (Uganda Shillings)</option>
                  <option value="USD">USD (US Dollars)</option>
                  <option value="KES">KES (Kenya Shillings)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Theme</label>
                <select
                  className="form-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="corporate">Corporate Blue</option>
                </select>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-0 p-3">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success fw-bold" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
