import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[13px] font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111113]/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.985]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#111113] text-white hover:bg-[#27272A] border border-transparent shadow-[0_8px_20px_-6px_rgba(17,17,19,0.28)]",
                indigo:
                    "bg-[#4F46E5] text-white hover:bg-[#4338CA] border border-transparent shadow-[0_8px_20px_-6px_rgba(79,70,229,0.35)]",
                terracotta:
                    "bg-[#9E331A] text-white hover:bg-[#B83D20] border border-transparent shadow-[0_8px_20px_-6px_rgba(158,51,26,0.3)]",
                secondary:
                    "bg-[#F3F1EC] text-[#111113] border border-black/[0.08] hover:bg-[#EAE7DF]",
                outline:
                    "border border-black/[0.11] bg-white text-[#111113] hover:bg-[#FBFBF9] hover:border-black/[0.2] shadow-[0_1px_2px_rgba(17,17,19,0.03)]",
                ghost:
                    "text-[#52525B] hover:text-[#111113] hover:bg-black/[0.04]",
                link:
                    "text-[#4F46E5] underline-offset-4 hover:underline p-0 h-auto font-medium active:scale-100 rounded-none",
                destructive:
                    "bg-[#BA1A1A] text-white hover:bg-[#991B1B] border border-transparent shadow-xs",
            },
            size: {
                default: "h-9 px-4 py-2 text-[13px]",
                sm: "h-8 px-3.5 py-1.5 text-[12px]",
                lg: "h-10.5 px-6 py-2.5 text-[13.5px]",
                icon: "h-9 w-9 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
