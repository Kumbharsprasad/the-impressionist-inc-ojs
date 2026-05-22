import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-bright-blue/50 focus:border-bright-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className
                )}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
