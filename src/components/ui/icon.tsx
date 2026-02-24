import { icons } from 'lucide-react';

interface IconProps {
  name: string;
  fallback?: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, fallback = 'CircleAlert', size = 24, className }: IconProps) {
  const LucideIcon = icons[name as keyof typeof icons] ?? icons[fallback as keyof typeof icons];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
}
