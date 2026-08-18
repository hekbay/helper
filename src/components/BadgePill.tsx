import React from 'react';
import type { BadgeLevel } from '../types/index';

interface BadgePillProps {
  level: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgePill: React.FC<BadgePillProps> = ({ level, size = 'md' }) => {
  let badgeStyles = '';

  switch (level) {
    case 'VIP':
      badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      break;
    case 'ESPECIAL':
      // Azul Safira clean - Apenas o texto "ESPECIAL"
      badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      break;
    case 'SILVER':
    default:
      badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200 font-semibold';
      break;
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3.5 py-1 font-bold'
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border tracking-wide uppercase transition-colors ${badgeStyles} ${sizeStyles}`}
    >
      {level}
    </span>
  );
};
