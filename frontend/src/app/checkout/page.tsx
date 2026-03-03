'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store';
import { ArrowRight, Calculator, LogIn, ShieldAlert, UserRoundX } from 'lucide-react';

const ZAKAT_TYPE_LABELS: Record<string, string> = {
  pendapatan: 'Zakat Pendapatan',
  perniagaan: 'Zakat Perniagaan',
  emas_perak: 'Zakat Emas & Perak',
  simpanan: 'Zakat Simpanan',
  saham: 'Zakat Saham',
  takaful: 'Zakat Takaful',
};

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const amount = Number(searchParams.get('amount') || '0');
  const zakatType = searchParams.get('type') || 'pendapatan';

  const [chooseGuest, setChooseGuest] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const payUrl = useMemo(() => {
    const params = new URLSearchParams({
      amount: amount.toString(),
      type: zakatType,
    });
    return `/pay?${params.toString()}`;
  }, [amount, zakatType]);

  useEffect(() => {
    if (isAuthenticated && amount > 0) {
      router.replace(payUrl);
    }
  }, [isAuthenticated, amount, payUrl, router]);

  const continueAsGuest = () => {
    if (!acknowledged) {
      setShowValidation(true);
      return;
    }

    const params = new URLSearchParams({
      amount: amount.toString(),
      type: zakatType,
      guest: '1',
    });

    if (phone.trim()) params.set('phone', phone.trim());
    if (email.trim()) params.set('email', email.trim());

    router.push(`/pay?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">Checkout Pembayaran</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Pilih cara paling cepat untuk teruskan pembayaran zakat anda.
            </p>
          </div>

          {amount <= 0 ? (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Jumlah Tidak Sah</CardTitle>
                <CardDescription>
                  Sila kembali ke kalkulator untuk kira jumlah zakat sebelum checkout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/calculator">
                  <Button>
                    <Calculator className="mr-2 h-4 w-4" />
                    Kembali ke Kalkulator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Ringkasan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jenis Zakat</span>
                    <Badge variant="secondary">
                      {ZAKAT_TYPE_LABELS[zakatType] || zakatType}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jumlah Bayaran</span>
                    <span className="text-xl font-bold text-primary">
                      RM {amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-5 lg:col-span-2">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Log Masuk
                    </CardTitle>
                    <CardDescription>
                      Untuk rekod profil penuh, sejarah bayaran dan resit cukai.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/auth/login?redirect=${encodeURIComponent(payUrl)}`}>
                      <Button className="w-full sm:w-auto">
                        Log Masuk & Teruskan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserRoundX className="h-5 w-5" />
                      Teruskan sebagai Hamba Allah
                    </CardTitle>
                    <CardDescription>
                      Tanpa log masuk. Cepat dan sesuai untuk pembayaran spontan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant={chooseGuest ? 'secondary' : 'outline'}
                      onClick={() => setChooseGuest((prev) => !prev)}
                    >
                      {chooseGuest ? 'Sembunyikan Borang' : 'Pilih Hamba Allah'}
                    </Button>

                    {chooseGuest && (
                      <div className="space-y-4 rounded-lg border p-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest_phone">Nombor Telefon (Opsyenal)</Label>
                          <Input
                            id="guest_phone"
                            placeholder="Contoh: 0123456789"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guest_email">E-mel (Opsyenal)</Label>
                          <Input
                            id="guest_email"
                            type="email"
                            placeholder="Contoh: nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                          <p className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                              Resit Hamba Allah tidak boleh digunakan untuk pelepasan cukai LHDN.
                            </span>
                          </p>
                        </div>

                        <div className="flex items-start space-x-2">
                          <input
                            id="guest_ack"
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => {
                              setAcknowledged(e.target.checked);
                              setShowValidation(false);
                            }}
                            className="mt-1 h-4 w-4 rounded border-input text-primary accent-primary"
                          />
                          <Label htmlFor="guest_ack" className="text-sm leading-5">
                            Saya faham resit Hamba Allah tidak boleh digunakan untuk pelepasan cukai LHDN.
                          </Label>
                        </div>
                        {showValidation && (
                          <p className="text-sm text-destructive">
                            Sila tandakan pengesahan sebelum meneruskan pembayaran.
                          </p>
                        )}

                        <Button onClick={continueAsGuest} className="w-full sm:w-auto">
                          Teruskan ke Pembayaran
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Memuatkan checkout...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
