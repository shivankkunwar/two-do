import { forwardRef, type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Variants
            "bg-primary text-white hover:bg-blue-600 focus:ring-primary active:scale-95":
              variant === "primary",
            "bg-secondary text-white hover:bg-green-600 focus:ring-secondary active:scale-95":
              variant === "secondary",
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300":
              variant === "outline",
            "text-gray-600 hover:bg-gray-100 focus:ring-gray-300":
              variant === "ghost",
            // Sizes
            "px-3 py-2 text-sm": size === "sm",
            "px-4 py-3 text-sm": size === "md",
            "px-6 py-4 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button; 