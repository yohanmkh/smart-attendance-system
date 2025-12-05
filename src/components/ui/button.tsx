import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-destructive hover:bg-destructive/90",
        outline:
          "border-2 border-border bg-background hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-border hover:bg-muted",
        ghost: "hover:bg-muted",
        link: "text-foreground underline-offset-4 hover:underline",
        accent:
          "bg-accent text-accent-foreground border-2 border-border hover:bg-accent/90",
        success:
          "bg-success text-success-foreground border-2 border-success hover:bg-success/90",
        glass:
          "bg-card border-2 border-border text-foreground hover:bg-muted",
        hero:
          "bg-card text-foreground border-2 border-border hover:bg-muted",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
