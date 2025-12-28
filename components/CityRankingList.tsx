import React from 'react';
import { CityStat } from '../types';
import { MapPin, BarChart2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  cities: CityStat[];
  title: string;
  limit?: number;
  showButton?: boolean;
}

const CityRankingList: React.FC<Props> = ({ cities, title, limit = 5, showButton = false }) => {
  const displayedCities = cities.slice(0, limit);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <BarChart2 className="text-brand-500" size={20} />
        {title}
      </h2>
      
      <div className="flex-grow space-y-3">
        {displayedCities.length === 0 ? (
            <p className="text-slate-400 text-sm italic">Keine Daten verfügbar.</p>
        ) : (
            displayedCities.map((city, index) => (
            <Link 
                to={`/city/${encodeURIComponent(city.name)}`}
                key={city.name} 
                className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 transition-all hover:shadow-sm border border-transparent hover:border-slate-100"
            >
                <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                </span>
                <div className="flex flex-col">
                    <span className="text-slate-700 font-medium flex items-center gap-1 group-hover:text-brand-600 transition-colors">
                        <MapPin size={12} className="text-slate-400 group-hover:text-brand-500" />
                        {city.name}
                    </span>
                    <span className="text-xs text-slate-400">Ø Nerv-Score: {city.avgScore.toFixed(1)}</span>
                </div>
                </div>
                <div className="text-right flex items-center gap-3">
                    <div>
                        <span className="block text-lg font-bold text-slate-800">{city.count}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">Meldungen</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Link>
            ))
        )}
      </div>

      {showButton && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link to="/rankings" className="block w-full text-center py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
            Alle Städte ansehen
          </Link>
        </div>
      )}
    </div>
  );
};

export default CityRankingList;