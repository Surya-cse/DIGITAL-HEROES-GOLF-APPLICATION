import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { 
  Trophy, 
  Play, 
  Send, 
  Users, 
  BarChart3, 
  RefreshCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ImpactDraw, DrawStatus } from '../../types';

interface SimulationResult {
  winningNumbers: number[];
  winners: {
    tier5: string[];
    tier4: string[];
    tier3: string[];
  };
  prizeSplits: {
    tier5: number;
    tier4: number;
    tier3: number;
  };
}

const DrawMgmt: React.FC = () => {
  const [activeDraw, setActiveDraw] = useState<ImpactDraw | null>(null);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubs, setActiveSubs] = useState(0);

  useEffect(() => {
    fetchDrawData();
  }, []);

  const fetchDrawData = async () => {
    setIsLoading(true);
    try {
      const [drawRes, statsRes] = await Promise.all([
        api.get('/admin-control/active-draw'),
        api.get('/admin-control/stats')
      ]);
      setActiveDraw(drawRes.data);
      setActiveSubs(statsRes.data.activeSubs);
    } catch (err) {
      console.error("Failed to load admin draw data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    const nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);
    setWinningNumbers(nums);
  };

  const runSimulation = async () => {
    if (winningNumbers.includes(0)) return alert("Set all 5 numbers first.");
    setIsLoading(true);
    try {
      const res = await api.post(`/admin-control/draw/simulate`, { 
        drawId: activeDraw?.id, 
        winningNumbers 
      });
      setSimulation(res.data);
    } catch (err) {
      alert("Simulation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const publishResults = async () => {
    if (!window.confirm("Are you sure? This will finalize payouts and notify winners.")) return;
    setIsLoading(true);
    try {
      await api.post(`/admin-control/draw/publish`, { 
        drawId: activeDraw?.id, 
        winningNumbers,
        winners: simulation?.winners 
      });
      alert("Results Published Successfully!");
      fetchDrawData();
      setSimulation(null);
    } catch (err) {
      alert("Publish failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Draw Management</h1>
        <p className="text-slate-500 font-medium">Configure, simulate, and finalize the monthly prize distribution.</p>
      </header>

      {/* Stats Ribbon */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-blue-600 mb-4">
            <Users size={24} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Active Members</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{activeSubs}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 text-green-600 mb-4">
            <BarChart3 size={24} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Prize Pool</span>
          </div>
          <p className="text-3xl font-black text-slate-900">£{(activeSubs * 20).toLocaleString()}</p>
        </div>
        <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Trophy size={24} />
            <span className="text-xs font-black uppercase tracking-widest text-blue-200">Draw Status</span>
          </div>
          <p className="text-2xl font-black">{activeDraw?.status || 'No Active Draw'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Step 1: Configuration */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">1</span>
            Set Winning Numbers
          </h3>
          
          <div className="grid grid-cols-5 gap-3 mb-8">
            {winningNumbers.map((num, i) => (
              <input 
                key={i}
                type="number"
                value={num || ''}
                onChange={(e) => {
                  const newNums = [...winningNumbers];
                  newNums[i] = parseInt(e.target.value);
                  setWinningNumbers(newNums);
                }}
                className="w-full aspect-square bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-black focus:border-blue-600 outline-none transition-all"
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleRandomize}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Randomize
            </button>
            <button 
              onClick={runSimulation}
              disabled={isLoading}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Play size={18} /> Run Simulation
            </button>
          </div>
        </section>

        {/* Step 2: Simulation Results */}
        <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">2</span>
            Simulation Review
          </h3>

          {simulation ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase mb-4">Potential Winner Counts</p>
                <div className="flex justify-between">
                  <WinnerBadge count={simulation.winners.tier5.length} tier="Match 5" />
                  <WinnerBadge count={simulation.winners.tier4.length} tier="Match 4" />
                  <WinnerBadge count={simulation.winners.tier3.length} tier="Match 3" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase mb-4">Prize Payouts (Each)</p>
                <div className="space-y-3">
                  <div className="flex justify-between font-bold"><span>Match 5:</span> <span className="text-blue-600">£{simulation.prizeSplits.tier5.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold"><span>Match 4:</span> <span className="text-blue-600">£{simulation.prizeSplits.tier4.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold"><span>Match 3:</span> <span className="text-blue-600">£{simulation.prizeSplits.tier3.toFixed(2)}</span></div>
                </div>
              </div>

              <button 
                onClick={publishResults}
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3"
              >
                <Send size={20} /> Publish Results Now
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="text-slate-300 mb-4" size={48} />
              <p className="text-slate-400 font-medium">Run a simulation to see <br />potential distributions.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const WinnerBadge = ({ count, tier }: { count: number; tier: string }) => (
  <div className="text-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black mb-1 mx-auto ${count > 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
      {count}
    </div>
    <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{tier}</p>
  </div>
);

export default DrawMgmt;