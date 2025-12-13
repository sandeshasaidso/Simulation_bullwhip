import { GameState, Role, NodeState } from '../types';

// Deterministic random for consistent demos
const getRandomDemand = (cycle: number) => {
  // Scenario: Steady, then Shock, then Volatile
  if (cycle < 3) return 10 + Math.floor(Math.random() * 2);
  if (cycle === 4) return 30; // The Shock
  return 12 + Math.floor(Math.random() * 8); // Post-shock volatility
};

// Simple Order-Up-To Policy for AI
const calculateAIOrder = (incomingOrder: number, currentInventory: number, backlog: number) => {
  const targetInventory = 20; 
  const smoothedDemand = incomingOrder; 
  
  const inventoryPosition = currentInventory - backlog;
  let order = smoothedDemand + (targetInventory - inventoryPosition);
  
  // Panic factor
  if (backlog > 5) order += 5; 

  return Math.max(0, Math.round(order));
};

export const advanceCycle = (
  currentState: GameState, 
  userOrderInput: number,
  playerRole: Role
): GameState => {
  const { nodes, currentCycle, maxCycles } = currentState;
  
  // 1. Generate New Customer Demand
  const newDemand = getRandomDemand(currentCycle + 1);

  // Deep copy nodes
  const nextNodes = JSON.parse(JSON.stringify(nodes)) as typeof nodes;

  // --- PHASE 1: RECEIVE ARRIVALS (From Previous Shipments) ---
  const nextDist = nextNodes[Role.DISTRIBUTOR];
  nextDist.inventory += currentState.nodes[Role.DISTRIBUTOR].incomingShipment;
  
  const nextMfg = nextNodes[Role.MANUFACTURER];
  nextMfg.inventory += currentState.nodes[Role.MANUFACTURER].incomingShipment;
  
  const nextVendor = nextNodes[Role.VENDOR];
  nextVendor.inventory += 1000; // Infinite source

  // --- PHASE 2: FULFILL DOWNSTREAM DEMAND ---
  
  // 2a. End User Demand -> Distributor
  nextNodes[Role.END_USER].incomingOrder = newDemand;
  const userDemand = newDemand;
  
  const distTotalDemand = userDemand + nextDist.backlog;
  const distSent = Math.min(nextDist.inventory, distTotalDemand);
  nextDist.inventory -= distSent;
  nextDist.backlog = distTotalDemand - distSent;
  nextDist.outgoingShipment = distSent;

  // --- PHASE 3: PLACE ORDERS (Decision Making) ---

  // DETERMINE ORDERS BASED ON WHO IS PLAYING
  let distOrderValue = 0;
  let mfgOrderValue = 0;

  if (playerRole === Role.DISTRIBUTOR) {
    // User controls Distributor
    distOrderValue = userOrderInput;
    // AI controls Manufacturer (Reacts to Distributor's order)
    // Note: In real life, Mfg receives order next turn. Here we assume information flows fast.
    mfgOrderValue = calculateAIOrder(distOrderValue, nextMfg.inventory, nextMfg.backlog);
  } else if (playerRole === Role.MANUFACTURER) {
    // AI controls Distributor (Reacts to User Demand)
    distOrderValue = calculateAIOrder(userDemand, nextDist.inventory, nextDist.backlog);
    // User controls Manufacturer
    mfgOrderValue = userOrderInput;
  }

  // Apply Distributor Order
  nextDist.outgoingOrder = distOrderValue;

  // Manufacturer Fulfills Distributor Order
  const mfgTotalDemand = nextDist.outgoingOrder + nextMfg.backlog;
  const mfgSent = Math.min(nextMfg.inventory, mfgTotalDemand);
  nextMfg.inventory -= mfgSent;
  nextMfg.backlog = mfgTotalDemand - mfgSent;
  nextMfg.outgoingShipment = mfgSent;

  // Apply Manufacturer Order
  nextMfg.outgoingOrder = mfgOrderValue;

  // Vendor Fulfills Manufacturer Order
  const vendorTotalDemand = nextMfg.outgoingOrder;
  const vendorSent = vendorTotalDemand;
  nextVendor.inventory -= vendorSent;
  nextVendor.outgoingShipment = vendorSent;

  // --- PHASE 4: SHIPMENTS IN TRANSIT (Arrivals for NEXT cycle) ---
  nextDist.incomingShipment = mfgSent;
  nextMfg.incomingShipment = vendorSent;

  // Update History
  const history = [...currentState.history, currentState];

  return {
    ...currentState,
    currentCycle: currentCycle + 1,
    nodes: nextNodes,
    history: history,
    gameOver: currentCycle + 1 >= maxCycles,
    isAnalyzing: true 
  };
};
