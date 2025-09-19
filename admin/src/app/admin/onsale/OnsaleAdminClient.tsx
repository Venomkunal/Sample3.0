'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/pages/Onsale.module.css';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 

type Onsale = {
  _id: string;
  title: string;
  name: string;
  discountPrice: string;
  originalPrice: string;
  category: string[];
  images: string[];
  description: string;
  inStock: boolean;
  createdAt: string;
  saleEnd?: string;
};

type Product = {
  _id: string;
  title: string;
  originalPrice: string;
};

export default function OnsaleAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [onsaleList, setOnsaleList] = useState<Onsale[]>([]);
  const [form, setForm] = useState({
    productId: '',
    discountPrice: '',
    duration: '7d',
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    discountPrice: '',
    duration: '7d',
  });

  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(setProducts);

    fetch(`${API}/api/onsale`)
      .then(res => res.json())
      .then(data => {
        const onsales = Array.isArray(data) ? data : data.onsale || [];
        setOnsaleList(onsales);

        const interval = setInterval(() => {
          const updatedCountdowns: Record<string, string> = {};

          onsales.forEach((item: { saleEnd: string | number | Date; _id: string | number; }) => {
            if (!item.saleEnd) return;

            const diff = new Date(item.saleEnd).getTime() - Date.now();
            if (diff <= 0) {
              updatedCountdowns[item._id] = 'Expired';
            } else {
              const hours = Math.floor(diff / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);
              updatedCountdowns[item._id] = `${hours}h ${minutes}m ${seconds}s`;
            }
          });

          setCountdowns(updatedCountdowns);
        }, 1000);

        return () => clearInterval(interval);
      });
  }, []);

  const handleAdd = async () => {
    if (!form.productId) return alert('Fill all fields');

    const res = await fetch(`${API}/api/onsale/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      alert(data.message || 'Failed to add');
      return;
    }

    setForm({ productId: '', discountPrice: '', duration: '7d' });
    const data = await fetch(`${API}/api/onsale/`).then(res => res.json());
    setOnsaleList(Array.isArray(data) ? data : data.onsale || []);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API}/api/onsale/delete/${id}`, { method: 'DELETE' });
    setOnsaleList(prev => prev.filter(item => item._id !== id));
  };

  const startEdit = (item: Onsale) => {
    setEditId(item._id);
    setEditForm({
      discountPrice: item.discountPrice,
      duration: '7d',
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ discountPrice: '', duration: '7d' });
  };

  const handleUpdate = async () => {
    if (!editId || !editForm.discountPrice) return;

    await fetch(`${API}/api/onsale/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });

    const updated = await fetch(`${API}/api/onsale`).then(r => r.json());
    setOnsaleList(Array.isArray(updated) ? updated : updated.onsale || []);
    cancelEdit();
  };

  const isExpired = (saleEnd?: string) => {
    return saleEnd && new Date(saleEnd).getTime() < Date.now();
  };

  return (
    <div className={styles.container}>
      <h2>🏷️ Onsale Manager</h2>

      <div className={styles.form}>
        <select
          value={form.productId}
          onChange={e => setForm({ ...form, productId: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={e => setForm({ ...form, discountPrice: e.target.value })}
        />

        <select
          value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })}
        >
          <option value="7d">7 Days</option>
          <option value="14d">14 Days</option>
          <option value="30d">30 Days</option>
          <option value="never">Never</option>
        </select>

        <button onClick={handleAdd}>➕ Add to Sale</button>
      </div>

      <h3>🔥 Currently On Sale</h3>
      <div className={styles.grid}>
        {onsaleList.map(item => (
          <div
            key={item._id}
            className={`${styles.card} ${isExpired(item.saleEnd) ? styles.expired : ''}`}
          >
            <Image
              src={
                item.images?.[0]
                  ? `${viewUrl}${item.images[0]}`
                  : '/no-image.png'
              }
              alt={item.title}
              width={300}
              height={300}
            />


            <div className={styles.details}>
              <h4>{item.title}</h4>
              <p>Name: {item.name}</p>
              <p>
                ₹<del>{item.originalPrice}</del> → <strong>₹{item.discountPrice}</strong>
              </p>
              <p>Stock: {item.inStock ? '✅ Yes' : '❌ No'}</p>
              <p>Category: {item.category?.join(', ')}</p>
              {item.saleEnd && (
                <>
                  <p>Ends: {new Date(item.saleEnd).toLocaleString()}</p>
                  <p className={styles.countdown}>
                    ⏳ Time Left: {countdowns[item._id] || 'Calculating...'}
                  </p>
                </>
              )}
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>

            <div className={styles.actions}>
              {editId === item._id ? (
                <>
                  <input
                    type="number"
                    value={editForm.discountPrice}
                    onChange={e =>
                      setEditForm({ ...editForm, discountPrice: e.target.value })
                    }
                  />
                  <select
                    value={editForm.duration}
                    onChange={e =>
                      setEditForm({ ...editForm, duration: e.target.value })
                    }
                  >
                    <option value="7d">7 Days</option>
                    <option value="14d">14 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="never">Never</option>
                  </select>
                  <button onClick={handleUpdate}>💾 Save</button>
                  <button onClick={cancelEdit}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(item)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
