'use client';

import { useState, useEffect, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import styles from '@/app/styles/components/SubcategoryForm.module.css';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// ✅ Category type
type Category = {
  _id: string;
  title: string;
  slug: string;
};

// ✅ Subcategory type
type Subcategory = {
  _id?: string;
  key: string;
  title: string;
  slug: string;
  image: string;
  href: string;
  parent: string | { _id: string; title: string; slug: string };
};

// ✅ Props type
type Props = {
  refresh: () => void;
  editing: Subcategory | null;
  setEditing: (subcat: Subcategory | null) => void;
};

export default function SubcategoryForm({ refresh, editing, setEditing }: Props) {
  const [form, setForm] = useState<Subcategory>({
    title: '',
    key: '',
    slug: '',
    image: '',
    href: '',
    parent: '',
  });

  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Load categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ If editing, fill form
  useEffect(() => {
    if (editing) {
      setForm(editing);
      setPreview(`${API}${editing.image}`);
    }
  }, [editing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API}/api/upload/subcategory`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.imageUrl }));
    setPreview(`${API}${data.imageUrl}`);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API}/api/subcategories/admin/update/${editing._id}`
      : `${API}/api/subcategories/admin/add`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: '', slug: '', image: '', href: '', parent: '', key: '' });
      setPreview('');
      setEditing(null);
      refresh();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit' : 'Add'} Subcategory</h2>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
      <input name="href" placeholder="Href" value={form.href} onChange={handleChange} />

      {/* ✅ Parent category dropdown */}
      <select
        name="parent"
        value={typeof form.parent === 'string' ? form.parent : form.parent?._id}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Parent Category --</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.title}
          </option>
        ))}
      </select>

      {/* ✅ Image uploader */}
      <div
        className={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt="Preview" width={120} height={120} />
        ) : (
          <p>Click or drag image here</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          hidden
        />
      </div>

      <button type="submit">{editing ? 'Update' : 'Add'} Subcategory</button>
      {editing && (
        <button type="button" onClick={() => setEditing(null)}>
          Cancel
        </button>
      )}
    </form>
  );
}
