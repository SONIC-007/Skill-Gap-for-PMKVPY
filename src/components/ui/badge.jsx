import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-[#4F46E5] text-white",
                secondary: "border-[#C7C4D8] bg-[#EAEDFF] text-[#3525CD]",
                destructive: "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]",
                success: "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]",
                warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
                outline: "border-[#E2E8F0] bg-white text-[#0F172A]",
                muted: "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]",
            },
        },
        defaultVariants: { variant: "default" },
    }
);

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
