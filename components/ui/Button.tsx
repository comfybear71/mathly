'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-500 shadow-lg hover:shadow-xl',
  secondary: 'bg-secondary text-white hover:bg-secondary-500 shadow-lg hover:shadow-xl',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  danger: 'bg-error text-white hover:opacity-90 shadow-lg',
};

const sizes = {
  sm: 'py-2 px-4 text-sm rounded-lg',
  md: 'py-3 px-6 text-base rounded-xl',
  lg: 'py-4 px-8 text-lg rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`font-heading font-bold transition-all duration-200 inline-flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
}
