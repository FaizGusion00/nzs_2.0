'use client';

/**
 * ZASS Kaunter - Form kutipan kaunter
 * Modul 2: Tunai, FPX, Cek, Kad Kredit/Debit
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, CreditCard, DollarSign, FileCheck, Banknote } from 'lucide-react';

const kaunterSchema = z.object({
  payer_id: z.string().min(1, 'Sila pilih pembayar'),
  zakat_type: z.string().min(1, 'Sila pilih jenis zakat'),
  amount: z.number().min(1, 'Jumlah mesti lebih dari RM 1.00'),
  method: z.enum(['cash', 'fpx', 'cheque', 'card']),
});

type KaunterForm = z.infer<typeof kaunterSchema>;

const MOCK_PAYERS = [
  { id: '1', name: 'Ahmad Bin Ali', nric: '900101011234' },
  { id: '2', name: 'Syarikat ABC Sdn Bhd', nric: '123456-X' },
  { id: '3', name: 'Fatimah Binti Hassan', nric: '850505055678' },
];

const ZAKAT_TYPES = [
  'Zakat Pendapatan',
  'Zakat Perniagaan',
  'Zakat Emas',
  'Zakat Wang Simpanan',
  'Zakat Saham',
  'Zakat Takaful',
];

export default function ZassKaunterPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [refNo, setRefNo] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'zass') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const form = useForm<KaunterForm>({
    resolver: zodResolver(kaunterSchema),
    defaultValues: { payer_id: '', zakat_type: '', amount: 0, method: 'cash' },
  });

  const onSubmit = async (data: KaunterForm) => {
    await new Promise((r) => setTimeout(r, 800));
    setRefNo('LZS-2025-' + Math.floor(100000 + Math.random() * 900000));
    setSuccess(true);
  };

  if (!isAuthenticated || !user || user.role !== 'zass') return null;

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle className="text-green-600">Kutipan Berjaya!</CardTitle>
              <CardDescription>No. Rujukan: {refNo}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => { setSuccess(false); form.reset(); }}>Transaksi Baru</Button>
              <Button variant="outline" className="ml-2" onClick={() => router.push('/zass/dashboard')}>
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Kutipan Kaunter</CardTitle>
              <CardDescription>Tunai, FPX, Cek, Kad Kredit/Debit</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Pembayar</Label>
                  <Select onValueChange={(v) => form.setValue('payer_id', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pembayar" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PAYERS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.nric})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.payer_id && (
                    <p className="text-sm text-destructive">{form.formState.errors.payer_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Jenis Zakat</Label>
                  <Select onValueChange={(v) => form.setValue('zakat_type', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis zakat" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZAKAT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.zakat_type && (
                    <p className="text-sm text-destructive">{form.formState.errors.zakat_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Jumlah (RM)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register('amount', { valueAsNumber: true })}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Kaedah Bayaran</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'cash', label: 'Tunai', icon: Banknote },
                      { value: 'fpx', label: 'FPX', icon: CreditCard },
                      { value: 'cheque', label: 'Cek', icon: FileCheck },
                      { value: 'card', label: 'Kad', icon: CreditCard },
                    ].map((m) => (
                      <Button
                        key={m.value}
                        type="button"
                        variant={form.watch('method') === m.value ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => form.setValue('method', m.value as KaunterForm['method'])}
                      >
                        <m.icon className="h-4 w-4 mr-2" />
                        {m.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                  ) : (
                    'Proses Kutipan'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
