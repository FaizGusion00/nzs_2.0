'use client';

/**
 * Login Page
 * Clean, minimalist login form. Demo: role determined by email keyword.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/lib/store';
import type { UserRole, AmilType, AgentType } from '@/lib/store';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak sah'),
  password: z.string().min(8, 'Kata laluan mesti sekurang-kurangnya 8 aksara'),
});

type LoginForm = z.infer<typeof loginSchema>;

/** Map email to role and optional sub-type for demo */
function getRoleFromEmail(email: string): { role: UserRole; amil_type?: AmilType; agent_type?: AgentType } {
  const e = email.toLowerCase();
  if (e.includes('super_admin')) return { role: 'super_admin' };
  if (e.includes('admin')) return { role: 'admin' };
  if (e.includes('zass')) return { role: 'zass' };
  if (e.includes('processing') || e.includes('exec')) return { role: 'exec_processing' };
  if (e.includes('finance')) return { role: 'exec_finance' };
  if (e.includes('ipis')) return { role: 'agent_ipis', agent_type: 'ipis' };
  if (e.includes('ipt')) return { role: 'agent_ipt', agent_type: 'ipt' };
  if (e.includes('consultant') || e.includes('agent')) return { role: 'agent_consultant', agent_type: 'consultant' };
  if (e.includes('amil')) {
    const amil_type: AmilType = e.includes('paf') ? 'paf' : e.includes('pap') ? 'pap' : 'pal';
    return { role: 'amil', amil_type };
  }
  if (e.includes('company') || e.includes('syarikat')) return { role: 'payer_company' };
  return { role: 'payer_individual' };
}

/** Get dashboard redirect path for role */
function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'zass': return '/zass/dashboard';
    case 'exec_processing': return '/exec/processing/dashboard';
    case 'exec_finance': return '/exec/finance/dashboard';
    case 'admin':
    case 'super_admin': return '/admin/dashboard';
    case 'agent_ipis':
    case 'agent_ipt':
    case 'agent_consultant': return '/agent/dashboard';
    case 'amil': return '/amil/dashboard';
    default: return '/dashboard';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { role, amil_type, agent_type } = getRoleFromEmail(data.email);
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email: data.email,
        full_name: data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        role,
        is_verified: true,
        ...(amil_type && { amil_type }),
        ...(agent_type && { agent_type }),
      };

      setAuth(mockUser, 'demo-token-' + Date.now());
      router.push(getRedirectPath(role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Log masuk gagal. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Log Masuk</CardTitle>
            <CardDescription>
              Masukkan email dan kata laluan anda untuk mengakses akaun
            </CardDescription>
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-800 dark:text-blue-200 font-semibold mb-2">
                <strong>Demo:</strong> Log masuk dengan sebarang email dan kata laluan (min 8 aksara)
              </p>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1 max-h-32 overflow-y-auto">
                <p><strong>Cara Akses Role:</strong></p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">user@demo.com</code> → Payer</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">company@</code> → Korporat</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">zass@</code> → ZASS Kaunter</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">processing@</code> → Exec Processing</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">finance@</code> → Exec Finance</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin@</code> → Admin/BI</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">agent@</code> → Ejen</p>
                <p>• <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">amil@</code> → Amil</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@example.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata Laluan</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Lupa kata laluan?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Log Masuk'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Tiada akaun? </span>
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

