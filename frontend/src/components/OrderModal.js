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

  const total = (Number(book.price) * quantity).toFixed(2);

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
          <h2 className="modal-title">Place Customer Order</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(244,63,94,0.15)',
                color: '#fb7185',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(244,63,94,0.3)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {/* Book Item Summary */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div>
                <strong style={{ color: '#fff', fontSize: '1rem', display: 'block' }}>{book.title}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>${Number(book.price).toFixed(2)} each</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Qty:</label>
                <input
                  type="number"
                  min="1"
                  max={book.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="form-control"
                  style={{ width: '70px', padding: '0.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-grid form-grid-2">
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
                <label>Phone Number *</label>
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
                <label>Delivery / Shipping Address *</label>
                <textarea
                  className="form-control"
                  placeholder="Street Address, City, State, ZIP code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>
            </div>

            {/* Total Calculation Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>Total Amount to Charge:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>${total}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm & Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
