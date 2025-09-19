'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import '@/app/styles/pages/signup.css';
import { useToast } from '@/app/component/page/ToastContext';

const authUrl = process.env.NEXT_PUBLIC_AUTH_CHECK_URL

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
   const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${authUrl}/auth/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    // console.log('📦 Response from backend:', data); // Add this line for debugging

    if (!res.ok) {
      setError(data.message || 'Signup failed'); // Show backend error
      return;
    }

    localStorage.setItem('token', data.token);

    showToast('Signup successful! Please login.', 'success');
    router.push('/login');
  } catch (err) {
    setError('Something went wrong. Please try again.');
    console.error('❌ Error submitting signup:', err);
  }
};


  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
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
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {/* 📞 Phone input with country code */}
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="login-redirect">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
