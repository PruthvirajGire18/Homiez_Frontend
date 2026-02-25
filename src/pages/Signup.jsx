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
    onSuccess: () => {
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
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Join your team and start collaborating
            </p>
          </div>

          {isError && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <AlertCircle size={16} />
              <span>
                {error?.response?.data?.message ||
                  error.message ||
                  "Something went wrong"}
              </span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate(signupData);
            }}
            className="space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                  value={signupData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                  value={signupData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                  value={signupData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {signupData.password && (
                <p
                  className={`mt-2 text-xs ${
                    passwordStrength === "Weak"
                      ? "text-red-400"
                      : passwordStrength === "Medium"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary h-11 w-full border-0 normal-case shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-zinc-200 transition-colors hover:text-white"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
