import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axiosInstance.post(endpoint, form);
      if (isLogin) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.fullName}!`);
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        toast.success("Account Created! Please sign in.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication Failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-slate flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-premium p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-2">
            {isLogin ? 'Sign in to manage your tee times.' : 'Join Digital Heroes and make a difference.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" placeholder="Enter your full name" required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-mint font-medium"
                onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input type="email" placeholder="you@example.com" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-mint font-medium"
              onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input type="password" placeholder="••••••••" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-mint font-medium"
              onChange={e => setForm({...form, password: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-brand-green text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-900 shadow-xl shadow-emerald-100 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-brand-mint font-black hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;