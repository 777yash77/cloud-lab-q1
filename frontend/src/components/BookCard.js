'use strict';
import React from 'react';

export default function BookCard({ book, onSelect, onEdit, onDelete, onOrder }) {
  const isOutOfStock = book.stockQuantity <= 0;
  const isLowStock = book.stockQuantity > 0 && book.stockQuantity < 5;

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology': return 'badge-tech';
      case 'business': return 'badge-business';
      case 'self-help': return 'badge-selfhelp';
      case 'fiction': return 'badge-fiction';
      default: return 'badge-default';
    }
  };

  // Generate deterministic realistic rating based on book ID
  const rating = (4.7 + ((book.id * 3) % 4) * 0.1).toFixed(1);
  const reviewsCount = 18 + ((book.id * 17) % 80);

  return (
    <div className="book-card">
      <div className="card-img-wrap" onClick={() => onSelect(book)} style={{ cursor: 'pointer' }}>
        <img
          src={book.coverImageUrl || fallbackImage}
          alt={book.title}
          className="card-img"
          loading="lazy"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <span className={`card-badge ${getCategoryBadgeClass(book.category)}`}>
          {book.category}
        </span>
      </div>

      <div className="card-body">
        <div className="card-meta-row">
          <span className="card-isbn">ISBN: {book.isbn || 'N/A'}</span>
          <span className="card-rating">★ {rating} ({reviewsCount})</span>
        </div>

        <h3 className="card-title" onClick={() => onSelect(book)} style={{ cursor: 'pointer' }} title={book.title}>
          {book.title}
        </h3>
        
        <p className="card-author">by {book.author}</p>
        
        <p className="card-desc" title={book.description}>
          {book.description || 'Enterprise grade cloud architecture and best practices synopsis.'}
        </p>

        <div className="card-footer">
          <div className="card-price">
            ${Number(book.price).toFixed(2)}
          </div>
          
          <div className="card-stock">
            {isOutOfStock ? (
              <span className="stock-out">
                <span style={{ fontSize: '0.65rem' }}>●</span> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="stock-low">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--accent-amber)', boxShadow: '0 0 8px var(--accent-amber)', width: '6px', height: '6px' }}></span>
                Only {book.stockQuantity} Left
              </span>
            ) : (
              <span className="stock-in">
                <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                {book.stockQuantity} in Stock
              </span>
            )}
          </div>
        </div>

        <div className="card-actions-row">
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            disabled={isOutOfStock}
            onClick={() => onOrder(book)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {isOutOfStock ? 'Sold Out' : 'Quick Order'}
          </button>

          <button
            className="btn btn-secondary btn-sm"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            title="Edit Book Details"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>

          <button
            className="btn btn-danger btn-sm"
            title="Delete Book"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
