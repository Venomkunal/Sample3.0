'use client';

import { useEffect, useState, DragEvent } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/pages/category.module.css';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || '';

/* ---------------- TYPES ---------------- */
type Category = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  href: string;
  pageheader: string;
};

type Subcategory = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  href: string;
  parent: string | { _id: string; title: string; slug: string };
  pageheader: string;
};

/* ---------------- IMAGE HELPERS ---------------- */
const uploadImage = async (files: File[], endpoint: string): Promise<string | null> => {
  if (files.length === 0) return null;
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  const res = await fetch(`${uploadUrl}/cuploads/create/${endpoint}`, { method: 'POST', body: formData });
  if (!res.ok) return null;
  const data = await res.json();
  return data.urls?.[0] || null;
};

const updateImage = async (endpoint: string, oldFilename: string, newFile: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', newFile);
  const res = await fetch(`${uploadUrl}/cuploads/updateimg/${endpoint}/${oldFilename}`, { method: 'PUT', body: formData });
  if (!res.ok) return null;
  const data = await res.json();
  return data.url || null;
};

const deleteImage = async (endpoint: string, filename: string): Promise<boolean> => {
  const res = await fetch(`${uploadUrl}/cuploads/deleteimg/${endpoint}/${filename}`, { method: 'DELETE' });
  return res.ok;
};

