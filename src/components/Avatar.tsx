import React, { useState } from 'react';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'sm',
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (failed || !src) {
    return (
      <span
        aria-label={name}
        title={name}
        className={`inline-flex items-center justify-center rounded-full bg-[#172554] text-white font-semibold shrink-0 select-none ${SIZE_CLASSES[size]} ${className}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      title={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover object-top border border-[#E2E8F0] shrink-0 bg-[#F1F5F9] ${SIZE_CLASSES[size]} ${className}`}
    />
  );
};
