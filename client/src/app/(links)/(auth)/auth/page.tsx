'use client';

import { useState } from 'react';
import '@/app/styles/pages/auth.css';
import PhoneInput from 'react-phone-input-2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/component/page/ToastContext'; // optional if you use to

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const router = useRouter();
  const { showToast } = useToast(); // Optional

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || 'Login failed', 'error');
        return;
      }

      showToast('Login successful!', 'success');
      router.push('/');
    } catch (error) {
      let errorMessage = 'Something went wrong during login';
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Please check your internet connection.';
      }
      showToast(errorMessage, 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || 'Signup failed', 'error');
        return;
      }

      showToast('Signup successful! You can login now.', 'success');
      setMode('login');
    } catch (error) {
      let errorMessage = 'Something went wrong during signup';
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Please check your internet connection.';
        alert(errorMessage)
        }
      showToast('Something went wrong during signup', `error`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-logo">
        <Image
          src="/images/logo.png"
          alt="Logo"
          className="auth-logo"
          width={200}
          height={210}
        />
      </div>

      <div className="auth-tabs">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>

      {mode === 'login' ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <PhoneInput
            country={'in'}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: false,
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}
