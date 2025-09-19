// admin/src/app/admin/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "@/app/styles/pages/Login.module.css";

const authUrl =
  process.env.NEXT_PUBLIC_AUTH_CHECK_URL || "http://localhost:5002";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await axios.post(
        `${authUrl}/auth/users/admin/login`,
        { email, password },
        { withCredentials: true } // ✅ ensures cookie gets saved
      );
      router.push("/admin");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Access denied: Admins only");
      } else if (err.response?.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Admin Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
