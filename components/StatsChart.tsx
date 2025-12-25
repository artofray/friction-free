import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Spotify', amount: 0.003, color: '#1DB954' },
  { name: 'Apple', amount: 0.01, color: '#FA2D48' },
  { name: 'SonicNode', amount: 0.08, color: '#06B6D4' },
];

export const StatsChart: React.FC = () => {
  return (
    <div className="w-full h-64 p-4 glass-panel rounded-xl">
      <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-4 font-bold">Per-Stream Royalty Comparison ($)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#a1a1aa', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};