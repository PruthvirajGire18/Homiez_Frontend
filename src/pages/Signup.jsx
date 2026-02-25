import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

const Signup = () => {
  const [signupData, setSignUpData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/onboarding");
    },
  });

  const handleInputChange = (e) => {
    setSignUpData({ ...signupData, [e.target.name]: e.target.value });
  };

  const passwordStrength =
    signupData.password.length < 6
      ? "Weak"
      : signupData.password.length < 10
      ? "Medium"
      : "Strong";

  return (
    // Changed to 100dvh to handle mobile browser toolbars seamlessly
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 p-4 text-zinc-100 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join your team and start collaborating
          </p>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="mb-6 flex animate-in fade-in slide-in-from-top-2 items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <span className="leading-relaxed">
              {error?.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again."}
            </span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(signupData);
          }}
          className="space-y-5"
        >
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="fullname" className="block text-sm font-medium text-zinc-300">
              Full Name
            </label>
            <div className="group relative">
              <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500" />
              <input
                id="fullname"
                type="text"
                name="fullname"
                placeholder="John Doe"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                value={signupData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

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
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                value={signupData.email}
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
                placeholder="Create a password"
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 pl-11 pr-12 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20"
                value={signupData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Visual Password Strength Indicator */}
            {signupData.password && (
              <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                <div className="flex gap-1.5">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength === "Weak"
                        ? "bg-red-400"
                        : passwordStrength === "Medium"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength === "Weak"
                        ? "bg-zinc-800"
                        : passwordStrength === "Medium"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength === "Strong"
                        ? "bg-emerald-400"
                        : "bg-zinc-800"
                    }`}
                  />
                </div>
                <p
                  className={`mt-1.5 text-xs font-medium transition-colors duration-300 ${
                    passwordStrength === "Weak"
                      ? "text-red-400"
                      : passwordStrength === "Medium"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary mt-2 flex h-11 w-full items-center justify-center rounded-xl border-0 text-base font-semibold normal-case shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-zinc-800/80 pt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;