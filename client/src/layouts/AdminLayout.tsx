import React, { useState } from 'react';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // SECURITY GATE: PRD Requirement - Protect Admin routes
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Draw Control', href: '/admin/draws', icon: Trophy },
    { name: 'Charity Registry', href: '/admin/charities', icon: Heart },
    { name: 'Winner Verification', href: '/admin/winners', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white fixed h-full shadow-2xl">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Trophy size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Control <span className="text-blue-500">Center</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white p-4 flex justify-between items-center z-[60]">
        <span className="font-black tracking-tighter">HERO ADMIN</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 3. MOBILE DRAWER */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900 z-[55] pt-20 px-6">
           <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-4 text-xl font-bold text-slate-300 py-4 border-b border-slate-800"
              >
                <item.icon /> {item.name}
              </Link>
            ))}
           </nav>
        </div>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-grow lg:ml-72 min-h-screen pt-20 lg:pt-0">
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
             <span>Digital Heroes</span>
             <ChevronRight size={14} />
             <span className="text-slate-900 font-bold capitalize">
               {location.pathname.split('/').pop()?.replace('-', ' ')}
             </span>
           </div>
           <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-black text-slate-900">{user?.fullName}</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-right">System Administrator</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
               {user?.fullName?.[0]}
             </div>
           </div>
        </header>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;