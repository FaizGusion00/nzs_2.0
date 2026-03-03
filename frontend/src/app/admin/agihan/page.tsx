'use client';

/**
 * Agihan Semula - Modul 3
 * Agihan kutipan kepada asnaf melalui Amil/Ejen
 */

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Users, CheckCircle2, Clock } from 'lucide-react';

export default function AdminAgihanPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) return null;

  const mockAgihan = [
    { id: '1', asnaf: 'Fakir - Ahmad bin Hassan', amount: 500, amil: 'Ustaz Muhammad', status: 'approved', date: '20 Jan 2025' },
    { id: '2', asnaf: 'Miskin - Keluarga Siti', amount: 350, amil: 'Ustazah Fatimah', status: 'pending', date: '21 Jan 2025' },
    { id: '3', asnaf: 'Mualaf - John bin Abdullah', amount: 200, amil: 'Ustaz Muhammad', status: 'approved', date: '19 Jan 2025' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Agihan Semula</h1>
            <p className="text-muted-foreground">
              Agihan kutipan kepada asnaf yang layak melalui Amil/Ejen
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Senarai Agihan</CardTitle>
              <CardDescription>Permohonan agihan kepada asnaf</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAgihan.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{a.asnaf}</p>
                      <p className="text-sm text-muted-foreground">
                        RM {a.amount.toLocaleString()} • {a.amil} • {a.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.status === 'approved' ? 'default' : 'secondary'}>
                        {a.status === 'approved' ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" />Diluluskan</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" />Menunggu</>
                        )}
                      </Badge>
                      {a.status === 'pending' && (
                        <Button size="sm">Luluskan</Button>
                      )}
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
