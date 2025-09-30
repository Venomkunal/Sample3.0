'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/pages/BannerAdmin.module.css';

type Product = {
  _id: string;
  title: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  price: string;
  images: string[];
  image: string;
  href: string;
  category?: string;
  description: string;
  quantity?: number;
  stock?: number;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const uploadUrl =process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

export default function BannerAdminClient() {
  const [banners, setBanners] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [editingBanner, setEditingBanner] = useState<Product | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditeddescription] = useState('');

  const fetchBanners = async () => {
    const res = await fetch(`${baseUrl}/api/banner`);
    const data = await res.json();
    setBanners(data);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    setAllProducts(data);
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  const handleAddToBanner = async () => {
    if (!selectedProductId) return;

    const res = await fetch(`${baseUrl}/api/banner/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: selectedProductId }),
    });

    const data = await res.json();

    if (res.ok) {
      fetchBanners();
      alert('Added to banner');
      setSelectedProductId('');
    } else {
      alert(data.message || data.error);
    }
  };

  const handleRemove = async (id: string) => {
    const confirmRemove = confirm('Are you sure you want to remove from banner?');
    if (!confirmRemove) return;

    const res = await fetch(`${baseUrl}/api/banner/${id}`, { method: 'DELETE' });

    if (res.ok) {
      fetchBanners();
      alert('Removed from banner');
    } else {
      alert('Failed to remove');
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingBanner(product);
    setEditedTitle(product.title);
    setEditedPrice(product.price);
    setEditeddescription(product.description);
  };

  const handleEditSave = async () => {
    if (!editingBanner) return;

    const res = await fetch(`${baseUrl}/api/banner/${editingBanner._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editedTitle, price: editedPrice, description: editedDescription }),
    });

    if (res.ok) {
      alert('Banner updated');
      setEditingBanner(null);
      fetchBanners();
    } else {
      alert('Failed to update banner');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Banner Products</h2>

      <div className={styles.addSection}>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Select Product --</option>
          {allProducts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
        <button onClick={handleAddToBanner}>Add to Banner</button>
      </div>

      <div className={styles.grid}>
        {banners.map((product) => {
          const discount =
            product.originalPrice && product.discountPrice
              ? Math.round(
                  ((+product.originalPrice - +product.discountPrice) / +product.originalPrice) *
                    100
                )
              : 0;

          return (
            <div key={product._id} className={styles.card}>
              <Image
                src={product.images && product.images.length > 0 ? `${uploadUrl}${product.images[0] }`: '/images/placeholder.png'}
                alt={product.title}
                width={200}
                height={200}
              />
              <h3>{product.title}</h3>
              <div className={styles.priceSection}>
                {product.discountPrice ? (
                  <>
                    <span className={styles.price}>₹{product.discountPrice}</span>
                    <span className={styles.originalPrice}>₹{product.originalPrice}</span>
                    <span className={styles.discount}>({discount}% OFF)</span>
                  </>
                ) : (
                  <span className={styles.price}>₹{product.originalPrice}</span>
                )}
              </div>
              <button onClick={() => handleEditClick(product)}>Edit</button>
              <button onClick={() => handleRemove(product._id)}>Remove from Banner</button>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingBanner && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Banner</h3>
            <label>
              Title:
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </label>
            <label>
              Price:
              <input
                type="text"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
              />
            </label>
            <label>
              Descrption:
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditeddescription(e.target.value)}
              />
            </label>
            <div className={styles.modalActions}>
              <button onClick={handleEditSave}>Save</button>
              <button onClick={() => setEditingBanner(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
