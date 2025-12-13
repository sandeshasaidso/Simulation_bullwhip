export enum Role {
  VENDOR = 'Vendor',
  MANUFACTURER = 'Manufacturer',
  DISTRIBUTOR = 'Distributor',
  END_USER = 'End User'
}

export enum GamePhase {
  INTRO = 'INTRO',
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  REPORT = 'REPORT'
}

export interface NodeState {
  role: Role;
  inventory: number;
  backlog: number;
  incomingOrder: number; // Order received from downstream
  outgoingOrder: number; // Order placed to upstream
  incomingShipment: number; // Goods arriving this turn
  outgoingShipment: number; // Goods sent downstream
  totalCost: number;
}

export interface GameState {
  gamePhase: GamePhase;
  playerRole: Role | null;
  currentCycle: number;
  maxCycles: number;
  nodes: {
    [Role.VENDOR]: NodeState;
    [Role.MANUFACTURER]: NodeState;
    [Role.DISTRIBUTOR]: NodeState;
    [Role.END_USER]: NodeState; // Mostly virtual, drives demand
  };
  history: GameState[]; // For charts
  lastGeminiAnalysis: string | null;
  finalReportData: string | null; // Stores the final generated doc content
  isAnalyzing: boolean;
  gameOver: boolean;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { 
    uri: string; 
    title: string;
    placeAnswerSources?: { reviewSnippets?: { url: string }[] }[] 
  };
}