import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-app-bg dark:bg-card-3 text-white dark:text-app-black hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:ring-app-bg dark:focus:ring-card-3",
      secondary: "bg-card-1 dark:bg-card-2 text-app-black dark:text-app-black hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:ring-card-1 dark:focus:ring-card-2",
      outline: "border-2 border-app-bg dark:border-card-3 text-app-bg dark:text-card-3 hover:bg-app-bg/10 dark:hover:bg-card-3/10 focus:ring-app-bg dark:focus:ring-card-3",
      ghost: "text-app-black dark:text-white hover:bg-app-black/10 dark:hover:bg-white/10 focus:ring-app-black dark:focus:ring-white",
      danger: "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-600",
    };
    
    const sizes = {
      sm: "text-xs px-3 py-2",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    };
    
    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button; 