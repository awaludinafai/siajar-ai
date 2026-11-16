import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Check,
  Copy,
  Download,
  Edit3,
  Eye,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  RefreshCw,
  Save,
} from 'lucide-react';
import {
  EXAMPLE_PRESETS,
  LEFT_MENUS,
  REFINE_ACTIONS_BY_MENU,
} from '../data/curriculum';
import { GeneratorFormData, MenuSectionId } from '../types';
import {
  cleanMarkdownForDisplay,
  renderChildrenWithLineBreaks,
} from '../utils/formatMarkdown';

interface DocumentWorkspaceProps {
  activeMenu: MenuSectionId;
  content: string;
  onContentChange: (nextContent: string) => void;
  formData: GeneratorFormData;
  isGenerating: boolean;
  isRefining: boolean;
  errorMessage: string | null;
  onRefine: (instruction: string) => void;
  onCopy: () => void;
  copied: boolean;
  onDownloadWord: () => void;
  onPrintPdf: () => void;
  onSaveSnapshot: () => void;
  justSaved: boolean;
  onLoadExample: (patch: Partial<GeneratorFormData>) => void;
  showFormPanel: boolean;
  onToggleFormPanel: () => void;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  activeMenu,
  content,
  onContentChange,
  formData,
  isGenerating,
  isRefining,
  errorMessage,
  onRefine,
  onCopy,
  copied,
  onDownloadWord,
  onPrintPdf,
  onSaveSnapshot,
  justSaved,
  onLoadExample,
  showFormPanel,
  onToggleFormPanel,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [customInstruction, setCustomInstruction] = useState('');

  const busy = isGenerating || isRefining;
  const totalMenit = (formData.alokasiJp || 0) * (formData.menitPerJp || 0);
  const currentMenu = LEFT_MENUS.find((m) => m.id === activeMenu) || LEFT_MENUS[0];
  const refineActions = REFINE_ACTIONS_BY_MENU[activeMenu] || REFINE_ACTIONS_BY_MENU.perangkat_ajar;

