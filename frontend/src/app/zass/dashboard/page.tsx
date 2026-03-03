'use client';

/**
 * ZASS Dashboard - Executive Kaunter / Branch Officers
 * Modul 2: Pemprosesan pembayaran kaunter (Tunai, FPX, Cek, Kad)
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrendingUp, Receipt, CreditCard, DollarSign, ArrowRight, Calendar } from 'lucide-react';

export default function ZassDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'zass') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'zass') return null;

  const stats = {
    today_collection: 12500.00,
    today_transactions: 45,
    cash_count: 8,
    fpx_count: 32,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard ZASS</h1>
            <p className="text-muted-foreground">
              Kutipan kaunter - Tunai, FPX, Cek, Kad Kredit/Debit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Kutipan Hari Ini</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.today_collection.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Transaksi hari ini</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Bilangan Transaksi</CardDescription>
                <CardTitle className="text-2xl">{stats.today_transactions}</CardTitle>
              </CardHeader>
              <CardContent>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tunai</CardDescription>
                <CardTitle className="text-2xl">{stats.cash_count}</CardTitle>
              </CardHeader>
              <CardContent>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>FPX / Kad</CardDescription>
                <CardTitle className="text-2xl">{stats.fpx_count}</CardTitle>
              </CardHeader>
              <CardContent>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Urus kutipan kaunter</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/zass/kaunter">
                <Button size="lg">
                  <Receipt className="mr-2 h-5 w-5" />
                  Mula Kutipan Kaunter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
