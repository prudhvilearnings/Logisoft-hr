import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-orange-50 text-orange-600 border-orange-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
