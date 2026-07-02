import { Flower, Heart, Sparkles, Users } from 'lucide-react';

type MemoryIconProps = {
  itemId: string;
  className?: string;
};

export function MemoryIcon({ itemId, className = '' }: MemoryIconProps) {
  const iconClassName = `${className}`.trim();

  if (itemId === 'ngoc-mai') {
    return <Flower className={iconClassName} />;
  }

  if (itemId === 'ban-be') {
    return <Users className={iconClassName} />;
  }

  if (itemId === 'gia-dinh') {
    return <Heart className={iconClassName} />;
  }

  return <Sparkles className={iconClassName} />;
}
