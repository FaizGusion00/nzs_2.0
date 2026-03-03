DOKUMENTASI KEPERLUAN SISTEM: NEW KUTIPAN SYSTEM (NKS) 2.0

Klien: Lembaga Zakat Selangor (MAIS)
Konteks: Pembangunan Sistem Core Zakat Berpusat, Omnichannel & Payer-Centric

1. FOKUS UI/UX & PENGALAMAN PENGGUNA (Front-End)

Lembaga Zakat Selangor (LZS) sangat menekankan pendekatan "Payer-Centric" dan Customer Experience. UI/UX bukan sekadar cantik, tetapi mesti efisien, responsif, dan mengurangkan ralat manual.

Prinsip Reka Bentuk (Design Principles)

Omnichannel: Antara muka yang konsisten merentasi Portal Web (Desktop/Mobile Browser), Sistem Klien Desktop (untuk Kaunter), dan Aplikasi Mudah Alih (Native App).

Automasi & Straight-Through Processing: UI mesti mengurangkan campur tangan manual. Kurangkan klik, gunakan auto-fill (integrasi MyDigitalID/AD).

Pengurusan Borang (Form Handling) yang Teguh: Borang pendaftaran/pembayaran mesti ada validasi masa nyata (real-time), kawalan muat naik fail (attachment controls) yang efisien, dan pencegahan double-submit.

Pendekatan Isu Khusus (Edge Cases): UI mesti ada aliran alternatif untuk "Hamba Allah" (pembayar tanpa nama) dan pengemaskinian nombor pasport (kerana pasport sentiasa berubah berbanding No. IC).

Papan Pemuka (Dashboard) Analitik: UI untuk pengurusan LZS menggunakan visualisasi data yang moden (Exploratory Data Analysis, carta, dan ramalan).

2. PERANAN PENGGUNA (USER ROLES & PERSONAS)

Sistem ini menyokong lebih dari 10,000 akses serentak. Profil pengguna dibahagikan kepada 5 Kategori Utama:

A. Pembayar (Payers)

Pembayar Individu: Orang awam yang membayar zakat sendiri.

Pembayar Korporat (Company/Majikan): Syarikat yang membayar zakat perniagaan atau menguruskan Skim Potongan Gaji (SPG) pekerja mereka.

B. Kakitangan LZS (Internal Staff)

Executive Kaunter / Branch Officers (ZASS): Menguruskan kutipan fizikal, tunai, pendaftaran walk-in, dan isu setempat.

Executive Processing: Menguruskan fail pukal (bulk processing), pemadanan data SPG, dan validasi data pihak ketiga (Bank/AG).

Executive Finance: Menguruskan penyesuaian penyata bank (reconciliation) dan isu kewangan.

Pasukan BI (Business Intelligence) / Top Management: Mengakses laporan analitik dan visualisasi data.

C. Ejen LZS (Agents)

Institusi Pendidikan Islam Swasta (IPIS)

Institusi Pengajian Tinggi (IPT)

Ejen Perunding (Consultants)

D. Amil (Zakat Collectors)

Penolong Amil Fitrah (PAF)

Penolong Amil Padi (PAP)

Penolong Amil Lapangan (PAL)

3. PERINCIAN MODUL UTAMA (CORE MODULES)

Secara teknikal, NKS 2.0 dibina di atas 3 teras utama: Data Management, Data Processing, dan Data Analytics.

Modul 1: Pengurusan Pembayar & Amil (Profiling / Data Management)

Pendaftaran Berpusat: Menyokong pendaftaran sendiri (self-service) dan pendaftaran dibantu ejen (agent-assisted).

Pengurusan Profil: Kemas kini data statik pembayar. Pengendalian isu nombor dokumen pengenalan (IC vs Passport) dan pengesanan pendua (Duplicate checking antara individu & syarikat).

Modul SPG (Skim Potongan Gaji):

Individu: Penetapan/kemas kini jumlah potongan gaji.

Majikan: Portal khas (eMajikan) untuk mendaftar profil syarikat dan muat naik data pekerja untuk SPG.

Modul 2: Pemprosesan Pembayaran & Transaksi (Data Processing)

Kaunter (Real-time): Mengendalikan Tunai, FPX, Cek, Kad Kredit/Debit.

