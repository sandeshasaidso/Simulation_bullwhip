import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  analysis: string | null;
  loading: boolean;
}

export const GeminiReport: React.FC<Props> = ({ analysis, loading }) => {
  if (!analysis && !loading) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-indigo-900">Gemini Supply Chain Analyst</h3>
          <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Powered by Gemini 3.0 Pro</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-indigo-500 animate-pulse text-sm font-medium">Analyzing deep supply chain patterns...</p>
        </div>
      ) : (
        <div className="prose prose-indigo max-w-none text-slate-700 text-sm">
          <ReactMarkdown>{analysis || "No analysis available yet."}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};