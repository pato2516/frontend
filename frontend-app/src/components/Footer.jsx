import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-wrapper py-3 px-4 border-top bg-white">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <div className="text-muted small">
          &copy; 2026 <span className="fw-semibold text-dark">MazaoSACCO</span>. All rights reserved.
        </div>
        <div>
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 small">
            <i className="bi bi-shield-check me-1"></i> Regulated by SASRA
          </span>
        </div>
      </div>
    </footer>
  );
}