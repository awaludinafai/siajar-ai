import {
  DeviceTypeId,
  DimensionId,
  GeneratorFormData,
  JenjangId,
  MenuDefinition,
  MenuSectionId,
  RefineAction,
} from '../types';

export const LEFT_MENUS: MenuDefinition[] = [
  {
    id: 'perangkat_ajar',
    label: 'Perangkat Ajar',
    shortLabel: 'Perangkat Ajar',
    description: 'Paket perangkat ajar terpadu multi-komponen sesuai Permendikdasmen No. 13/2025.',
  },
  {
    id: 'analisis_alokasi_waktu',
    label: 'Analisis Alokasi Waktu',
    shortLabel: 'Alokasi Waktu',
    description: 'Perhitungan minggu efektif, minggu tidak efektif, dan distribusi JP semester.',
  },
  {
    id: 'capaian_pembelajaran',
    label: 'Capaian Pembelajaran',
    shortLabel: 'Capaian Pembelajaran',
    description: 'Bedah teks CP menjadi elemen, kompetensi inti, dan materi esensial per fase.',
  },
  {
    id: 'alur_tujuan_pembelajaran',
    label: 'Alur Tujuan Pembelajaran',
    shortLabel: 'Alur TP (ATP)',
    description: 'Pemetaan CP menjadi kode TP, rumusan TP, KKTP, dan urutan alur belajar.',
  },
  {
    id: 'program_semester',
    label: 'Program Semester',
    shortLabel: 'Program Semester',
    description: 'Matriks distribusi materi/TP ke kalender bulan dan minggu efektif semester.',
  },
  {
    id: 'program_tahunan',
    label: 'Program Tahunan',
    shortLabel: 'Program Tahunan',
    description: 'Rencana penetapan alokasi JP seluruh materi pokok Semester Ganjil & Genap.',
  },
  {
    id: 'modul_ajar',
    label: 'Modul Ajar',
    shortLabel: 'Modul Ajar',
    description: 'Modul Ajar Pembelajaran Mendalam (3M, Memahami–Mengaplikasi–Merefleksi, LKPD & Asesmen).',
  },
];

export function getMenuLabel(menuId: MenuSectionId): string {
  return LEFT_MENUS.find((m) => m.id === menuId)?.label || 'Perangkat Ajar';
}

export interface JenjangOption {
  id: JenjangId;
  label: string;
  fases: {
    id: string;
    label: string;
    kelasOptions: string[];
  }[];
  defaultMenitPerJp: number;
  defaultJpPerMinggu: number;
  subjects: string[];
}

