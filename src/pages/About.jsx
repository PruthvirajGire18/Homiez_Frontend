import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-5 py-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-indigo-500">Homiez</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            A real-time collaboration platform built for fast, simple, and
            natural communication.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Left */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">What is Homiez?</h2>
            <p className="text-gray-400 leading-relaxed">
              Homiez is a web-based, real-time collaboration platform that
              combines chat, video calling, and social networking in one clean,
              mobile-first experience.
            </p>
            <p className="text-gray-400 leading-relaxed">
              It’s designed for quick catch-ups, remote teamwork, and instant
              communication — think <span className="text-gray-200">Slack + Zoom</span>,
              but lightweight and distraction-free.
            </p>

            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              Our mission is to make online communication feel instant and
              human, without bloated workflows or complex tools.
            </p>
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="💬 Real-Time Chat"
              desc="Instant one-on-one messaging with presence and threads."
            />
            <FeatureCard
              title="🎥 Video Calls"
              desc="Start or join calls directly inside a chat."
            />
            <FeatureCard
              title="🤝 Friend System"
              desc="Connect, manage friends, and discover new users."
            />
            <FeatureCard
              title="📱 Mobile First"
              desc="Responsive UI that feels great on any device."
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Built With Modern Tech</h2>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Homiez is built using React, Tailwind CSS, Node.js, MongoDB, JWT
            authentication, and Stream Chat & Video SDK — deployed on Netlify
            and Vercel for performance and reliability.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          Built with ❤️ to make collaboration simple, fast, and human.
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-gray-900 rounded-2xl p-6 shadow hover:shadow-indigo-500/10 transition">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </div>
);

export default About;