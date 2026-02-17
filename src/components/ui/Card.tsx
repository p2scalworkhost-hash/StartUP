import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<string, string> = {
    default: 'bg-white border border-slate-200',
    bordered: 'bg-white border-2 border-slate-200',
    elevated: 'bg-white shadow-lg shadow-slate-200/50',
};

const paddingStyles: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', padding = 'md', className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
          rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
