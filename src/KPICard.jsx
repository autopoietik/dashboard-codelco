import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const KPICard = ({ data, delay = 0 }) => {
  const { title, desc, formula, target, current, chartType, unit } = data;

  // Generate Dummy Data based on chartType
  const chartData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map((month, index) => {
      let val = 0;
      const progress = index / 11; // 0 to 1

      switch (chartType) {
        case 'growth':
          // Exponential-ish growth
          val = 10 + (progress * progress) * 80 + (Math.random() * 5); 
          break;
        case 'stable-high':
          // Random fluctuation around high value
          val = 80 + (Math.random() - 0.5) * 20;
          break;
        case 'consistent':
            // Very flat high line
            val = 98 + (Math.random() - 0.5) * 2;
            break;
        case 'reduction':
          // Inverse of growth
          val = 90 - (progress * progress) * 70 + (Math.random() * 5);
          break;
        case 'step':
            // Step function
            val = index < 4 ? 30 : index < 8 ? 60 : 85;
            val += Math.random() * 2;
            break;
        default:
          val = 50 + (Math.random() - 0.5) * 40;
      }
      return { name: month, val: Math.max(0, val) };
    });
  }, [chartType]);

  const isPositive = chartType === 'growth' || chartType === 'stable-high' || chartType === 'consistent' || chartType === 'step';
  // For 'reduction', lower is better, usually implied by the context, but color-wise green usually means "good". 
  // If we assume the "current" vs "target" logic handles the color of the text, the chart color can just denote the trend.
  // Let's stick to a tech/neutral color for the chart to avoid confusion, or use a gradient.

  return (
    <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-5 flex flex-col h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300"
        style={{ animationDelay: `${delay}s` }}
    >
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-codelco-slate/20 to-codelco-orange/50 opacity-50" />

        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-codelco-slate text-lg leading-tight">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
            {/* Status Indicator (Simple Dot based on logic could be here, but let's keep it clean) */}
        </div>

        {/* Formula */}
        <div className="mb-4 bg-gray-50/80 rounded px-2 py-1.5 border border-gray-100 font-mono text-[10px] text-gray-500 truncate" title={formula}>
            ƒx: {formula}
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Meta</p>
                <p className="text-sm font-semibold text-gray-600">{target}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Actual</p>
                <p className="text-xl font-bold text-codelco-orange">{current}</p>
            </div>
        </div>

        {/* Sparkline */}
        <div className="h-24 w-full mt-auto relative">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D97828" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D97828" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#D97828" 
                        strokeWidth={2} 
                        fill={`url(#gradient-${title})`} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default KPICard;
