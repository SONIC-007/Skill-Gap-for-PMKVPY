import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-[13px] font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.99]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3525CD] border border-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_2px_rgba(15,23,42,0.06)]",
                secondary:
                    "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#E2E8F0]/70 hover:border-[#CBD5E1]",
                outline:
                    "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(15,23,42,0.02)]",
                ghost:
                    "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
                link:
                    "text-[#4F46E5] underline-offset-4 hover:underline p-0 h-auto font-medium active:scale-100",
                destructive:
                    "bg-[#BA1A1A] text-white hover:bg-[#991B1B] active:bg-[#7F1D1D] border border-transparent shadow-xs",
            },
            size: {
                default: "h-9 px-4 py-2 text-[13px]",
                sm: "h-8 px-3 py-1.5 text-[12px] rounded-md",
                lg: "h-10 px-5 py-2.5 text-[14px]",
                icon: "h-9 w-9 p-0 rounded-lg",
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
