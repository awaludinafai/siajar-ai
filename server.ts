import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '4mb' }));

const PORT = Number(process.env.PORT) || 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi pada server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

type MenuSectionId =
  | 'perangkat_ajar'
  | 'analisis_alokasi_waktu'
  | 'capaian_pembelajaran'
  | 'alur_tujuan_pembelajaran'
  | 'program_semester'
  | 'program_tahunan'
  | 'modul_ajar';

const DEVICE_LABELS: Record<string, string> = {
  analisis_cp: 'Analisis Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP)',
  modul_ajar: 'Modul Ajar Pendekatan Pembelajaran Mendalam (Deep Learning)',
  lkpd_bahan: 'Lembar Kerja Peserta Didik (LKPD) & Bahan Ajar Esensial',
  bank_soal: 'Bank Soal HOTS (C4–C6), Kisi-Kisi, Kunci Jawaban & Rubrik Asesmen',
  kokurikuler: 'Rancangan Proyek Kokurikuler Lintas Disiplin',
};

const DIMENSION_LABELS: Record<string, string> = {
  keimanan: 'Keimanan dan Ketakwaan terhadap Tuhan YME',
  kewargaan: 'Kewargaan',
  penalaran_kritis: 'Penalaran Kritis',
  kreativitas: 'Kreativitas',
  kolaborasi: 'Kolaborasi',
  kemandirian: 'Kemandirian',
  kesehatan: 'Kesehatan',
  komunikasi: 'Komunikasi',
};

const SYSTEM_INSTRUCTION = `Anda adalah Pakar Pengembang Kurikulum Nasional Indonesia dan Instruksional Desainer Senior Kemendikdasmen yang menguasai Permendikdasmen No. 13 Tahun 2025 tentang Kurikulum dan Pendekatan Pembelajaran Mendalam (Deep Learning).

ATURAN WAJIB STRUKTUR & KUALITAS OUTPUT:
1. Seluruh dokumen HARUS ditulis dalam Bahasa Indonesia yang baku, pedagogis, operasional, dan siap pakai oleh guru serta administrasi sekolah.
2. Langsung mulai dokumen dengan judul resmi (Heading 1 \`#\`) dan tabel Identitas — JANGAN menuliskan kalimat sapaan, pembuka percakapan, atau penutup seperti "Berikut adalah...".
3. Wajib menerapkan kerangka **Pembelajaran Mendalam (Deep Learning)** sesuai kebijakan Kemendikdasmen terbaru:
   - **3 Prinsip Pembelajaran**: Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful).
   - **3 Pengalaman Belajar**: Memahami, Mengaplikasi, Merefleksi.
   - **Strategi Pembelajaran Berdiferensiasi**: Konten, Proses, dan Produk (serta Lingkungan Belajar bila relevan).
   - **8 Dimensi Profil Lulusan**: mengintegrasikan dimensi yang dipilih secara konkret.
4. Jika kondisi sarana menyatakan keterbatasan proyektor/internet, rancangan aktivitas WAJIB bersifat **unplugged / luring kontekstual** menggunakan media nyata.
5. Jika jenjang SMK dipilih, kaitkan dengan **Program Keahlian** dan kebutuhan dunia kerja/industri. Jika jenjang SLB dipilih, sertakan adaptasi aksesibilitas sesuai **Kekhususan Peserta Didik**.
6. FORMAT MARKDOWN & TABEL GFM RAPI (WAJIB DIPATUHI):
   - Seluruh data terstruktur (Identitas, Analisis Minggu Efektif, Bedah CP, ATP, Matriks Program Semester, Program Tahunan, Langkah Pembelajaran, Kisi-kisi Soal, dan Rubrik Penilaian) WAJIB menggunakan **Tabel Markdown GFM standar** (\`|\` dan \`| --- |\`).
   - Pastikan seluruh perhitungan angka (Jumlah Minggu, JP Efektif, Total Menit, Distribusi JP) konsisten secara matematis.
   - **DILARANG KERAS** menggunakan tag HTML mentah apa pun di dalam teks maupun sel tabel (seperti \`<br>\`, \`<br/>\`, \`<b>\`, \`<ul>\`, \`<li>\`, \`<p>\`). Jika ada beberapa poin dalam satu sel tabel, tulis rapi dalam satu baris menggunakan penomoran inline \`1) ...; 2) ...\` atau pemisah titik koma \`;\`.
   - **DILARANG KERAS** menggunakan sintaks LaTeX atau pembatas dolar (\`$...$\`, \`$$...$$\`, \`\\text{...}\`, \`\\mathbf{...}\`, \`\\times\`, \`\\frac\`). Seluruh rumus dan perhitungan WAJIB ditulis dengan teks biasa dan **simbol hitung resmi Unicode** (\`×\`, \`÷\`, \`+\`, \`−\`, \`=\`, \`≤\`, \`≥\`, \`≈\`, \`/\`) serta cetak tebal Markdown biasa, contoh: \`17 minggu × 2 JP = **34 JP** (1.360 menit)\`.`;

