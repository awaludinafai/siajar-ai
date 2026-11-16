export type JenjangId = 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB';

export type MenuSectionId =
  | 'perangkat_ajar'
  | 'analisis_alokasi_waktu'
  | 'capaian_pembelajaran'
  | 'alur_tujuan_pembelajaran'
  | 'program_semester'
  | 'program_tahunan'
  | 'modul_ajar';

export type DeviceTypeId =
  | 'analisis_cp'
  | 'modul_ajar'
  | 'lkpd_bahan'
  | 'bank_soal'
  | 'kokurikuler';

export type DimensionId =
  | 'keimanan'
  | 'kewargaan'
  | 'penalaran_kritis'
  | 'kreativitas'
  | 'kolaborasi'
  | 'kemandirian'
  | 'kesehatan'
  | 'komunikasi';

export interface GeneratorFormData {
  jenjang: JenjangId;
  fase: string;
  programKeahlian: string;
  kekhususanSlb: string;
  mataPelajaran: string;
  kelas: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  alokasiJp: number;
  menitPerJp: number;
  jpPerMinggu: number;
  jumlahMingguSemester: number;
  mingguTidakEfektif: number;
  keteranganMingguTidakEfektif: string;
  cpAtauTopik: string;
  elemenCp: string;
  daftarMateriAtauTp: string;
  modelPembelajaran: string;
  jenisPerangkat: DeviceTypeId[];
  karakteristikSiswa: string;
  kearifanLokal: string;
  kondisiSarana: string;
  dimensiProfil: DimensionId[];
  namaGuru: string;
  satuanPendidikan: string;
}

export interface SavedDocument {
  id: string;
  menuId: MenuSectionId;
  title: string;
  createdAt: string;
  updatedAt: string;
  formData: GeneratorFormData;
  content: string;
}

export interface RefineAction {
  id: string;
  label: string;
  instruction: string;
}

export interface MenuDefinition {
  id: MenuSectionId;
  label: string;
  shortLabel: string;
  description: string;
}
