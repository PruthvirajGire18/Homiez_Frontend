import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

const OnBoarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/onboarding", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Onboarding completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // v5 syntax
    },
    onError: () => {
      toast.error("Onboarding failed. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleClick = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    const randomImageUrl = `https://avatar.iran.liara.run/public/${randomNum}.png`;
    setFormData({ ...formData, profilePicture: randomImageUrl });
    toast.success("New avatar generated!");
  };

  return (
    // Swapped flex centering for safe scrolling when mobile keyboard is open
    <div className="flex min-h-[100dvh] flex-col justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-zinc-800/60 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Tell your teammates a little bit about yourself.
          </p>
        </div>

        {/* Avatar Section */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="avatar group relative">
            <div className="h-24 w-24 shrink-0 rounded-full bg-zinc-800 ring-4 ring-zinc-800/50 ring-offset-4 ring-offset-zinc-900 transition-all duration-300 group-hover:ring-emerald-500/30">
              <img
                src={formData.profilePicture || "/default-profile.png"}
                alt="Profile Preview"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          
          <button
            onClick={handleClick}
            type="button"
            className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-4 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-zinc-700/50 hover:text-zinc-100 active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" />
            Generate Random Avatar
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1.5">
            <label htmlFor="fullname" className="block text-sm font-medium text-zinc-300">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              // text-base on mobile prevents iOS zoom, sm:text-sm returns to standard on desktop
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 sm:h-11 sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-sm font-medium text-zinc-300">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="What do you do? What are your interests?"
              rows="3"
              // text-base prevents iOS zoom. Added min-h-[100px] for a better mobile tap target
              className="min-h-[100px] w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              // text-base prevents iOS zoom
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 sm:h-11 sm:text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary flex h-12 w-full items-center justify-center rounded-xl border-0 text-base font-semibold normal-case shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 sm:h-11"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Finish Onboarding"
              )}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default OnBoarding;