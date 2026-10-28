'use strict';
import React, { useState } from 'react';

export default function OrdersDashboard({ orders, onUpdateStatus, onDeleteOrder, loading, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Calculations for KPI Cards
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ marginTop: '1rem', marginBottom: '4rem' }}>
      {/* KPI Overview Cards */}
      <div className="metrics-strip">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            💰
          </div>
          <div>
            <div className="metric-val">${totalRevenue.toFixed(2)}</div>
            <div className="metric-label">Gross Revenue</div>
            <div className="metric-sub">From all customer orders</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            📦
          </div>
          <div>
            <div className="metric-val">{orders.length}</div>
            <div className="metric-label">Total Orders</div>
            <div className="metric-sub">Lifetime orders placed</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            ⏳
          </div>
          <div>
            <div className="metric-val">{pendingCount}</div>
            <div className="metric-label">Pending Action</div>
            <div className="metric-sub">Requires confirmation</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            ✅
          </div>
          <div>
            <div className="metric-val">{deliveredCount}</div>
            <div className="metric-label">Fulfilled</div>
            <div className="metric-sub">Successfully delivered</div>
          </div>
        </div>
      </div>

      {/* Header and Refresh Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Customer Orders & Fulfillment
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live status dispatch, address tracking, and inventory synchronization across MySQL tables.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={loading ? 'spin' : ''}>
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Records'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="controls-bar" style={{ padding: '0.9rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="controls-row-top">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by customer name, order # or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>&times;</button>
            )}
          </div>

          <div className="category-pills">
            {statuses.map((st) => {
              const count = st === 'ALL' ? orders.length : orders.filter(o => o.status === st).length;
              return (
                <button
                  key={st}
                  className={`pill ${filterStatus === st ? 'active' : ''}`}
                  onClick={() => setFilterStatus(st)}
                >
                  {st}
                  <span style={{
                    fontSize: '0.7rem',
                    background: filterStatus === st ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    padding: '1px 5px',
                    borderRadius: '8px'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No Orders Found</h3>
          <p>
            {searchTerm || filterStatus !== 'ALL'
              ? 'No orders matched your search query. Try clearing the filter.'
              : 'The customer orders queue is currently empty. Place a quick order from the Catalog to see it appear here live!'}
          </p>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Customer Profile</th>
                <th>Order Items</th>
                <th>Total Value</th>
                <th>Current Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ color: '#fff', display: 'block', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {order.orderNumber}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="customer-avatar">
                        {getInitials(order.customerName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', maxWidth: '210px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={order.shippingAddress}>
                          📍 {order.shippingAddress}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '3px' }}>
                        📖 {item.bookTitle} <strong style={{ color: 'var(--accent-cyan)' }}>x{item.quantity}</strong>
                      </div>
                    ))}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
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
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.82rem', width: 'auto', background: 'rgba(7,9,14,0.9)' }}
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
                      title="Delete or Cancel Order"
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
