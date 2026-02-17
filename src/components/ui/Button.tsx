import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
    primary:
        'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25',
    secondary:
        'bg-slate-800 text-white hover:bg-slate-700',
    outline:
        'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
    danger:
        'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25',
};

const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', className = '', disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
