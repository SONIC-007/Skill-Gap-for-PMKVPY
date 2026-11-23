import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]", {
    variants: {
        variant: {
            default: "bg-[#0071e3] text-white hover:bg-[#0077ed] active:bg-[#0066cc] border border-transparent shadow-none",
            secondary: "bg-transparent text-[#0071e3] border border-[#0071e3] hover:bg-[#0071e3]/5 active:bg-[#0071e3]/10",
            outline: "border border-[#d2d2d7] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b] active:bg-[#e5e5ea]",
            ghost: "text-[#1d1d1f] hover:bg-[#1d1d1f]/5 active:bg-[#1d1d1f]/10",
            link: "text-[#0066cc] underline-offset-4 hover:underline p-0 h-auto font-normal active:scale-100",
            destructive: "bg-[#ff3b30] text-white hover:bg-[#e03126] active:bg-[#c92a20] shadow-none",
        },
        size: {
            default: "h-[44px] px-[21px] py-[11px]",
            sm: "h-[36px] px-4 py-2 text-xs",
            lg: "h-[50px] px-8 py-3 text-[17px]",
            icon: "h-[40px] w-[40px] p-0 rounded-full",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}/>);
});
Button.displayName = "Button";
export { Button, buttonVariants };
