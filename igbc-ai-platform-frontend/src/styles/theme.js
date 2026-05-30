export const theme = {
  colors: {
    primary: "#22C55E",    // Green 500
    primaryHover: "#16A34A", // Green 600
    secondary: "#34D399",  // Emerald 400
    accent: "#2DD4BF",     // Tech-focused Teal 400
    background: "#F8FFFB", // Premium light sustainability surface
    dark: "#0F172A",       // Slate 900 for text contrast
    white: "#FFFFFF",
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  shadows: {
    xs: "0 2px 8px -1px rgba(16, 185, 129, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)",
    sm: "0 12px 34px -6px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(16, 185, 129, 0.03)",
    md: "0 22px 50px -12px rgba(15, 23, 42, 0.07), 0 8px 24px -4px rgba(16, 185, 129, 0.04)",
    lg: "0 30px 70px -15px rgba(15, 23, 42, 0.12), 0 12px 32px -6px rgba(16, 185, 129, 0.06)",
    glow: "0 20px 50px -10px rgba(16, 185, 129, 0.25)",
  },
  gradients: {
    primary: "linear-gradient(135deg, #22C55E 0%, #34D399 50%, #2DD4BF 100%)",
    surface: "linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(244, 252, 247, 0.6) 100%)",
    ambient: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 48%, #ffffff 100%)",
  },
  cards: {
    normal:
      "rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-out",
    glass:
      "rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 ease-out",
    bento:
      "rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 ease-out",
    gradient:
      "rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white text-slate-900 shadow-sm transition-all duration-300 hover:shadow-lg",
  },
  buttons: {
    primary:
      "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:bg-emerald-600 active:scale-98 transition-all duration-200 font-medium",
    secondary:
      "bg-teal-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:bg-teal-600 active:scale-98 transition-all duration-200 font-medium",
    success:
      "bg-green-500 text-white shadow-md shadow-green-500/20 hover:bg-green-600 active:scale-98 transition-all duration-200 font-medium",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/60 transition-all duration-200 font-medium",
  },
};

export default theme;
