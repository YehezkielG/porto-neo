import type { PublicPortfolioData } from '../types';

/**
 * Public portfolio content. Kept in the frontend so this site can be deployed
 * as a static app without the PHP API. Update this file to change the content.
 */
export const portfolioData: PublicPortfolioData = {
  profile: {
    fullName: 'Yehezkiel Haganta Tarigan',
    email: 'yehezkielhaganta@gmail.com',
    phone: '+62 838-2290-5683',
    photo: '/kiel.jpg',
    description: 'Computer science student passionate about building software and exploring artificial intelligence.',
  },
  aboutMe: {
    description: 'Hi, I’m Yehezkiel, a computer science student passionate about building software and exploring the world of Artificial Intelligence systems. I enjoy learning things deeply, often going beyond the surface to understand how and why they work.',
    interests: [
      { text: 'Software Engineering', icon: 'CodeXml' },
      { text: 'AI Engineering', icon: 'BrainCircuit' },
      { text: 'Neural Networks & Deep Learning', icon: 'Network' },
    ],
    favoriteLanguages: [
      { text: 'TypeScript', icon: 'Braces' },
      { text: 'Python', icon: 'Terminal' },
    ],
    beyondCode: [
      { text: 'Watching movies', icon: 'Clapperboard' },
      { text: 'Reading books', icon: 'BookOpen' },
      { text: 'Running', icon: 'Activity' },
      { text: 'Playing mobile games', icon: 'Gamepad2' },
    ],
  },
  education: [
    {
      id: 1,
      institution: 'Medan State University',
      level: "Bachelor's Degree",
      fieldOfStudy: 'Computer Science',
      startYear: 2024,
      endYear: null,
      image: '/Lambang_Universitas_Negeri_Medan.png',
    },
    {
      id: 2,
      institution: 'SMK Tritech Informatika',
      level: 'SMK',
      fieldOfStudy: 'Software Engineer',
      startYear: 2021,
      endYear: 2024,
      image: '/tritech.png',
    },
  ],
  experience: [],
  skills: [
    { id: 1, name: 'TypeScript', level: 'Advanced' },
    { id: 2, name: 'Python', level: 'Intermediate' },
    { id: 4, name: 'C++', level: 'Basic' }
  ],
  projects: [
    {
      id: 1,
      name: 'NimoLM-244M',
      description: 'NimoLM-244M is a compact decoder-only language model developed from scratch, designed to explore hybrid attention architectures that combine Gated Linear Attention (GLA) with conventional causal self-attention.',
      url: 'https://huggingface.co/yehezkielhaganta/NimoLM-244M-base',
      image: '/nimo.jpg',
    },
  ],
  technicalDomains: [],
  links: [
    { id: 1, platform: 'github', url: 'https://github.com/YehezkielG' },
    { id: 2, platform: 'linkedin', url: 'https://www.linkedin.com/in/yehezkiel-haganta/' },
    { id: 4, platform: 'instagram', url: 'https://www.instagram.com/yehezkiel_haganta_/' },
    { id: 5, platform: 'kaggle', url: 'https://www.kaggle.com/yehezkielhaganta' },
  ],
};
