import React, { useState, useEffect } from 'react';
import { Search, Heart, ExternalLink, Award } from 'lucide-react';
import api from '../api/axiosInstance';
import { Charity } from '../types';

const Charities: React.FC = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await api.get('/registry');
        setCharities(response.data);
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCharity = charities.find(c => c.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Charity Registry</h1>
          <p className="text-slate-500 font-medium">Discover the causes your golf performance supports.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or cause..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Charity (PRD Requirement) */}
      {featuredCharity && !searchTerm && (
        <section className="mb-20">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 h-80 lg:h-auto bg-slate-800">
              <img 
                src={featuredCharity.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"} 
                alt={featuredCharity.name}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="w-full lg:w-1/2 p-12 text-white">
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
                <Award size={16} /> Featured Impact Partner
              </div>
              <h2 className="text-4xl font-black mb-6">{featuredCharity.name}</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {featuredCharity.description}
              </p>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
                Support this Cause <Heart size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Charity Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[2rem] animate-pulse" />)
        ) : (
          filteredCharities.map((charity) => (
            <div key={charity.id} className="group bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-blue-100/50 transition-all">
              <div className="h-48 bg-slate-50 rounded-2xl mb-6 overflow-hidden">
                 <img 
                  src={charity.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={charity.name}
                 />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{charity.name}</h3>
              <p className="text-slate-500 line-clamp-3 mb-6 text-sm leading-relaxed">
                {charity.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Details <ExternalLink size={14} />
                </button>
                <button className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-xl transition-all">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filteredCharities.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 font-medium text-lg">No charities match your search. Try a different keyword.</p>
        </div>
      )}
    </div>
  );
};

export default Charities;