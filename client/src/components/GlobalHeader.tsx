import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard,
  Heart
} from 'lucide-react';

const GlobalHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Micro-interaction: Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-slate-100 py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* 1. BRAND IDENTITY */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
            <Trophy className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
            Digital<span className="text-blue-600">Heroes</span>
          </span>
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/charities" label="Charities" />
          <NavLink to="/draws" label="Monthly Draw" />
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />

          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={18} className="text-blue-600" />
                DASHBOARD
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors">
                SIGN IN
              </Link>
              <Link 
                to="/login" 
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-slate-200"
              >
                JOIN THE ELITE
              </Link>
            </div>
          )}
        </nav>

        {/* 3. MOBILE TOGGLE */}
        <button 
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-6">
            <Link to="/charities" className="block text-2xl font-black text-slate-900">Charities</Link>
            <Link to="/draws" className="block text-2xl font-black text-slate-900">Monthly Draw</Link>
            <hr className="border-slate-100" />
            {user ? (
              <>
                <Link to="/dashboard" className="block text-xl font-black text-blue-600">My Dashboard</Link>
                <button onClick={handleLogout} className="text-xl font-black text-red-500">Sign Out</button>
              </>
            ) : (
              <div className="grid gap-4">
                <Link to="/login" className="text-center py-4 text-slate-900 font-black">Sign In</Link>
                <Link to="/login" className="text-center bg-blue-600 text-white py-4 rounded-2xl font-black">Join Now</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Sub-component for Nav Links to keep the code clean
const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`text-xs font-black uppercase tracking-widest transition-all relative group ${
        isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-600 transition-all duration-300 ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );
};

export default GlobalHeader;