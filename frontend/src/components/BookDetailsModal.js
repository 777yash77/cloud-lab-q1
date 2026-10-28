'use strict';
import React from 'react';

export default function BookDetailsModal({ book, onClose, onEdit, onOrder }) {
  if (!book) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book Specifications</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <img
                src={book.coverImageUrl || fallbackImage}
                alt={book.title}
                style={{
                  width: '160px',
                  height: '230px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <span className="card-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '8px' }}>
                  {book.category}
                </span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', color: '#fff' }}>{book.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
                  By <strong style={{ color: 'var(--text-light)' }}>{book.author}</strong>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ISBN-13</span>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{book.isbn}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stock Status</span>
                    <strong style={{ fontSize: '0.9rem', color: book.stockQuantity > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {book.stockQuantity > 0 ? `${book.stockQuantity} units available` : 'Out of stock'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Unit Price</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)' }}>${Number(book.price).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Book Overview
              </h4>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {book.description || 'No detailed synopsis provided.'}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(book); }}>
            Edit Book
          </button>
          <button
            className="btn btn-primary"
            disabled={book.stockQuantity <= 0}
            onClick={() => { onClose(); onOrder(book); }}
          >
            {book.stockQuantity <= 0 ? 'Out of Stock' : 'Proceed to Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
