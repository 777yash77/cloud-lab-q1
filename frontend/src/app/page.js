'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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
    }, 4000);
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
      // Suppress noisy toast if it's the initial check
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
        addToast(`Deleted "${book.title}" from bookstore.`, 'success');
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
      fetchBooks(); // in case inventory was restored
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel / delete order #${orderId}?`)) {
      try {
        await api.deleteOrder(orderId);
        addToast(`Order #${orderId} deleted successfully.`);
        fetchOrders();
        fetchBooks();
      } catch (err) {
        addToast(err.message || 'Failed to cancel order.', 'error');
      }
    }
  };

  const categories = ['ALL', 'Technology', 'Business', 'Self-Help', 'Fiction', 'Science', 'History', 'Philosophy'];

  const totalStock = books.reduce((acc, b) => acc + (b.stockQuantity || 0), 0);

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddBook={handleOpenAddBook}
        ordersCount={orders.length}
      />

      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span style={{ fontSize: '1rem' }}>⚡</span> Powered by Next.js & Spring Boot + MySQL
          </div>
          <h1>Discover, Share & Manage Books</h1>
          <p>
            An enterprise full-stack bookstore platform with dynamic CRUD operations, real-time inventory tracking, and seamless customer order fulfillment.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'inline-flex',
            gap: '2rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.8rem 2rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{books.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Book Titles</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{totalStock}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Units in Stock</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{orders.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Orders</div>
            </div>
          </div>
        </section>

        {activeTab === 'catalog' ? (
          <>
            {/* Search and Category Filters */}
            <div className="controls-bar">
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
              </div>

              <div className="category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            {loadingBooks ? (
              <div className="empty-state">
                <h3>Loading Bookstore Catalog...</h3>
                <p>Connecting to backend API at Spring Boot server...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <h3>No Books Found</h3>
                <p>
                  {searchQuery || selectedCategory !== 'ALL'
                    ? 'No books match the filter criteria. Try another search or reset filters.'
                    : 'Your catalog is empty. Click "Share New Book" above to publish your first title!'}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                  onClick={handleOpenAddBook}
                >
                  Add Your First Book
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {books.map((book) => (
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
