import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, Heart, Play, ArrowRight } from 'lucide-react';

const Landing = () => (
  <div className="bg-white">
    <section className="relative h-[600px] flex items-center bg-primary text-white overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-10 relative z-10">
        <div className="max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full w-fit mb-6 text-sm border border-white/20">Play. Give. Win.</div>
          <h1 className="text-6xl font-bold leading-tight mb-6 tracking-tight">Better Golf.<br />A Brighter Tomorrow.</h1>
          <p className="text-xl text-emerald-50 mb-10">Track your game. Win exciting prizes. Support wonderful causes.</p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-primary-light hover:bg-emerald-400 px-10 py-4 rounded-xl font-bold text-lg">Get Started</Link>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-slate-50"><Play size={18} fill="currentColor"/> Watch Video</button>
          </div>
        </div>
      </div>
    </section>
    <div className="bg-primary py-10 border-t border-white/10">
      <div className="container mx-auto px-10 grid grid-cols-4 gap-8 text-center">
        <StatItem v="1,240+" l="Active Golfers" />
        <StatItem v="₹ 8.4M" l="Raised for Charity" />
        <StatItem v="25+" l="Charity Partners" />
        <StatItem v="12" l="Monthly Winners" />
      </div>
    </div>
  </div>
);

const StatItem = ({ v, l }: any) => (
  <div><p className="text-3xl font-bold text-white mb-1">{v}</p><p className="text-emerald-300 text-xs font-black uppercase tracking-widest">{l}</p></div>
);

export default Landing;