'use client';

/**
 * SPG Individu - Modul 1
 * Skim Potongan Gaji: Tetapan/kemas kini potongan gaji
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

const spgSchema = z.object({
  amount: z.number().min(1, 'Jumlah mesti lebih dari RM 0'),
  frequency: z.enum(['monthly', 'quarterly', 'yearly']),
});

type SpgForm = z.infer<typeof spgSchema>;

export default function ProfileSpgPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'payer_individual') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const form = useForm<SpgForm>({
    resolver: zodResolver(spgSchema),
    defaultValues: { amount: 125, frequency: 'monthly' },
  });

  const onSubmit = async (data: SpgForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isAuthenticated || !user || user.role !== 'payer_individual') return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-xl mx-auto">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Profil
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Skim Potongan Gaji (SPG)</CardTitle>
              <CardDescription>
                Tetapkan atau kemas kini jumlah potongan gaji bulanan anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Jumlah Potongan (RM)</Label>
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
                  <Label>Kekerapan</Label>
                  <Select onValueChange={(v) => form.setValue('frequency', v as SpgForm['frequency'])} defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="quarterly">Suku Tahunan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                  ) : saved ? (
                    <><CheckCircle2 className="mr-2 h-4 w-4" /> Disimpan!</>
                  ) : (
                    'Simpan Tetapan'
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
