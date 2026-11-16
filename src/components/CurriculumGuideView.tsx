import React from 'react';
import { GRADUATE_DIMENSIONS } from '../data/curriculum';

interface CurriculumGuideViewProps {
  onStartGenerator: () => void;
}

export const CurriculumGuideView: React.FC<CurriculumGuideViewProps> = ({ onStartGenerator }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-3">
        <p className="text-xs font-medium text-indigo-700">
          Landasan Regulasi · Permendikdasmen No. 13 Tahun 2025
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
        >
          Kerangka Kurikulum Nasional & Pendekatan Pembelajaran Mendalam
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          SiAjar AI merancang seluruh perangkat ajar mengikuti struktur kurikulum terbaru Kemendikdasmen yang menempatkan pemahaman konsep bermakna, pengalaman belajar aktif, pembelajaran berdiferensiasi, serta penguatan 8 Dimensi Profil Lulusan sebagai inti proses belajar di kelas.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartGenerator}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Mulai Susun Perangkat Ajar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            01. Tiga Prinsip Pembelajaran Mendalam
          </h2>
          <div className="divide-y divide-slate-100">
            <div className="py-3 first:pt-0">
              <h3 className="text-sm font-semibold text-slate-900">Berkesadaran (Mindful)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Membantu murid hadir secara utuh, memahami tujuan belajarnya, mengelola perhatian serta emosi, dan membangun motivasi intrinsik sebelum dan selama pembelajaran berlangsung.
              </p>
            </div>
            <div className="py-3">
              <h3 className="text-sm font-semibold text-slate-900">Bermakna (Meaningful)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Menghubungkan konsep esensial mata pelajaran dengan pengalaman nyata murid, permasalahan lingkungan sekitar, serta kearifan lokal daerah agar pengetahuan terasa relevan.
              </p>
            </div>
            <div className="py-3 last:pb-0">
              <h3 className="text-sm font-semibold text-slate-900">Menggembirakan (Joyful)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Menciptakan iklim kelas yang aman, positif, kolaboratif, dan memicu rasa ingin tahu melalui tantangan intelektual yang menumbuhkan kegembiraan dalam menemukan konsep.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            02. Tiga Pengalaman Belajar Inti
          </h2>
          <div className="divide-y divide-slate-100">
            <div className="py-3 first:pt-0">
              <h3 className="text-sm font-semibold text-slate-900">1. Memahami (Understanding)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Fase mengonstruksi pengetahuan secara aktif melalui observasi, pertanyaan pemantik, eksplorasi sumber belajar, dan pemaknaan konsep inti secara mendalam.
              </p>
            </div>
            <div className="py-3">
              <h3 className="text-sm font-semibold text-slate-900">2. Mengaplikasi (Applying)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Fase mentransfer dan menerapkan pemahaman pada konteks nyata, studi kasus otentik, eksperimen, maupun aktivitas berbasis masalah sesuai sarana kelas.
              </p>
            </div>
            <div className="py-3 last:pb-0">
              <h3 className="text-sm font-semibold text-slate-900">3. Merefleksi (Reflecting)</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Fase mengevaluasi strategi belajar, mengenali kemajuan diri, menerima umpan balik konstruktif, dan merumuskan tindak lanjut perbaikan pemahaman.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            03. Delapan Dimensi Profil Lulusan
          </h2>
          <span className="text-xs text-slate-500">
            Diintegrasikan dalam Tujuan Pembelajaran, Langkah Inti, dan Kokurikuler
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GRADUATE_DIMENSIONS.map((dim, index) => (
            <div
              key={dim.id}
              className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/70"
            >
              <span className="text-xs font-mono text-indigo-700 tabular-nums">
                0{index + 1}
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{dim.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-slate-900">
          04. Mata Pelajaran Pilihan & Kontekstualisasi Sarana
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Kurikulum Nasional mengakomodasi mata pelajaran pilihan strategis seperti{' '}
          <strong className="text-slate-900">Koding dan Kecerdasan Artifisial</strong> mulai jenjang SD/MI (Fase C atau pengenalan dasar), SMP/MTs (Fase D), hingga SMA/SMK. Apabila satuan pendidikan belum memiliki proyektor atau akses internet memadai, SiAjar AI secara otomatis menyusun aktivitas{' '}
          <strong className="text-slate-900">Unplugged Computing & Pembelajaran Kontekstual</strong> menggunakan media luring yang tetap menjaga kedalaman konsep.
        </p>
      </section>
    </div>
  );
};
