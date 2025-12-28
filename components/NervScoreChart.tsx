import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface NervScoreChartProps {
  score: number; // 1-10
  size?: number;
}

const NervScoreChart: React.FC<NervScoreChartProps> = ({ score, size = 200 }) => {
  // Determine color based on score
  let color = '#10b981'; // green-500 (Low)
  if (score > 3) color = '#f59e0b'; // amber-500 (Medium)
  if (score > 7) color = '#ef4444'; // red-500 (High)

  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 10 - score },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-score" fill={color} />
            <Cell key="cell-remaining" fill="#e2e8f0" /> {/* slate-200 */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Nerv Score</span>
      </div>
    </div>
  );
};

export default NervScoreChart;