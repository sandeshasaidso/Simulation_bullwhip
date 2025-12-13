import React from 'react';
import { motion } from 'framer-motion';
import { Role, NodeState } from '../types';
import { Package, Truck, AlertCircle } from 'lucide-react';

interface Props {
  node: NodeState;
  imageSrc?: string;
  isUser?: boolean;
  onEditImage?: () => void;
}

export const WarehouseNode: React.FC<Props> = ({ node, imageSrc, isUser, onEditImage }) => {
  const isBacklogged = node.backlog > 0;

  return (
    <div className={`relative flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border-2 ${isUser ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'} w-48 transition-all`}>
      {isUser && (
        <span className="absolute -top-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          YOU (Distributor)
        </span>
      )}
      
      {/* Visual Asset */}
      <div className="relative group cursor-pointer" onClick={isUser ? onEditImage : undefined}>
        <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border border-slate-300 flex items-center justify-center mb-3">
          {imageSrc ? (
             <img src={imageSrc} alt={node.role} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🏭</span>
          )}
        </div>
        {isUser && (
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-white text-xs font-bold">Edit Theme</span>
           </div>
        )}
      </div>

      <h3 className="font-bold text-slate-800 mb-2">{node.role}</h3>

      {/* Stats */}
      <div className="w-full space-y-2 text-sm">
        <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded">
          <span className="text-slate-500 flex items-center gap-1">
             <Package size={14} /> Stock
          </span>
          <span className={`font-mono font-bold ${node.inventory < 5 ? 'text-red-500' : 'text-slate-700'}`}>
            {node.inventory}
          </span>
        </div>

        <div className={`flex justify-between items-center p-1.5 rounded ${isBacklogged ? 'bg-red-50' : 'bg-slate-50'}`}>
          <span className={`${isBacklogged ? 'text-red-600' : 'text-slate-500'} flex items-center gap-1`}>
             <AlertCircle size={14} /> Backlog
          </span>
          <span className={`font-mono font-bold ${isBacklogged ? 'text-red-600' : 'text-slate-700'}`}>
            {node.backlog}
          </span>
        </div>
      </div>

      {/* Dynamic Incoming/Outgoing Indicators */}
      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
         {node.outgoingShipment > 0 && (
           <motion.div 
             initial={{ x: -10, opacity: 0 }}
             animate={{ x: 20, opacity: 1 }}
             transition={{ duration: 1, repeat: Infinity }}
             className="text-green-600"
           >
             <Truck size={20} />
             <span className="text-xs font-bold">{node.outgoingShipment}</span>
           </motion.div>
         )}
      </div>
      
       {/* Incoming Orders indicator (Left side usually, but simplified here) */}
       {node.incomingOrder > 0 && (
          <div className="absolute -left-2 top-10 bg-yellow-100 text-yellow-800 text-xs px-1 rounded border border-yellow-300 z-20">
            Order: {node.incomingOrder}
          </div>
       )}

    </div>
  );
};
