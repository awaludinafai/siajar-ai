import React from 'react';
import {
  BookOpenText,
  CalendarDays,
  CalendarRange,
  Check,
  Clock,
  GitBranch,
  Layers,
  Target,
} from 'lucide-react';
import { LEFT_MENUS } from '../data/curriculum';
import { MenuSectionId } from '../types';

interface LeftMenuSidebarProps {
  activeMenu: MenuSectionId;
  onSelectMenu: (menuId: MenuSectionId) => void;
  completedMenus: Record<MenuSectionId, boolean>;
  disabled?: boolean;
  onOpenProfile?: () => void;
}

const MENU_ICONS: Record<MenuSectionId, React.ComponentType<{ className?: string }>> = {
  perangkat_ajar: Layers,
  analisis_alokasi_waktu: Clock,
  capaian_pembelajaran: Target,
  alur_tujuan_pembelajaran: GitBranch,
  program_semester: CalendarRange,
  program_tahunan: CalendarDays,
  modul_ajar: BookOpenText,
};

export const LeftMenuSidebar: React.FC<LeftMenuSidebarProps> = ({
  activeMenu,
  onSelectMenu,
  completedMenus,
  disabled = false,
  onOpenProfile,
}) => {
  return (
    <aside
      aria-label="Menu Dokumen Kurikulum"
      className="no-print bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:w-[244px] xl:w-[256px] shrink-0 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 flex flex-col"
    >
      <div className="hidden lg:block px-4 pt-5 pb-3 border-b border-slate-100">
        <p className="text-xs font-bold text-slate-900">Menu Administrasi Guru</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Pilih jenis dokumen Kurikulum Nasional
        </p>
      </div>

      {/* Desktop vertical menu / Mobile horizontal scrollable bar */}
      <nav className="flex lg:flex-col gap-1 p-2.5 lg:p-3 overflow-x-auto lg:overflow-y-auto">
        {LEFT_MENUS.map((menu) => {
          const Icon = MENU_ICONS[menu.id];
          const isActive = activeMenu === menu.id;
          const hasDraft = completedMenus[menu.id];

          return (
            <button
              key={menu.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMenu(menu.id)}
              className={`group flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs sm:text-[13px] transition-colors whitespace-nowrap lg:whitespace-normal shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200/80'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="leading-snug">{menu.label}</span>
              </span>
              {hasDraft && (
                <Check
                  aria-label="Sudah memiliki draf"
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0 hidden lg:block"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden lg:block mt-auto p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Identitas sekolah, jenjang, fase, dan mata pelajaran otomatis terhubung di ketujuh menu di atas.
        </p>
        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="block text-left text-[11px] text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            Pembuat: <span className="font-semibold text-slate-800">Awaludin Fadilah</span> ·{' '}
            <span className="font-medium">afweb teknologi</span>
          </button>
        )}
      </div>
    </aside>
  );
};