export const JENJANG_OPTIONS: JenjangOption[] = [
  {
    id: 'PAUD',
    label: 'PAUD (TK / KB / RA)',
    defaultMenitPerJp: 30,
    defaultJpPerMinggu: 15,
    fases: [
      { id: 'Fondasi', label: 'Fase Fondasi', kelasOptions: ['Usia 3-4 Tahun (KB)', 'Usia 4-5 Tahun (TK A)', 'Usia 5-6 Tahun (TK B)'] },
    ],
    subjects: [
      'Nilai Agama dan Budi Pekerti',
      'Jati Diri',
      'Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni',
      'Projek Penguatan Profil Lulusan PAUD',
    ],
  },
  {
    id: 'SD',
    label: 'SD / MI',
    defaultMenitPerJp: 35,
    defaultJpPerMinggu: 4,
    fases: [
      { id: 'Fase A', label: 'Fase A (Kelas 1–2)', kelasOptions: ['Kelas 1', 'Kelas 2'] },
      { id: 'Fase B', label: 'Fase B (Kelas 3–4)', kelasOptions: ['Kelas 3', 'Kelas 4'] },
      { id: 'Fase C', label: 'Fase C (Kelas 5–6)', kelasOptions: ['Kelas 5', 'Kelas 6'] },
    ],
    subjects: [
      'Koding dan Kecerdasan Artifisial (Pilihan)',
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika',
      'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
      'Seni Budaya dan Prakarya',
      'Bahasa Inggris',
      'Pendidikan Agama dan Budi Pekerti',
      'Muatan Lokal / Bahasa Daerah',
    ],
  },
  {
    id: 'SMP',
    label: 'SMP / MTs',
    defaultMenitPerJp: 40,
    defaultJpPerMinggu: 4,
    fases: [
      { id: 'Fase D', label: 'Fase D (Kelas 7–9)', kelasOptions: ['Kelas 7', 'Kelas 8', 'Kelas 9'] },
    ],
    subjects: [
      'Koding dan Kecerdasan Artifisial (Pilihan)',
      'Informatika',
      'Matematika',
      'Ilmu Pengetahuan Alam (IPA)',
      'Ilmu Pengetahuan Sosial (IPS)',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Pendidikan Pancasila',
      'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
      'Seni Budaya / Prakarya',
      'Pendidikan Agama dan Budi Pekerti',
    ],
  },
  {
    id: 'SMA',
    label: 'SMA / MA',
    defaultMenitPerJp: 45,
    defaultJpPerMinggu: 4,
    fases: [
      { id: 'Fase E', label: 'Fase E (Kelas 10)', kelasOptions: ['Kelas 10'] },
      { id: 'Fase F', label: 'Fase F (Kelas 11–12)', kelasOptions: ['Kelas 11', 'Kelas 12'] },
    ],
    subjects: [
      'Koding dan Kecerdasan Artifisial (Pilihan)',
      'Informatika',
      'Matematika',
      'Matematika Tingkat Lanjut',
      'Fisika',
      'Kimia',
      'Biologi',
      'Ekonomi',
      'Sosiologi',
      'Geografi',
      'Sejarah',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Pendidikan Pancasila',
      'Seni Budaya / Prakarya & Kewirausahaan',
      'PJOK',
    ],
  },
  {
    id: 'SMK',
    label: 'SMK / MAK',
    defaultMenitPerJp: 45,
    defaultJpPerMinggu: 6,
    fases: [
      { id: 'Fase E', label: 'Fase E (Kelas 10)', kelasOptions: ['Kelas 10'] },
      { id: 'Fase F', label: 'Fase F (Kelas 11–12)', kelasOptions: ['Kelas 11', 'Kelas 12'] },
    ],
    subjects: [
      'Koding dan Kecerdasan Artifisial (Pilihan)',
      'Dasar-dasar Program Keahlian',
      'Konsentrasi Keahlian',
      'Projek Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      'Informatika',
      'Matematika',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Projek Kreatif dan Kewirausahaan',
      'Pendidikan Pancasila',
      'PJOK',
    ],
  },
  {
    id: 'SLB',
    label: 'SLB (Pendidikan Khusus)',
    defaultMenitPerJp: 35,
    defaultJpPerMinggu: 4,
    fases: [
      { id: 'Fondasi', label: 'Fase Fondasi (TKLB)', kelasOptions: ['TKLB'] },
      { id: 'Fase A', label: 'Fase A (SDLB Kelas 1–2)', kelasOptions: ['Kelas 1 SDLB', 'Kelas 2 SDLB'] },
      { id: 'Fase B', label: 'Fase B (SDLB Kelas 3–4)', kelasOptions: ['Kelas 3 SDLB', 'Kelas 4 SDLB'] },
      { id: 'Fase C', label: 'Fase C (SDLB Kelas 5–6)', kelasOptions: ['Kelas 5 SDLB', 'Kelas 6 SDLB'] },
      { id: 'Fase D', label: 'Fase D (SMPLB Kelas 7–9)', kelasOptions: ['Kelas 7 SMPLB', 'Kelas 8 SMPLB', 'Kelas 9 SMPLB'] },
      { id: 'Fase E', label: 'Fase E (SMALB Kelas 10)', kelasOptions: ['Kelas 10 SMALB'] },
      { id: 'Fase F', label: 'Fase F (SMALB Kelas 11–12)', kelasOptions: ['Kelas 11 SMALB', 'Kelas 12 SMALB'] },
    ],
    subjects: [
      'Program Kebutuhan Khusus',
      'Keterampilan Pilihan / Vokasional',
      'Bahasa Indonesia',
      'Matematika',
      'IPAS / IPA / IPS',
      'Pendidikan Pancasila',
      'Seni dan Budaya',
      'PJOK Adaptif',
      'Koding dan Kecerdasan Artifisial Adaptif',
    ],
  },
];

