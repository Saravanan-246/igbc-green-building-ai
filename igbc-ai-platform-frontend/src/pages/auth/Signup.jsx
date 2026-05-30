import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../store/authStore";

// ==========================================
// SYSTEM ASSETS & BRAND ICONS
// ==========================================
const iconPaths = {
  leaf: "M19.5 4.5C11 4.8 5.5 9.8 5.5 16.8c0 1.1.2 2.1.7 3 6.8-.6 12.3-6.1 13.3-15.3ZM5.8 19.7C8.2 14.8 12 11.4 17 9.4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z",
  mail: "M4.5 6.5h15v11h-15v-11Zm1.2 1.2 6.3 5 6.3-5",
  lock: "M7 10V8a5 5 0 0 1 10 0v2M6.5 10h11A1.5 1.5 0 0 1 19 11.5v7A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10 4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z",
  eyeOff: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  arrow: "M5 12h14m-5-5 5 5-5 5"
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Icon({ name, className = "" }) {
  if (!iconPaths[name]) return null;
  const isStroke = name === "leaf" || name === "arrow";
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : "none"}
      strokeWidth={isStroke ? "1.8" : "0"}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return { label: "Strong", width: "w-full", className: "bg-emerald-500" };
  if (score >= 3) return { label: "Good", width: "w-3/4", className: "bg-teal-500" };
  if (score >= 2) return { label: "Fair", width: "w-1/2", className: "bg-amber-500" };
  return { label: "Weak", width: "w-1/4", className: "bg-red-500" };
}

// ==========================================
// ELEVATED SIGNUP INTERFACE (Google/OpenAI Tier)
// ==========================================
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (formData.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid business email.";
    }

    if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    signUp({
      name: formData.name.trim(),
      email: formData.email.trim(),
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen relative font-sans antialiased flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#f6fdf9] to-[#daf4e4] overflow-hidden">
      
      {/* Premium Deep Blend Aesthetic Blur Accents */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none" />

      {/* Main Structural Interface Card */}
      <div className="w-full max-w-[520px] bg-white border border-emerald-100/40 rounded-3xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(4,120,87,0.03),0_1px_2px_rgba(0,0,0,0.01)] relative z-10">
        
        {/* Workspace Brand Identity */}
        <div className="flex flex-col items-center text-center mb-9">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-white mb-5 shadow-md shadow-emerald-700/10 transition-transform duration-300 hover:scale-105">
            <Icon name="leaf" className="h-5 w-5" />
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight text-slate-900 leading-tight">
            Create your account
          </h1>
          <p className="mt-2.5 text-sm text-slate-500 font-medium">
            Get started with your enterprise platform workspace.
          </p>
        </div>

        {/* Form Module */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Identity Grid Fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Full Name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Icon name="user" className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  placeholder="Aarav Mehta"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>
              {errors.name && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Icon name="mail" className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              {errors.email && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.email}</p>}
            </div>
          </div>

          {/* Password Authentication Grid Fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Icon name="lock" className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-11 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Icon name="lock" className="h-4 w-4" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-11 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  <Icon name={showConfirmPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Password Dynamic Evaluation Indicator */}
          {formData.password && (
            <div className="flex items-center gap-3 pt-1">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className={cn("h-full rounded-full transition-all duration-300", strength.width, strength.className)} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[45px] text-right">{strength.label}</span>
            </div>
          )}

          {/* Submission Control Core Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 px-4 mt-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Creating Workspace..." : "Get Started"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </form>

        {/* Bottom Platform Route Navigation Links */}
        <p className="mt-9 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors" to="/login">
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Signup;