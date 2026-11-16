import React, { useMemo, useState } from 'react';
import { Download, FolderOpen, Search, Trash2 } from 'lucide-react';
import { getMenuLabel } from '../data/curriculum';
import { SavedDocument } from '../types';
import { downloadAsWordDoc } from '../utils/exportDoc';

interface HistoryViewProps {
  documents: SavedDocument[];
  onOpenDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onClearAll: () => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onClearAll,
  onStartNew,
}) => {
  const [query, setQuery] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesJenjang = jenjangFilter === 'ALL' || doc.formData.jenjang === jenjangFilter;
      const menuLabel = getMenuLabel(doc.menuId || 'perangkat_ajar').toLowerCase();
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        menuLabel.includes(q) ||
        doc.formData.mataPelajaran.toLowerCase().includes(q) ||
        doc.formData.cpAtauTopik.toLowerCase().includes(q);
      return matchesJenjang && matchesQuery;
    });
  }, [documents, query, jenjangFilter]);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Riwayat Dokumen Kurikulum Tersimpan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tersimpan lokal di peramban Anda. Buka kembali dokumen pada menu asalnya untuk mengedit atau mengekspor ulang.
          </p>
        </div>

        {documents.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-rose-700 hover:text-rose-800 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Hapus Semua Riwayat
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, jenis dokumen (Promes/Prota/ATP/Modul), atau mapel..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['ALL', 'PAUD', 'SD', 'SMP', 'SMA', 'SMK', 'SLB'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setJenjangFilter(item)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                jenjangFilter === item
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item === 'ALL' ? 'Semua' : item}
            </button>
          ))}
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <h2 className="text-base font-bold text-slate-900">Belum Ada Dokumen Tersimpan</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Setiap perangkat ajar, analisis alokasi waktu, CP, ATP, Promes, Prota, atau Modul Ajar yang Anda hasilkan akan otomatis tersimpan di sini.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onStartNew}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Mulai Buat Dokumen
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-900">Tidak ada hasil yang cocok</p>
          <p className="text-xs text-slate-500">
            Ubah kata kunci pencarian atau pilih filter jenjang lainnya.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                  <span className="font-sans font-semibold text-indigo-700">
                    {getMenuLabel(doc.menuId || 'perangkat_ajar')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.formData.jenjang}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.formData.fase}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.formData.kelas}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(doc.updatedAt)}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 truncate">{doc.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {doc.formData.mataPelajaran}
                  {doc.formData.cpAtauTopik ? ` — ${doc.formData.cpAtauTopik}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenDocument(doc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Buka
                </button>
                <button
                  type="button"
                  onClick={() => downloadAsWordDoc(doc.content, doc.title)}
                  title="Unduh Word (.doc)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Word
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDocument(doc.id)}
                  title="Hapus dokumen"
                  className="inline-flex items-center justify-center p-1.5 text-slate-500 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
