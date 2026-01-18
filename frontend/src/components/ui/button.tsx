import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-[Cinzel] font-semibold uppercase tracking-wider ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ro-gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[var(--ro-gold)] to-[var(--ro-gold-dark)] text-[var(--ro-brown-dark)] border-2 border-[var(--ro-gold-dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.3)] hover:from-[var(--ro-gold-light)] hover:to-[var(--ro-gold)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(212,164,76,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]",
        destructive:
          "bg-gradient-to-b from-[var(--ro-red)] to-[#6b1f32] text-white border-2 border-[#6b1f32] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.3)] hover:from-[#a33352] hover:to-[var(--ro-red)]",
        outline:
          "border-2 border-[var(--ro-gold-dark)] bg-transparent text-[var(--ro-gold)] hover:bg-[rgba(212,164,76,0.1)] hover:border-[var(--ro-gold)] hover:shadow-[0_0_10px_rgba(212,164,76,0.2)]",
        secondary:
          "bg-[var(--ro-brown-light)] text-[var(--ro-parchment)] border border-[var(--ro-gold-dark)] hover:bg-[var(--ro-brown)] hover:border-[var(--ro-gold)]",
        ghost: "text-[var(--ro-gold)] border border-transparent hover:bg-[rgba(212,164,76,0.1)] hover:border-[rgba(212,164,76,0.3)] hover:text-shadow-[0_0_10px_rgba(212,164,76,0.5)]",
        link: "text-[var(--ro-gold)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
