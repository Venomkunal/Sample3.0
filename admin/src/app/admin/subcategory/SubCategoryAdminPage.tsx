// admin\src\app\admin\subcategory\SubCategoryAdminPage.tsx
'use client';

import { useEffect, useState } from 'react';
import SubcategoryForm from './SubcategoryForm';
import SubcategoryCard from './SubcategoryCard';
import styles from '@/app/styles/pages/subcategory.module.css';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Move this type to a shared file, e.g., SubcategoryTypes.ts, and import it in both files.
// For now, update the type so 'key' is always a string.
type Subcategory = {
  _id?: string;
  key: string;
  title: string;
  slug: string;
  image: string;
  href: string;
  parent: string | { _id: string; title: string; slug: string }; // ✅ flexible
};

export default function SubcategoryAdminPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [editing, setEditing] = useState<Subcategory | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/subcategories`);
      if (!res.ok) throw new Error('Failed to fetch subcategories');
      const data = await res.json();
      setSubcategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${API}/api/subcategories/admin/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchData();
  };

  return (
    <div className={styles.container}>
      <h1>Manage Subcategories</h1>
      <SubcategoryForm refresh={fetchData} editing={editing} setEditing={setEditing} />

      <div className={styles.grid}>
        {subcategories.map((sub) => (
          <SubcategoryCard
            key={sub._id}
            subcategory={sub}
            onEdit={() => setEditing(sub)}
            onDelete={() => handleDelete(sub._id!)}
          />
        ))}
      </div>
    </div>
  );
}
