import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';

const SIZE_CLASSES = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(partner) {
  if (partner?.logoInitials) return partner.logoInitials;
  const name = String(partner?.name || '').trim();
  if (!name) return 'IS';
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function PartnerLogo({ partner, size = 'lg', className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoUrl = partner?.logoUrl?.trim();

  useEffect(() => {
    setImgFailed(false);
  }, [logoUrl]);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.lg;

  if (logoUrl && !imgFailed) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-700/80 dark:bg-slate-900',
          sizeClass,
          className,
        )}
      >
        <img
          src={logoUrl}
          alt={`${partner?.name || 'Partner'} logo`}
          className="h-full w-full rounded-lg object-contain"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm',
        sizeClass,
        partner?.logoBg || 'bg-brand-600',
        className,
      )}
    >
      {getInitials(partner)}
    </div>
  );
}
