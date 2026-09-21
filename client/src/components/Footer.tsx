import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Heart, 
  Instagram, 
  Twitter, 
  Mail, 
  Globe, 
  ArrowUpRight 
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Trophy size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                Digital<span className="text-blue-500">Heroes</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The premier platform where golf performance fuels global impact. Track your game, win prizes, and support world-class charities.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Platform</h4>
            <ul className="space-y-4">
              <FooterLink to="/draws" label="Monthly Draw" />
              <FooterLink to="/dashboard" label="Member Dashboard" />
              <FooterLink to="/login" label="Join the Community" />
              <FooterLink to="/concept" label="How it Works" />
            </ul>
          </div>

          {/* Column 3: Impact Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Impact</h4>
            <ul className="space-y-4">
              <FooterLink to="/charities" label="Charity Registry" />
              <FooterLink to="/impact-report" label="Charity Impact" />
              <FooterLink to="/partners" label="Become a Partner" />
            </ul>
          </div>

          {/* Column 4: Newsletter/Trust */}
          <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-800">
            <Heart className="text-red-500 mb-4" size={24} />
            <h4 className="text-lg font-bold mb-2">Every Swing Counts</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              10% of every subscription is donated directly to charities verified by our team.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-white bg-blue-600 px-4 py-2 rounded-full w-fit">
              <Globe size={12} /> SECURE PLATFORM
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} Digital Heroes Platform. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-slate-500 hover:text-white text-xs font-bold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-xs font-bold transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-slate-500 hover:text-white text-xs font-bold transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sub-components for cleaner code
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
    {icon}
  </a>
);

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link to={to} className="text-slate-400 hover:text-white text-sm font-bold flex items-center group transition-colors">
      {label}
      <ArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
    </Link>
  </li>
);

export default Footer;