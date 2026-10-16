import {
  Atom,
  Blocks,
  Bot,
  BrainCircuit,
  Boxes,
  ChartNoAxesColumnIncreasing,
  Cloud,
  CodeXml,
  Cpu,
  Database,
  FlaskConical,
  Gamepad2,
  Globe,
  Network,
  Palette,
  ScanEye,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Workflow,
  Wrench,
  CircuitBoard,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import type { ComponentProps } from 'react';

export const DOMAIN_ICON_OPTIONS = [
  { id: 'brain', label: 'AI & ML', Icon: BrainCircuit },
  { id: 'code', label: 'Code', Icon: CodeXml },
  { id: 'vision', label: 'Vision', Icon: ScanEye },
  { id: 'chip', label: 'IoT', Icon: Cpu },
  { id: 'database', label: 'Database', Icon: Database },
  { id: 'network', label: 'Network', Icon: Network },
  { id: 'bot', label: 'Robotics', Icon: Bot },
  { id: 'cloud', label: 'Cloud', Icon: Cloud },
  { id: 'security', label: 'Security', Icon: ShieldCheck },
  { id: 'terminal', label: 'Terminal', Icon: Terminal },
  { id: 'mobile', label: 'Mobile', Icon: Smartphone },
  { id: 'tools', label: 'Tools', Icon: Wrench },
  { id: 'design', label: 'Design', Icon: Palette },
  { id: 'analytics', label: 'Analytics', Icon: ChartNoAxesColumnIncreasing },
  { id: 'containers', label: 'Containers', Icon: Boxes },
  { id: 'workflow', label: 'Automation', Icon: Workflow },
  { id: 'web', label: 'Web', Icon: Globe },
  { id: 'blocks', label: 'Web3', Icon: Blocks },
  { id: 'research', label: 'Research', Icon: FlaskConical },
  { id: 'games', label: 'Game dev', Icon: Gamepad2 },
  { id: 'embedded', label: 'Embedded', Icon: CircuitBoard },
  { id: 'server', label: 'Backend', Icon: Server },
  { id: 'science', label: 'Science', Icon: Atom },
  { id: 'creative', label: 'Creative', Icon: Sparkles },
];

const DOMAIN_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(DOMAIN_ICON_OPTIONS.map(({ id, Icon }) => [id, Icon]));

type DomainIconProps = Omit<LucideProps, 'name'> & { name: string; size?: ComponentProps<LucideIcon>['size'] };

export const DomainIcon = ({ name, size = 24, ...props }: DomainIconProps) => {
  const Icon = DOMAIN_ICON_MAP[name] || CodeXml;
  return <Icon size={size} strokeWidth={2.25} aria-hidden="true" {...props} />;
};

