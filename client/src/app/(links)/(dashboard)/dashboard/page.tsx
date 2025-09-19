'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/pages/Dashboard.module.css';
import { useToast } from '@/app/component/page/ToastContext';

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:5002/users/me', {
          credentials: 'include', // Include cookies
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        console.log('📦 User data:', data);
        setUser(data);
      } catch (err) {
        console.error('Auth error:', err);
        showToast('Please login again', 'error');
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router, showToast]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5002/logout', {
        method: 'POST',
        credentials: 'include', // Send cookie
      });

      if (!res.ok) throw new Error('Logout failed');

      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Logout failed', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome, {user?.name || 'Customer'} 👋</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className={styles.section}>
        <h2>Your Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className={styles.section}>
        <h2>Recent Orders</h2>
        <p>No orders yet.</p>
      </div>
    </div>
  );
}