SPG & Pukal (Batch/Bulk Processing): Pemprosesan fail berat (minimum 1,000 transaksi per fail .txt berenkripsi). Enjin mesti padankan data dengan profil sedia ada.

Semakan Pendua (Duplicate Checking): Algoritma untuk tangkap transaksi berulang pada tarikh yang sama.

Kutipan Berjadual: Automasi untuk recurring payments.

Modul 3: Pengurusan Komisen & Agihan Semula (Commission Management)

Pengiraan komisen automatik untuk Amil dan Ejen (Wakalah) berdasarkan kutipan.

Modul agihan semula kutipan kepada asnaf yang layak melalui Amil/Ejen.

Modul 4: Batal & Pelarasan (Remedies & Adjustments)

Penggantian (Replacement): Kemas kini resit yang salah lapor.

Pembatalan (Cancellation): Batal transaksi tidak sah.

Pulangan Balik (Refund Processing): Proses aliran kerja permohonan pemulangan wang zakat (contoh: terlebih bayar).

Modul 5: Kutipan & Penyesuaian (Collection & Reconciliation)

Integrasi fail penyata bank dengan data kutipan NKS.

Padanan automatik (Auto-matching) antara resit dikeluarkan sistem dengan duit masuk di bank statement.

Modul 6: Analitik Data & Pelaporan (Data Analytics)

Penjanaan senarai pembayar, senarai jumlah kutipan mengikut cawangan/saluran.

Self-service customizable reports.

Advanced Analytics: Exploratory Data Analysis, Classification & Clustering, Predictive Analytics (menggunakan Machine Learning/AI untuk meramal corak pembayaran bulan Ramadan/Disember).

4. INTEGRASI SISTEM (SYSTEM INTEGRATION)

Sistem ini tidak berdiri sendiri. Pembangun Backend mesti mahir membina dan menggunakan API Gateway serta SFTP.

Backend / Sistem Kewangan & Kerajaan: SAP (Sistem Kewangan LZS), Jabatan Akauntan Negara (AG - untuk potong gaji penjawat awam).

Pihak Ketiga (Third Party): Bank (Bank Islam, Maybank), Payment Gateway (FPX, T&G, Grab, Debit/Kredit).

Identiti & Akses: Active Directory (AD), MyDigitalID.

Sistem LZS Sedia Ada: Integrasi web services dengan Portal eSPG, eMajikan, eDaftar, Portal Agent, EZO (Self Service), dan Mobile Apps LZS.

Format Fail: Protokol SFTP dengan pemindahan fail .txt (Encrypted) berskala besar.

5. SPESIFIKASI TEKNIKAL & INFRASTRUKTUR

Maklumat ini sangat kritikal untuk pasukan Architecture dan DevOps.

Beban Sistem (System Load)

Purata Transaksi: ~300,000 transaksi sebulan.

Waktu Puncak (Peak Period): Mencecah 500,000 transaksi sebulan (berlaku pada bulan Ramadan dan Disember). Sistem mesti ada auto-scaling atau direka bentuk untuk High Availability.

Akses Serentak: Mampu menyokong lebih 10,000 pengguna aktif serentak (concurrent users).

Pengurusan Pangkalan Data (Database)

Saiz Asal: ~4 TB pangkalan data teras dengan sejarah data sejak tahun 2003 (lebih 44 Juta rekod).

Strategi Migrasi Data: Pasukan dev mesti ada perancangan migrasi ETL (Extract, Transform, Load) yang sangat kemas dari sistem lama tanpa kehilangan integriti data.

Pilihan teknologi rujukan RFP: Penggunaan seni bina N-Tier, SQL (Stored Procedure), pelbagai proses (Multiple/Batch process).

Keselamatan (Security)

Standard piawaian keselamatan industri seperti ISO 27001, SOC.

Rangkaian: Web Application Firewall (WAF), API Gateway.

Ujian Wajib: Penetration Test (VAPT) sebelum 'Go-Live'.

Nota Dev: Fokus utama dalam membida atau membangunkan sistem ini adalah kebolehan memproses data berskala besar (Bulk Processing & Reconciliation) secara seamless di backend, sambil menyediakan antaramuka pengguna (UI) yang sangat ringkas, pantas, dan mesra pengguna di frontend.