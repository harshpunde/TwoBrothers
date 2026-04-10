import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

const BADGE_OPTIONS = [
  { value: '',              label: 'None' },
  { value: 'trending',     label: 'Trending',      labelText: 'Trending' },
  { value: 'best-seller',  label: 'Best Seller',   labelText: 'Best Seller' },
  { value: 'winter-special', label: 'Winter Special', labelText: 'Winter Special' },
];

const EMPTY_PRODUCT = {
  name: '', price: '', tags: '', rating: '4.9', reviews: '0 Reviews',
  badge: '', badgeLabel: '',
  variants: '500g, 1kg, 2kg', defaultVariant: '1kg',
  image: '',
};

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    product
      ? { ...product, variants: Array.isArray(product.variants) ? product.variants.join(', ') : product.variants }
      : { ...EMPTY_PRODUCT }
  );

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleBadge = (val) => {
    const opt = BADGE_OPTIONS.find(o => o.value === val);
    set('badge', val);
    set('badgeLabel', opt?.labelText || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const variants = form.variants.split(',').map(v => v.trim()).filter(Boolean);
    onSave({
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      variants,
      wishlist: false,
    });
    onClose();
  };

  const isEdit = !!product;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <span className="admin-modal-title">{isEdit ? 'Edit Product' : 'Add New Product'}</span>
          <button className="admin-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-grid">

              <div className="admin-form-group span2">
                <label>Product Name *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Khapli Multigrain Atta" />
              </div>

              <div className="admin-form-group">
                <label>Price (₹) *</label>
                <input required type="number" min="1" value={form.price}
                  onChange={e => set('price', e.target.value)} placeholder="1745" />
              </div>

              <div className="admin-form-group">
                <label>Badge</label>
                <select value={form.badge} onChange={e => handleBadge(e.target.value)}>
                  {BADGE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group span2">
                <label>Tags / Subtitle</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="e.g. 50% Khapli | 50% Supergrains" />
              </div>

              <div className="admin-form-group">
                <label>Rating (e.g. 4.9)</label>
                <input type="number" step="0.1" min="1" max="5" value={form.rating}
                  onChange={e => set('rating', e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label>Reviews Label</label>
                <input value={form.reviews} onChange={e => set('reviews', e.target.value)}
                  placeholder="e.g. 411 Reviews" />
              </div>

              <div className="admin-form-group">
                <label>Variants (comma separated)</label>
                <input value={form.variants} onChange={e => set('variants', e.target.value)}
                  placeholder="500g, 1kg, 2kg, 5kg" />
              </div>

              <div className="admin-form-group">
                <label>Default Variant</label>
                <input value={form.defaultVariant} onChange={e => set('defaultVariant', e.target.value)}
                  placeholder="1kg" />
              </div>

              <div className="admin-form-group span2">
                <label>Image URL</label>
                <input value={form.image} onChange={e => set('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..." />
                {form.image && (
                  <img src={form.image} alt="preview" className="admin-image-preview"
                    style={{ marginTop: 8 }} onError={e => e.target.style.display = 'none'} />
                )}
              </div>

            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn-primary">
              {isEdit ? 'Save Changes' : '+ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal confirm-modal">
        <div className="admin-modal-body" style={{ paddingTop: 32 }}>
          <div className="confirm-modal-icon">🗑️</div>
          <p className="confirm-modal-text">
            Are you sure you want to delete<br />
            <span className="confirm-modal-name">"{product.name}"</span>?<br />
            <small style={{ color: '#aaa' }}>This action cannot be undone.</small>
          </p>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts({ showToast }) {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data) => {
    addProduct(data);
    showToast('✅ Product added successfully!', 'success');
  };

  const handleEdit = (data) => {
    updateProduct(editProduct.id, data);
    showToast('✅ Product updated!', 'success');
  };

  const handleDelete = () => {
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    showToast('🗑️ Product deleted.', 'success');
  };

  return (
    <div>
      {addModal && (
        <ProductModal onClose={() => setAddModal(false)} onSave={handleAdd} />
      )}
      {editProduct && (
        <ProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleEdit} />
      )}
      {deleteTarget && (
        <ConfirmModal product={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Products ({filtered.length})</span>
          <div className="admin-card-actions">
            <input
              className="admin-search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="admin-btn admin-btn-primary" onClick={() => setAddModal(true)}>
              + Add Product
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Tags</th>
                <th>Badge</th>
                <th>Rating</th>
                <th>Variants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt={p.name} className="admin-table-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/48x48?text=?'; }} />
                  </td>
                  <td style={{ maxWidth: 200, fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontWeight: 700 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td style={{ color: '#888', fontSize: 12 }}>{p.tags}</td>
                  <td>
                    <span className={`admin-badge-tag ${p.badge || 'none'}`}>
                      {p.badgeLabel || 'None'}
                    </span>
                  </td>
                  <td>⭐ {p.rating}</td>
                  <td style={{ fontSize: 12, color: '#666' }}>
                    {Array.isArray(p.variants) ? p.variants.join(', ') : p.variants}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setEditProduct(p)}>
                        ✏️ Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteTarget(p)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
