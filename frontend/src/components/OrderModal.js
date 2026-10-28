'use strict';
import React, { useState } from 'react';

export default function OrderModal({ book, isOpen, onClose, onSubmitOrder }) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !book) return null;

  const unitPrice = Number(book.price) || 0;
  const subtotal = (unitPrice * quantity).toFixed(2);
  const total = subtotal;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (quantity < book.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (quantity > book.stockQuantity) {
      setError(`Only ${book.stockQuantity} copies currently in stock.`);
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items: [
          {
            bookId: book.id,
            quantity: parseInt(quantity, 10),
          },
        ],
      };

      await onSubmitOrder(orderPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Place Customer Order</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Immediate stock deduction & order fulfillment tracking
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(244,63,94,0.15)',
                color: '#fb7185',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(244,63,94,0.3)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {/* Selected Book Summary Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(7, 9, 14, 0.7)',
              border: '1px solid var(--border-subtle)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <strong style={{ color: '#fff', fontSize: '1rem', display: 'block', maxWidth: '300px' }}>
                    {book.title}
                  </strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    By {book.author} • <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>${unitPrice.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Quantity:</span>
                <div className="qty-stepper">
                  <button type="button" className="qty-btn" onClick={handleDecrease}>−</button>
                  <input
                    type="text"
                    readOnly
                    className="qty-input"
                    value={quantity}
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleIncrease}
                    disabled={quantity >= book.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Customer Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Alice Johnson"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Customer Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="alice@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 234-5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Shipping / Destination Address *</label>
                <textarea
                  className="form-control"
                  placeholder="Street Address, City, State, ZIP code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ minHeight: '75px' }}
                  required
                />
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div style={{
              background: 'rgba(7, 9, 14, 0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.25rem',
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                <span>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Standard Delivery:</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>FREE (Complimentary)</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#fff',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.25rem'
              }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
                  ${total}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {loading ? 'Processing Order...' : `Confirm & Pay $${total}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
