'use strict';
import React, { useState } from 'react';

export default function OrdersDashboard({ orders, onUpdateStatus, onDeleteOrder, loading, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch =
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'CONFIRMED': return 'badge-confirmed';
      case 'SHIPPED': return 'badge-shipped';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', marginBottom: '4rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Customer Order Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track order fulfillment, update delivery status, and review customer purchase history.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="controls-bar" style={{ padding: '0.8rem 1.2rem', marginBottom: '1.5rem' }}>
        <div className="search-box" style={{ maxWidth: '360px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by customer, order # or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {statuses.map((st) => (
            <button
              key={st}
              className={`pill ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No Orders Found</h3>
          <p>
            {searchTerm || filterStatus !== 'ALL'
              ? 'Try modifying your filter or search query.'
              : 'Browse books and place a test order to see it listed here!'}
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Customer</th>
                <th>Items & Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Manage Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ color: '#fff', display: 'block' }}>{order.orderNumber}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '200px' }} title={order.shippingAddress}>
                      {order.shippingAddress}
                    </div>
                  </td>
                  <td>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '3px' }}>
                        • {item.bookTitle} <strong style={{ color: 'var(--accent-cyan)' }}>x{item.quantity}</strong>
                      </div>
                    ))}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge-status ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Cancel/Delete Order"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
