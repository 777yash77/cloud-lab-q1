'use strict';
import React, { useState, useEffect } from 'react';

export default function AddEditBookModal({ isOpen, onClose, onSave, editingBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    category: 'Technology',
    stockQuantity: 10,
    coverImageUrl: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        isbn: editingBook.isbn || '',
        price: editingBook.price || '',
        category: editingBook.category || 'Technology',
        stockQuantity: editingBook.stockQuantity ?? 10,
        coverImageUrl: editingBook.coverImageUrl || '',
        description: editingBook.description || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        price: '',
        category: 'Technology',
        stockQuantity: 15,
        coverImageUrl: '',
        description: '',
      });
    }
    setError('');
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.isbn || !formData.price) {
      setError('Please fill in all mandatory fields (Title, Author, ISBN, Price).');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      };
      await onSave(payload, editingBook ? editingBook.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Error occurred while saving book');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Technology', 'Business', 'Self-Help', 'Fiction', 'Science', 'History', 'Philosophy'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingBook ? 'Update Book Information' : 'Share / Add New Book'}
          </h2>
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

            <div className="form-grid">
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Building Microservices"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label>Author Name *</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    placeholder="e.g. Sam Newman"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ISBN Identifier *</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    placeholder="e.g. 978-1492034025"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label>Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    name="price"
                    className="form-control"
                    placeholder="39.99"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label>Initial Stock Inventory *</label>
                  <input
                    type="number"
                    min="0"
                    name="stockQuantity"
                    className="form-control"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cover Image URL (Optional)</label>
                  <input
                    type="url"
                    name="coverImageUrl"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Synopsis</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Enter a brief summary of the book content, key topics, and takeaways..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingBook ? 'Save Changes' : 'Publish Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
