
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/storage';
import { MapPin, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';

interface PhoneStat {
    phoneNumber: string;
    count: number;
    avgScore: number;
    companyName?: string;
}

const CityDetails: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [stats, setStats] = useState<PhoneStat[]>([]);

  useEffect(() => {
    if (cityName) {
        setStats(reportService.getTopNumbersByCity(decodeURIComponent(cityName)));
    }
  }, [cityName]);

  if (!cityName) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/rankings" className="inline-flex items-center text-slate-500 hover:text-brand-600 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Zurück zum Ranking
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                <MapPin size={28} />
            </div>
            {cityName}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
            Gelistete Autohändler-Nummern in dieser Region.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-700">Verbreitung nach Telefonnummer</h2>
        </div>
        
        {stats.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic">Keine Daten verfügbar.</div>
        ) : (
            <div className="divide-y divide-slate-100">
                {stats.map((item, idx) => (
                    <div key={item.phoneNumber} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 font-bold text-sm text-slate-500">
                                {idx + 1}
                            </span>
                            <div>
                                <Link 
                                    to={`/phone/${encodeURIComponent(item.phoneNumber)}`}
                                    className="font-mono text-lg font-bold text-slate-800 hover:text-brand-600 transition-colors"
                                >
                                    {item.phoneNumber}
                                </Link>
                                {item.companyName && <p className="text-sm text-slate-500">{item.companyName}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-slate-900">{item.count}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Meldungen</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                                item.avgScore > 7 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                Ø {item.avgScore.toFixed(1)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default CityDetails;
