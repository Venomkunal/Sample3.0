'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/app/styles/pages/page.module.css';

export default function ChooseUserTypePage() {
  const [userType, setUserType] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setUserType(selected);

    if (selected === 'admin') {
      router.push('/admin/login');
    } else if (selected === 'user') {
      router.push('/user');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Select User Type</h1>
        <select value={userType} onChange={handleChange} className={styles.select}>
          <option value="">-- Select --</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    </div>
  );
}