export const PROGRAM_KEAHLIAN_SMK = [
  'Pengembangan Perangkat Lunak dan Gim (PPLG)',
  'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
  'Desain Komunikasi Visual (DKV)',
  'Teknik Otomotif / Teknik Kendaraan Ringan',
  'Teknik Mesin / Pemesinan',
  'Teknik Ketenagalistrikan',
  'Akuntansi dan Keuangan Lembaga',
  'Manajemen Perkantoran dan Layanan Bisnis',
  'Pemasaran / Bisnis Digital',
  'Kuliner / Tata Boga',
  'Busana / Tata Busana',
  'Agribisnis Tanaman / Peternakan',
  'Layanan Kesehatan / Keperawatan',
  'Perhotelan',
];

export const KEKHUSUSAN_SLB = [
  'Hambatan Pendengaran (Tunarungu)',
  'Hambatan Penglihatan (Tunanetra)',
  'Hambatan Intelektual (Tunagrahita)',
  'Hambatan Fisik dan Motorik (Tunadaksa)',
  'Spektrum Autisme / ADHD',
  'Hambatan Majemuk',
];

export const DEVICE_TYPES: { id: DeviceTypeId; label: string; shortDesc: string }[] = [
  {
    id: 'analisis_cp',
    label: 'Analisis CP ke TP & ATP',
    shortDesc: 'Pemetaan Capaian Pembelajaran menjadi Tujuan & Alur Tujuan Pembelajaran',
  },
  {
    id: 'modul_ajar',
    label: 'Modul Ajar Pembelajaran Mendalam',
    shortDesc: 'Berkesadaran, Bermakna, Menggembirakan (Memahami–Mengaplikasi–Merefleksi)',
  },
  {
    id: 'lkpd_bahan',
    label: 'LKPD & Bahan Ajar',
    shortDesc: 'Lembar aktivitas eksploratif peserta didik dan ringkasan materi esensial',
  },
  {
    id: 'bank_soal',
    label: 'Bank Soal HOTS, Kisi-kisi & Rubrik',
    shortDesc: 'Instrumen asesmen formatif/sumatif, kisi-kisi, kunci, dan rubrik penilaian',
  },
  {
    id: 'kokurikuler',
    label: 'Rancangan Proyek Kokurikuler',
    shortDesc: 'Kegiatan kokurikuler lintas disiplin untuk penguatan 8 Dimensi Profil Lulusan',
  },
];

export const GRADUATE_DIMENSIONS: { id: DimensionId; label: string }[] = [
  { id: 'keimanan', label: 'Keimanan & Ketakwaan terhadap Tuhan YME' },
  { id: 'kewargaan', label: 'Kewargaan' },
  { id: 'penalaran_kritis', label: 'Penalaran Kritis' },
  { id: 'kreativitas', label: 'Kreativitas' },
  { id: 'kolaborasi', label: 'Kolaborasi' },
  { id: 'kemandirian', label: 'Kemandirian' },
  { id: 'kesehatan', label: 'Kesehatan' },
  { id: 'komunikasi', label: 'Komunikasi' },
];

export const SARANA_PRESETS = [
  'Kelas standar dengan papan tulis, tanpa proyektor dan akses internet terbatas (pembelajaran unplugged / kontekstual)',
  'Kelas dilengkapi proyektor LCD, speaker, dan Wi-Fi sekolah yang memadai',
  'Laboratorium komputer / kelas digital 1 siswa 1 perangkat dengan akses internet penuh',
  'Pembelajaran luar ruang (outdoor learning) memanfaatkan lingkungan sekitar sekolah dan alat peraga sederhana',
];

export const MODEL_PEMBELAJARAN_OPTIONS = [
  'Pembelajaran Mendalam (Deep Learning) Kontekstual',
  'Problem-Based Learning (PBL)',
  'Project-Based Learning (PjBL)',
  'Discovery / Inquiry Learning',
  'Cooperative Learning & Unplugged Activity',
];

