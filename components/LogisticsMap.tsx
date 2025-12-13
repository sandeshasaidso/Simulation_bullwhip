import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Navigation } from 'lucide-react';
import { findLogisticsHubs } from '../services/gemini';
import { GroundingChunk } from '../types';

export const LogisticsMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{text: string, grounding: GroundingChunk[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!query.trim()) return;
    
    setLoading(true);
    // Simulate getting user location (mock SF)
    const userLoc = { lat: 37.7749, lng: -122.4194 };
    const data = await findLogisticsHubs(query, userLoc);
    setResult(data as {text: string, grounding: GroundingChunk[]});
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-red-500" />
        <h3 className="text-lg font-bold text-slate-800">Global Logistics Explorer</h3>
      </div>
      
      <p className="text-sm text-slate-500 mb-4">
        Use Gemini Maps Grounding to find real-world warehouse hubs, ports, or suppliers to inspire your simulation strategy.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Major cargo ports in California' or 'Chip suppliers in Taiwan'"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Search size={20} />}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto min-h-[200px]">
        {result ? (
          <div className="space-y-4">
             <div className="text-sm text-slate-700 whitespace-pre-line">
               {result.text}
             </div>
             
             {/* Map Grounding Sources */}
             {result.grounding.length > 0 && (
               <div className="mt-4 pt-4 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sources & Map Data</h4>
                 <div className="grid gap-2">
                   {result.grounding.map((chunk, idx) => {
                     // Prefer map uri, fallback to web
                     const uri = chunk.maps?.uri || chunk.web?.uri;
                     const title = chunk.maps?.title || chunk.web?.title || 'Source';
                     
                     if (!uri) return null;

                     return (
                       <a 
                         key={idx}
                         href={uri}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors group"
                       >
                         <Navigation size={14} className="text-blue-500 group-hover:text-blue-600" />
                         <span className="text-sm font-medium text-slate-700 truncate flex-1">{title}</span>
                         <ExternalLink size={12} className="text-slate-400" />
                       </a>
                     );
                   })}
                 </div>
               </div>
             )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <MapPin size={48} className="mb-2 opacity-20" />
             <p className="text-sm">Search to explore real-world logistics data</p>
          </div>
        )}
      </div>
    </div>
  );
};