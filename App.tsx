import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, Play, RefreshCw, Layers } from 'lucide-react';
import { Role, GameState, GamePhase } from './types';
import { INITIAL_STATE, DEFAULT_WAREHOUSE_IMG } from './constants';
import { advanceCycle } from './services/simulation';
import { analyzeCycle, generateFinalReport } from './services/gemini';
import { WarehouseNode } from './components/WarehouseNode';
import { BullwhipChart } from './components/Charts';
import { GeminiReport } from './components/GeminiReport';
import { LogisticsMap } from './components/LogisticsMap';
import { AssetEditor } from './components/AssetEditor';
import { SetupScreen } from './components/SetupScreen';
import { FinalReport } from './components/FinalReport';
import { IntroScreen } from './components/IntroScreen';

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [userOrderInput, setUserOrderInput] = useState<number>(10);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [assetImage, setAssetImage] = useState(DEFAULT_WAREHOUSE_IMG);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sim' | 'map'>('sim');

  // Trigger Live Analysis during play
  useEffect(() => {
    if (gameState.gamePhase === GamePhase.PLAYING && gameState.currentCycle > 0 && gameState.isAnalyzing) {
      const fetchAnalysis = async () => {
        setAnalysisLoading(true);
        const text = await analyzeCycle(gameState);
        setGameState(prev => ({ 
          ...prev, 
          lastGeminiAnalysis: text,
          isAnalyzing: false
        }));
        setAnalysisLoading(false);
      };
      fetchAnalysis();
    }
  }, [gameState.currentCycle, gameState.isAnalyzing, gameState.gamePhase]);

  // Trigger Final Report when Game Over
  useEffect(() => {
    if (gameState.gameOver && gameState.gamePhase !== GamePhase.REPORT) {
       setGameState(prev => ({ ...prev, gamePhase: GamePhase.REPORT }));
       
       const fetchFinalReport = async () => {
         setReportLoading(true);
         // Use the history from gameState
         const report = await generateFinalReport(gameState.history, gameState.playerRole);
         setGameState(prev => ({ ...prev, finalReportData: report }));
         setReportLoading(false);
       };
       fetchFinalReport();
    }
  }, [gameState.gameOver, gameState.gamePhase]);

  const handleRoleSelect = (role: Role) => {
    setGameState(prev => ({ 
      ...prev, 
      gamePhase: GamePhase.PLAYING,
      playerRole: role
    }));
  };

  const handleNextCycle = () => {
    if (gameState.gameOver || !gameState.playerRole) return;
    const newState = advanceCycle(gameState, userOrderInput, gameState.playerRole);
    setGameState(newState);
  };

  const handleReset = () => {
    setGameState(INITIAL_STATE);
    setUserOrderInput(10);
  };

  // --- RENDER PHASES ---

  if (gameState.gamePhase === GamePhase.INTRO) {
    return <IntroScreen onStart={() => setGameState(prev => ({ ...prev, gamePhase: GamePhase.SETUP }))} />;
  }

  if (gameState.gamePhase === GamePhase.SETUP) {
    return <SetupScreen onSelectRole={handleRoleSelect} />;
  }

  if (gameState.gamePhase === GamePhase.REPORT) {
    return (
      <FinalReport 
        history={gameState.history} 
        playerRole={gameState.playerRole}
        reportContent={gameState.finalReportData}
        loading={reportLoading}
        onRestart={handleReset}
      />
    );
  }

  // --- PLAYING PHASE ---

  const isPlayerDistributor = gameState.playerRole === Role.DISTRIBUTOR;

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <AssetEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        currentImage={assetImage}
        onUpdateImage={setAssetImage}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Bullwhip Simulator AI</h1>
              <p className="text-xs text-slate-500">Playing as: <span className="font-bold">{gameState.playerRole}</span></p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setActiveTab('sim')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'sim' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Simulation
             </button>
             <button 
               onClick={() => setActiveTab('map')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'map' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Global Logistics
             </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
               <span className="text-xs font-bold text-slate-400 uppercase">Cycle</span>
               <div className="text-2xl font-mono font-bold text-slate-800 leading-none">
                 {gameState.currentCycle} <span className="text-sm text-slate-400">/ {gameState.maxCycles}</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'map' ? (
          <div className="h-[600px]">
             <LogisticsMap />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Visual Simulation */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-slate-200/50 p-8 rounded-2xl border border-slate-300 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[700px] gap-4">
                  
                  {/* Vendor */}
                  <WarehouseNode node={gameState.nodes[Role.VENDOR]} />
                  <ArrowRight className="text-slate-400 rotate-180" size={32} />
                  
                  {/* Manufacturer */}
                  <WarehouseNode 
                    node={gameState.nodes[Role.MANUFACTURER]} 
                    isUser={gameState.playerRole === Role.MANUFACTURER}
                    imageSrc={gameState.playerRole === Role.MANUFACTURER ? assetImage : undefined}
                    onEditImage={() => setIsEditorOpen(true)}
                  />
                  <ArrowRight className="text-slate-400 rotate-180" size={32} />
                  
                  {/* Distributor */}
                  <WarehouseNode 
                    node={gameState.nodes[Role.DISTRIBUTOR]} 
                    isUser={gameState.playerRole === Role.DISTRIBUTOR}
                    imageSrc={gameState.playerRole === Role.DISTRIBUTOR ? assetImage : undefined}
                    onEditImage={() => setIsEditorOpen(true)}
                  />
                  <ArrowRight className="text-slate-400 rotate-180" size={32} />
                  
                  {/* End User */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 text-green-600 mb-2">
                       <Activity />
                    </div>
                    <span className="font-bold text-slate-700">Customer</span>
                    <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-mono mt-2">
                      Demand: {gameState.nodes[Role.END_USER].incomingOrder}
                    </div>
                  </div>

                </div>
                <p className="text-center text-slate-400 text-sm mt-6 flex items-center justify-center gap-2">
                  <Layers size={14}/> 
                  Supply flows Right to Left (Inventory) • Orders flow Left to Right (Information)
                </p>
              </div>

              <BullwhipChart history={gameState.history} />
            </div>

            {/* Right Column: Controls */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  {gameState.playerRole} Controls
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Place Order to {isPlayerDistributor ? 'Manufacturer' : 'Vendor'}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="0"
                      value={userOrderInput}
                      onChange={(e) => setUserOrderInput(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 p-3 border border-slate-300 rounded-lg text-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      onClick={handleNextCycle}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95"
                    >
                      Next <Play size={16} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Incoming Order from Downstream: {gameState.nodes[gameState.playerRole!].incomingOrder}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Your Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded">
                       <span className="text-xs text-slate-500 block">Inventory</span>
                       <span className="font-bold text-lg text-slate-800">
                         {gameState.nodes[gameState.playerRole!].inventory}
                       </span>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                       <span className="text-xs text-red-500 block">Backlog</span>
                       <span className="font-bold text-lg text-red-700">
                         {gameState.nodes[gameState.playerRole!].backlog}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              <GeminiReport analysis={gameState.lastGeminiAnalysis} loading={analysisLoading} />

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;