export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced';

export type AboutListField = 'interests' | 'favorite_languages' | 'beyond_code';

export interface AboutItem {
  text: string;
  icon: string;
}

export interface AboutMeData {
  description: string;
  interests: AboutItem[];
  favorite_languages: AboutItem[];
  beyond_code: AboutItem[];
}

export interface Profile {
  id?: number;
  nama_lengkap?: string;
  username?: string;
  email?: string;
  nomor_hp?: string;
  foto?: string;
  deskripsi?: string;
}

export interface Education {
  id: number;
  nama_institusi: string;
  tingkat?: string;
  jurusan?: string;
  tahun_mulai?: string | number;
  tahun_selesai?: string | number | null;
  gambar?: string | null;
}

export interface Experience {
  id: number;
  nama_perusahaan: string;
  jabatan: string;
  tahun_mulai?: string | number;
  tahun_selesai?: string | number | null;
  gambar?: string | null;
}

export interface Skill {
  id: number;
  nama_keahlian: string;
  level: SkillLevel;
}

export interface Project {
  id: number;
  nama_karya: string;
  deskripsi: string;
  url?: string;
  gambar?: string | null;
}

export interface TechnicalDomain {
  id: number;
  title: string;
  tools: string;
  icon: string;
}

export interface ProfileLink {
  id: number;
  platform: string;
  url: string;
}

export interface PublicPortfolioData {
  profil?: Profile;
  about_me?: Partial<AboutMeData>;
  riwayat_pendidikan?: Education[];
  pengalaman?: Experience[];
  keahlian?: Skill[];
  karya_terbaik?: Project[];
  technical_domains?: TechnicalDomain[];
  links?: ProfileLink[];
}

export interface AdminUser extends Profile {}

export interface AlertState {
  show: boolean;
  type: 'success' | 'error' | '';
  message: string;
}

export interface TokenProps {
  token: string;
}

export interface AboutMeForm extends AboutMeData {}

export interface EducationForm {
  nama_institusi: string;
  tingkat: string;
  jurusan: string;
  tahun_mulai: string;
  tahun_selesai: string;
  gambar: File | null;
}

export interface ExperienceForm {
  nama_perusahaan: string;
  jabatan: string;
  tahun_mulai: string;
  tahun_selesai: string;
  gambar: File | null;
}

export interface ProjectForm {
  nama_karya: string;
  deskripsi: string;
  url: string;
  gambar: File | null;
}
