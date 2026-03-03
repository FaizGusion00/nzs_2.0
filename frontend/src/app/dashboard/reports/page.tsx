'use client';

/**
 * Self-Service Reports (Payer) - Modul 6
 * Predefined report templates: My payments by year, etc.
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileText, Download, Calendar } from 'lucide-react';

export default function DashboardReportsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'payer_individual' && user.role !== 'payer_company') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'payer_individual' && user.role !== 'payer_company')) return null;

  // Mock data
  const mockPaymentsByYear = [
    { year: '2024', total: 3750, count: 3 },
    { year: '2023', total: 2500, count: 2 },
    { year: '2022', total: 1250, count: 1 },
  ];

  const handleExport = (type: string) => {
    alert(`Demo: Muat turun laporan "${type}"`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Laporan Saya</h1>
            <p className="text-muted-foreground">
              Self-service: Pilih template laporan dan muat turun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Bayaran Mengikut Tahun
                </CardTitle>
                <CardDescription>
                  Ringkasan jumlah bayaran zakat mengikut tahun
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {mockPaymentsByYear.map((r) => (
                    <div key={r.year} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{r.year}</span>
                      <span>RM {r.total.toLocaleString()} ({r.count} transaksi)</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" onClick={() => handleExport('Bayaran mengikut tahun')}>
                  <Download className="h-4 w-4 mr-2" />
                  Muat Turun
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Ringkasan Bulanan
                </CardTitle>
                <CardDescription>
                  Jumlah bayaran mengikut bulan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Pilih Tahun</Label>
                  <Select defaultValue="2024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={() => handleExport('Ringkasan bulanan')}>
                  <Download className="h-4 w-4 mr-2" />
                  Muat Turun
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
