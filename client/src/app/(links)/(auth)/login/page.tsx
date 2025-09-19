'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie'; // 👈 import js-cookie
import { useAuth } from '@/app/component/page/AuthContext'; 
import '@/app/styles/pages/login.css';
import { useToast } from '@/app/component/page/ToastContext';

const authUrl = process.env.NEXT_PUBLIC_AUTH_CHECK_URL|| "";
console.log('NEXT_PUBLIC_AUTH_CHECK_URL:', process.env.NEXT_PUBLIC_AUTH_CHECK_URL);


export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth(); // Still using this, but we'll just call it for context updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${authUrl}/auth/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailOrPhone, password }),
        credentials: 'include' // Send cookies if backend uses them
      });

      const data = await res.json();
      console.log('📦 Response from backend:', data);

      if (!res.ok) {
        showToast(data.message || 'Login failed', 'error');
        return;
      }

      // ✅ Set token in browser cookies
      Cookies.set('CustomerToken', data.token, {
        expires: 7,         // valid for 7 days
        secure: true,       // only sent over HTTPS (use false for localhost if needed)
        sameSite: 'Strict', // CSRF protection
      });

      // Optional: update global auth context (without storing token again)
      login(data.token);

      showToast('Login successful!', 'success');
      router.push('/');
    } catch (error) {
      console.error('❌ Login Error:', error);
      showToast('Something went wrong. Try again later.', 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Image src="/images/logo.png" alt="Logo" className="login-logo" width={100} height={110} />
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email / Phone Number"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">
          Don’t have an account? <Link href="/signup">Sign up</Link><br />
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

