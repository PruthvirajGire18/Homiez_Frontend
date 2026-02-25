import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import toast from "react-hot-toast";

const OnBoarding = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/onboarding", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Onboarding completed successfully");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: () => {
      toast.error("Onboarding failed");
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
    toast("Random profile picture generated! You can change it if you want.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Tell us a little about yourself
            </p>
          </div>

          <div className="mb-5 flex justify-center">
            <div className="avatar">
              <div className="h-24 w-24 rounded-full ring-2 ring-zinc-700 ring-offset-2 ring-offset-zinc-900">
                <img
                  src={authUser?.profilePicture}
                  alt="Profile"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <button
              onClick={handleClick}
              type="button"
              className="btn btn-ghost btn-sm border border-zinc-700 bg-zinc-900 text-zinc-200 normal-case hover:bg-zinc-800"
            >
              Generate random profile picture
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell something about yourself"
                rows="3"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your city"
                className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary mt-2 h-11 w-full border-0 normal-case shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Finish Onboarding"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
