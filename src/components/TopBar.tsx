import React from 'react';

export type WorkspaceTab = 'generator' | 'riwayat' | 'panduan' | 'profil';

interface TopBarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  savedCount: number;
  hasDocument: boolean;
  onResetNew: () => void;
  onPrintPdf: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  hasDocument,
  onResetNew,
  onPrintPdf,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <button
        type="button"
        onClick={() => onSelectTab('generator')}
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        SiAjar AI
      </button>

      {/* Zone 2: Concise single-line navigation links */}
      <nav aria-label="Navigasi Utama" className="flex items-center gap-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectTab('generator')}
          className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
            activeTab === 'generator'
              ? 'text-indigo-700 border-indigo-600'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Generator
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('riwayat')}
          className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
            activeTab === 'riwayat'
              ? 'text-indigo-700 border-indigo-600'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Riwayat ({savedCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('panduan')}
          className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
            activeTab === 'panduan'
              ? 'text-indigo-700 border-indigo-600'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Panduan Kurikulum
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('profil')}
          className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
            activeTab === 'profil'
              ? 'text-indigo-700 border-indigo-600'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Profil Pembuat
        </button>
      </nav>

      {/* Zone 3: Single primary action */}
      <div className="shrink-0">
        {activeTab === 'generator' && hasDocument ? (
          <button
            type="button"
            onClick={onPrintPdf}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Cetak PDF
          </button>
        ) : (
          <button
            type="button"
            onClick={onResetNew}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Perangkat Baru
          </button>
        )}
      </div>
    </header>
  );
};
