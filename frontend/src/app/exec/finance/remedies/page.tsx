'use client';

/**
 * Pelarasan - Modul 4
 * Penggantian, Pembatalan, Refund
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileEdit, XCircle, RotateCcw } from 'lucide-react';

export default function ExecFinanceRemediesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && (user.role !== 'exec_finance' && user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const canAccess = user?.role === 'exec_finance' || user?.role === 'admin' || user?.role === 'super_admin';
  if (!isAuthenticated || !user || !canAccess) return null;

  const handleReplace = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSuccess('Penggantian resit berjaya.');
  };
  const handleCancel = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSuccess('Transaksi telah dibatalkan.');
  };
  const handleRefund = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSuccess('Permohonan refund telah dihantar.');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Pelarasan</h1>
            <p className="text-muted-foreground">Penggantian, pembatalan, refund</p>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg text-green-800 dark:text-green-200">
              {success}
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => setSuccess(null)}>Tutup</Button>
            </div>
          )}

          <Tabs defaultValue="replace">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="replace">Penggantian</TabsTrigger>
              <TabsTrigger value="cancel">Pembatalan</TabsTrigger>
              <TabsTrigger value="refund">Refund</TabsTrigger>
            </TabsList>
            <TabsContent value="replace" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileEdit className="h-5 w-5 mr-2" />
                    Penggantian Resit
                  </CardTitle>
                  <CardDescription>Kemas kini resit yang salah lapor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>No. Rujukan</Label>
                    <Input placeholder="LZS-2025-001234" />
                  </div>
                  <div>
                    <Label>Maklumat Baru</Label>
                    <Input placeholder="Keterangan penggantian" />
                  </div>
                  <Button onClick={handleReplace}>Proses Penggantian</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cancel" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Pembatalan Transaksi
                  </CardTitle>
                  <CardDescription>Batal transaksi tidak sah</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>No. Rujukan</Label>
                    <Input placeholder="LZS-2025-001234" />
                  </div>
                  <div>
                    <Label>Sebab Pembatalan</Label>
                    <Input placeholder="Sebab pembatalan" />
                  </div>
                  <Button variant="destructive" onClick={handleCancel}>Batalkan Transaksi</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="refund" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Permohonan Refund
                  </CardTitle>
                  <CardDescription>Pulangan balik zakat (contoh: terlebih bayar)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>No. Rujukan</Label>
                    <Input placeholder="LZS-2025-001234" />
                  </div>
                  <div>
                    <Label>Jumlah Refund (RM)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label>Alasan</Label>
                    <Input placeholder="Terlebih bayar / lain-lain" />
                  </div>
                  <Button onClick={handleRefund}>Hantar Permohonan</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