export interface ExamplePreset {
  title: string;
  patch: Partial<GeneratorFormData>;
}

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    title: 'SMP · Koding & KA',
    patch: {
      jenjang: 'SMP',
      fase: 'Fase D',
      kelas: 'Kelas 8',
      semester: 'Ganjil',
      tahunAjaran: '2026/2027',
      alokasiJp: 4,
      menitPerJp: 40,
      jpPerMinggu: 2,
      jumlahMingguSemester: 20,
      mingguTidakEfektif: 3,
      keteranganMingguTidakEfektif: 'MPLS/Awal Tahun (1 minggu), Asesmen Sumatif Tengah & Akhir Semester (2 minggu)',
      mataPelajaran: 'Koding dan Kecerdasan Artifisial (Pilihan)',
      elemenCp: 'Berpikir Komputasional, Literasi Digital, dan Kecerdasan Artifisial',
      cpAtauTopik:
        'Peserta didik mampu memahami konsep dasar berpikir komputasional (dekomposisi, pengenalan pola, abstraksi, algoritma) serta prinsip kerja sistem Kecerdasan Artifisial sederhana (klasifikasi data dan etika penggunaan KA dalam kehidupan sehari-hari).',
      daftarMateriAtauTp:
        '1. Dekomposisi & Pengenalan Pola dalam Masalah Sehari-hari\n2. Perancangan Algoritma & Flowchart Sederhana\n3. Konsep Kerja Kecerdasan Artifisial & Klasifikasi Data\n4. Etika, Bias Data, dan Keamanan Penggunaan KA',
      karakteristikSiswa: 'Sebagian besar siswa akrab dengan ponsel pintar, memiliki gaya belajar visual-kinestetik, namun belum terbiasa membuat algoritma terstruktur.',
      kearifanLokal: 'Mengklasifikasikan jenis sampah lokal dan hasil pertanian/kuliner khas daerah sebagai contoh dataset latihan.',
      kondisiSarana: 'Kelas standar dengan papan tulis, tanpa proyektor dan akses internet terbatas (pembelajaran unplugged / kontekstual)',
      dimensiProfil: ['penalaran_kritis', 'kreativitas', 'kolaborasi', 'komunikasi'],
    },
  },
  {
    title: 'SD · IPAS Fase B',
    patch: {
      jenjang: 'SD',
      fase: 'Fase B',
      kelas: 'Kelas 4',
      semester: 'Genap',
      tahunAjaran: '2026/2027',
      alokasiJp: 4,
      menitPerJp: 35,
      jpPerMinggu: 5,
      jumlahMingguSemester: 19,
      mingguTidakEfektif: 3,
      keteranganMingguTidakEfektif: 'Libur Awal Ramadan/Idulfitri (2 minggu), Asesmen Sumatif Akhir Semester (1 minggu)',
      mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      elemenCp: 'Pemahaman IPAS (Sains dan Sosial) dan Keterampilan Proses',
      cpAtauTopik:
        'Mengidentifikasi wujud zat dan perubahannya serta mengaitkannya dengan siklus air dan ketersediaan air bersih di lingkungan sekitar.',
      daftarMateriAtauTp:
        '1. Wujud Zat dan Sifatnya\n2. Perubahan Wujud Zat dalam Kehidupan\n3. Siklus Air dan Pelestarian Mata Air\n4. Gaya dan Energi di Sekitar Kita',
      karakteristikSiswa: 'Siswa sangat aktif bergerak, antusias pada eksperimen langsung, dengan kemampuan literasi membaca yang beragam (perlu diferensiasi panduan visual).',
      kearifanLokal: 'Tradisi menjaga sumber mata air desa / sumur resapan dan kondisi musim hujan-kemarau di wilayah setempat.',
      kondisiSarana: 'Pembelajaran luar ruang (outdoor learning) memanfaatkan lingkungan sekitar sekolah dan alat peraga sederhana',
      dimensiProfil: ['keimanan', 'penalaran_kritis', 'kolaborasi', 'kesehatan'],
    },
  },
  {
    title: 'SMK · PPLG Fase F',
    patch: {
      jenjang: 'SMK',
      fase: 'Fase F',
      programKeahlian: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
      kelas: 'Kelas 11',
      semester: 'Ganjil',
      tahunAjaran: '2026/2027',
      alokasiJp: 6,
      menitPerJp: 45,
      jpPerMinggu: 6,
      jumlahMingguSemester: 20,
      mingguTidakEfektif: 2,
      keteranganMingguTidakEfektif: 'Uji Blok / Sumatif Tengah & Akhir Semester (2 minggu)',
      mataPelajaran: 'Konsentrasi Keahlian',
      elemenCp: 'Pemrograman Web dan Basis Data Berorientasi Industri',
      cpAtauTopik:
        'Merancang dan membangun antarmuka aplikasi web responsif terintegrasi basis data untuk layanan UMKM lokal dengan menerapkan prinsip UI/UX dan keamanan input dasar.',
      daftarMateriAtauTp:
        '1. Perancangan Wireframe & UI/UX Aplikasi Web\n2. Struktur Basis Data Relasional & Normalisasi\n3. Pengembangan Frontend Responsif & API CRUD\n4. Validasi Keamanan Input & Pengujian Aplikasi',
      karakteristikSiswa: 'Siswa memiliki keterampilan dasar HTML/CSS, namun masih perlu bimbingan dalam pemecahan masalah bug dan kerja tim berbasis proyek industri.',
      kearifanLokal: 'Digitalisasi katalog produk UMKM kerajinan atau kuliner tradisional di sekitar kota/kabupaten sekolah.',
      kondisiSarana: 'Laboratorium komputer / kelas digital 1 siswa 1 perangkat dengan akses internet penuh',
      dimensiProfil: ['penalaran_kritis', 'kreativitas', 'kolaborasi', 'kemandirian'],
    },
  },
];

