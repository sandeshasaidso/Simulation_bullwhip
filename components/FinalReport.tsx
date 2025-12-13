import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GameState, Role } from '../types';
import { BullwhipChart } from './Charts';
import { Download, Printer, RefreshCcw } from 'lucide-react';

interface Props {
  history: GameState[];
  playerRole: Role | null;
  reportContent: string | null;
  loading: boolean;
  onRestart: () => void;
}

export const FinalReport: React.FC<Props> = ({ history, playerRole, reportContent, loading, onRestart }) => {
  
  // Calculate quick stats
  const totalCost = history.reduce((acc, state) => {
    // Simple cost model: Holding ($0.5) + Backlog ($1.0)
    const myNode = state.nodes[playerRole || Role.DISTRIBUTOR];
    return acc + (myNode.inventory * 0.5) + (myNode.backlog * 1.0);
  }, 0);

  const varianceDemand = calculateVariance(history.map(h => h.nodes[Role.END_USER].incomingOrder));
  const varianceOrders = calculateVariance(history.map(h => h.nodes[playerRole || Role.DISTRIBUTOR].outgoingOrder));
  const bullwhipRatio = varianceDemand > 0 ? (varianceOrders / varianceDemand).toFixed(2) : "N/A";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 print:p-0 print:m-0 print:max-w-none print:w-full">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-8 no-print">
        <button onClick={onRestart} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <RefreshCcw size={18} /> New Simulation
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow">
            <Printer size={18} /> Print Report
          </button>
        </div>
      </div>

      {/* A4 Page Container */}
      <div className="bg-white shadow-2xl p-12 min-h-[1123px] w-full max-w-[794px] mx-auto text-slate-900 printable-doc print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none print:p-8">
        
        {/* Header */}
        <div className="border-b-4 border-indigo-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Simulation Report</h1>
            <p className="text-indigo-600 font-medium text-lg">Supply Chain Operations Analysis</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-slate-500">Role: <span className="font-bold text-slate-900">{playerRole}</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-10 print:gap-4">
          <div className="bg-slate-50 p-4 rounded border border-slate-200 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Total Cost</p>
            <p className="text-2xl font-mono text-slate-900">${totalCost.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Bullwhip Ratio</p>
            <p className={`text-2xl font-mono font-bold ${Number(bullwhipRatio) > 1.5 ? 'text-red-600' : 'text-green-600'}`}>
              {bullwhipRatio}
            </p>
            <p className="text-[10px] text-slate-400">Order Var / Demand Var</p>
          </div>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 print:bg-white print:border-slate-300">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Cycles Completed</p>
            <p className="text-2xl font-mono text-slate-900">{history.length}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-10 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">Performance Visualization</h2>
          <div className="h-64 bg-slate-50 border border-slate-200 rounded p-2 print:bg-white print:border-slate-300">
            <BullwhipChart history={history} />
          </div>
        </div>

        {/* AI Analysis Content */}
        <div className="mb-8">
           <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">Gemini Analysis</h2>
           {loading ? (
             <div className="py-12 flex flex-col items-center justify-center text-slate-400">
               <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
               <p className="text-sm">Generating comprehensive report...</p>
             </div>
           ) : (
             <div className="prose prose-slate prose-sm max-w-none text-justify print:prose-base">
               <ReactMarkdown>{reportContent || "No report generated."}</ReactMarkdown>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">Generated by Bullwhip Simulator AI • Powered by Google Gemini</p>
        </div>

      </div>
      
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body { 
            background: white !important; 
          }
          /* Hide everything outside the root if needed, but since we are replacing the view, standard hiding should suffice */
          .no-print { display: none !important; }
          
          /* Force exact colors for charts and backgrounds */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

function calculateVariance(nums: number[]) {
  if (nums.length === 0) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
}
