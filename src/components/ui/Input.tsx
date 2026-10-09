import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#9fb4c7] flex justify-between items-center">
            <span>{label}</span>
            {props.required && <span className="text-[#00d6c8] text-[10px]">*REQ</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#9fb4c7]">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#061424]/90 border text-[#e9f2f9] font-['Manrope',sans-serif] text-sm px-3.5 py-2.5 rounded-sm transition-all duration-200 placeholder:text-[#9fb4c7]/40 focus:outline-none ${
              error
                ? 'border-[#dd0000] focus:border-[#dd0000] focus:ring-1 focus:ring-[#dd0000]'
                : 'border-[#173654] focus:border-[#00d6c8] focus:shadow-[0_0_12px_rgba(0,214,200,0.2)]'
            } ${leftAddon ? 'pl-10' : ''} ${rightAddon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 flex items-center text-[#9fb4c7]">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#ff4d4d] font-['Manrope',sans-serif]">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-[#9fb4c7]/70 font-['Manrope',sans-serif]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