export const REFINE_ACTIONS_BY_MENU: Record<MenuSectionId, RefineAction[]> = {
  perangkat_ajar: [
    {
      id: 'perdalam_lkpd',
      label: 'Perdalam LKPD',
      instruction:
        'Perdalam bagian Lembar Kerja Peserta Didik (LKPD) agar lebih eksploratif, kontekstual dengan skenario pemecahan masalah nyata, dan pertanyaan pemantik HOTS.',
    },
    {
      id: 'sederhanakan_bahasa',
      label: 'Sederhanakan Bahasa',
      instruction:
        'Sederhanakan bahasa penjelasan materi ajar dan instruksi aktivitas siswa agar lebih lugas, komunikatif, dan ramah usia peserta didik pada fase ini.',
    },
    {
      id: 'tambah_remedial',
      label: 'Tambah Remedial & Pengayaan',
      instruction:
        'Tambahkan paket soal Remedial bertahap dan soal Pengayaan HOTS (C4–C6) lengkap dengan kisi-kisi, kunci jawaban, dan rubrik penskoran.',
    },
    {
      id: 'perkuat_diferensiasi',
      label: 'Perkuat Diferensiasi',
      instruction:
        'Perkaya strategi pembelajaran berdiferensiasi (konten, proses, dan produk) serta kaitkan kearifan lokal secara lebih konkret di kegiatan inti.',
    },
  ],
  analisis_alokasi_waktu: [
    {
      id: 'detail_minggu',
      label: 'Rinci Kalender Per Bulan',
      instruction:
        'Rinci tabel perhitungan minggu efektif per bulan secara lebih detail (Juli–Desember untuk Ganjil atau Januari–Juni untuk Genap) beserta jumlah hari belajar efektif.',
    },
    {
      id: 'cadangan_remedial',
      label: 'Alokasi Cadangan & P5/Kokurikuler',
      instruction:
        'Tambahkan pos alokasi waktu khusus untuk asesmen sumatif, remedial/pengayaan, serta jam cadangan kokurikuler agar total JP seimbang.',
    },
  ],
  capaian_pembelajaran: [
    {
      id: 'bedah_kompetensi',
      label: 'Pertajam Taksonomi & Kompetensi',
      instruction:
        'Pertajam pemetaan kata kerja operasional kompetensi pada tabel bedah CP beserta tingkat kedalaman pemahaman konseptual yang diharapkan.',
    },
    {
      id: 'contoh_kontekstual',
      label: 'Tambah Contoh Kontekstual',
      instruction:
        'Tambahkan contoh konkret penerapan pemahaman bermakna dan keterkaitan lintas elemen CP dengan kehidupan sehari-hari murid.',
    },
  ],
  alur_tujuan_pembelajaran: [
    {
      id: 'lengkapi_kktp',
      label: 'Pertajam Indikator KKTP',
      instruction:
        'Lengkapi setiap baris Tujuan Pembelajaran pada tabel ATP dengan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang lebih terukur.',
    },
    {
      id: 'urutkan_prasyarat',
      label: 'Perjelas Alur Prasyarat',
      instruction:
        'Tambahkan penjelasan rasional pengurutan ATP dari konsep fondasional ke kompleks (scaffolding) serta rekomendasi alokasi JP tiap TP.',
    },
  ],
  program_semester: [
    {
      id: 'isi_tanda_silang',
      label: 'Rapikan Matriks Minggu',
      instruction:
        'Rapikan tabel matriks Program Semester dengan penandaan JP yang jelas pada kolom minggu ke-1 hingga ke-5 tiap bulan dan tandai minggu tidak efektif/sumatif.',
    },
    {
      id: 'sesuaikan_kalender',
      label: 'Tambah Asesmen Sumatif Lingkup',
      instruction:
        'Sisipkan jadwal Asesmen Sumatif Lingkup Materi, Asesmen Tengah Semester, dan Remedial/Pengayaan secara proporsional pada matriks Promes.',
    },
  ],
  program_tahunan: [
    {
      id: 'seimbangkan_jp',
      label: 'Seimbangkan JP Ganjil & Genap',
      instruction:
        'Seimbangkan distribusi total JP antara Semester Ganjil dan Semester Genap dalam tabel Program Tahunan agar sesuai dengan minggu efektif setahun.',
    },
    {
      id: 'tambah_catatan_prota',
      label: 'Lengkapi Rekapitulasi & Pengesahan',
      instruction:
        'Lengkapi bagian rekapitulasi total JP intrakurikuler, alokasi kokurikuler/cadangan, dan blok pengesahan Kepala Sekolah serta Guru Mata Pelajaran.',
    },
  ],
  modul_ajar: [
    {
      id: 'perdalam_lkpd',
      label: 'Perdalam LKPD & Aktivitas',
      instruction:
        'Perdalam Lembar Kerja Peserta Didik (LKPD) dan skenario aktivitas Memahami–Mengaplikasi–Merefleksi agar lebih konkret dan siap dipraktikkan.',
    },
    {
      id: 'sederhanakan_bahasa',
      label: 'Sederhanakan Bahasa',
      instruction:
        'Sederhanakan bahasa instruksi dan bahan bacaan murid agar mudah dipahami sesuai tingkat perkembangan fase.',
    },
    {
      id: 'tambah_asesmen',
      label: 'Lengkapi Rubrik & Soal HOTS',
      instruction:
        'Lengkapi modul ajar dengan instrumen asesmen formatif, soal HOTS sumatif, kunci jawaban, dan tabel rubrik penilaian 4 level capaian.',
    },
    {
      id: 'perkuat_diferensiasi',
      label: 'Perkuat Diferensiasi',
      instruction:
        'Pertajam strategi diferensiasi konten, proses, dan produk pada setiap tahap kegiatan inti serta integrasikan kearifan lokal.',
    },
  ],
};