interface GeneratePayload {
  menuId?: MenuSectionId;
  jenjang: string;
  fase: string;
  programKeahlian?: string;
  kekhususanSlb?: string;
  mataPelajaran: string;
  kelas: string;
  semester: string;
  tahunAjaran?: string;
  alokasiJp: number;
  menitPerJp: number;
  jpPerMinggu?: number;
  jumlahMingguSemester?: number;
  mingguTidakEfektif?: number;
  keteranganMingguTidakEfektif?: string;
  cpAtauTopik: string;
  elemenCp?: string;
  daftarMateriAtauTp?: string;
  modelPembelajaran?: string;
  jenisPerangkat: string[];
  karakteristikSiswa?: string;
  kearifanLokal?: string;
  kondisiSarana?: string;
  dimensiProfil: string[];
  namaGuru?: string;
  satuanPendidikan?: string;
}

function buildSharedIdentityBlock(payload: GeneratePayload): string {
  const totalMenit = (payload.alokasiJp || 2) * (payload.menitPerJp || 40);
  const selectedDimensions = (payload.dimensiProfil || [])
    .map((id) => `- ${DIMENSION_LABELS[id] || id}`)
    .join('\n');

  return `### IDENTITAS SATUAN & KURIKULUM
- **Satuan Pendidikan**: ${payload.satuanPendidikan?.trim() || '[Nama Sekolah / Satuan Pendidikan]'}
- **Nama Penyusun / Guru**: ${payload.namaGuru?.trim() || '[Nama Guru Penyusun]'}
- **Tahun Ajaran**: ${payload.tahunAjaran?.trim() || '2026/2027'}
- **Jenjang & Fase**: ${payload.jenjang} (${payload.fase})
${payload.jenjang === 'SMK' && payload.programKeahlian ? `- **Program Keahlian SMK**: ${payload.programKeahlian}\n` : ''}${payload.jenjang === 'SLB' && payload.kekhususanSlb ? `- **Kekhususan Peserta Didik SLB**: ${payload.kekhususanSlb}\n` : ''}- **Mata Pelajaran**: ${payload.mataPelajaran}
- **Kelas / Semester**: ${payload.kelas} / Semester ${payload.semester}
- **Alokasi Waktu Topik/Modul**: ${payload.alokasiJp} JP (${payload.alokasiJp} × ${payload.menitPerJp} menit = ${totalMenit} menit)
- **JP per Minggu**: ${payload.jpPerMinggu || 4} JP/minggu

### KONTEKSTUALISASI
- **Karakteristik Peserta Didik**: ${payload.karakteristikSiswa?.trim() || 'Peserta didik heterogen dengan kesiapan belajar dan gaya belajar beragam.'}
- **Kearifan Lokal / Konteks Daerah**: ${payload.kearifanLokal?.trim() || 'Mengaitkan pembelajaran dengan kehidupan sosial, budaya, dan lingkungan sekitar sekolah.'}
- **Sarana & Prasarana**: ${payload.kondisiSarana?.trim() || 'Sarana kelas standar.'}

### DIMENSI PROFIL LULUSAN TARGET
${selectedDimensions || '- Penalaran Kritis\n- Kreativitas\n- Kolaborasi'}`;
}

