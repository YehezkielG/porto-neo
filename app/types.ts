export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced';

export type AboutListField = 'interests' | 'favoriteLanguages' | 'beyondCode';

export interface AboutItem {
  text: string;
  icon: string;
}

export interface AboutMeData {
  description: string;
  interests: AboutItem[];
  favoriteLanguages: AboutItem[];
  beyondCode: AboutItem[];
}

export interface Profile {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  photo?: string;
  description?: string;
}

export interface Education {
  id: number;
  institution: string;
  level?: string;
  fieldOfStudy?: string;
  startYear?: string | number;
  endYear?: string | number | null;
  image?: string | null;
}

export interface Experience {
  id: number;
  company: string;
  jobTitle: string;
  startYear?: string | number;
  endYear?: string | number | null;
  image?: string | null;
}

export interface Skill {
  id: number;
  name: string;
  level: SkillLevel;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  url?: string;
  image?: string | null;
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
  profile?: Profile;
  aboutMe?: Partial<AboutMeData>;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  projects?: Project[];
  technicalDomains?: TechnicalDomain[];
  links?: ProfileLink[];
}

