'use client';

/**
 * Bulk SPG - Pemprosesan fail pukal
 * Modul 2: Min 1,000 transaksi per fail .txt (encrypted)
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExecProcessingBulkPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; total: number; matched: number; duplicates: number } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'exec_processing') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setResult({
      success: true,
      total: 1250,
      matched: 1200,
      duplicates: 5,
    });
    setProcessing(false);
  };

  const previewRows = Array.from({ length: 20 }).map((_, idx) => ({
    no: idx + 1,
    nricSsm: idx % 3 === 0 ? `9001010112${(idx + 10).toString().padStart(2, '0')}` : `123456${(idx + 100).toString().padStart(3, '0')}-X`,
    name: idx % 2 === 0 ? `Pekerja Demo ${idx + 1}` : `Syarikat Demo ${idx + 1}`,
    amount: (Math.floor(Math.random() * 300) + 50).toFixed(2),
    status: idx % 4 === 0 ? 'Perlu Semakan' : 'Padanan Awal',
  }));

  const duplicateRows = [
    { ref: 'LZS-2025-001901', date: '20 Jan 2025', amount: 125.0, reason: 'Jumlah sama, IC sama, tarikh sama' },
    { ref: 'LZS-2025-001944', date: '20 Jan 2025', amount: 200.0, reason: 'Rujukan bank berulang' },
    { ref: 'LZS-2025-001982', date: '19 Jan 2025', amount: 90.0, reason: 'Fail batch ulang hantar' },
    { ref: 'LZS-2025-002014', date: '19 Jan 2025', amount: 60.0, reason: 'No. dokumen pendua' },
    { ref: 'LZS-2025-002031', date: '18 Jan 2025', amount: 300.0, reason: 'Transaksi duplicate callback' },
  ];

  if (!isAuthenticated || !user || user.role !== 'exec_processing') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bulk SPG</CardTitle>
              <CardDescription>
                Muat naik fail .txt (encrypted). Minimum 1,000 transaksi per fail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Klik untuk pilih fail .txt'}
                  </p>
                </label>
              </div>

              {result && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 font-medium mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Pemprosesan Berjaya
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>Jumlah rekod: {result.total.toLocaleString()}</li>
                    <li>Berjaya dipadankan: {result.matched.toLocaleString()}</li>
                    <li>Pendua dikesan: {result.duplicates}</li>
                  </ul>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setFile(null); }}>
                    Muat Naik Fail Baru
                  </Button>
                </div>
              )}

              <Button onClick={handleUpload} disabled={!file || processing} className="w-full">
                {processing ? 'Memproses...' : 'Proses Fail'}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preview Rekod Sebelum Proses</CardTitle>
              <CardDescription>Contoh data batch untuk semakan awal padanan profil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">No</th>
                      <th className="text-left py-2">IC / SSM</th>
                      <th className="text-left py-2">Nama</th>
                      <th className="text-right py-2">Jumlah (RM)</th>
                      <th className="text-left py-2">Status Padanan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row.no} className="border-b">
                        <td className="py-2">{row.no}</td>
                        <td className="py-2">{row.nricSsm}</td>
                        <td className="py-2">{row.name}</td>
                        <td className="py-2 text-right">{row.amount}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-1 rounded ${row.status === 'Perlu Semakan' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Semakan Pendua (Duplicate Checking)</CardTitle>
                <CardDescription>Transaksi yang dikesan berulang pada tarikh sama</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">No. Rujukan</th>
                        <th className="text-left py-2">Tarikh</th>
                        <th className="text-right py-2">Jumlah (RM)</th>
                        <th className="text-left py-2">Sebab</th>
                      </tr>
                    </thead>
                    <tbody>
                      {duplicateRows.map((d) => (
                        <tr key={d.ref} className="border-b">
                          <td className="py-2">{d.ref}</td>
                          <td className="py-2">{d.date}</td>
                          <td className="py-2 text-right">{d.amount.toFixed(2)}</td>
                          <td className="py-2">{d.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
