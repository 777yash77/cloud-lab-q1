'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';
import AddEditBookModal from '../components/AddEditBookModal';
import OrderModal from '../components/OrderModal';
import OrdersDashboard from '../components/OrdersDashboard';
import Toast from '../components/Toast';
import { api } from '../services/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'orders'
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Filters, Search, Sorting, and View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED'); // 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'STOCK_DESC' | 'TITLE_AZ'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals state
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToOrder, setBookToOrder] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch books
  const fetchBooks = useCallback(async () => {
    try {
      setLoadingBooks(true);
      const data = await api.getBooks(searchQuery, selectedCategory);
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      addToast(err.message || 'Could not load books from backend API', 'error');
    } finally {
      setLoadingBooks(false);
    }
  }, [searchQuery, selectedCategory]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Client-side sorting on retrieved books
  const sortedBooks = useMemo(() => {
    const list = [...books];
    switch (sortBy) {
      case 'PRICE_ASC':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'PRICE_DESC':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case 'STOCK_DESC':
        return list.sort((a, b) => Number(b.stockQuantity) - Number(a.stockQuantity));
      case 'TITLE_AZ':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return list;
    }
  }, [books, sortBy]);

  // CRUD Handlers for Books
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setIsAddEditModalOpen(true);
  };

  const handleSaveBook = async (bookPayload, id) => {
    if (id) {
      await api.updateBook(id, bookPayload);
      addToast(`Updated book "${bookPayload.title}" successfully!`);
    } else {
      await api.createBook(bookPayload);
      addToast(`Published new book "${bookPayload.title}" successfully!`);
    }
    fetchBooks();
  };

  const handleDeleteBook = async (book) => {
    if (window.confirm(`Are you sure you want to remove "${book.title}" from the catalog?`)) {
      try {
        await api.deleteBook(book.id);
        addToast(`Deleted "${book.title}" from catalog.`, 'success');
        fetchBooks();
      } catch (err) {
        addToast(err.message || 'Failed to delete book.', 'error');
      }
    }
  };

  // Order Handlers
  const handleOpenOrder = (book) => {
    setBookToOrder(book);
  };

  const handleSubmitOrder = async (orderPayload) => {
    await api.createOrder(orderPayload);
    addToast('Your order has been placed successfully! Tracking initiated.');
    fetchBooks(); // Refresh stock counts
    fetchOrders(); // Refresh orders list
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} status changed to ${newStatus}.`);
      fetchOrders();
      fetchBooks();
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel / delete order #${orderId}?`)) {
      try {
        await api.deleteOrder(orderId);
        addToast(`Order #${orderId} removed successfully.`);
        fetchOrders();
        fetchBooks();
      } catch (err) {
        addToast(err.message || 'Failed to cancel order.', 'error');
      }
    }
  };

  const categories = [
    { label: 'ALL', icon: '✨' },
    { label: 'Technology', icon: '💻' },
    { label: 'Business', icon: '📈' },
    { label: 'Self-Help', icon: '💡' },
    { label: 'Fiction', icon: '📖' },
    { label: 'Science', icon: '🔬' },
    { label: 'History', icon: '🏛️' },
    { label: 'Philosophy', icon: '🧠' },
  ];

  const totalStock = books.reduce((acc, b) => acc + (b.stockQuantity || 0), 0);
  const totalCatalogValue = books.reduce((acc, b) => acc + (Number(b.price || 0) * (b.stockQuantity || 0)), 0);

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddBook={handleOpenAddBook}
        ordersCount={orders.length}
        booksCount={books.length}
      />

      <main className="container">
        {/* Modernized Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>Cloud-Native High Concurrency Architecture</span>
          </div>

          <h1>
            Discover, Curate & Manage <span className="highlight">Books Online</span>
          </h1>

          <p>
            An enterprise full-stack cloud bookstore platform engineered with Spring Boot 3, MySQL 8, Docker containerization, and a modern reactive Next.js 14 user interface.
          </p>

          {/* Quick Metrics Bar */}
          <div className="metrics-strip">
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                📚
              </div>
              <div>
                <div className="metric-val">{books.length}</div>
                <div className="metric-label">Book Titles</div>
                <div className="metric-sub">Cataloged in MySQL</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                📦
              </div>
              <div>
                <div className="metric-val">{totalStock}</div>
                <div className="metric-label">Units in Stock</div>
                <div className="metric-sub">Live inventory tracking</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                💎
              </div>
              <div>
                <div className="metric-val">${totalCatalogValue.toFixed(0)}</div>
                <div className="metric-label">Inventory Value</div>
                <div className="metric-sub">Across all categories</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                🛍️
              </div>
              <div>
                <div className="metric-val">{orders.length}</div>
                <div className="metric-label">Customer Orders</div>
                <div className="metric-sub">Fulfilled via REST API</div>
              </div>
            </div>
          </div>
        </section>

        {activeTab === 'catalog' ? (
          <>
            {/* Search, Filter, Sort and Layout Controls Bar */}
            <div className="controls-bar">
              <div className="controls-row-top">
                <div className="search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search books by title, author, category, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="search-clear" onClick={() => setSearchQuery('')}>&times;</button>
                  )}
                </div>

                <div className="view-controls">
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    title="Sort Books"
                  >
                    <option value="FEATURED">Featured / Default</option>
                    <option value="PRICE_ASC">Price: Low to High</option>
                    <option value="PRICE_DESC">Price: High to Low</option>
                    <option value="STOCK_DESC">Inventory: Highest Stock</option>
                    <option value="TITLE_AZ">Alphabetical: A to Z</option>
                  </select>

                  <div className="view-mode-toggles">
                    <button
                      className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                      </svg>
                    </button>
                    <button
                      className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"/>
                        <line x1="8" y1="12" x2="21" y2="12"/>
                        <line x1="8" y1="18" x2="21" y2="18"/>
                        <line x1="3" y1="6" x2="3.01" y2="6"/>
                        <line x1="3" y1="12" x2="3.01" y2="12"/>
                        <line x1="3" y1="18" x2="3.01" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    className={`pill ${selectedCategory === cat.label ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.label)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count Summary */}
            <div className="results-info-bar">
              <div>
                Showing <strong style={{ color: '#fff' }}>{sortedBooks.length}</strong> {sortedBooks.length === 1 ? 'book' : 'books'}
                {selectedCategory !== 'ALL' && <span> in <span style={{ color: 'var(--accent-cyan)' }}>{selectedCategory}</span></span>}
                {searchQuery && <span> matching &ldquo;<span style={{ color: '#fff' }}>{searchQuery}</span>&rdquo;</span>}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Real-time synchronized with backend database
              </div>
            </div>

            {/* Books Grid / List View */}
            {loadingBooks ? (
              <div className="empty-state">
                <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '12px', height: '12px' }}></div>
                <h3>Loading Bookstore Catalog...</h3>
                <p>Connecting to backend API at Spring Boot server...</p>
              </div>
            ) : sortedBooks.length === 0 ? (
              <div className="empty-state">
                <h3>No Books Found</h3>
                <p>
                  {searchQuery || selectedCategory !== 'ALL'
                    ? 'No books match the filter criteria. Try resetting filters or searching another title.'
                    : 'Your catalog is empty. Click "Publish Book" above to add your first title!'}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1.25rem' }}
                  onClick={handleOpenAddBook}
                >
                  Publish Your First Book
                </button>
              </div>
            ) : (
              <div className={`books-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {sortedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={setSelectedBookForDetails}
                    onEdit={handleOpenEditBook}
                    onDelete={handleDeleteBook}
                    onOrder={handleOpenOrder}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <OrdersDashboard
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            loading={loadingOrders}
            onRefresh={fetchOrders}
          />
        )}
      </main>

      {/* Modern Cloud Architecture Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📚</span>
                <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>PageCraft Bookstore</strong>
                <span className="brand-tag">v1.0.0</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px' }}>
                Full-stack cloud-native web application showcasing multi-tier architecture, persistent volume Docker Compose, and automated CI/CD.
              </p>
            </div>

            <div className="footer-badges">
              <span className="tech-badge">⚡ Spring Boot 3.2.3</span>
              <span className="tech-badge">🐬 MySQL 8.0</span>
              <span className="tech-badge">▲ Next.js 14</span>
              <span className="tech-badge">🐳 Docker Compose</span>
              <span className="tech-badge">☁️ AWS EC2</span>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} PageCraft Cloud Bookstore • Designed for High Reliability & Scalability
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-dot"></span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookDetailsModal
        book={selectedBookForDetails}
        onClose={() => setSelectedBookForDetails(null)}
        onEdit={handleOpenEditBook}
        onOrder={handleOpenOrder}
      />

      <AddEditBookModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />

      <OrderModal
        book={bookToOrder}
        isOpen={!!bookToOrder}
        onClose={() => setBookToOrder(null)}
        onSubmitOrder={handleSubmitOrder}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
