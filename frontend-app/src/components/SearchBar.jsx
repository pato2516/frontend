import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="position-relative w-100" style={{ maxWidth: '400px' }}>
      {/* Floating Left Search Icon */}
      <span 
        className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted d-flex align-items-center"
        style={{ pointerEvents: 'none', zIndex: 5 }}
      >
        <i className="bi bi-search fs-6"></i>
      </span>

      {/* Input Field with Custom Gray Focus Border */}
      <input
        type="text"
        className="form-control bg-white shadow-sm border-custom-gray"
        placeholder="Search transactions, references..."
        value={query}
        onChange={handleChange}
        style={{
          paddingLeft: '2.5rem',
          paddingRight: query ? '2.5rem' : '1rem',
          height: '44px',
          borderRadius: '50px',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease-in-out'
        }}
      />

      {/* Conditional Floating Right Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="btn position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent text-muted text-opacity-50 hover-text-dark d-flex align-items-center"
          type="button"
          style={{ zIndex: 5 }}
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
}