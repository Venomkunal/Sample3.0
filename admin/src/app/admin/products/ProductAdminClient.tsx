"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/app/admin/components/modal';
import styles from '@/app/styles/pages/ProductAdmin.module.css';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || '';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

type Product = {
  _id?: string;
  title: string;
  name: string;
  discountPrice?: string;
  originalPrice: string;
  rating?: number;
  reviews?: number;
  category: string[];
  onsale?: boolean;
  images?: string[];
  highlights?: string[];
  delivery?: string[];
  seller?: string[];
  description: string;
  inStock?: boolean;
};

type Mode = 'create' | 'addImages' | 'edit';

export default function ProductAdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ url: string; file: File | null }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<Mode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Product>({
    title: '',
    name: '',
    discountPrice: '',
    originalPrice: '',
    rating: 0,
    reviews: 0,
    category: [],
    onsale: false,
    images: [],
    highlights: [],
    delivery: [],
    seller: [],
    description: '',
    inStock: true,
  });

  // Load products
  useEffect(() => {
    fetch(`${baseUrl}/api/products`)
      .then((res) => res.json())
      .then(setProducts)
      .catch((e) => console.error('Fetch products failed', e));
  }, []);

  // ----- Form handlers -----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setNewProduct((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setNewProduct((prev) => ({ ...prev, [name]: Number(value) as unknown as string }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const newPreviews = fileList.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImageFiles((prev) => [...prev, ...fileList]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const removed = imagePreviews[index];
    // track removed existing images (only when editing and it's an existing URL from server)
    if (!removed.file && removed.url.startsWith(API)) {
      const relativePath = removed.url.replace(API ?? '', '');
      setRemovedImages((prev) => [...prev, relativePath]);
    }
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
    // also remove corresponding file if it exists
    if (removed.file) {
      setImageFiles((prev) => prev.filter((f) => f !== removed.file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  // ----- Upload helpers -----
  const uploadImages = async (productId: string): Promise<string[]> => {
    const newFiles = imagePreviews.filter((img) => img.file);
    if (newFiles.length === 0) return [];

    const formData = new FormData();
    newFiles.forEach((img) => formData.append('images', img.file!));

    const res = await fetch(`${API}/uploads/${productId}/images`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.urls || [];
  };

  const resetForm = () => {
    setNewProduct({
      title: '',
      name: '',
      discountPrice: '',
      originalPrice: '',
      rating: 0,
      reviews: 0,
      category: [],
      onsale: false,
      images: [],
      highlights: [],
      delivery: [],
      seller: [],
      description: '',
      inStock: true,
    });
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
    setMode('create');
    setEditingId(null);
    setIsModalOpen(false);
  };

  // ----- Create → then Add Images flow -----
  const createProduct = async () => {
    // 1) Create product without images
    const productToCreate = { ...newProduct, images: [] };

    const res = await fetch(`${baseUrl}/api/products/admin/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(productToCreate),
    });

    if (!res.ok) {
      alert('Failed to create product');
      return;
    }

    const created = await res.json();
    alert('Product created! Now add images.');

    // Add to list
    setProducts((prev) => [created, ...prev]);

    // 2) Switch modal into Add Images mode for that product
    setEditingId(created._id);
    setMode('addImages');
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedImages([]);
    setIsModalOpen(true);

    // Clear text fields for next create
    setNewProduct({
      title: '',
      name: '',
      discountPrice: '',
      originalPrice: '',
      rating: 0,
      reviews: 0,
      category: [],
      onsale: false,
      images: [],
      highlights: [],
      delivery: [],
      seller: [],
      description: '',
      inStock: true,
    });
  };

  const addImagesToProduct = async () => {
    if (!editingId) return;
    const uploadedImageUrls = await uploadImages(editingId);

    const res = await fetch(`${baseUrl}/api/products/admin/update/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ images: uploadedImageUrls }),
    });

    if (!res.ok) {
      alert('Failed to add images');
      return;
    }

    const updated = await res.json();
    alert('Images added!');

    setProducts((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
    resetForm();
  };

  // ----- Edit flow -----
  const startEditProduct = (product: Product) => {
    setNewProduct(product);
    setEditingId(product._id || null);
    setMode('edit');
    setIsModalOpen(true);

    const previews = (product.images || []).map((url) => ({
      url: url.startsWith('http') ? url : `${API}${url}`,
      file: null,
    }));
    setImagePreviews(previews);
    setImageFiles([]);
    setRemovedImages([]);
  };

const updateProduct = async () => {
  if (!editingId) return;

  // Upload any newly added files
  const uploadedImageUrls = await uploadImages(editingId);

  // Keep already-existing images still shown in the previews
  const existingImageUrls = imagePreviews
    .filter((img) => img.file === null)
    .map((img) => {
      try {
        const url = new URL(img.url);
        return url.pathname; // strip host to keep as relative
      } catch {
        return img.url.startsWith('/') ? img.url : `/${img.url}`;
      }
    });

  const updatedImages = [...existingImageUrls, ...uploadedImageUrls];

  // ----- detect changes -----
  const oldProduct = products.find((p) => p._id === editingId);
  const oldImages = oldProduct?.images || [];

  const hasImageChanges =
    removedImages.length > 0 ||
    JSON.stringify(updatedImages) !== JSON.stringify(oldImages);

  const hasTitleOrCategoryChange =
    newProduct.title !== oldProduct?.title ||
    newProduct.category.join(',') !== (oldProduct?.category || []).join(',');

  // ----- conditionally call APIs -----
  if (hasImageChanges || hasTitleOrCategoryChange) {
    // ✅ Call uploads API and exit — don’t call products API
    const uploadsRes = await fetch(`${API}/uploads/edit/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        removedImages,
        images: updatedImages,
        title: newProduct.title,
        category: newProduct.category,
      }),
    });

    if (!uploadsRes.ok) {
      alert('Failed to update images/folders');
      return;
    }

    const updated = await uploadsRes.json();
    alert('Product updated via uploads API!');
    setProducts((prev) =>
      prev.map((p) => (p._id === editingId ? updated : p))
    );
    resetForm();
    return; // 🚀 prevent falling into DB update
  }

  // ✅ If no image/title/category changes → only call DB update
  const res = await fetch(
    `${baseUrl}/api/products/admin/update/${editingId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...newProduct, images: updatedImages }),
    }
  );

  if (!res.ok) {
    alert('Failed to update product');
    return;
  }

  const updated = await res.json();
  alert('Product updated!');
  setProducts((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
  resetForm();
};



  // ----- Delete -----
  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      // 1) Delete images from disk
      const delUploads = await fetch(`${API}/uploads/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!delUploads.ok) {
        alert('Failed to delete product images');
        return;
      }

      // 2) Delete product document
      const res = await fetch(`${baseUrl}/api/products/admin/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        alert('Product images deleted but failed to delete product');
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🛍️ Product Admin Panel</h2>

      <button
        className={styles.floatingAddButton}
        onClick={() => {
          setMode('create');
          setIsModalOpen(true);
        }}
      >
        + Add Product
      </button>

      <Modal isOpen={isModalOpen} onClose={resetForm}>
        <h3>
          {mode === 'edit' ? 'Edit Product' : mode === 'addImages' ? 'Add Images to Product' : 'Create New Product'}
        </h3>

        {/* --- Text fields only in CREATE or EDIT --- */}
        {mode !== 'addImages' && (
          <>
            <input
              className={styles.input}
              name="title"
              placeholder="Title"
              value={newProduct.title}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="name"
              placeholder="Name"
              value={newProduct.name}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="discountPrice"
              placeholder="Discount Price"
              value={newProduct.discountPrice}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="originalPrice"
              placeholder="Original Price"
              value={newProduct.originalPrice}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="rating"
              type="number"
              placeholder="Rating"
              value={newProduct.rating}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="reviews"
              type="number"
              placeholder="Reviews"
              value={newProduct.reviews}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="category"
              placeholder="Categories (comma separated)"
              value={newProduct.category.join(',')}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value.split(',').map((s) => s.trim()) })}
            />
            <label className={styles.label}>
              <input name="inStock" type="checkbox" checked={newProduct.inStock} onChange={handleChange} /> In Stock
            </label>
            <textarea
              className={styles.textarea}
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              name="highlights"
              placeholder="Highlights (comma separated)"
              onChange={(e) => setNewProduct({ ...newProduct, highlights: e.target.value.split(',').map((s) => s.trim()) })}
            />
            <input
              className={styles.input}
              name="delivery"
              placeholder="Delivery options (comma separated)"
              onChange={(e) => setNewProduct({ ...newProduct, delivery: e.target.value.split(',').map((s) => s.trim()) })}
            />
            <input
              className={styles.input}
              name="seller"
              placeholder="Sellers (comma separated)"
              onChange={(e) => setNewProduct({ ...newProduct, seller: e.target.value.split(',').map((s) => s.trim()) })}
            />
          </>
        )}

        {/* --- Image drop zone shown in ADD IMAGES and EDIT --- */}
        {mode !== 'create' && (
          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragOver : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <p>Drag & drop images here or click to select</p>
            <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e.target.files || [])} />
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className={styles.previewGrid}>
            {imagePreviews.map((img, idx) => (
              <div key={idx} className={styles.previewItem}>
                <Image src={img.url} alt={`preview-${idx}`} width={100} height={100} unoptimized />
                <button type="button" className={styles.removeBtn} onClick={() => removeImage(idx)}>
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.modalActions}>
          {mode === 'edit' ? (
            <>
              <button className={styles.addButton} onClick={updateProduct}>
                ✅ Update Product
              </button>
              <button className={styles.cancelButton} onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : mode === 'addImages' ? (
            <>
              <button className={styles.addButton} onClick={addImagesToProduct}>
                + Add Images
              </button>
              <button className={styles.cancelButton} onClick={resetForm}>
                Done
              </button>
            </>
          ) : (
            <>
              <button className={styles.addButton} onClick={createProduct}>
                + Create Product
              </button>
              <button className={styles.cancelButton} onClick={resetForm}>
                Cancel
              </button>
            </>
          )}
        </div>
      </Modal>

      <div className={styles.grid}>
        {products.map((p) => (
          <div key={p._id} className={styles.card}>
            {/* Show first image if available */}
            {p.images && p.images.length > 0 ? (
              <>
              <Link href={`$`}></Link>
              <Image
                src={p.images[0].startsWith('http') ? p.images[0] : `${API}${p.images[0]}`}
                alt={p.name}
                width={120}
                height={120}
                unoptimized
              />
              </>
            ) : (
              <div className={styles.previewItem}>No Image</div>
            )}
            <h4>{p.title}</h4>
            <p>₹{p.originalPrice}</p>
            <p>{(p.category || []).join(', ')}</p>
            <div className={styles.cardActions}>
              <button onClick={() => startEditProduct(p)}>✏️ Edit</button>
              <button onClick={() => deleteProduct(p._id!)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
