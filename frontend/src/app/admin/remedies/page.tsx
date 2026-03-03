'use client';

/**
 * Admin Remedies - Redirect to shared remedies page
 * Modul 4: Batal & Pelarasan (admin, exec_finance)
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRemediesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
    } else if (isAuthenticated && user && (user.role === 'admin' || user.role === 'super_admin')) {
      router.replace('/exec/finance/remedies');
    }
  }, [isAuthenticated, user, router]);

  return null;
}
