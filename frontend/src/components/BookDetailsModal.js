'use strict';
import React from 'react';

export default function BookDetailsModal({ book, onClose, onEdit, onOrder }) {
  if (!book) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  const isOutOfStock = (book.stockQuantity || 0) <= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Book Specifications</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Full catalog listing & technical meta details
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 200px', margin: '0 auto' }}>
              <img
                src={book.coverImageUrl || fallbackImage}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-subtle)',
                }}
                onError={(e) => { e.target.src = fallbackImage; }}
              />
            </div>

            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="card-badge badge-tech" style={{ position: 'static' }}>
                  {book.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>
                  ★ 4.9 (Verified)
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', marginBottom: '0.35rem', color: '#fff', lineHeight: '1.25' }}>
                {book.title}
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.25rem' }}>
                Written by <strong style={{ color: 'var(--text-light)' }}>{book.author}</strong>
              </p>

              {/* Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                background: 'rgba(7, 9, 14, 0.7)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ISBN-13
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: '#fff', fontFamily: 'monospace' }}>
                    {book.isbn}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Inventory Status
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: !isOutOfStock ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {!isOutOfStock ? `${book.stockQuantity} copies available` : 'Out of stock'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Cloud Database ID
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                    #{book.id}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Unit Price
                  </span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                    ${Number(book.price).toFixed(2)}
                  </strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Synopsis & Overview
                </h4>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.65', fontSize: '0.92rem' }}>
                  {book.description || 'No detailed synopsis provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(book); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Edit Book
          </button>
          <button
            className="btn btn-primary"
            disabled={isOutOfStock}
            onClick={() => { onClose(); onOrder(book); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            {isOutOfStock ? 'Sold Out' : 'Proceed to Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
