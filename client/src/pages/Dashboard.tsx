import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePerformanceTracker } from '../hooks/usePerformanceTracker';
import { 
  LayoutDashboard, MapPin, Calendar, Clock, Trophy, 
  Target, Heart, Star, ChevronRight, Settings, Users 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { scores } = usePerformanceTracker();

  return (
    <div className="min-h-screen bg-brand-slate flex">
      {/* SIDEBAR - Matches Screenshot */}
      <aside className="w-72 bg-brand-green text-white hidden lg:flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-white/10 p-2 rounded-lg"><Trophy size={20}/></div>
          <span className="text-xl font-black uppercase tracking-tighter">Digital Heroes</span>
        </div>
        
        <nav className="flex-grow space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <SidebarLink icon={<Calendar size={20}/>} label="My Bookings" />
          <SidebarLink icon={<Target size={20}/>} label="My Scores" />
          <SidebarLink icon={<Star size={20}/>} label="Rewards" />
          <SidebarLink icon={<Heart size={20}/>} label="Charity" />
        </nav>

        <div className="pt-8 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">{user?.fullName?.[0]}</div>
             <div className="text-sm">
                <p className="font-bold">{user?.fullName}</p>
                <p className="text-xs text-white/50">{user?.role}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Welcome back, {user?.fullName}! 👋</h1>
            <p className="text-slate-400 font-medium mt-1">Keep playing, keep improving, keep making an impact.</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <Calendar size={18} className="text-brand-mint" />
            <span className="text-sm font-bold text-slate-600">Thu, 24 Sep 2026</span>
          </div>
        </header>

        {/* TOP STATS RIBBON */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Users className="text-blue-500"/>} label="Rounds Played" val="18" bg="bg-blue-50" />
          <StatCard icon={<Target className="text-emerald-500"/>} label="Average Score" val="36.4" bg="bg-emerald-50" />
          <StatCard icon={<Heart className="text-red-500"/>} label="Best Score" val="42" bg="bg-red-50" />
          <StatCard icon={<Star className="text-amber-500"/>} label="Reward Points" val="1,240" bg="bg-amber-50" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Tee Time */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-card border border-slate-50">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Tee Time</h3>
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex gap-5 items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border p-1 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Trichy Golf Club</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar size={14}/> Sat, 26 Sep 2026 • <Clock size={14}/> 07:20 AM
                    </p>
                  </div>
                </div>
                <button className="bg-brand-green text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20">View Details</button>
              </div>
            </section>

            {/* Recent Scores Grid */}
            <section className="bg-white rounded-[2rem] p-8 shadow-card border border-slate-50">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold">Recent Scores</h3>
                 <button className="text-brand-mint text-sm font-bold">View All</button>
               </div>
               <div className="flex items-end justify-between px-4">
                  {[42, 38, 35, 32, 40].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 group">
                       <div className="w-10 bg-brand-green/10 rounded-t-lg group-hover:bg-brand-mint transition-all" style={{ height: `${h * 4}px` }}></div>
                       <p className="text-xs font-bold text-slate-400">{10+i} Sep</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Column Cards */}
          <div className="space-y-8">
             <ImpactCard />
             <div className="bg-white rounded-[2rem] p-8 shadow-card border border-slate-50 text-center">
                <Star size={32} className="text-brand-gold mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-400 uppercase">Your Rank</h4>
                <p className="text-3xl font-black text-slate-900 mt-2">#248</p>
                <p className="text-xs text-brand-mint font-bold mt-2">Among 10,000+ Players</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Components
const SidebarLink = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
    {icon} {label}
  </div>
);

const StatCard = ({ icon, label, val, bg }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-card flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${bg}`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900">{val}</p>
    </div>
  </div>
);

const ImpactCard = () => (
  <div className="bg-white rounded-[2rem] p-8 shadow-card border border-slate-50">
    <div className="flex items-center gap-3 mb-6">
      <Heart className="text-red-500" fill="currentColor" size={24} />
      <h3 className="text-lg font-bold">Charity Impact</h3>
    </div>
    <p className="text-3xl font-black text-slate-900 mb-2">₹ 1,240</p>
    <p className="text-sm text-slate-400 font-medium">Contributed to Charities</p>
    <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
      <div className="bg-brand-mint h-full w-[65%]"></div>
    </div>
  </div>
);

export default Dashboard;