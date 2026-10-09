import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'teal' | 'outline' | 'ember' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'teal',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-["Oswald",sans-serif] tracking-wider uppercase transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-sm',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-sm',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-sm',
  };

  const variantStyles = {
    teal: 'bg-[#00d6c8] text-[#061424] font-semibold hover:bg-[#1ef9eb] hover:shadow-[0_0_20px_rgba(0,214,200,0.4)] active:scale-[0.98]',
    outline:
      'border border-[#173654] bg-[#091c31]/80 text-[#e9f2f9] hover:border-[#00d6c8] hover:text-[#00d6c8] hover:bg-[#00d6c8]/10 hover:shadow-[0_0_15px_rgba(0,214,200,0.15)] active:scale-[0.98]',
    ember:
      'bg-gradient-to-r from-[#dd0000] to-[#ff6a00] text-white font-semibold hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] active:scale-[0.98]',
    ghost:
      'text-[#9fb4c7] hover:text-[#e9f2f9] hover:bg-[#173654]/40 active:scale-[0.98]',
    danger:
      'border border-[#dd0000]/60 bg-[#dd0000]/10 text-[#ff4d4d] hover:bg-[#dd0000] hover:text-white active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