export const DEFAULT_FORM_DATA: GeneratorFormData = {
  jenjang: 'SMP',
  fase: 'Fase D',
  programKeahlian: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
  kekhususanSlb: 'Hambatan Pendengaran (Tunarungu)',
  mataPelajaran: 'Koding dan Kecerdasan Artifisial (Pilihan)',
  kelas: 'Kelas 8',
  semester: 'Ganjil',
  tahunAjaran: '2026/2027',
  alokasiJp: 4,
  menitPerJp: 40,
  jpPerMinggu: 2,
  jumlahMingguSemester: 20,
  mingguTidakEfektif: 3,
  keteranganMingguTidakEfektif: 'MPLS/Awal Tahun, Asesmen Sumatif Tengah & Akhir Semester',
  cpAtauTopik: '',
  elemenCp: '',
  daftarMateriAtauTp: '',
  modelPembelajaran: MODEL_PEMBELAJARAN_OPTIONS[0],
  jenisPerangkat: ['analisis_cp', 'modul_ajar', 'lkpd_bahan', 'bank_soal'],
  karakteristikSiswa: '',
  kearifanLokal: '',
  kondisiSarana: SARANA_PRESETS[0],
  dimensiProfil: ['penalaran_kritis', 'kreativitas', 'kolaborasi', 'komunikasi'],
  namaGuru: '',
  satuanPendidikan: '',
};
