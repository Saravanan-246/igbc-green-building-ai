const variantClasses = {
  primary:
    "bg-emerald-600 text-white shadow-xs shadow-emerald-600/10 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-700/10 focus-visible:ring-emerald-600",
  
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400",
  
  success:
    "bg-teal-600 text-white shadow-xs shadow-teal-600/10 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-700/10 focus-visible:ring-teal-600",
  
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-300",
    
  danger:
    "bg-red-600 text-white shadow-xs shadow-red-600/10 hover:bg-red-700 hover:shadow-md hover:shadow-red-700/10 focus-visible:ring-red-600"
};

const sizeClasses = {
  sm: "h-9 gap-1.5 rounded-xl px-3.5 text-xs font-bold",
  md: "h-11 gap-2 rounded-2xl px-5 text-sm font-semibold",
  lg: "h-12 gap-2.5 rounded-[1.25rem] px-5 text-sm font-semibold sm:h-14 sm:px-6 sm:text-base",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}) {
  const componentProps = Component === "button" ? { type, ...props } : props;

  return (
    <Component
      className={cn(
        // Core Alignment and Layout Structures
        "inline-flex max-w-full shrink-0 items-center justify-center whitespace-nowrap border border-transparent select-none transition-all duration-200 ease-out",
        
        // Dynamic Focus and Keyboard Navigation States
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        
        // Disabled System State Overrides
        "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
        
        // Tactile Spring Kinetic Micro-Feedback on Click
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        // Design Token Variables Mapping
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...componentProps}
    >
      {children}
    </Component>
  );
}

export default Button;
