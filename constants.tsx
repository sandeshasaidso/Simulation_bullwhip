import { Role, GameState, GamePhase } from './types';

// A simple base64 placeholder for the warehouse/factory to allow editing
export const DEFAULT_WAREHOUSE_IMG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDc1NTY5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMgMjF2LThhMiAyIDAgMCAxIDItMmgyLjVhMiAyIDAgMCAxIDIgMnY4Ii8+PHBhdGggZD0iTTEzIDIxdi04YTIgMiAwIDAgMSAyLTJoMi41YTIgMiAwIDAgMSAyIDJ2OCIvPjxwYXRoIGQ9Ik0zIDEwaDE4Ii8+PHBhdGggZD0iTTUgM2gxNGEyIDIgMCAwIDEgMiAydjNIM1Y1YTIgMiAwIDAgMSAyLTJ6Ii8+PC9zdmc+`;

export const INITIAL_STATE: GameState = {
  gamePhase: GamePhase.INTRO,
  playerRole: null,
  currentCycle: 0,
  maxCycles: 10, // Increased for better simulation depth
  nodes: {
    [Role.VENDOR]: {
      role: Role.VENDOR,
      inventory: 1000, 
      backlog: 0,
      incomingOrder: 0,
      outgoingOrder: 0,
      incomingShipment: 0,
      outgoingShipment: 0,
      totalCost: 0
    },
    [Role.MANUFACTURER]: {
      role: Role.MANUFACTURER,
      inventory: 20,
      backlog: 0,
      incomingOrder: 0,
      outgoingOrder: 0,
      incomingShipment: 0,
      outgoingShipment: 0,
      totalCost: 0
    },
    [Role.DISTRIBUTOR]: {
      role: Role.DISTRIBUTOR,
      inventory: 15,
      backlog: 0,
      incomingOrder: 0,
      outgoingOrder: 0,
      incomingShipment: 0,
      outgoingShipment: 0,
      totalCost: 0
    },
    [Role.END_USER]: {
      role: Role.END_USER,
      inventory: 0,
      backlog: 0,
      incomingOrder: 0, 
      outgoingOrder: 0,
      incomingShipment: 0,
      outgoingShipment: 0,
      totalCost: 0
    }
  },
  history: [],
  lastGeminiAnalysis: null,
  finalReportData: null,
  isAnalyzing: false,
  gameOver: false
};