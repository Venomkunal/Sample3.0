'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/component/page/ToastContext';

const authUrl = process.env.NEXT_AUTH_CHECK_URL|| "http://localhost:5002";

export function useAuthGuard() {
  const router = useRouter();
  const { showToast } = useToast();
  const toastShownRef = useRef(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${authUrl}/users/me`, {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          if (!toastShownRef.current) {
            showToast('Please login to continue.', 'error');
            toastShownRef.current = true;
          }
          router.push('/login');
        }
      } catch (err) {
        let message = 'An error occurred while checking authentication. Please try again. ';
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string' && (err as { message: string }).message.includes('401')) {
          message = 'You are not authenticated. Please login to continue. ';
        }
        if (!toastShownRef.current) {
          showToast(message, 'error');
          toastShownRef.current = true;
        }
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      toastShownRef.current = false;
    };
  }, [router, showToast]);

  return { isAuthenticated, loading };
}
