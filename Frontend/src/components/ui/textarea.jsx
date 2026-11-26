import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[84px] w-full rounded-xl border border-black/[0.12] bg-[#FBFBF9]/80 px-3.5 py-2.5 text-[13px] text-[#111113] placeholder:text-[#71717A] focus-visible:bg-white focus-visible:outline-none focus-visible:border-[#111113] focus-visible:ring-2 focus-visible:ring-[#111113]/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