  const handleCustomRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInstruction.trim() || busy) return;
    onRefine(customInstruction.trim());
    setCustomInstruction('');
  };

  return (
    <main className="flex-1 min-w-0 bg-slate-100/80 flex flex-col print-container">
      {/* Document Toolbar */}
      <div className="no-print sticky top-16 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 space-y-2.5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onToggleFormPanel}
              title={showFormPanel ? 'Sembunyikan panel form' : 'Tampilkan panel form'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showFormPanel ? (
                <>
                  <PanelLeftClose className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tutup Form</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka Form</span>
                </>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums truncate">
                <span>{currentMenu.label}</span>
                <span aria-hidden="true">·</span>
                <span>{formData.jenjang}</span>
                <span aria-hidden="true">·</span>
                <span>{formData.fase}</span>
                <span aria-hidden="true">·</span>
                <span>{formData.kelas}</span>
                {activeMenu === 'perangkat_ajar' || activeMenu === 'modul_ajar' ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      {formData.alokasiJp} JP ({totalMenit} mnt)
                    </span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>TA {formData.tahunAjaran}</span>
                  </>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {formData.mataPelajaran || currentMenu.label}
              </h1>
            </div>
          </div>

          {content && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'preview'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Pratinjau
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setViewMode('edit')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                    viewMode === 'edit'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Teks
                </button>
              </div>

              <button
                type="button"
                onClick={onSaveSnapshot}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Tersimpan
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Simpan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onDownloadWord}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Word (.doc)
              </button>

              <button
                type="button"
                onClick={onPrintPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          )}
        </div>

        {/* Regenerate / Refine Bar */}
        {content && (
          <div className="pt-2 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600 mr-1 whitespace-nowrap">
                Sempurnakan:
              </span>
              {refineActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={busy}
                  onClick={() => onRefine(action.instruction)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefining ? 'animate-spin' : ''}`} />
                  {action.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomRefine} className="flex-1 flex items-center gap-1.5 min-w-[220px]">
              <input
                type="text"
                value={customInstruction}
                disabled={busy}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Instruksi perbaikan khusus bagian tertentu..."
                className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !customInstruction.trim()}
                className="px-3 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                Terapkan
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto print-container">
        {errorMessage && (
          <div
            role="alert"
            className="no-print max-w-[920px] mx-auto mb-5 p-4 rounded-lg border border-rose-200 bg-rose-50 text-sm text-rose-800"
          >
            <strong className="font-semibold">Gagal memproses dokumen: </strong>
            {errorMessage}
          </div>
        )}

        {!content && !isGenerating ? (
          <div className="no-print max-w-[920px] mx-auto bg-white border border-slate-200 rounded-xl p-6 sm:p-9 space-y-7">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-xs font-medium text-indigo-700">
                Kurikulum Nasional · Permendikdasmen No. 13 Tahun 2025
              </p>
              <h2
                className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                {currentMenu.label}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentMenu.description} Lengkapi parameter pada panel form di sebelah kiri, lalu klik tombol <strong className="text-slate-900">Hasilkan {currentMenu.shortLabel}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-mono text-indigo-700">01 · Prinsip 3M</span>
                <h3 className="text-sm font-bold text-slate-900">
                  Berkesadaran, Bermakna, Menggembirakan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seluruh dokumen selaras dengan pendekatan Pembelajaran Mendalam Kemendikdasmen.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-mono text-indigo-700">02 · Siklus Belajar</span>
                <h3 className="text-sm font-bold text-slate-900">
                  Memahami, Mengaplikasi, Merefleksi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terstruktur dalam tabel alokasi waktu, matriks minggu efektif, ATP, Promes, dan Prota.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-mono text-indigo-700">03 · Siap Cetak</span>
                <h3 className="text-sm font-bold text-slate-900">
                  Ekspor PDF, Word & Edit Teks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Edit hasil secara langsung, salin, cetak ke PDF bersih, atau unduh format Word (.doc).
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">
                Muat contoh data kurikulum ke form untuk mencoba menu {currentMenu.label}:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => onLoadExample(preset.patch)}
                    className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Muat Contoh: {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[920px] mx-auto bg-white border border-slate-200 rounded-xl shadow-xs print-paper">
            {busy && (
              <div className="no-print px-6 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center gap-2 text-xs font-medium text-indigo-800 rounded-t-xl">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>
                  {isRefining
                    ? `Memperbarui ${currentMenu.label}...`
                    : `Sedang menyusun ${currentMenu.label} secara langsung...`}
                </span>
              </div>
            )}

            {viewMode === 'edit' && !busy ? (
              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="markdown-editor" className="text-xs font-semibold text-slate-700">
                    Editor Markdown Langsung
                  </label>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Selesai Edit
                  </button>
                </div>
                <textarea
                  id="markdown-editor"
                  value={content}
                  onChange={(e) => onContentChange(e.target.value)}
                  rows={28}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-4 font-mono text-xs sm:text-sm text-slate-900 leading-relaxed focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            ) : (
              <article className="px-6 py-8 sm:px-10 sm:py-10 doc-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table>{children}</table>
                      </div>
                    ),
                    td: ({ children, ...props }) => (
                      <td {...props}>{renderChildrenWithLineBreaks(children)}</td>
                    ),
                    th: ({ children, ...props }) => (
                      <th {...props}>{renderChildrenWithLineBreaks(children)}</th>
                    ),
                    p: ({ children, ...props }) => (
                      <p {...props}>{renderChildrenWithLineBreaks(children)}</p>
                    ),
                    li: ({ children, ...props }) => (
                      <li {...props}>{renderChildrenWithLineBreaks(children)}</li>
                    ),
                  }}
                >
                  {cleanMarkdownForDisplay(content, { preserveBreakToken: true })}
                </ReactMarkdown>
              </article>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
