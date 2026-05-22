import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-bright-blue/50 focus:border-bright-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';
export { Input };
