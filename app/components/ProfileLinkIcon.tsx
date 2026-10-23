import {
  BrainCircuit,
  Camera,
  ChartNoAxesColumnIncreasing,
  Clapperboard,
  CodeXml,
  ContactRound,
  Film,
  Globe,
  MessageCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: Record<string, { slug: string | null; Fallback: LucideIcon }> = {
  linkedin: { slug: 'linkedin', Fallback: ContactRound },
  instagram: { slug: 'instagram', Fallback: Camera },
  imdb: { slug: 'imdb', Fallback: Film },
  letterboxd: { slug: 'letterboxd', Fallback: Clapperboard },
  github: { slug: 'github', Fallback: CodeXml },
  huggingface: { slug: 'huggingface', Fallback: BrainCircuit },
  kaggle: { slug: 'kaggle', Fallback: ChartNoAxesColumnIncreasing },
  discord: { slug: 'discord', Fallback: MessageCircle },
  portfolio: { slug: null, Fallback: Globe },
};

export const PROFILE_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/username' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/username' },
  { id: 'imdb', label: 'IMDb', placeholder: 'https://www.imdb.com/name/...' },
  { id: 'letterboxd', label: 'Letterboxd', placeholder: 'https://letterboxd.com/username' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { id: 'huggingface', label: 'Hugging Face', placeholder: 'https://huggingface.co/username' },
  { id: 'kaggle', label: 'Kaggle', placeholder: 'https://www.kaggle.com/username' },
  { id: 'discord', label: 'Discord', placeholder: 'https://discord.com/users/...' },
  { id: 'portfolio', label: 'Other portfolio', placeholder: 'https://your-other-portfolio.example' },
] as const;

export default function ProfileLinkIcon({ name, size = 22 }: { name: string; size?: number }) {
  const icon = icons[name] || icons.portfolio;
  const Fallback = icon.Fallback;
  if (!icon.slug) return <Fallback size={size} strokeWidth={2.25} aria-hidden="true" />;

  return (
    <>
      <img
        src={`https://cdn.simpleicons.org/${icon.slug}`}
        width={size}
        height={size}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          event.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <Fallback className="hidden" size={size} strokeWidth={2.25} aria-hidden="true" />
    </>
  );
}
