'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/pages/UsersAdminPage.module.css';

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'vendor' | 'customer';
};

const ROLES: User['role'][] = ['admin', 'manager', 'vendor', 'customer'];
const API = process.env.NEXT_PUBLIC_AUTH_CHECK_URL|| '';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${API}/users/admin/`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data: User[]) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API}/users/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete user');
    }
  };

  const handleChangeRole = async (id: string, newRole: User['role']) => {
    try {
      const res = await fetch(`${API}/users/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update user role');
      const updated = await res.json();
      setUsers(prev =>
        prev.map(user => (user._id === id ? { ...user, role: updated.role } : user))
      );
      setEditingId(null);
    } catch (err) {
      console.error('Role update error:', err);
      alert('Failed to update user role');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧑‍💼 Admin User Manager</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                {editingId === user._id ? (
                  <select
                    value={user.role}
                    onChange={e =>
                      handleChangeRole(user._id, e.target.value as User['role'])
                    }
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className={styles.actions}>
                {editingId === user._id ? (
                  <button
                    className={styles.button}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className={styles.button}
                    onClick={() => setEditingId(user._id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={styles.button}
                  onClick={() => setViewingUser(user)}
                >
                  View Profile
                </button>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewingUser && (
        <div className={styles.modal}>
          <div className={styles.card}>
            <button
              className={styles.closeBtn}
              onClick={() => setViewingUser(null)}
            >
              ✖
            </button>
            <Image
              src="/images/me.jpg"
              alt="Profile"
              className={styles.profileImg}
              width={200}
              height={200}
            />
            <h3>{viewingUser.name}</h3>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Phone:</strong> {viewingUser.phone}</p>
            <p><strong>Role:</strong> {viewingUser.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}
