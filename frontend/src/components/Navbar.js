'use strict';
import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddBook, ordersCount }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand" onClick={() => setActiveTab('catalog')}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <span>PageCraft</span>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85em', marginLeft: '4px' }}>Books</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('catalog')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Book Catalog
          </button>

          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Customer Orders
            {ordersCount > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                marginLeft: '4px'
              }}>
                {ordersCount}
              </span>
            )}
          </button>

          <button className="btn btn-primary" onClick={onOpenAddBook}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Share New Book
          </button>
        </div>
      </div>
    </header>
  );
}
