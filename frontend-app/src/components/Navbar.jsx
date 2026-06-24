import React from 'react';
import SearchBar from './SearchBar';

export default function Navbar({ title }) {
  return (
    <header className="navbar-wrapper d-flex justify-content-between align-items-center px-4 border-bottom">
      <h4 className="mb-0 fw-bold text-dark">{title}</h4>
      
      <div className="d-flex align-items-center gap-4">
        <div className="position-relative d-none d-lg-block" style={{ width: '320px' }}>
          <span className="position-absolute top-5 start-0 ps-3 pt-2 text-muted"><i className="bi bi-search"></i></span>
          {/* Modern Floating Search Bar Integration */}
            <div className="d-none d-md-block flex-grow-1" style={{ maxWidth: '380px' }}>
                <SearchBar onSearch={(value) => console.log("Searching for:", value)} />
            </div>
        </div>
        
        <div className="position-relative cursor-pointer">
          <i className="bi bi-bell text-secondary fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </div>
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="rounded-circle" width="36" height="36" />
      </div>
    </header>
  );
}