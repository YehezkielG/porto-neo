import {
  Activity,
  BookOpen,
  Bot,
  BrainCircuit,
  Braces,
  Camera,
  Clapperboard,
  CodeXml,
  Cpu,
  Database,
  Film,
  Gamepad2,
  Globe2,
  GraduationCap,
  Heart,
  Laptop,
  Lightbulb,
  Music2,
  Network,
  Palette,
  Rocket,
  Sparkles,
  Terminal,
  Wrench,
} from 'lucide-react';

export const ABOUT_ICON_OPTIONS = [
  { name: 'CodeXml', label: 'Code', Icon: CodeXml, color: 'text-[#087d9c]' },
  { name: 'BrainCircuit', label: 'AI / Brain', Icon: BrainCircuit, color: 'text-violet-600' },
  { name: 'Network', label: 'Network', Icon: Network, color: 'text-pink-600' },
  { name: 'Braces', label: 'Braces', Icon: Braces, color: 'text-sky-600' },
  { name: 'Terminal', label: 'Terminal', Icon: Terminal, color: 'text-emerald-600' },
  { name: 'Database', label: 'Database', Icon: Database, color: 'text-indigo-600' },
  { name: 'Cpu', label: 'CPU', Icon: Cpu, color: 'text-orange-600' },
  { name: 'Laptop', label: 'Laptop', Icon: Laptop, color: 'text-cyan-700' },
  { name: 'Bot', label: 'Robot', Icon: Bot, color: 'text-violet-600' },
  { name: 'BookOpen', label: 'Book', Icon: BookOpen, color: 'text-lime-700' },
  { name: 'Clapperboard', label: 'Movies', Icon: Clapperboard, color: 'text-rose-600' },
  { name: 'Film', label: 'Film', Icon: Film, color: 'text-fuchsia-600' },
  { name: 'Activity', label: 'Activity', Icon: Activity, color: 'text-emerald-600' },
  { name: 'Gamepad2', label: 'Gaming', Icon: Gamepad2, color: 'text-purple-600' },
  { name: 'Music2', label: 'Music', Icon: Music2, color: 'text-pink-600' },
  { name: 'Camera', label: 'Camera', Icon: Camera, color: 'text-amber-700' },
  { name: 'Palette', label: 'Creative', Icon: Palette, color: 'text-fuchsia-600' },
  { name: 'Rocket', label: 'Rocket', Icon: Rocket, color: 'text-orange-600' },
  { name: 'Globe2', label: 'Global', Icon: Globe2, color: 'text-blue-600' },
  { name: 'Lightbulb', label: 'Idea', Icon: Lightbulb, color: 'text-amber-600' },
  { name: 'Wrench', label: 'Tools', Icon: Wrench, color: 'text-slate-600' },
  { name: 'GraduationCap', label: 'Learning', Icon: GraduationCap, color: 'text-sky-700' },
  { name: 'Heart', label: 'Favorite', Icon: Heart, color: 'text-rose-600' },
  { name: 'Sparkles', label: 'Sparkles', Icon: Sparkles, color: 'text-[#087d9c]' },
];

export const ABOUT_ICON_MAP = Object.fromEntries(
  ABOUT_ICON_OPTIONS.map((option) => [option.name, option]),
);

export const DEFAULT_ABOUT_ICONS = {
  interests: ['CodeXml', 'BrainCircuit', 'Network'],
  favorite_languages: ['Braces', 'Terminal'],
  beyond_code: ['Clapperboard', 'BookOpen', 'Activity', 'Gamepad2'],
};

