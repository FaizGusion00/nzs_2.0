'use client';

/**
 * Executive Finance Dashboard
 * Modul 5: Penyesuaian penyata bank, isu kewangan
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Banknote, FileCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function ExecFinanceDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'exec_finance') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'exec_finance') return null;

  const stats = {
    reconciled_today: 450,
    unmatched: 12,
    pending_remedies: 3,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Finance</h1>
            <p className="text-muted-foreground">
              Penyesuaian penyata bank, batal & pelarasan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Dipadankan Hari Ini</CardDescription>
                <CardTitle className="text-2xl">{stats.reconciled_today}</CardTitle>
              </CardHeader>
              <CardContent>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Belum Dipadankan</CardDescription>
                <CardTitle className="text-2xl">{stats.unmatched}</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pelarasan Menunggu</CardDescription>
                <CardTitle className="text-2xl">{stats.pending_remedies}</CardTitle>
              </CardHeader>
              <CardContent>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/exec/finance/reconciliation')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-6 w-6 mr-2" />
                  Penyesuaian Bank
                </CardTitle>
                <CardDescription>Padanan automatik resit dengan penyata bank</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Urus Penyesuaian
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/exec/finance/remedies')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Banknote className="h-6 w-6 mr-2" />
                  Pelarasan
                </CardTitle>
                <CardDescription>Penggantian, pembatalan, refund</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Urus Pelarasan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
