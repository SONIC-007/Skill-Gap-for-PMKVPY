import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors", {
    variants: {
        variant: {
            default: "border-transparent bg-[#0071e3] text-white",
            secondary: "border-[#0071e3]/20 bg-[#0071e3]/10 text-[#0071e3]",
            destructive: "border-[#ff3b30]/20 bg-[#ff3b30]/10 text-[#ff3b30]",
            success: "border-[#34c759]/20 bg-[#34c759]/10 text-[#248a3d]",
            warning: "border-[#f5a623]/25 bg-[#f5a623]/10 text-[#b36b00]",
            outline: "border-[#e5e7eb] bg-white text-[#1d1d1f]",
            muted: "border-transparent bg-[#f5f5f7] text-[#86868b]",
        },
    },
    defaultVariants: { variant: "default" },
});
function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props}/>;
}
export { Badge, badgeVariants };
