import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'primary', size = 'md', isLoading, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    {
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2 text-sm': size === 'md',
                        'h-12 px-6 text-base': size === 'lg',
                        'h-10 w-10 p-0': size === 'icon',
                    },
                    {
                        'bg-bright-blue text-white hover:bg-medium-blue shadow-lg shadow-bright-blue/20': variant === 'primary',
                        'bg-white text-navy border-2 border-slate-200 hover:border-bright-blue/50': variant === 'outline',
                        'hover:bg-bright-blue/10 text-navy': variant === 'ghost',
                        'bg-medium-blue text-white hover:bg-navy shadow-lg shadow-medium-blue/20': variant === 'secondary',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export { Button };
