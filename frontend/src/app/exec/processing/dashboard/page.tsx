'use client';

/**
 * Executive Processing Dashboard
 * Modul 2: Bulk SPG, pemadanan data, validasi pihak ketiga
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileText, Upload, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ExecProcessingDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'exec_processing') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'exec_processing') return null;

  const stats = {
    bulk_processed: 12500,
    pending_files: 3,
    matched_today: 1100,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Processing</h1>
            <p className="text-muted-foreground">
              Pemprosesan fail pukal SPG, pemadanan data Bank/AG
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Transaksi Bulk Diproses</CardDescription>
                <CardTitle className="text-2xl">{stats.bulk_processed.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Fail Menunggu</CardDescription>
                <CardTitle className="text-2xl">{stats.pending_files}</CardTitle>
              </CardHeader>
              <CardContent>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pemadanan Hari Ini</CardDescription>
                <CardTitle className="text-2xl">{stats.matched_today.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/exec/processing/bulk')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-6 w-6 mr-2" />
                  Bulk SPG
                </CardTitle>
                <CardDescription>Muat naik fail .txt (min 1,000 transaksi)</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Muat Naik Fail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/exec/processing/recurring')}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  Kutipan Berjadual
                </CardTitle>
                <CardDescription>Automasi recurring payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Urus Berjadual
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
