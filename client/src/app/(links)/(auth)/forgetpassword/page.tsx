'use client';

import { useState } from 'react';
import styles from '@/app/styles/pages/ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending password reset to:', email);
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Enter your email address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
      ) : (
        <p className={styles.success}>✅ A reset link has been sent to your email.</p>
      )}
    </div>
  );
}
