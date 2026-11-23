import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (<input type={type} className={cn("flex h-[42px] w-full rounded-xl border border-[#d2d2d7] bg-white px-3.5 py-2 text-[15px] text-[#1d1d1f] transition-colors placeholder:text-[#86868b] focus-visible:border-[#0071e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/20 disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props}/>);
});
Input.displayName = "Input";
export { Input };
