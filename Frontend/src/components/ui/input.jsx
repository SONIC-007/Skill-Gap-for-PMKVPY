import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-xl border border-black/[0.12] bg-[#FBFBF9]/80 px-3.5 py-2 text-[13px] text-[#111113] transition-all placeholder:text-[#71717A] focus-visible:bg-white focus-visible:border-[#111113] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113]/10 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
