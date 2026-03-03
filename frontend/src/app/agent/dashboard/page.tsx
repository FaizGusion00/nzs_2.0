'use client';

/**
 * Ejen Dashboard - IPIS, IPT, Consultant
 * Modul 3: Komisen Wakalah
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DollarSign, Users, Receipt, ArrowRight } from 'lucide-react';

export default function AgentDashboardPage() {
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

  const agentLabel = user.agent_type === 'ipis' ? 'IPIS' : user.agent_type === 'ipt' ? 'IPT' : 'Perunding';
  const stats = {
    total_collection: 87500,
    total_commission: 1750,
    payers_referred: 45,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Dashboard Ejen <Badge variant="secondary">{agentLabel}</Badge>
            </h1>
            <p className="text-muted-foreground">
              Komisen Wakalah berdasarkan kutipan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_collection.toLocaleString('ms-MY')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Komisen Wakalah</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pembayar Dirujuk</CardDescription>
                <CardTitle className="text-2xl">{stats.payers_referred}</CardTitle>
              </CardHeader>
              <CardContent>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Lihat komisen dan sejarah</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/agent/commissions">
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Lihat Komisyen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
