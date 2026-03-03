'use client';

/**
 * Ejen Commissions - Modul 3
 * Komisen Wakalah untuk Ejen (IPIS, IPT, Consultant)
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DollarSign, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function AgentCommissionsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && !['agent_ipis', 'agent_ipt', 'agent_consultant'].includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const isAgent = user?.role === 'agent_ipis' || user?.role === 'agent_ipt' || user?.role === 'agent_consultant';
  if (!isAuthenticated || !user || !isAgent) return null;

  const summary = { total_earned: 1750, total_paid: 1400, total_pending: 350 };
  const commissions = [
    { id: '1', ref: 'LZS-2025-001234', amount: 25, collection: 1250, is_paid: true, paid_at: '15 Jan 2025', payer: 'Ahmad Bin Ali' },
    { id: '2', ref: 'LZS-2025-001189', amount: 100, collection: 5000, is_paid: true, paid_at: '15 Jan 2025', payer: 'Syarikat ABC' },
    { id: '3', ref: 'LZS-2025-001156', amount: 50, collection: 2500, is_paid: false, payer: 'Fatimah Binti Hassan' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Komisyen Wakalah</h1>
            <p className="text-muted-foreground">Sejarah komisen berdasarkan kutipan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Diperoleh</CardDescription>
                <CardTitle>RM {summary.total_earned.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Telah Dibayar</CardDescription>
                <CardTitle>RM {summary.total_paid.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Menunggu</CardDescription>
                <CardTitle>RM {summary.total_pending.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sejarah Komisyen</CardTitle>
              <CardDescription>Kutipan yang dirujuk melalui anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{c.ref}</p>
                      <p className="text-sm text-muted-foreground">{c.payer} • RM {c.collection.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">RM {c.amount.toFixed(2)}</p>
                      <Badge variant={c.is_paid ? 'default' : 'secondary'}>
                        {c.is_paid ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" />Dibayar</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" />Menunggu</>
                        )}
                      </Badge>
                      {c.paid_at && <p className="text-xs text-muted-foreground mt-1">{c.paid_at}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
