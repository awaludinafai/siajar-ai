import React from 'react';
import { Building2, User } from 'lucide-react';
import { LEFT_MENUS } from '../data/curriculum';

interface CreatorProfileViewProps {
  onStartGenerator: () => void;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({ onStartGenerator }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Main Profile Header Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            aria-hidden="true"
            className="w-16 h-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold tracking-tight shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AF
          </div>

          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-medium text-indigo-700">
              Profil Pembuat & Badan Usaha Pengembang
            </p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              Awaludin Fadilah
            </h1>
            <p className="text-sm text-slate-600">
              Pendiri & Pengembang Utama ·{' '}
              <span className="font-semibold text-slate-900">afweb teknologi</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pembuat Aplikasi</span>
            </div>
            <p className="text-sm font-bold text-slate-900">Awaludin Fadilah</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Perancang arsitektur aplikasi dan pengembang sistem perangkat ajar digital untuk mendukung tugas perencanaan pembelajaran guru di Indonesia.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Badan Usaha</span>
            </div>
            <p className="text-sm font-bold text-slate-900">afweb teknologi</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Badan usaha teknologi informasi yang berfokus pada pengembangan aplikasi web modern, sistem manajemen pendidikan, dan solusi digital terapan.
            </p>
          </div>
        </div>
      </section>

      {/* Tentag Aplikasi & Cakupan Fitur */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Tentang Pengembangan SiAjar AI
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          SiAjar AI dikembangkan oleh <strong className="text-slate-900">Awaludin Fadilah</strong> bersama{' '}
          <strong className="text-slate-900">afweb teknologi</strong> untuk membantu guru dan satuan pendidikan pada jenjang PAUD, SD/MI, SMP/MTs, SMA/MA, SMK/MAK, dan SLB dalam menyiapkan administrasi Kurikulum Nasional (Permendikdasmen No. 13 Tahun 2025) dengan pendekatan Pembelajaran Mendalam secara cepat, rapi, dan siap cetak.
        </p>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-900">
            Cakupan Menu Dokumen Kurikulum
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LEFT_MENUS.map((menu, index) => (
              <div
                key={menu.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/60"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono text-indigo-700 tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{menu.label}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {menu.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} afweb teknologi · Awaludin Fadilah
          </span>
          <button
            type="button"
            onClick={onStartGenerator}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Kembali ke Generator
          </button>
        </div>
      </section>
    </div>
  );
};
