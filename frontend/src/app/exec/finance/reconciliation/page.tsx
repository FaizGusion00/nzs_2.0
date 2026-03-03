'use client';

/**
 * Penyesuaian Bank - Modul 5
 * Integrasi fail penyata bank, auto-matching
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Upload, CheckCircle2, XCircle, Link2 } from 'lucide-react';

type StatementRow = {
  id: string;
  bankRef: string;
  amount: number;
  date: string;
  status: 'matched' | 'unmatched';
  lzsRef?: string;
};

export default function ExecFinanceReconciliationPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [processed, setProcessed] = useState(false);
  const [statementRows, setStatementRows] = useState<StatementRow[]>([]);
  const [manualMatchTarget, setManualMatchTarget] = useState<StatementRow | null>(null);
  const [selectedLzsRef, setSelectedLzsRef] = useState('LZS-2025-001200');

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'exec_finance') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const lzsMatched = [
    { ref: 'LZS-2025-001234', amount: 1250, bankRef: 'FPX-xxx', date: '20 Jan 2025' },
    { ref: 'LZS-2025-001189', amount: 5000, bankRef: 'FPX-yyy', date: '19 Jan 2025' },
  ];
  const lzsUnmatched = [
    { ref: 'LZS-2025-001200', amount: 850, reason: 'Tiada padanan dalam penyata' },
  ];

  const handleProcess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatementRows([
      { id: 's1', bankRef: 'FPX-xxx', amount: 1250, date: '20 Jan 2025', status: 'matched', lzsRef: 'LZS-2025-001234' },
      { id: 's2', bankRef: 'FPX-yyy', amount: 5000, date: '19 Jan 2025', status: 'matched', lzsRef: 'LZS-2025-001189' },
      { id: 's3', bankRef: 'JOM-4021', amount: 850, date: '18 Jan 2025', status: 'unmatched' },
      { id: 's4', bankRef: 'CARD-2287', amount: 320, date: '18 Jan 2025', status: 'unmatched' },
      { id: 's5', bankRef: 'FPX-zz1', amount: 700, date: '17 Jan 2025', status: 'unmatched' },
    ]);
    setProcessed(true);
  };

  if (!isAuthenticated || !user || user.role !== 'exec_finance') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Muat Naik Penyata Bank</CardTitle>
              <CardDescription>Fail penyata bank untuk pemadanan automatik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="bank-upload"
                />
                <label htmlFor="bank-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Pilih fail penyata bank'}
                  </p>
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <Button disabled={!file} onClick={handleProcess}>
                  Proses Penyata
                </Button>
                {processed && (
                  <Button variant="outline" onClick={() => { setProcessed(false); setStatementRows([]); }}>
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {processed && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>View Penyata Bank (Uploaded)</CardTitle>
                <CardDescription>Semakan baris transaksi dari fail penyata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">No</th>
                        <th className="text-left py-2">Rujukan Bank</th>
                        <th className="text-right py-2">Jumlah (RM)</th>
                        <th className="text-left py-2">Tarikh</th>
                        <th className="text-left py-2">Status Padanan</th>
                        <th className="text-left py-2">No. Resit LZS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementRows.map((row, index) => (
                        <tr key={row.id} className="border-b">
                          <td className="py-2">{index + 1}</td>
                          <td className="py-2">{row.bankRef}</td>
                          <td className="py-2 text-right">{row.amount.toFixed(2)}</td>
                          <td className="py-2">{row.date}</td>
                          <td className="py-2">
                            <Badge variant={row.status === 'matched' ? 'default' : 'secondary'}>
                              {row.status === 'matched' ? 'Matched' : 'Unmatched'}
                            </Badge>
                          </td>
                          <td className="py-2">{row.lzsRef || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Dipadankan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lzsMatched.map((m) => (
                    <div key={m.ref} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{m.ref}</p>
                        <p className="text-xs text-muted-foreground">{m.bankRef} • {m.date}</p>
                      </div>
                      <Badge variant="default">RM {m.amount.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-amber-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  Belum Dipadankan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lzsUnmatched.map((u) => (
                    <div key={u.ref} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm">{u.ref}</p>
                        <p className="text-xs text-muted-foreground">{u.reason}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setManualMatchTarget({
                            id: u.ref,
                            bankRef: 'Manual pilih',
                            amount: u.amount,
                            date: 'N/A',
                            status: 'unmatched',
                          })
                        }
                      >
                        Padankan
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Dialog open={!!manualMatchTarget} onOpenChange={(open) => !open && setManualMatchTarget(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Padankan Secara Manual</DialogTitle>
                <DialogDescription>
                  Pilih transaksi bank untuk dipadankan dengan resit LZS.
                </DialogDescription>
              </DialogHeader>

              {manualMatchTarget && (
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Resit LZS</p>
                    <p className="font-medium">{manualMatchTarget.id} • RM {manualMatchTarget.amount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Pilih Rujukan Bank</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2 bg-background"
                      value={selectedLzsRef}
                      onChange={(e) => setSelectedLzsRef(e.target.value)}
                    >
                      <option value="LZS-2025-001200">JOM-4021 • RM 850.00</option>
                      <option value="LZS-2025-001201">CARD-2287 • RM 320.00</option>
                      <option value="LZS-2025-001202">FPX-zz1 • RM 700.00</option>
                    </select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setManualMatchTarget(null)}>
                  Batal
                </Button>
                <Button onClick={() => setManualMatchTarget(null)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Sahkan Padanan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
