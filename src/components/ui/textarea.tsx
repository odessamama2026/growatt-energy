import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-md border border-line bg-paper px-4 py-3 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
