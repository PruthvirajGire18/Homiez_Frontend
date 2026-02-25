import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

const Login = () => {
  const [logindata, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Updated to v5 object syntax
      navigate("/", { replace: true });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Invalid email or password"
      );
    },
  });

  const handleInputChange = (e) => {
    setLoginData({ ...logindata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(logindata);
  };

  return (
    // Swapped flex centering for a safer scrolling approach on mobile keyboards
    <div className="flex min-h-[100dvh] flex-col justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Log in to continue your collaboration workspace
          </p>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="mb-6 flex animate-in fade-in slide-in-from-top-2 items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <span className="leading-relaxed">
              {error?.response?.data?.message ||
                error.message ||
                "Login failed. Please check your credentials and try again."}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email Address
            </label>
            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500" />
              <input
                id="email"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-11 pr-4 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 sm:h-11 sm:text-sm"
                value={logindata.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <div className="group relative">
              <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-11 pr-12 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 sm:h-11 sm:text-sm"
                value={logindata.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:h-9 sm:w-9"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary mt-2 flex h-12 w-full items-center justify-center rounded-xl border-0 text-base font-semibold normal-case shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 sm:h-11"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-zinc-800/80 pt-6 text-center text-sm text-zinc-400">
          Do not have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;