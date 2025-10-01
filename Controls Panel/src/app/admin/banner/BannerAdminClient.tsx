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
  images: string[]; // ✅ string URLs
  href: string;
  category?: string;
  description: string;
  quantity?: number;
  stock?: number;
};

type Banner = {
  _id: string;
  productId: string;
  title: string;
  description: string;
  price: string;
  images: string[]; // ✅ string URLs
  backgroundimg: string[]; // ✅ string URLs
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
const upload = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL

export default function BannerAdminClient() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // Fetch banners
  const fetchBanners = async () => {
    const res = await fetch(`${baseUrl}/api/banner`);
    const data = await res.json();
    setBanners(data);
  };

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    setAllProducts(data);
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  // Add product to banner
  const handleAddToBanner = async () => {
    if (!selectedProductId || !selectedImage) return;

    const formData = new FormData();
    formData.append('productId', selectedProductId);
    // formData.append('imageUrl', selectedImage);
    // if (backgroundFile) {
    //   formData.append('backgroundimg', backgroundFile);
    // }

    const res = await fetch(`${baseUrl}/api/banner/add`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      fetchBanners();
      alert('Added to banner');
      setSelectedProductId('');
      setSelectedImage('');
      setBackgroundFile(null);
      setPreviewBackground(null);
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to add');
    }
  };

  // Remove banner
  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove from banner?')) return;

    const res = await fetch(`${baseUrl}/api/banner/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchBanners();
      alert('Removed from banner');
    } else {
      alert('Failed to remove');
    }
  };

  // Edit banner
  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setEditedTitle(banner.title);
    setEditedPrice(banner.price);
    setEditedDescription(banner.description);
  };

  const handleEditSave = async () => {
    if (!editingBanner) return;

    const res = await fetch(`${baseUrl}/api/banner/${editingBanner._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editedTitle,
        price: editedPrice,
        description: editedDescription,
      }),
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

      {/* Add Section */}
      <div className={styles.addSection}>
        <select
          value={selectedProductId}
          onChange={(e) => {
            setSelectedProductId(e.target.value);
            setSelectedImage('');
          }}
        >
          <option value="">-- Select Product --</option>
          {allProducts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {selectedProductId && (
          <div className={styles.imageSelect}>
            <p>Select Product Image:</p>
            <div className={styles.imageOptions}>
              {allProducts
                .find((p) => p._id === selectedProductId)
                ?.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.imgOption} ${
                      selectedImage === img ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image src={`${upload}${img}`} alt="option" width={80} height={80} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Background upload */}
        <div>
          <p>Upload Banner Background:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setBackgroundFile(file);
              if (file) {
                setPreviewBackground(URL.createObjectURL(file));
              }
            }}
          />
          {previewBackground && (
            <div className={styles.bgPreview}>
              <Image src={previewBackground} alt="Preview" width={150} height={80} />
            </div>
          )}
        </div>

        <button onClick={handleAddToBanner}>Add to Banner</button>
      </div>

      {/* Banner Grid */}
      <div className={styles.grid}>
        {banners.map((banner) => (
          <div key={banner._id} className={styles.card}>
            {banner.backgroundimg && banner.backgroundimg.length > 0 && (
              <div
                className={styles.background}
                style={{ backgroundImage: `url(${banner.backgroundimg[0]})` }}
              />
            )}
            {banner.images && banner.images.length > 0 && (
              <Image src={banner.images[0]} alt={banner.title} width={200} height={200} />
            )}
            <h3>{banner.title}</h3>
            <p>{banner.description}</p>
            <div className={styles.priceSection}>
              <span className={styles.price}>₹{banner.price}</span>
            </div>
            <button onClick={() => handleEditClick(banner)}>Edit</button>
            <button onClick={() => handleRemove(banner._id)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
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
              Description:
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
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
