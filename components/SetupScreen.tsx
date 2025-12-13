import React from 'react';
import { Role } from '../types';
import { Factory, Package, ArrowRight } from 'lucide-react';

interface Props {
  onSelectRole: (role: Role) => void;
}

export const SetupScreen: React.FC<Props> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Bullwhip Simulator AI</h1>
        <p className="text-xl text-slate-600">Select your role in the supply chain to begin.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Manufacturer Card */}
        <button 
          onClick={() => onSelectRole(Role.MANUFACTURER)}
          className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-indigo-500 hover:shadow-2xl transition-all text-left"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
            <Factory size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Manufacturer</h2>
          <p className="text-slate-500 mb-6 min-h-[48px]">
            You sit upstream. You receive orders from the Distributor and must produce goods by ordering materials from the Vendor.
          </p>
          <div className="flex items-center text-indigo-600 font-bold group-hover:gap-2 transition-all">
            Select Role <ArrowRight size={20} className="ml-2" />
          </div>
        </button>

        {/* Distributor Card */}
        <button 
          onClick={() => onSelectRole(Role.DISTRIBUTOR)}
          className="group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all text-left"
        >
           <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Package size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Distributor</h2>
          <p className="text-slate-500 mb-6 min-h-[48px]">
            You sit downstream. You are close to the customer. You must fulfill customer demand by ordering from the Manufacturer.
          </p>
          <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
            Select Role <ArrowRight size={20} className="ml-2" />
          </div>
        </button>

      </div>
    </div>
  );
};
