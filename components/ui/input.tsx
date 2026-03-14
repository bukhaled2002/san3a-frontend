import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex sm:h-14 h-11 w-full rounded-none border border-primary/20 bg-card px-4 py-2 text-base font-medium text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tech-grey focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}

        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