function buildPromptByMenu(payload: GeneratePayload): string {
  const menuId: MenuSectionId = payload.menuId || 'perangkat_ajar';
  const identity = buildSharedIdentityBlock(payload);
  const jumlahMinggu = payload.jumlahMingguSemester || 20;
  const tidakEfektif = payload.mingguTidakEfektif ?? 3;
  const mingguEfektif = Math.max(1, jumlahMinggu - tidakEfektif);
  const jpMinggu = payload.jpPerMinggu || 4;
  const totalJpEfektif = mingguEfektif * jpMinggu;

  switch (menuId) {
    case 'analisis_alokasi_waktu': {
      const bulanList =
        payload.semester === 'Ganjil'
          ? 'Juli, Agustus, September, Oktober, November, Desember'
          : 'Januari, Februari, Maret, April, Mei, Juni';

      return `Susun dokumen resmi **ANALISIS ALOKASI WAKTU & PERHITUNGAN MINGGU EFEKTIF** Kurikulum Nasional (Permendikdasmen No. 13 Tahun 2025).

${identity}

### PARAMETER KALENDER SEMESTER
- **Semester**: ${payload.semester} (${bulanList})
- **Total Minggu dalam Semester**: ${jumlahMinggu} minggu
- **Jumlah Minggu Tidak Efektif**: ${tidakEfektif} minggu
- **Keterangan Minggu Tidak Efektif**: ${payload.keteranganMingguTidakEfektif?.trim() || 'MPLS/Awal Tahun, Asesmen Tengah Semester, Asesmen Akhir Semester, Libur Semester'}
- **Minggu Efektif Belajar**: ${mingguEfektif} minggu
- **Total Jam Pelajaran (JP) Efektif**: ${mingguEfektif} minggu × ${jpMinggu} JP = **${totalJpEfektif} JP**
- **Daftar Materi Pokok / Lingkup Materi**:
${payload.daftarMateriAtauTp?.trim() || payload.cpAtauTopik?.trim() || 'Susunkan lingkup materi esensial yang sesuai dengan mata pelajaran dan fase di atas.'}

### STRUKTUR WAJIB DOKUMEN
1. **Judul & Tabel Identitas Sekolah/Mapel**
2. **A. Perhitungan Jumlah Minggu per Bulan** (Tabel kolom: No | Bulan | Jumlah Minggu | Minggu Tidak Efektif | Minggu Efektif | Keterangan, pastikan total = ${jumlahMinggu} minggu, tidak efektif = ${tidakEfektif} minggu, efektif = ${mingguEfektif} minggu)
3. **B. Rincian Minggu Tidak Efektif** (Tabel: No | Jenis Kegiatan / Agenda Sekolah | Jumlah Minggu | Keterangan Waktu)
4. **C. Perhitungan Jam Pelajaran (JP) Efektif** (Rumus & ringkasan total ${totalJpEfektif} JP serta total menit)
5. **D. Distribusi Alokasi Waktu per Lingkup Materi / Tujuan Pembelajaran** (Tabel: No | Elemen / Lingkup Materi | Materi Pokok | Alokasi JP | Asesmen/Cadangan | Total JP — pastikan jumlah total tepat **${totalJpEfektif} JP**)
6. **Blok Pengesahan** (Mengetahui Kepala Sekolah & Guru Mata Pelajaran).`;
    }

    case 'capaian_pembelajaran': {
      return `Susun dokumen resmi **ANALISIS CAPAIAN PEMBELAJARAN (CP)** berdasarkan Permendikdasmen No. 13 Tahun 2025 dengan Pendekatan Pembelajaran Mendalam.

${identity}

### ELEMEN & TEKS CAPAIAN PEMBELAJARAN (CP)
- **Elemen CP**: ${payload.elemenCp?.trim() || 'Sesuai elemen resmi mata pelajaran pada fase ini'}
- **Teks CP / Fokus Materi**:
${payload.cpAtauTopik}

### STRUKTUR WAJIB DOKUMEN
1. **Judul & Tabel Identitas CP**
2. **A. Rasional Mata Pelajaran & Kedudukan Fase** (mengapa materi ini penting pada ${payload.fase})
3. **B. Deskripsi Capaian Pembelajaran per Elemen**
4. **C. Tabel Bedah / Analisis CP (Kompetensi & Konten/Materi Esensial)**
   - Kolom Tabel: \`No | Elemen | Kalimat CP | Kompetensi (Kata Kerja Operasional & Level Kognitif) | Konten / Materi Esensial | Pemahaman Bermakna | Dimensi Profil Lulusan\`
5. **D. Pemetaan Lintas Disiplin & Kontekstualisasi Kearifan Lokal**
6. **E. Implikasi Pendekatan Pembelajaran Mendalam (Berkesadaran, Bermakna, Menggembirakan) & Strategi Diferensiasi** pada CP ini.`;
    }

    case 'alur_tujuan_pembelajaran': {
      return `Susun dokumen resmi **ALUR TUJUAN PEMBELAJARAN (ATP)** berdasarkan Permendikdasmen No. 13 Tahun 2025.

${identity}

### ELEMEN, CP & LINGKUP MATERI
- **Elemen CP**: ${payload.elemenCp?.trim() || 'Sesuai elemen resmi fase'}
- **Capaian Pembelajaran (CP) Acuan**:
${payload.cpAtauTopik}
- **Pokok Materi / Catatan Urutan**:
${payload.daftarMateriAtauTp?.trim() || 'Susunkan alur logis dari konsep fondasional menuju aplikasi kompleks.'}

### STRUKTUR WAJIB DOKUMEN
1. **Judul & Tabel Identitas ATP**
2. **A. Capaian Pembelajaran (CP) Fase & Rasional Pengurutan Alur** (menjelaskan prinsip *scaffolding*: konkret ke abstrak, mudah ke kompleks, deduktif/induktif)
3. **B. Tabel Alur Tujuan Pembelajaran (ATP) Lengkap**
   - Kolom wajib: \`No | Elemen | Kode TP | Rumusan Tujuan Pembelajaran (TP) | Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) | Materi Esensial | Dimensi Profil Lulusan | Alokasi Waktu (JP) | Kelas / Semester\`
   - Buat minimal 6–8 TP yang runtut dan operasional.
4. **C. Pemetaan Asesmen & Strategi Pembelajaran Mendalam (Memahami–Mengaplikasi–Merefleksi)** sepanjang alur.
5. **D. Blok Pengesahan**.`;
    }

    case 'program_semester': {
      const months =
        payload.semester === 'Ganjil'
          ? ['Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];

      return `Susun dokumen resmi **PROGRAM SEMESTER (PROMES)** Tahun Ajaran ${payload.tahunAjaran || '2026/2027'} Semester ${payload.semester}.

${identity}

### DATA KALENDER & MATERI PROMES
- **Total Minggu Semester**: ${jumlahMinggu} minggu (Efektif: ${mingguEfektif} minggu, Tidak Efektif: ${tidakEfektif} minggu)
- **JP per Minggu**: ${jpMinggu} JP (Total Efektif: ${totalJpEfektif} JP)
- **Daftar TP / Materi Pokok yang Didistribusikan**:
${payload.daftarMateriAtauTp?.trim() || payload.cpAtauTopik}

### STRUKTUR WAJIB DOKUMEN
1. **Judul & Tabel Identitas Program Semester**
2. **A. Ringkasan Perhitungan Minggu & JP Efektif Semester ${payload.semester}**
3. **B. Matriks Distribusi Program Semester**
   - Gunakan **Tabel Markdown GFM** yang rapi dengan kolom:
     \`No | Kode TP / Lingkup Materi | Tujuan Pembelajaran / Materi Pokok | JP | ${months.map((m) => `${m} (M1-M4)`).join(' | ')} | Ket\`
   - Atau gunakan kolom per bulan yang memperlihatkan alokasi JP tiap minggu secara eksplisit (misal \`M1: 2 JP, M2: 2 JP\` atau \`✓ (4 JP)\`, serta tandai minggu **ASTS / ASAS / Libur / Jeda**). Pastikan jumlah seluruh JP pada baris materi + asesmen tepat = **${totalJpEfektif} JP**.
4. **C. Jadwal Asesmen Formatif, Sumatif Lingkup Materi, Remedial & Pengayaan**
5. **D. Blok Pengesahan** (Kepala Sekolah & Guru Mata Pelajaran).`;
    }

    case 'program_tahunan': {
      return `Susun dokumen resmi **PROGRAM TAHUNAN (PROTA)** Tahun Ajaran ${payload.tahunAjaran || '2026/2027'} Kurikulum Nasional.

${identity}

### CAKUPAN MATERI & ALOKASI SETAHUN
- **JP per Minggu**: ${jpMinggu} JP
- **Estimasi Minggu Efektif Setahun**: Semester Ganjil (${mingguEfektif} minggu = ${totalJpEfektif} JP) & Semester Genap (${mingguEfektif} minggu = ${totalJpEfektif} JP), Total = **${totalJpEfektif * 2} JP/Tahun**
- **Capaian Pembelajaran / Daftar Materi Pokok Setahun**:
${payload.daftarMateriAtauTp?.trim() || payload.cpAtauTopik}

### STRUKTUR WAJIB DOKUMEN
1. **Judul & Tabel Identitas Program Tahunan**
2. **A. Rasional Penyusunan Program Tahunan** (memuat integrasi Pengalaman Belajar Mendalam dan Kokurikuler)
3. **B. Tabel Program Tahunan (Semester Ganjil & Semester Genap)**
   - Kolom wajib: \`No | Semester | Elemen / Kode ATP | Tujuan Pembelajaran / Materi Pokok | Alokasi Waktu (JP) | Proyek Kokurikuler / Profil Lulusan | Keterangan\`
   - Sertakan baris **Sub-Total Semester Ganjil**, **Sub-Total Semester Genap**, serta baris **Total Alokasi Waktu Setahun** (mencakup intrakurikuler, asesmen sumatif, dan cadangan remedial/pengayaan).
4. **C. Rekapitulasi Distribusi Jam Pelajaran** (Tabel ringkas perbandingan Ganjil vs Genap)
5. **D. Blok Pengesahan** (Kepala Sekolah & Guru Mata Pelajaran).`;
    }

    case 'modul_ajar': {
      return `Susun **MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)** yang lengkap, operasional, dan siap praktik di kelas sesuai **Permendikdasmen No. 13 Tahun 2025**.

${identity}

### SPESIFIKASI MODUL AJAR
- **Model / Pendekatan Pembelajaran**: ${payload.modelPembelajaran || 'Pembelajaran Mendalam (Deep Learning) Kontekstual'}
- **Capaian Pembelajaran (CP) / Topik Materi**:
${payload.cpAtauTopik}

### STRUKTUR WAJIB MODUL AJAR
1. **Informasi Umum** (Tabel Identitas, Kompetensi Awal / Asesmen Diagnostik Singkat, Dimensi Profil Lulusan Terintegrasi, Sarana/Media Kontekstual, Target Peserta Didik, Model Pembelajaran)
2. **Komponen Inti**:
   - Tujuan Pembelajaran & Indikator Ketercapaian (KKTP)
   - Pemahaman Bermakna & Pertanyaan Pemantik (HOTS)
   - **Penerapan 3 Prinsip Pembelajaran Mendalam** (eksplisit: Berkesadaran/Mindful, Bermakna/Meaningful, Menggembirakan/Joyful)
   - **Skenario & Tabel Langkah Pembelajaran** berbasis **3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)** mencakup Pendahuluan, Kegiatan Inti, dan Penutup dengan **Strategi Diferensiasi (Konten, Proses, Produk)** dan total waktu tepat **${(payload.alokasiJp || 4) * (payload.menitPerJp || 40)} menit**.
3. **Asesmen & Rubrik Penilaian** (Asesmen Awal, Formatif Proses, Sumatif/Soal HOTS + Kunci Jawaban + Tabel Rubrik 4 Level: Baru Memulai, Berkembang, Cakap, Mahir)
4. **Pengayaan, Remedial & Refleksi Guru/Murid**
5. **Lampiran: Bahan Ajar Ringkas & LKPD Eksploratif** siap cetak.`;
    }

    case 'perangkat_ajar':
    default: {
      const selectedDevices = (payload.jenisPerangkat || [])
        .map((id, idx) => `${idx + 1}. **${DEVICE_LABELS[id] || id}**`)
        .join('\n');

      return `Susun paket perangkat ajar Kurikulum Nasional lengkap berdasarkan data berikut:

${identity}

### CAPAIAN PEMBELAJARAN (CP) / TOPIK MATERI SPESIFIK
${payload.cpAtauTopik}

### KOMPONEN PERANGKAT AJAR YANG WAJIB DIHASILKAN
Hasilkan secara berurutan dan komprehensif bagian-bagian berikut:
${selectedDevices}

Pastikan setiap bagian yang dipilih ditulis lengkap, operasional, tidak disingkat, memuat 3 Prinsip (Berkesadaran, Bermakna, Menggembirakan), 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi), Strategi Diferensiasi, serta menggunakan tabel Markdown GFM yang rapi.`;
    }
  }
}

function sendSseEvent(res: express.Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function formatApiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID') || raw.includes('API key')) {
    return {
      status: 401,
      message: 'Kunci API Gemini belum valid atau belum tersedia. Silakan periksa panel Settings > Secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'Batas kuota permintaan Gemini API tercapai sementara. Silakan coba lagi beberapa saat.',
    };
  }
  return {
    status: 500,
    message: raw || 'Terjadi kesalahan pada layanan generasi perangkat ajar.',
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  const payload = req.body as GeneratePayload;
  const menuId = payload?.menuId || 'perangkat_ajar';

  if (!payload?.mataPelajaran?.trim()) {
    res.status(400).json({ error: 'Mata pelajaran wajib diisi.' });
    return;
  }

  const requiresTopicOrList =
    menuId === 'perangkat_ajar' ||
    menuId === 'capaian_pembelajaran' ||
    menuId === 'alur_tujuan_pembelajaran' ||
    menuId === 'modul_ajar';

  if (requiresTopicOrList && !payload?.cpAtauTopik?.trim() && !payload?.daftarMateriAtauTp?.trim()) {
    res.status(400).json({ error: 'Capaian Pembelajaran (CP) atau topik materi wajib diisi.' });
    return;
  }

  if (
    menuId === 'perangkat_ajar' &&
    (!Array.isArray(payload.jenisPerangkat) || payload.jenisPerangkat.length === 0)
  ) {
    res.status(400).json({ error: 'Pilih minimal satu jenis perangkat ajar yang ingin dihasilkan.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  try {
    const ai = getAiClient();
    const prompt = buildPromptByMenu(payload);

    const stream = await ai.models.generateContentStream({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        sendSseEvent(res, 'chunk', { text });
      }
    }

    sendSseEvent(res, 'done', { ok: true });
    res.end();
  } catch (err) {
    const formatted = formatApiError(err);
    sendSseEvent(res, 'error', { message: formatted.message });
    res.end();
  }
});

app.post('/api/refine', async (req, res) => {
  const { currentContent, instruction, formData } = req.body as {
    currentContent: string;
    instruction: string;
    formData?: GeneratePayload;
  };

  if (!currentContent?.trim() || !instruction?.trim()) {
    res.status(400).json({ error: 'Dokumen saat ini dan instruksi penyempurnaan wajib tersedia.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  try {
    const ai = getAiClient();
    const contextSummary = formData
      ? `Konteks Dokumen (${formData.menuId || 'perangkat_ajar'}): ${formData.jenjang} (${formData.fase}), Mapel ${formData.mataPelajaran}, ${formData.kelas}, Semester ${formData.semester}, Tahun Ajaran ${formData.tahunAjaran || '2026/2027'}, Alokasi ${formData.alokasiJp} JP (${formData.menitPerJp} menit/JP). Sarana: ${formData.kondisiSarana || '-'}. Kearifan lokal: ${formData.kearifanLokal || '-'}.`
      : '';

    const prompt = `Anda diminta menyempurnakan / meregenerasi bagian tertentu dari dokumen Kurikulum Nasional berikut ini.

${contextSummary}

### INSTRUKSI PENYEMPURNAAN DARI GURU:
${instruction}

### ATURAN PENULISAN ULANG:
- Pertahankan struktur keseluruhan dokumen yang sudah baik dan lengkap.
- Terapkan instruksi penyempurnaan di atas secara mendalam, konkret, dan langsung terintegrasi ke dalam dokumen lengkap (bukan hanya potongan terpisah).
- Tetap patuhi Permendikdasmen No. 13 Tahun 2025 (3 Prinsip: Berkesadaran, Bermakna, Menggembirakan; 3 Pengalaman Belajar: Memahami, Mengaplikasi, Merefleksi; Strategi Diferensiasi; Tabel Markdown GFM rapi).
- Langsung keluarkan dokumen lengkap dalam Markdown tanpa kalimat pengantar percakapan.

### DOKUMEN SAAT INI:
${currentContent}`;

    const stream = await ai.models.generateContentStream({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        sendSseEvent(res, 'chunk', { text });
      }
    }

    sendSseEvent(res, 'done', { ok: true });
    res.end();
  } catch (err) {
    const formatted = formatApiError(err);
    sendSseEvent(res, 'error', { message: formatted.message });
    res.end();
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SiAjar AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