/* ---------------- COMPONENT ---------------- */
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  const [newCategory, setNewCategory] = useState<Category>({
    title: '',
    slug: '',
    description: '',
    image: '',
    href: '',
    pageheader: '',
  });

  const [newSubcategory, setNewSubcategory] = useState<Subcategory>({
    title: '',
    slug: '',
    description: '',
    image: '',
    href: '',
    parent: '',
    pageheader: '',
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  const [catImageFiles, setCatImageFiles] = useState<File[]>([]);
  const [catImagePreviews, setCatImagePreviews] = useState<string[]>([]);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${API}/api/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const fetchSubcategories = async () => {
    const res = await fetch(`${API}/api/subcategories`);
    const data = await res.json();
    setSubcategories(data);
  };

  /* ---------- SAVE CATEGORY ---------- */
  async function saveCategory() {
    let imageUrl = editingCategory?.image || newCategory.image;
    if (catImageFiles.length > 0) {
      if (editingCategory?.image) {
        const oldFilename = editingCategory.image.split('/').pop()!;
        const updated = await updateImage('category', oldFilename, catImageFiles[0]);
        if (updated) imageUrl = updated;
      } else {
        const uploaded = await uploadImage(catImageFiles, 'category');
        if (uploaded) imageUrl = uploaded;
      }
    }
    const payload = { ...(editingCategory || newCategory), image: imageUrl };
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory
      ? `${API}/api/categories/admin/update/${editingCategory._id}`
      : `${API}/api/categories/admin/add`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' });

    setCategoryModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ title: '', slug: '', description: '', image: '', href: '', pageheader: '' });
    setCatImageFiles([]);
    setCatImagePreviews([]);
    fetchCategories();
  }

  /* ---------- SAVE SUBCATEGORY ---------- */
  async function saveSubcategory() {
    let imageUrl = editingSubcategory?.image || newSubcategory.image;
    if (subImageFiles.length > 0) {
      if (editingSubcategory?.image) {
        const oldFilename = editingSubcategory.image.split('/').pop()!;
        const updated = await updateImage('subcategory', oldFilename, subImageFiles[0]);
        if (updated) imageUrl = updated;
      } else {
        const uploaded = await uploadImage(subImageFiles, 'subcategory');
        if (uploaded) imageUrl = uploaded;
      }
    }
    const payload = { ...(editingSubcategory || newSubcategory), image: imageUrl };
    const method = editingSubcategory ? 'PUT' : 'POST';
    const url = editingSubcategory
      ? `${API}/api/subcategories/admin/update/${editingSubcategory._id}`
      : `${API}/api/subcategories/admin/add`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' });

    setSubcategoryModalOpen(false);
    setEditingSubcategory(null);
    setNewSubcategory({ title: '', slug: '', image: '', href: '', description: '', parent: '' ,pageheader: ''});
    setSubImageFiles([]);
    setSubImagePreviews([]);
    fetchSubcategories();
  }

  /* ---------- DELETE ---------- */
  const deleteCategory = async (id: string) => {
    const cat = categories.find((c) => c._id === id);
    if (cat?.image) {
      await deleteImage('category', cat.image.split('/').pop()!);
    }
    await fetch(`${API}/api/categories/admin/delete/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchCategories();
  };

  const deleteSubcategory = async (id: string) => {
    const sub = subcategories.find((s) => s._id === id);
    if (sub?.image) {
      await deleteImage('subcategory', sub.image.split('/').pop()!);
    }
    await fetch(`${API}/api/subcategories/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchSubcategories();
  };

  /* ---------- IMAGE DRAG & DROP ---------- */
  const handleDrop = (e: DragEvent<HTMLDivElement>, type: 'category' | 'subcategory') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (type === 'category') {
      setCatImageFiles(files);
      setCatImagePreviews(files.map((f) => URL.createObjectURL(f)));
    } else {
      setSubImageFiles(files);
      setSubImagePreviews(files.map((f) => URL.createObjectURL(f)));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  /* ---------- RENDER ---------- */
  return (
    <div className={styles.container}>
      <h1>Admin Categories Panel</h1>

      <button onClick={() => setCategoryModalOpen(true)}>Add Category</button>
      <button onClick={() => setSubcategoryModalOpen(true)}>Add Subcategory</button>

      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            {cat.title}
            {cat.image && <Image src={`${uploadUrl}${cat.image}`} alt='' width={100} height={100} className={styles.previewImage} />}
            <button onClick={() => { setEditingCategory(cat); setCategoryModalOpen(true); }}>Edit</button>
            <button onClick={() => deleteCategory(cat._id!)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Subcategories</h2>
      <ul>
        {subcategories.map((sub) => (
          <li key={sub._id}>
            {sub.title} (
              {typeof sub.parent === 'object' ? sub.parent.title : sub.parent})
            {sub.image && <Image src={`${uploadUrl}${sub.image}`} alt ='' width={100} height={100}  className={styles.previewImage} />}
            <button onClick={() => { setEditingSubcategory(sub); setSubcategoryModalOpen(true); }}>Edit</button>
            <button onClick={() => deleteSubcategory(sub._id!)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className={styles.modal}>
          <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
          <input
            type="text"
            placeholder="Title"
            value={editingCategory ? editingCategory.title : newCategory.title}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, title: e.target.value })
                : setNewCategory({ ...newCategory, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Page Header"
            value={editingCategory ? editingCategory.pageheader : newCategory.pageheader}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, pageheader: e.target.value })
                : setNewCategory({ ...newCategory, pageheader: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={editingCategory ? editingCategory.description : newCategory.description}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, description: e.target.value })
                : setNewCategory({ ...newCategory, description: e.target.value })
            }
          />

          {/* Show slug + href only in EDIT mode */}
          {editingCategory && (
            <>
              <input
                type="text"
                placeholder="Slug"
                value={editingCategory.slug}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
              />
              <input
                type="text"
                placeholder="Href"
                value={editingCategory.href}
                onChange={(e) => setEditingCategory({ ...editingCategory, href: e.target.value })}
              />
            </>
          )}

          {/* Drag & Drop area */}
          <div className={styles.dropZone} onDrop={(e) => handleDrop(e, 'category')} onDragOver={handleDragOver}>
            Drag & Drop image here or click to select
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setCatImageFiles(Array.from(e.target.files));
                  setCatImagePreviews(Array.from(e.target.files).map((f) => URL.createObjectURL(f)));
                }
              }}
            />
          </div>

          {/* Existing backend image */}
          {editingCategory?.image && catImageFiles.length === 0 && (
            <div className={styles.previewContainer}>
              <p>Current Image:</p>
              <img src={`${uploadUrl}${editingCategory.image}`} alt="Current Category" className={styles.previewImage} />
            </div>
          )}

          {/* New preview */}
          {catImagePreviews.length > 0 && (
            <div className={styles.previewContainer}>
              <p>New Upload:</p>
              {catImagePreviews.map((src, i) => (
                <img key={i} src={src} alt={`Preview ${i}`} className={styles.previewImage} />
              ))}
            </div>
          )}

          <button onClick={saveCategory}>Save</button>
          <button
            onClick={() => {
              setCategoryModalOpen(false);
              setEditingCategory(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Subcategory Modal */}
      {subcategoryModalOpen && (
        <div className={styles.modal}>
          <h2>{editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</h2>
          <input
            type="text"
            placeholder="Title"
            value={editingSubcategory ? editingSubcategory.title : newSubcategory.title}
            onChange={(e) =>
              editingSubcategory
                ? setEditingSubcategory({ ...editingSubcategory, title: e.target.value })
                : setNewSubcategory({ ...newSubcategory, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="page Header"
            value={editingSubcategory ? editingSubcategory.pageheader : newSubcategory.pageheader}
            onChange={(e) =>
              editingSubcategory
                ? setEditingSubcategory({ ...editingSubcategory, pageheader: e.target.value })
                : setNewSubcategory({ ...newSubcategory, pageheader: e.target.value })
            }
          />  
          <textarea
            placeholder="Description"
            value={editingSubcategory ? editingSubcategory.description : newSubcategory.description}
            onChange={(e) =>
              editingSubcategory
                ? setEditingSubcategory({ ...editingSubcategory, description: e.target.value })
                : setNewSubcategory({ ...newSubcategory, description: e.target.value })
            }
          />
          <select
            value={
              editingSubcategory
                ? (typeof editingSubcategory.parent === 'string'
                  ? editingSubcategory.parent
                  : editingSubcategory.parent?._id || '')
                : typeof newSubcategory.parent === 'string'
                  ? newSubcategory.parent
                  : newSubcategory.parent?._id || ''
            }
            onChange={(e) =>
              editingSubcategory
                ? setEditingSubcategory({ ...editingSubcategory, parent: e.target.value })
                : setNewSubcategory({ ...newSubcategory, parent: e.target.value })
            }
          >
            <option value="">Select Parent</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>

          {/* Show slug + href only in EDIT mode */}
          {editingSubcategory && (
            <>
              <input
                type="text"
                placeholder="Slug"
                value={editingSubcategory.slug}
                onChange={(e) => setEditingSubcategory({ ...editingSubcategory, slug: e.target.value })}
              />
              <input
                type="text"
                placeholder="Href"
                value={editingSubcategory.href}
                onChange={(e) => setEditingSubcategory({ ...editingSubcategory, href: e.target.value })}
              />
            </>
          )}

          {/* Drag & Drop area */}
          <div className={styles.dropZone} onDrop={(e) => handleDrop(e, 'subcategory')} onDragOver={handleDragOver}>
            Drag & Drop image here or click to select
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setSubImageFiles(Array.from(e.target.files));
                  setSubImagePreviews(Array.from(e.target.files).map((f) => URL.createObjectURL(f)));
                }
              }}
            />
          </div>

          {editingSubcategory?.image && subImageFiles.length === 0 && (
            <div className={styles.previewContainer}>
              <p>Current Image:</p>
              <img src={`${uploadUrl}${editingSubcategory.image}`} alt="Current Subcategory" className={styles.previewImage} />
            </div>
          )}

          {subImagePreviews.length > 0 && (
            <div className={styles.previewContainer}>
              <p>New Upload:</p>
              {subImagePreviews.map((src, i) => (
                <Image key={i} src={src} alt={`Preview ${i}`} className={styles.previewImage} />
              ))}
            </div>
          )}

          <button onClick={saveSubcategory}>Save</button>
          <button
            onClick={() => {
              setSubcategoryModalOpen(false);
              setEditingSubcategory(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
