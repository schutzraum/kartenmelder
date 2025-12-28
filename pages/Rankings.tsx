import React, { useEffect, useState } from 'react';
import { reportService } from '../services/storage';
import { CityStat } from '../types';
import { MapPin, TrendingUp, Filter } from 'lucide-react';

const Rankings: React.FC = () => {
  const [stats, setStats] = useState<CityStat[]>([]);
  const [filter, setFilter] = useState<'all' | '7days'>('all');

  useEffect(() => {
    setStats(reportService.getStatsByCity(filter === '7days' ? 7 : undefined));
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Städte-Ranking</h1>
        <p className="text-slate-500 mt-2">Wo sind Autohändler-Karten am aggressivsten verbreitet?</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Filter size={18} />
            <span>Filter:</span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Alle Zeit
            </button>
            <button 
                onClick={() => setFilter('7days')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === '7days' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Letzte 7 Tage
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700 w-16">#</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Stadt / Ort</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ø Nerv Score</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Meldungen</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right hidden md:table-cell">Aktivität</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.map((city, idx) => (
              <tr key={city.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500 font-medium">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${idx < 3 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100'}`}>
                        {idx + 1}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <MapPin size={16} className="text-slate-400" />
                    {city.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        city.avgScore > 7 ? 'bg-red-100 text-red-700' : city.avgScore > 4 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {city.avgScore.toFixed(1)}
                    </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">{city.count}</td>
                <td className="px-6 py-4 text-right hidden md:table-cell">
                  {/* Simple visual bar for activity relative to max */}
                  <div className="w-24 ml-auto bg-slate-100 rounded-full h-1.5">
                     <div 
                        className="bg-brand-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((city.count / (stats[0]?.count || 1)) * 100, 100)}%` }}
                     ></div>
                  </div>
                </td>
              </tr>
            ))}
            {stats.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        Keine Daten für diesen Zeitraum gefunden.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;