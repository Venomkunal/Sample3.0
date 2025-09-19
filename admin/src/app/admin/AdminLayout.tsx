'use client';
import Link from 'next/link';
import styles from './Admin.module.css';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/admin/logout`, {
        method: 'POST',
        credentials: 'include', // Important to send cookies
      });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Admin</h2>
        <ul>
          <li><Link href="/admin">Dashboard</Link></li>
          <li><Link href="/admin/banner">Banner</Link></li>
          <li><Link href="/admin/onsale">Onsale</Link></li>
          <li><Link href="/admin/users">Users</Link></li>
          <li><Link href="/admin/category">Categories</Link></li>
          <li><Link href="/admin/subcategory">SubCategories</Link></li>
          <li><Link href="/admin/products">Products</Link></li>
          <li><Link href="/admin/settings">Settings</Link></li>
          <li><button onClick={logout}>Logout</button></li>
        </ul>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

