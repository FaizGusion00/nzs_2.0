'use client';

/**
 * Kutipan Berjadual - Recurring payments
 * Modul 2: Automasi untuk recurring payments
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Calendar, Plus, CheckCircle2, Eye, Pencil, Ban } from 'lucide-react';

type RecurringItem = {
  id: string;
  payer: string;
  amount: number;
  frequency: string;
  next: string;
  status: 'active' | 'inactive';
};

export default function ExecProcessingRecurringPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalItem, setViewModalItem] = useState<RecurringItem | null>(null);
  const [formData, setFormData] = useState({
    payer: '',
    zakatType: '',
    amount: '',
    frequency: 'Bulanan',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'exec_processing') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const mockRecurring: RecurringItem[] = [
    { id: '1', payer: 'Ahmad Bin Ali', amount: 125, frequency: 'Bulanan', next: '1 Feb 2025', status: 'active' },
    { id: '2', payer: 'Syarikat ABC Sdn Bhd', amount: 500, frequency: 'Bulanan', next: '5 Feb 2025', status: 'active' },
    { id: '3', payer: 'Fatimah Binti Hassan', amount: 85, frequency: 'Bulanan', next: '15 Feb 2025', status: 'active' },
  ];

  if (!isAuthenticated || !user || user.role !== 'exec_processing') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Kutipan Berjadual</h1>
              <p className="text-muted-foreground">Automasi pembayaran berulang</p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadual
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Senarai Berjadual</CardTitle>
              <CardDescription>Pembayaran automatik mengikut jadual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecurring.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setViewModalItem(r)}
                    className="w-full text-left flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{r.payer}</p>
                        <p className="text-sm text-muted-foreground">
                          RM {r.amount.toFixed(2)} • {r.frequency} • Seterusnya: {r.next}
                        </p>
                      </div>
                    </div>
                    <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {r.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Tambah Jadual Kutipan</DialogTitle>
                <DialogDescription>
                  Tetapkan recurring payment untuk pembayar terpilih.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Pembayar</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, payer: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pembayar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ahmad Bin Ali">Ahmad Bin Ali</SelectItem>
                      <SelectItem value="Syarikat ABC Sdn Bhd">Syarikat ABC Sdn Bhd</SelectItem>
                      <SelectItem value="Fatimah Binti Hassan">Fatimah Binti Hassan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenis Zakat</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, zakatType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis zakat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zakat Pendapatan">Zakat Pendapatan</SelectItem>
                      <SelectItem value="Zakat Perniagaan">Zakat Perniagaan</SelectItem>
                      <SelectItem value="Zakat Wang Simpanan">Zakat Wang Simpanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jumlah (RM)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="Contoh: 125.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kekerapan</Label>
                  <Select
                    defaultValue="Bulanan"
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bulanan">Bulanan</SelectItem>
                      <SelectItem value="Suku Tahunan">Suku Tahunan</SelectItem>
                      <SelectItem value="Tahunan">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tarikh Mula</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Tarikh Tamat (Opsyenal)</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setAddModalOpen(false)}>Simpan Jadual</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!viewModalItem} onOpenChange={(open) => !open && setViewModalItem(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Butiran Jadual</DialogTitle>
                <DialogDescription>
                  Maklumat recurring payment terpilih
                </DialogDescription>
              </DialogHeader>

              {viewModalItem && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pembayar</p>
                      <p className="font-medium">{viewModalItem.payer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant={viewModalItem.status === 'active' ? 'default' : 'secondary'}>
                        {viewModalItem.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jumlah</p>
                      <p className="font-medium">RM {viewModalItem.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kekerapan</p>
                      <p className="font-medium">{viewModalItem.frequency}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Tarikh Seterusnya</p>
                      <p className="font-medium">{viewModalItem.next}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex-1 min-w-[120px]">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Resit
                    </Button>
                    <Button variant="outline" className="flex-1 min-w-[120px]">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" className="flex-1 min-w-[120px]">
                      <Ban className="h-4 w-4 mr-2" />
                      Nonaktifkan
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
