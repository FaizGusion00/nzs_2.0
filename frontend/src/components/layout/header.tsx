'use client';

/**
 * Header Component
 * Responsive navigation header with role-based links (LZS)
 */

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, LogOut, User, Calculator, Receipt, Home, Building2, FileText, MessageCircle, BarChart3, Sparkles, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const role = user?.role;

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = role === 'admin' || role === 'super_admin';
  const isPayer = role === 'payer_individual' || role === 'payer_company';
  const isAgent = role === 'agent_ipis' || role === 'agent_ipt' || role === 'agent_consultant';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Image
              src="/lzs-logo.png"
              alt="Lembaga Zakat Selangor"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:flex xl:hidden flex-col leading-tight min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">
              LZS eZakat
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              Sentiasa Bersama
            </span>
          </div>
          <div className="hidden xl:flex flex-col leading-tight min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">
              Lembaga Zakat Selangor
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[280px]">
              eZakat • Sentiasa Bersama, Sentiasa Menjaga
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-5">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/admin/users" className="text-sm font-medium hover:text-primary transition-colors">
                    Pengguna
                  </Link>
                  <Link href="/admin/reports" className="text-sm font-medium hover:text-primary transition-colors">
                    Laporan
                  </Link>
                  <Link href="/admin/amil-performance" className="text-sm font-medium hover:text-primary transition-colors">
                    Prestasi Amil
                  </Link>
                  <Link href="/admin/communications" className="text-sm font-medium hover:text-primary transition-colors">
                    Komunikasi
                  </Link>
                  <Link href="/admin/remedies" className="text-sm font-medium hover:text-primary transition-colors">
                    Pelarasan
                  </Link>
                  <Link href="/admin/agihan" className="text-sm font-medium hover:text-primary transition-colors">
                    Agihan
                  </Link>
                </>
              )}
              {role === 'zass' && (
                <>
                  <Link href="/zass/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/zass/kaunter" className="text-sm font-medium hover:text-primary transition-colors">
                    Kaunter
                  </Link>
                </>
              )}
              {role === 'exec_processing' && (
                <>
                  <Link href="/exec/processing/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/exec/processing/bulk" className="text-sm font-medium hover:text-primary transition-colors">
                    Bulk SPG
                  </Link>
                  <Link href="/exec/processing/recurring" className="text-sm font-medium hover:text-primary transition-colors">
                    Berjadual
                  </Link>
                </>
              )}
              {role === 'exec_finance' && (
                <>
                  <Link href="/exec/finance/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/exec/finance/reconciliation" className="text-sm font-medium hover:text-primary transition-colors">
                    Penyesuaian
                  </Link>
                  <Link href="/exec/finance/remedies" className="text-sm font-medium hover:text-primary transition-colors">
                    Pelarasan
                  </Link>
                </>
              )}
              {isAgent && (
                <>
                  <Link href="/agent/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/agent/commissions" className="text-sm font-medium hover:text-primary transition-colors">
                    Komisyen
                  </Link>
                </>
              )}
              {role === 'amil' && (
                <>
                  <Link href="/amil/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard Amil
                  </Link>
                  <Link href="/amil/collect" className="text-sm font-medium hover:text-primary transition-colors">
                    Kutipan
                  </Link>
                  <Link href="/amil/collections" className="text-sm font-medium hover:text-primary transition-colors">
                    Koleksi
                  </Link>
                  <Link href="/amil/commissions" className="text-sm font-medium hover:text-primary transition-colors">
                    Komisyen
                  </Link>
                </>
              )}
              {isPayer && (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
                    Kalkulator
                  </Link>
                  <Link href="/calculations" className="text-sm font-medium hover:text-primary transition-colors">
                    Pengiraan
                  </Link>
                  <Link href="/pay" className="text-sm font-medium hover:text-primary transition-colors">
                    Bayaran
                  </Link>
                  <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
                    Sejarah
                  </Link>
                  <Link href="/dashboard/reports" className="text-sm font-medium hover:text-primary transition-colors">
                    Laporan
                  </Link>
                  {role === 'payer_company' && (
                    <Link href="/emajikan/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                      eMajikan
                    </Link>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
                Kalkulator Zakat
              </Link>
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Ciri-ciri
              </Link>
            </>
          )}
        </nav>

        {/* Theme + Auth Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user ? getInitials(user.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isPayer && (
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      Dashboard Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                {role === 'zass' && (
                  <DropdownMenuItem asChild>
                    <Link href="/zass/dashboard" className="cursor-pointer">
                      Dashboard ZASS
                    </Link>
                  </DropdownMenuItem>
                )}
                {role === 'exec_processing' && (
                  <DropdownMenuItem asChild>
                    <Link href="/exec/processing/dashboard" className="cursor-pointer">
                      Dashboard Processing
                    </Link>
                  </DropdownMenuItem>
                )}
                {role === 'exec_finance' && (
                  <DropdownMenuItem asChild>
                    <Link href="/exec/finance/dashboard" className="cursor-pointer">
                      Dashboard Finance
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAgent && (
                  <DropdownMenuItem asChild>
                    <Link href="/agent/dashboard" className="cursor-pointer">
                      Dashboard Ejen
                    </Link>
                  </DropdownMenuItem>
                )}
                {role === 'amil' && (
                  <DropdownMenuItem asChild>
                    <Link href="/amil/dashboard" className="cursor-pointer">
                      Dashboard Amil
                    </Link>
                  </DropdownMenuItem>
                )}
                {isPayer && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/calculator" className="cursor-pointer">
                        <Calculator className="mr-2 h-4 w-4" />
                        Kalkulator
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/calculations" className="cursor-pointer">
                        <Calculator className="mr-2 h-4 w-4" />
                        Sejarah Pengiraan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/history" className="cursor-pointer">
                        <Receipt className="mr-2 h-4 w-4" />
                        Sejarah Bayaran
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/reports" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        Laporan Saya
                      </Link>
                    </DropdownMenuItem>
                    {role === 'payer_company' && (
                      <DropdownMenuItem asChild>
                        <Link href="/emajikan/dashboard" className="cursor-pointer">
                          <Building2 className="mr-2 h-4 w-4" />
                          eMajikan
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Log Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}

          {/* Mobile/Tablet Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <SheetHeader className="border-b bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-3 pr-8">
                  <div className="relative h-9 w-9 overflow-hidden rounded-md bg-primary/5 shrink-0">
                    <Image
                      src="/lzs-logo.png"
                      alt="Lembaga Zakat Selangor"
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="text-base">Menu</SheetTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      LZS eZakat
                    </p>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-3 py-4">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <>
                        <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Admin</span>
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <User className="h-5 w-5" />
                          <span>Pengguna</span>
                        </Link>
                        <Link href="/admin/reports" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Laporan</span>
                        </Link>
                        <Link href="/admin/amil-performance" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <BarChart3 className="h-5 w-5" />
                          <span>Prestasi Amil</span>
                        </Link>
                        <Link href="/admin/communications" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <MessageCircle className="h-5 w-5" />
                          <span>Komunikasi</span>
                        </Link>
                        <Link href="/admin/remedies" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <FileText className="h-5 w-5" />
                          <span>Pelarasan</span>
                        </Link>
                        <Link href="/admin/agihan" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Building2 className="h-5 w-5" />
                          <span>Agihan</span>
                        </Link>
                      </>
                    )}
                    {role === 'zass' && (
                      <>
                        <Link href="/zass/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard ZASS</span>
                        </Link>
                        <Link href="/zass/kaunter" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Kaunter</span>
                        </Link>
                      </>
                    )}
                    {role === 'exec_processing' && (
                      <>
                        <Link href="/exec/processing/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Processing</span>
                        </Link>
                        <Link href="/exec/processing/bulk" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <FileText className="h-5 w-5" />
                          <span>Bulk SPG</span>
                        </Link>
                        <Link href="/exec/processing/recurring" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Berjadual</span>
                        </Link>
                      </>
                    )}
                    {role === 'exec_finance' && (
                      <>
                        <Link href="/exec/finance/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Finance</span>
                        </Link>
                        <Link href="/exec/finance/reconciliation" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Penyesuaian</span>
                        </Link>
                        <Link href="/exec/finance/remedies" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <FileText className="h-5 w-5" />
                          <span>Pelarasan</span>
                        </Link>
                      </>
                    )}
                    {isAgent && (
                      <>
                        <Link href="/agent/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Ejen</span>
                        </Link>
                        <Link href="/agent/commissions" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Komisyen</span>
                        </Link>
                      </>
                    )}
                    {role === 'amil' && (
                      <>
                        <Link href="/amil/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard Amil</span>
                        </Link>
                        <Link href="/amil/collect" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Kutipan</span>
                        </Link>
                        <Link href="/amil/collections" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Koleksi</span>
                        </Link>
                        <Link href="/amil/commissions" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Komisyen</span>
                        </Link>
                      </>
                    )}
                    {isPayer && (
                      <>
                        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Home className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link href="/calculator" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Calculator className="h-5 w-5" />
                          <span>Kalkulator</span>
                        </Link>
                        <Link href="/calculations" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Calculator className="h-5 w-5" />
                          <span>Pengiraan</span>
                        </Link>
                        <Link href="/pay" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Bayaran</span>
                        </Link>
                        <Link href="/history" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <Receipt className="h-5 w-5" />
                          <span>Sejarah</span>
                        </Link>
                        <Link href="/dashboard/reports" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <FileText className="h-5 w-5" />
                          <span>Laporan</span>
                        </Link>
                        <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                          <User className="h-5 w-5" />
                          <span>Profil</span>
                        </Link>
                        {role === 'payer_company' && (
                          <Link href="/emajikan/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                            <Building2 className="h-5 w-5" />
                            <span>eMajikan</span>
                          </Link>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border bg-muted/40 p-3">
                      <Link href="/calculator" className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                        <span className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Kira / Bayar Zakat
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="px-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Menu Utama
                    </div>
                    <Link href="/calculator" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                      <Calculator className="h-5 w-5" />
                      <span>Kalkulator Zakat</span>
                    </Link>
                    <Link href="/#features" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                      <Sparkles className="h-5 w-5" />
                      <span>Ciri-ciri</span>
                    </Link>

                    <Separator className="my-1" />
                    <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Akaun
                    </div>
                    <Link href="/auth/login" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                      <LogIn className="h-5 w-5" />
                      <span>Log Masuk</span>
                    </Link>
                    <Link href="/auth/register" className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted/80">
                      <UserPlus className="h-5 w-5" />
                      <span>Daftar</span>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

