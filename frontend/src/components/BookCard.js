'use strict';
import React from 'react';

export default function BookCard({ book, onSelect, onEdit, onDelete, onOrder }) {
  const isOutOfStock = book.stockQuantity <= 0;
  const isLowStock = book.stockQuantity > 0 && book.stockQuantity < 5;

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="book-card">
      <div className="card-img-wrap" onClick={() => onSelect(book)} style={{ cursor: 'pointer' }}>
        <img
          src={book.coverImageUrl || fallbackImage}
          alt={book.title}
          className="card-img"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <span className="card-badge">{book.category}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title" onClick={() => onSelect(book)} style={{ cursor: 'pointer' }}>
          {book.title}
        </h3>
        <p className="card-author">by {book.author}</p>
        <p className="card-desc">{book.description || 'No detailed description available.'}</p>

        <div className="card-footer">
          <div className="card-price">${Number(book.price).toFixed(2)}</div>
          <div className="card-stock">
            {isOutOfStock ? (
              <span className="stock-out">● Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-low">● Only {book.stockQuantity} left</span>
            ) : (
              <span className="stock-in">● {book.stockQuantity} in stock</span>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            {isOutOfStock ? 'Sold Out' : 'Order Now'}
          </button>

          <button
            className="btn btn-secondary btn-sm"
            title="Edit Book Details"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
