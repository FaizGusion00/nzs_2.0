'use client';

/**
 * eMajikan Portal - Modul 1
 * Majikan: Daftar syarikat, muat naik data pekerja SPG
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Upload, Users } from 'lucide-react';

type Employee = {
  no: number;
  name: string;
  ic: string;
  amount: number;
};

export default function EmajikanDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [uploadSuccessOpen, setUploadSuccessOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [companyProfile, setCompanyProfile] = useState({
    companyName: 'Syarikat ABC Sdn Bhd',
    ssm: '123456-X',
    address: 'Lot 456, Jalan Perusahaan, 40000 Shah Alam, Selangor',
  });

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
    else if (user && user.role !== 'payer_company') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'payer_company') return null;

  const mockEmployees: Employee[] = [
    { no: 1, name: 'Ahmad Bin Ali', ic: '900101011234', amount: 125 },
    { no: 2, name: 'Fatimah Binti Hassan', ic: '850505055678', amount: 85 },
    { no: 3, name: 'Mohd Zain Bin Ismail', ic: '920202021234', amount: 150 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Portal eMajikan</h1>
            <p className="text-muted-foreground">
              Skim Potongan Gaji (SPG) - Daftar pekerja dan muat naik data
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Daftar / Kemas Kini Profil Syarikat</CardTitle>
              <CardDescription>
                Pastikan profil syarikat lengkap sebelum proses SPG.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nama Syarikat</Label>
                  <Input
                    value={companyProfile.companyName}
                    onChange={(e) => setCompanyProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. SSM</Label>
                  <Input
                    value={companyProfile.ssm}
                    onChange={(e) => setCompanyProfile((prev) => ({ ...prev, ssm: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat Syarikat</Label>
                  <Input
                    value={companyProfile.address}
                    onChange={(e) => setCompanyProfile((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={() => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000); }}>
                Simpan Profil Syarikat
              </Button>
              {profileSaved && <p className="text-sm text-green-600">Profil syarikat berjaya disimpan.</p>}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Muat Naik Data Pekerja
              </CardTitle>
              <CardDescription>
                Fail .txt format SPG. Muat naik senarai pekerja untuk potongan gaji.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="emp-upload"
                />
                <label htmlFor="emp-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : 'Klik untuk pilih fail pekerja'}
                  </p>
                </label>
              </div>
              <Button className="mt-4" disabled={!file} onClick={() => setUploadSuccessOpen(true)}>
                Muat Naik
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Senarai Pekerja SPG
              </CardTitle>
              <CardDescription>Pekerja yang didaftarkan untuk potongan gaji</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">No</th>
                      <th className="text-left py-2">Nama</th>
                      <th className="text-left py-2">No. IC</th>
                      <th className="text-right py-2">Potongan (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEmployees.map((e) => (
                      <tr
                        key={e.no}
                        className="border-b hover:bg-muted/30 cursor-pointer"
                        onClick={() => setSelectedEmployee(e)}
                      >
                        <td className="py-2">{e.no}</td>
                        <td className="py-2">{e.name}</td>
                        <td className="py-2">{e.ic}</td>
                        <td className="py-2 text-right">{e.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Dialog open={uploadSuccessOpen} onOpenChange={setUploadSuccessOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Muat Naik Berjaya</DialogTitle>
                <DialogDescription>
                  Ringkasan upload fail pekerja SPG.
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm space-y-1">
                <p>Fail: {file?.name || '-'}</p>
                <p>Jumlah rekod diterima: 3</p>
                <p>Rekod valid: 3</p>
                <p>Rekod gagal: 0</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setUploadSuccessOpen(false)}>Tutup</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Butiran Pekerja SPG</DialogTitle>
                <DialogDescription>
                  Semak/ubah potongan untuk pekerja terpilih.
                </DialogDescription>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-3 text-sm">
                  <p><strong>Nama:</strong> {selectedEmployee.name}</p>
                  <p><strong>No. IC:</strong> {selectedEmployee.ic}</p>
                  <p><strong>Potongan Semasa:</strong> RM {selectedEmployee.amount.toFixed(2)}</p>
                  <div className="space-y-2">
                    <Label>Jumlah Potongan Baru (RM)</Label>
                    <Input defaultValue={selectedEmployee.amount.toFixed(2)} type="number" step="0.01" />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmployee(null)}>Batal</Button>
                <Button onClick={() => setSelectedEmployee(null)}>Simpan Perubahan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
