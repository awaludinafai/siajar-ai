import React, { useState } from 'react';
import { Loader2, RotateCcw, Square } from 'lucide-react';
import {
  DEVICE_TYPES,
  EXAMPLE_PRESETS,
  GRADUATE_DIMENSIONS,
  JENJANG_OPTIONS,
  KEKHUSUSAN_SLB,
  LEFT_MENUS,
  MODEL_PEMBELAJARAN_OPTIONS,
  PROGRAM_KEAHLIAN_SMK,
  SARANA_PRESETS,
} from '../data/curriculum';
import { DeviceTypeId, DimensionId, GeneratorFormData, JenjangId, MenuSectionId } from '../types';

interface GeneratorSidebarProps {
  activeMenu: MenuSectionId;
  formData: GeneratorFormData;
  onChange: (next: GeneratorFormData) => void;
  onGenerate: () => void;
  onStop: () => void;
  onReset: () => void;
  isGenerating: boolean;
  validationError: string | null;
}

export const GeneratorSidebar: React.FC<GeneratorSidebarProps> = ({
  activeMenu,
  formData,
  onChange,
  onGenerate,
  onStop,
  onReset,
  isGenerating,
  validationError,
}) => {
  const currentMenuMeta = LEFT_MENUS.find((m) => m.id === activeMenu) || LEFT_MENUS[0];
  const currentJenjang = JENJANG_OPTIONS.find((j) => j.id === formData.jenjang) || JENJANG_OPTIONS[2];
  const currentFase =
    currentJenjang.fases.find((f) => f.id === formData.fase) || currentJenjang.fases[0];

  const isPresetSubject = currentJenjang.subjects.includes(formData.mataPelajaran);
  const [useCustomSubject, setUseCustomSubject] = useState<boolean>(
    !isPresetSubject && formData.mataPelajaran !== ''
  );

  const handleJenjangChange = (jenjangId: JenjangId) => {
    const nextJenjang = JENJANG_OPTIONS.find((j) => j.id === jenjangId) || JENJANG_OPTIONS[0];
    const nextFase = nextJenjang.fases[0];
    const nextKelas = nextFase.kelasOptions[0];
    const nextSubject = nextJenjang.subjects[0];
    setUseCustomSubject(false);

    onChange({
      ...formData,
      jenjang: jenjangId,
      fase: nextFase.id,
      kelas: nextKelas,
      menitPerJp: nextJenjang.defaultMenitPerJp,
      jpPerMinggu: nextJenjang.defaultJpPerMinggu,
      mataPelajaran: nextSubject,
    });
  };

  const handleFaseChange = (faseId: string) => {
    const nextFase = currentJenjang.fases.find((f) => f.id === faseId) || currentJenjang.fases[0];
    onChange({
      ...formData,
      fase: nextFase.id,
      kelas: nextFase.kelasOptions[0],
    });
  };

  const toggleDeviceType = (id: DeviceTypeId) => {
    const exists = formData.jenisPerangkat.includes(id);
    const next = exists
      ? formData.jenisPerangkat.filter((item) => item !== id)
      : [...formData.jenisPerangkat, id];
    onChange({ ...formData, jenisPerangkat: next });
  };

  const toggleDimension = (id: DimensionId) => {
    const exists = formData.dimensiProfil.includes(id);
    const next = exists
      ? formData.dimensiProfil.filter((item) => item !== id)
      : [...formData.dimensiProfil, id];
    onChange({ ...formData, dimensiProfil: next });
  };

  const applyExamplePreset = (patch: Partial<GeneratorFormData>) => {
    const targetJenjang =
      JENJANG_OPTIONS.find((j) => j.id === (patch.jenjang || formData.jenjang)) || currentJenjang;
    if (patch.mataPelajaran) {
      setUseCustomSubject(!targetJenjang.subjects.includes(patch.mataPelajaran));
    }
    onChange({
      ...formData,
      ...patch,
    });
  };

  const totalMenit = (formData.alokasiJp || 0) * (formData.menitPerJp || 0);
  const mingguEfektif = Math.max(
    1,
    (formData.jumlahMingguSemester || 20) - (formData.mingguTidakEfektif || 0)
  );
  const totalJpSemester = mingguEfektif * (formData.jpPerMinggu || 2);

  const showCalendarFields =
    activeMenu === 'analisis_alokasi_waktu' ||
    activeMenu === 'program_semester' ||
    activeMenu === 'program_tahunan';
  const showElemenField =
    activeMenu === 'capaian_pembelajaran' || activeMenu === 'alur_tujuan_pembelajaran';
  const showMateriListField =
    activeMenu === 'analisis_alokasi_waktu' ||
    activeMenu === 'alur_tujuan_pembelajaran' ||
    activeMenu === 'program_semester' ||
    activeMenu === 'program_tahunan';
  const showCpOrTopikField =
    activeMenu === 'perangkat_ajar' ||
    activeMenu === 'capaian_pembelajaran' ||
    activeMenu === 'alur_tujuan_pembelajaran' ||
    activeMenu === 'modul_ajar';
  const showDeviceCheckboxes = activeMenu === 'perangkat_ajar';
  const showModelPembelajaran = activeMenu === 'modul_ajar';
  const showModulDuration = activeMenu === 'perangkat_ajar' || activeMenu === 'modul_ajar';
  const showKontekstualisasi =
    activeMenu === 'perangkat_ajar' ||
    activeMenu === 'modul_ajar' ||
    activeMenu === 'capaian_pembelajaran';

  return (
    <section
      aria-label="Form Parameter Dokumen"
      className="no-print w-full lg:w-[360px] xl:w-[390px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16"
    >
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900 truncate">{currentMenuMeta.label}</h2>
          <p className="text-[11px] text-slate-500 truncate">{currentMenuMeta.description}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          title="Atur ulang formulir"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5"
      >
        {/* Quick Example Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Isi Contoh Cepat</span>
            <span className="text-[11px] text-slate-500">1-klik uji coba</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {EXAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                disabled={isGenerating}
                onClick={() => applyExamplePreset(preset.patch)}
                className="px-2 py-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/70 rounded-md transition-colors truncate cursor-pointer disabled:opacity-50"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Jenjang, Fase, Kelas, Semester, Tahun Ajaran */}
        <section className="space-y-2.5 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">1. Jenjang, Fase & Mapel</h3>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="jenjang" className="block text-xs font-medium text-slate-700 mb-1">
                Jenjang
              </label>
              <select
                id="jenjang"
                value={formData.jenjang}
                onChange={(e) => handleJenjangChange(e.target.value as JenjangId)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {JENJANG_OPTIONS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fase" className="block text-xs font-medium text-slate-700 mb-1">
                Fase
              </label>
              <select
                id="fase"
                value={currentFase.id}
                onChange={(e) => handleFaseChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {currentJenjang.fases.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.jenjang === 'SMK' && (
            <div>
              <label htmlFor="programKeahlian" className="block text-xs font-medium text-slate-700 mb-1">
                Program Keahlian (SMK)
              </label>
              <select
                id="programKeahlian"
                value={formData.programKeahlian}
                onChange={(e) => onChange({ ...formData, programKeahlian: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {PROGRAM_KEAHLIAN_SMK.map((pk) => (
                  <option key={pk} value={pk}>
                    {pk}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.jenjang === 'SLB' && (
            <div>
              <label htmlFor="kekhususanSlb" className="block text-xs font-medium text-slate-700 mb-1">
                Kekhususan Peserta Didik (SLB)
              </label>
              <select
                id="kekhususanSlb"
                value={formData.kekhususanSlb}
                onChange={(e) => onChange({ ...formData, kekhususanSlb: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {KEKHUSUSAN_SLB.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="mataPelajaran" className="block text-xs font-medium text-slate-700">
                Mata Pelajaran
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = !useCustomSubject;
                  setUseCustomSubject(next);
                  if (!next) {
                    onChange({ ...formData, mataPelajaran: currentJenjang.subjects[0] });
                  } else {
                    onChange({ ...formData, mataPelajaran: '' });
                  }
                }}
                className="text-[11px] font-medium text-indigo-700 hover:underline cursor-pointer"
              >
                {useCustomSubject ? 'Pilih dari daftar' : 'Ketik mapel lainnya'}
              </button>
            </div>

            {useCustomSubject ? (
              <input
                id="mataPelajaran"
                type="text"
                value={formData.mataPelajaran}
                onChange={(e) => onChange({ ...formData, mataPelajaran: e.target.value })}
                placeholder="Contoh: Bahasa Sunda / Riset"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            ) : (
              <select
                id="mataPelajaran"
                value={
                  currentJenjang.subjects.includes(formData.mataPelajaran)
                    ? formData.mataPelajaran
                    : currentJenjang.subjects[0]
                }
                onChange={(e) => onChange({ ...formData, mataPelajaran: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {currentJenjang.subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="kelas" className="block text-xs font-medium text-slate-700 mb-1">
                Kelas
              </label>
              <select
                id="kelas"
                value={formData.kelas}
                onChange={(e) => onChange({ ...formData, kelas: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {currentFase.kelasOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="block text-xs font-medium text-slate-700 mb-1">
                Semester
              </label>
              <select
                id="semester"
                value={formData.semester}
                onChange={(e) =>
                  onChange({ ...formData, semester: e.target.value as 'Ganjil' | 'Genap' })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div>
              <label htmlFor="tahunAjaran" className="block text-xs font-medium text-slate-700 mb-1">
                Tahun Ajaran
              </label>
              <input
                id="tahunAjaran"
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => onChange({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2026/2027"
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Calendar & Effective Weeks (Analisis Alokasi Waktu, Promes, Prota) */}
        {showCalendarFields && (
          <section className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">
              2. Kalender Minggu Efektif & Beban JP
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="jumlahMingguSemester" className="block text-[11px] font-medium text-slate-700 mb-1">
                  Jml Minggu
                </label>
                <input
                  id="jumlahMingguSemester"
                  type="number"
                  min={10}
                  max={28}
                  value={formData.jumlahMingguSemester}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      jumlahMingguSemester: Math.max(10, Number(e.target.value) || 18),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="mingguTidakEfektif" className="block text-[11px] font-medium text-slate-700 mb-1">
                  Tdk Efektif
                </label>
                <input
                  id="mingguTidakEfektif"
                  type="number"
                  min={0}
                  max={12}
                  value={formData.mingguTidakEfektif}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      mingguTidakEfektif: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="jpPerMinggu" className="block text-[11px] font-medium text-slate-700 mb-1">
                  JP / Minggu
                </label>
                <input
                  id="jpPerMinggu"
                  type="number"
                  min={1}
                  max={20}
                  value={formData.jpPerMinggu}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      jpPerMinggu: Math.max(1, Number(e.target.value) || 2),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
            <p className="text-xs text-indigo-700 font-mono tabular-nums bg-indigo-50/70 border border-indigo-200/70 rounded-md px-2.5 py-1.5">
              Efektif: {mingguEfektif} minggu × {formData.jpPerMinggu} JP = {totalJpSemester} JP/semester
            </p>
            <div>
              <label htmlFor="keteranganMingguTidakEfektif" className="block text-xs font-medium text-slate-700 mb-1">
                Keterangan Minggu Tidak Efektif
              </label>
              <input
                id="keteranganMingguTidakEfektif"
                type="text"
                value={formData.keteranganMingguTidakEfektif}
                onChange={(e) =>
                  onChange({ ...formData, keteranganMingguTidakEfektif: e.target.value })
                }
                placeholder="MPLS, ASTS, ASAS, Libur Semester..."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </section>
        )}

        {/* Module / Teaching Unit Duration */}
        {showModulDuration && (
          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">2. Alokasi Waktu Pertemuan</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="alokasiJp" className="block text-xs font-medium text-slate-700 mb-1">
                  Alokasi Waktu (JP)
                </label>
                <input
                  id="alokasiJp"
                  type="number"
                  min={1}
                  max={36}
                  value={formData.alokasiJp}
                  onChange={(e) =>
                    onChange({ ...formData, alokasiJp: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label htmlFor="menitPerJp" className="block text-xs font-medium text-slate-700 mb-1">
                  Menit per JP
                </label>
                <input
                  id="menitPerJp"
                  type="number"
                  min={15}
                  max={60}
                  step={5}
                  value={formData.menitPerJp}
                  onChange={(e) =>
                    onChange({ ...formData, menitPerJp: Math.max(15, Number(e.target.value) || 35) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono tabular-nums">
              Total durasi: {totalMenit} menit ({formData.alokasiJp} JP)
            </p>
          </section>
        )}

        {/* Model Pembelajaran (for Modul Ajar) */}
        {showModelPembelajaran && (
          <section className="space-y-1.5 pt-2 border-t border-slate-100">
            <label htmlFor="modelPembelajaran" className="block text-xs font-bold text-slate-900">
              Model / Pendekatan Pembelajaran
            </label>
            <select
              id="modelPembelajaran"
              value={formData.modelPembelajaran}
              onChange={(e) => onChange({ ...formData, modelPembelajaran: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {MODEL_PEMBELAJARAN_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Elemen CP (for CP & ATP) */}
        {showElemenField && (
          <section className="space-y-1.5 pt-2 border-t border-slate-100">
            <label htmlFor="elemenCp" className="block text-xs font-bold text-slate-900">
              Elemen Capaian Pembelajaran (Opsional)
            </label>
            <input
              id="elemenCp"
              type="text"
              value={formData.elemenCp}
              onChange={(e) => onChange({ ...formData, elemenCp: e.target.value })}
              placeholder="Misal: Berpikir Komputasional, Pemahaman Sains, Bilangan..."
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </section>
        )}

        {/* Capaian Pembelajaran / Topik Materi */}
        {showCpOrTopikField && (
          <section className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <label htmlFor="cpAtauTopik" className="text-xs font-bold text-slate-900">
                Capaian Pembelajaran (CP) / Topik Materi
              </label>
              <span className="text-[11px] text-rose-600 font-medium">Wajib</span>
            </div>
            <textarea
              id="cpAtauTopik"
              rows={4}
              value={formData.cpAtauTopik}
              onChange={(e) => onChange({ ...formData, cpAtauTopik: e.target.value })}
              placeholder="Tempelkan bunyi Capaian Pembelajaran (CP) atau tuliskan topik materi spesifik..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 leading-relaxed"
            />
          </section>
        )}

        {/* Daftar Materi Pokok / Tujuan Pembelajaran (Alokasi Waktu, ATP, Promes, Prota) */}
        {showMateriListField && (
          <section className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <label htmlFor="daftarMateriAtauTp" className="text-xs font-bold text-slate-900">
                Daftar Lingkup Materi / Tujuan Pembelajaran
              </label>
              <span className="text-[11px] text-slate-500">
                {showCpOrTopikField ? 'Opsional' : 'Disarankan'}
              </span>
            </div>
            <textarea
              id="daftarMateriAtauTp"
              rows={4}
              value={formData.daftarMateriAtauTp}
              onChange={(e) => onChange({ ...formData, daftarMateriAtauTp: e.target.value })}
              placeholder="Tuliskan daftar materi pokok atau TP (kosongkan jika ingin AI menyusun otomatis sesuai fase & mapel)..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 leading-relaxed"
            />
          </section>
        )}

        {/* Jenis Perangkat (Only for Perangkat Ajar terpadu) */}
        {showDeviceCheckboxes && (
          <section className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-bold text-slate-900">Komponen Perangkat Ajar</h3>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {formData.jenisPerangkat.length}/{DEVICE_TYPES.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {DEVICE_TYPES.map((device) => {
                const checked = formData.jenisPerangkat.includes(device.id);
                return (
                  <label
                    key={device.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? 'bg-indigo-50/60 border-indigo-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDeviceType(device.id)}
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900">{device.label}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        {device.shortDesc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {/* Kontekstualisasi */}
        {showKontekstualisasi && (
          <section className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Kontekstualisasi & Sarana</h3>

            <div>
              <label htmlFor="karakteristikSiswa" className="block text-xs font-medium text-slate-700 mb-1">
                Karakteristik Peserta Didik
              </label>
              <textarea
                id="karakteristikSiswa"
                rows={2}
                value={formData.karakteristikSiswa}
                onChange={(e) => onChange({ ...formData, karakteristikSiswa: e.target.value })}
                placeholder="Misal: Gaya belajar beragam, sebagian perlu scaffolding literasi..."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="kearifanLokal" className="block text-xs font-medium text-slate-700 mb-1">
                Kearifan Lokal / Konteks Daerah
              </label>
              <input
                id="kearifanLokal"
                type="text"
                value={formData.kearifanLokal}
                onChange={(e) => onChange({ ...formData, kearifanLokal: e.target.value })}
                placeholder="Misal: Budaya pesisir, pasar daerah, pertanian padi..."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="kondisiSarana" className="block text-xs font-medium text-slate-700 mb-1">
                Ketersediaan Sarana & Prasarana
              </label>
              <select
                aria-label="Pilih preset sarana"
                value={
                  SARANA_PRESETS.includes(formData.kondisiSarana) ? formData.kondisiSarana : 'custom'
                }
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    onChange({ ...formData, kondisiSarana: e.target.value });
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 mb-1.5"
              >
                {SARANA_PRESETS.map((preset, idx) => (
                  <option key={idx} value={preset}>
                    {idx === 0
                      ? 'Tanpa Proyektor / Internet Terbatas (Unplugged)'
                      : idx === 1
                      ? 'Kelas Standar + Proyektor & Wi-Fi'
                      : idx === 2
                      ? 'Lab Komputer / Kelas Digital (1:1)'
                      : 'Luar Ruang & Alat Peraga Sederhana'}
                  </option>
                ))}
                <option value="custom">Tulis kondisi sarana khusus...</option>
              </select>
              <textarea
                id="kondisiSarana"
                rows={2}
                value={formData.kondisiSarana}
                onChange={(e) => onChange({ ...formData, kondisiSarana: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </section>
        )}

        {/* Dimensi Profil Lulusan (8 Dimensi) */}
        <section className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Dimensi Profil Lulusan (8 Dimensi)</h3>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...formData,
                  dimensiProfil:
                    formData.dimensiProfil.length === GRADUATE_DIMENSIONS.length
                      ? ['penalaran_kritis', 'kreativitas']
                      : GRADUATE_DIMENSIONS.map((d) => d.id),
                })
              }
              className="text-[11px] font-medium text-indigo-700 hover:underline cursor-pointer"
            >
              {formData.dimensiProfil.length === GRADUATE_DIMENSIONS.length
                ? 'Pilih minimal'
                : 'Pilih semua'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {GRADUATE_DIMENSIONS.map((dim) => {
              const checked = formData.dimensiProfil.includes(dim.id);
              return (
                <label
                  key={dim.id}
                  className={`flex items-start gap-2 p-2 rounded-md border text-[11px] cursor-pointer transition-colors ${
                    checked
                      ? 'bg-indigo-50/60 border-indigo-300 text-slate-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDimension(dim.id)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 shrink-0"
                  />
                  <span className="leading-tight">{dim.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Identitas Kop Dokumen */}
        <section className="space-y-2 pt-2 border-t border-slate-100 pb-1">
          <h3 className="text-xs font-bold text-slate-900">Identitas Kop Dokumen (Opsional)</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="satuanPendidikan" className="block text-[11px] font-medium text-slate-600 mb-1">
                Nama Sekolah
              </label>
              <input
                id="satuanPendidikan"
                type="text"
                value={formData.satuanPendidikan}
                onChange={(e) => onChange({ ...formData, satuanPendidikan: e.target.value })}
                placeholder="SMPN 1 Nusantara"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="namaGuru" className="block text-[11px] font-medium text-slate-600 mb-1">
                Nama Guru
              </label>
              <input
                id="namaGuru"
                type="text"
                value={formData.namaGuru}
                onChange={(e) => onChange({ ...formData, namaGuru: e.target.value })}
                placeholder="Nama Guru, S.Pd."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
        </section>

        {validationError && (
          <div
            role="alert"
            className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-xs text-rose-800 font-medium"
          >
            {validationError}
          </div>
        )}
      </form>

      {/* Sticky Footer Submit */}
      <div className="p-4 border-t border-slate-200 bg-white">
        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            Hentikan Generasi
          </button>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Hasilkan {currentMenuMeta.shortLabel}
          </button>
        )}
        {isGenerating && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-indigo-700 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Menyusun {currentMenuMeta.label}...
          </p>
        )}
      </div>
    </section>
  );
};
