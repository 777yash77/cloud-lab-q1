'use strict';
import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddBook, ordersCount, booksCount }) {
  return (
    <>
      {/* Top Architecture Status Ticker */}
      <div className="top-ticker">
        <div className="top-ticker-item">
          <span className="pulse-dot"></span>
          <span>AWS EC2 Ready</span>
        </div>
        <span style={{ opacity: 0.3 }}>•</span>
        <div className="top-ticker-item">
          <span>Spring Boot 3.2.3 REST API</span>
        </div>
        <span style={{ opacity: 0.3 }}>•</span>
        <div className="top-ticker-item">
          <span>MySQL 8.0 Engine</span>
        </div>
        <span style={{ opacity: 0.3 }}>•</span>
        <div className="top-ticker-item">
          <span>Docker Compose Multi-Container</span>
        </div>
        <span style={{ opacity: 0.3 }}>•</span>
        <div className="top-ticker-item">
          <span>Next.js 14 Standalone</span>
        </div>
      </div>

      <header className="navbar">
        <div className="container nav-inner">
          {/* Brand */}
          <div className="brand" onClick={() => setActiveTab('catalog')}>
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="brand-name">PageCraft</span>
                <span className="brand-tag">Cloud</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.3px', marginTop: '-2px' }}>
                Online Bookstore Architecture
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="nav-actions">
            <button
              className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('catalog')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Catalog
              {booksCount !== undefined && (
                <span style={{
                  background: activeTab === 'catalog' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  marginLeft: '4px'
                }}>
                  {booksCount}
                </span>
              )}
            </button>

            <button
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Orders
              {ordersCount > 0 && (
                <span style={{
                  background: activeTab === 'orders' ? 'rgba(255,255,255,0.25)' : 'rgba(6, 182, 212, 0.25)',
                  color: activeTab === 'orders' ? '#fff' : '#38bdf8',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginLeft: '4px'
                }}>
                  {ordersCount}
                </span>
              )}
            </button>

            <button className="btn btn-primary" onClick={onOpenAddBook}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Publish Book
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
