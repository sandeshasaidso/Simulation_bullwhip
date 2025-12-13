import React, { useState } from 'react';
import { X, Wand2, Image as ImageIcon } from 'lucide-react';
import { editAsset } from '../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onUpdateImage: (newImage: string) => void;
}

export const AssetEditor: React.FC<Props> = ({ isOpen, onClose, currentImage, onUpdateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    
    try {
      const newImg = await editAsset(currentImage, prompt);
      if (newImg) {
        onUpdateImage(newImg);
        onClose();
      } else {
        setError('Failed to generate image. Try a different prompt.');
      }
    } catch (e) {
      setError('Error connecting to Gemini Image service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Wand2 className="text-purple-600" size={20} />
            Customize Warehouse
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-6">
           <div className="flex justify-center mb-6">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner">
               <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
             </div>
           </div>

           <label className="block text-sm font-medium text-slate-700 mb-2">
             Describe your warehouse style
           </label>
           <div className="relative">
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="e.g., A futuristic high-tech distribution center with neon lights, cyberpunk style"
               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[100px] resize-none"
             />
             <ImageIcon className="absolute bottom-3 right-3 text-slate-400" size={16} />
           </div>

           {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

           <button 
             onClick={handleGenerate}
             disabled={loading || !prompt}
             className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
           >
             {loading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 Generating Assets...
               </>
             ) : (
               <>
                 <Wand2 size={18} />
                 Generate with Gemini
               </>
             )}
           </button>
           <p className="text-center text-xs text-slate-400 mt-3">Powered by Gemini 2.5 Flash Image</p>
        </div>
      </div>
    </div>
  );
};