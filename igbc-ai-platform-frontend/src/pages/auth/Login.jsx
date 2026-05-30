import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRememberedEmail, signIn } from "../../store/authStore";

// ==========================================
// SYSTEM ASSETS & BRAND ICONS
// ==========================================
const iconPaths = {
  leaf: "M12 2C6.48 2 2 6.48 2 12c0 4.42 3.58 8 8 8v-2c-3.31 0-6-2.69-6-6 0-2.97 2.16-5.43 5-5.91V9h2V6.09c2.84.48 5 2.94 5 5.91 0 1.96-.94 3.7-2.41 4.8l1.27 1.54C18.66 16.92 20 14.61 20 12c0-5.52-4.48-10-10-10z",
  google: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10 4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z",
  eyeOff: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
};

function Icon({ name, className = "" }) {
  if (!iconPaths[name]) return null;
  const isStroke = name === "leaf" || name === "arrow";
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : "none"}
      strokeWidth={isStroke ? "2" : "0"}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

// ==========================================
// ELEVATED USER INTERFACE (Google/OpenAI Tier)
// ==========================================
function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: getRememberedEmail() || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({
        email: formData.email.trim(),
        name: "Enterprise Workspace User",
        remember: true,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please verify your account configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen relative font-sans antialiased flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#f6fdf9] to-[#daf4e4] overflow-hidden">
      
      {/* Editorial Aesthetic Organic Blur Accents */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/30 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-200/25 blur-[120px] pointer-events-none" />

      {/* Main Structural Interface Card */}
      <div className="w-full max-w-[460px] bg-white border border-emerald-100/40 rounded-3xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(4,120,87,0.03),0_1px_2px_rgba(0,0,0,0.01)] relative z-10">
        
        {/* Core Workspace Header Identification */}
        <div className="flex flex-col items-center text-center mb-9">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-white mb-5 shadow-md shadow-emerald-700/10 transition-transform duration-300 hover:scale-105">
            <Icon name="leaf" className="h-5 w-5" />
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight text-slate-900 leading-tight">
            Sign in to your account
          </h1>
          <p className="mt-2.5 text-sm text-slate-500 font-medium">
            Access your secure enterprise asset ecosystem.
          </p>
        </div>

        {/* OAuth Federation Identity Layout */}
        <div className="mb-7">
          <button 
            type="button" 
            className="flex w-full items-center justify-center gap-3 h-12 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm text-slate-700 transition active:scale-[0.99]"
          >
            <Icon name="google" className="h-4 w-4" />
            Sign in with Google
          </button>
        </div>

        {/* Separator Module */}
        <div className="relative flex py-3 items-center mb-7">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">or email access</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Core Transactional Authorization Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
              placeholder="name@company.com"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-12 text-sm font-normal text-slate-900 placeholder:text-slate-400/80 outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="text-xs font-semibold text-rose-600 bg-rose-50/70 border border-rose-100 rounded-xl px-4 py-3.5 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Continue"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </form>

        {/* Global Footer Navigation */}
        <p className="mt-9 text-center text-sm font-medium text-slate-500">
          New to the workspace?{" "}
          <Link className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors" to="/signup">
            Create account
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;