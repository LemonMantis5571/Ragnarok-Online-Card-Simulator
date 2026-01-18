import * as React from "react"

import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 animate-[scaleIn_0.3s_ease-out]">{children}</div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ro-panel bg-gradient-to-b from-[rgba(45,35,24,0.98)] to-[rgba(26,20,16,0.99)] text-foreground rounded-lg border-2 border-[var(--ro-gold-dark)] shadow-[0_0_30px_rgba(0,0,0,0.7),0_0_60px_rgba(212,164,76,0.1)] p-6 w-full max-w-lg relative",
      className
    )}
    {...props}
  >
    {/* Decorative Corners */}
    <div className="ro-corner ro-corner-tl"></div>
    <div className="ro-corner ro-corner-tr"></div>
    <div className="ro-corner ro-corner-bl"></div>
    <div className="ro-corner ro-corner-br"></div>

    {/* Close button area glow */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--ro-gold)] to-transparent opacity-30"></div>

    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left pb-4 border-b border-[rgba(212,164,76,0.2)] mb-4",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-xl font-[Cinzel] font-semibold leading-none tracking-tight text-[var(--ro-gold)]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-2", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }
