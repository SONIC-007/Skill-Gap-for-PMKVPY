import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-[#111113] text-white",
                secondary: "border-[#4F46E5]/20 bg-[#EAEDFF] text-[#3525CD]",
                destructive: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
                success: "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]",
                warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
                outline: "border-black/[0.1] bg-white text-[#111113]",
                muted: "border-black/[0.08] bg-[#F3F1EC] text-[#52525B]",
            },
        },
        defaultVariants: { variant: "default" },
    }
);

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
