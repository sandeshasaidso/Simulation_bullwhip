import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { GameState, Role } from '../types';

interface Props {
  history: GameState[];
}

export const BullwhipChart: React.FC<Props> = ({ history }) => {
  const data = history.map((state) => ({
    cycle: state.currentCycle,
    CustomerDemand: state.nodes[Role.END_USER].incomingOrder,
    DistributorOrder: state.nodes[Role.DISTRIBUTOR].outgoingOrder,
    ManufacturerOrder: state.nodes[Role.MANUFACTURER].outgoingOrder,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-80">
      <h3 className="text-lg font-bold text-slate-700 mb-4">Order Volatility (Bullwhip Effect)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="cycle" label={{ value: 'Cycle', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36}/>
          {/* End User Demand: Green (Stable-ish) */}
          <Line type="monotone" dataKey="CustomerDemand" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
          {/* Distributor: Blue (User) */}
          <Line type="monotone" dataKey="DistributorOrder" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
          {/* Manufacturer: Red (Amplified) */}
          <Line type="monotone" dataKey="ManufacturerOrder" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};