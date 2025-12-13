import React from 'react';
import { ArrowRight, TrendingUp, Layers, AlertTriangle } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const IntroScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="max-w-3xl bg-white p-10 rounded-2xl shadow-xl border border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Layers className="text-indigo-600" size={36} />
          The Bullwhip Effect
        </h1>
        
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
          <p>
            The <strong className="text-indigo-600">Bullwhip Effect</strong> is a supply chain phenomenon where small fluctuations in demand at the retail level cause progressively larger fluctuations in demand at the wholesale, distributor, manufacturer, and raw material supplier levels.
          </p>
          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex gap-4 items-start">
            <TrendingUp className="text-indigo-600 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-indigo-900 text-base mb-1">Why does it happen?</h3>
              <p className="text-sm">
                Lack of communication, disorganization, order batching, price variations, and demand forecast errors contribute to this distortion of information as it travels up the chain.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 flex gap-4 items-start">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
             <div>
              <h3 className="font-bold text-yellow-900 text-base mb-1">Your Objective</h3>
              <p className="text-sm">
                Minimize total costs by balancing <strong>Inventory Costs</strong> (holding too much stock) against <strong>Backlog Costs</strong> (failing to fulfill orders).
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">The Simulation Context</h2>
          <p>
            You are about to enter a 4-tier supply chain simulation:
          </p>
          
          <div className="flex justify-between items-center gap-2 text-center text-sm font-bold text-slate-500 my-4 bg-slate-100 p-4 rounded-lg">
             <div className="flex flex-col items-center flex-1">
               <span className="text-xs uppercase tracking-wide">Upstream</span>
               <span className="text-slate-800 text-lg">Vendor</span>
             </div>
             <ArrowRight className="text-slate-400 rotate-180" size={20} />
             <div className="flex flex-col items-center flex-1">
               <span className="text-slate-800 text-lg">Manufacturer</span>
             </div>
             <ArrowRight className="text-slate-400 rotate-180" size={20} />
             <div className="flex flex-col items-center flex-1">
               <span className="text-slate-800 text-lg">Distributor</span>
             </div>
             <ArrowRight className="text-slate-400 rotate-180" size={20} />
             <div className="flex flex-col items-center flex-1">
               <span className="text-slate-800 text-lg">End User</span>
               <span className="text-xs uppercase tracking-wide">Downstream</span>
             </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={onStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
          >
            Start Simulation <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};