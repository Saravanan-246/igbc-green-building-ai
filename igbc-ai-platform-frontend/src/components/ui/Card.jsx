const variantClasses = {
  normal:
    "border-slate-200/80 bg-white text-slate-900 shadow-xs",
  
  glass:
    "border-white/60 bg-white/70 text-slate-900 shadow-sm backdrop-blur-md",
  
  gradient:
    "border-emerald-100/60 bg-gradient-to-br from-white via-emerald-50/30 to-slate-50/50 text-slate-900 shadow-xs",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6", // Upped to 24px for a more spacious, premium look
  lg: "p-8", // Upped to 32px for enterprise dashboard grids
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Card({
  as: Component = "section",
  variant = "normal",
  padding = "md",
  interactive = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-[1.5rem] border transition-all duration-300 ease-out",
        interactive && [
          "cursor-pointer",
          "hover:-translate-y-1 hover:border-emerald-500/20",
          "hover:shadow-xl hover:shadow-slate-200/40",
          "active:scale-[0.99] active:translate-y-0"
        ],
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
