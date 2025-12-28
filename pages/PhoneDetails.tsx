import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/storage';
import { Phone, MapPin, ArrowLeft, Building2, BarChart3, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface PhoneProfile {
    phoneNumber: string;
    companyNames: string[];
    totalCount: number;
    avgScore: number;
    cities: {
        name: string;
        count: number;
        avgScore: number;
    }[];
}

const PhoneDetails: React.FC = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const [profile, setProfile] = useState<PhoneProfile | null>(null);
  const [showAllNames, setShowAllNames] = useState(false);

  useEffect(() => {
    if (phoneNumber) {
        // Decode URI component in case formatting includes spaces handled by router
        const decodedPhone = decodeURIComponent(phoneNumber);
        const data = reportService.getPhoneActivityProfile(decodedPhone);
        setProfile(data);
    }
  }, [phoneNumber]);

  if (!phoneNumber) return null;

  if (!profile) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h2 className="text-xl font-bold text-slate-700">Keine Daten gefunden</h2>
            <p className="text-slate-500 mt-2">Die Nummer {phoneNumber} ist uns nicht bekannt.</p>
            <div className="mt-6">
                <Link to="/rankings" className="text-brand-600 hover:underline">Zurück zum Ranking</Link>
            </div>
        </div>
      );
  }

  const displayedNames = showAllNames ? profile.companyNames : profile.companyNames.slice(0, 3);
  const remainingNames = profile.companyNames.length - 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/rankings" className="inline-flex items-center text-slate-500 hover:text-brand-600 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Zurück zu Rankings
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-slate-900 text-white p-2 rounded-lg">
                            <Phone size={24} />
                        </div>
                        <h1 className="text-3xl font-mono font-bold text-slate-900">{profile.phoneNumber}</h1>
                    </div>
                    
                    {profile.companyNames.length > 0 ? (
                        <div className="space-y-1">
                            {displayedNames.map((name, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-600">
                                    <Building2 size={16} className="text-slate-400 shrink-0" />
                                    <span className="font-medium">{name}</span>
                                </div>
                            ))}
                            {profile.companyNames.length > 3 && (
                                <button 
                                    onClick={() => setShowAllNames(!showAllNames)}
                                    className="flex items-center gap-1 text-brand-600 text-sm font-medium hover:text-brand-700 mt-1 pl-6"
                                >
                                    {showAllNames ? (
                                        <>Weniger anzeigen <ChevronUp size={14} /></>
                                    ) : (
                                        <>+{remainingNames} weitere Namen <ChevronDown size={14} /></>
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm italic flex items-center gap-2">
                             <Building2 size={16} /> Kein Firmenname bekannt
                        </span>
                    )}
                </div>

                <div className="flex gap-4 self-start md:self-center">
                    <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 text-center">
                        <span className="block text-2xl font-bold text-slate-900">{profile.totalCount}</span>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Meldungen</span>
                    </div>
                    <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 text-center">
                         <span className={`block text-2xl font-bold ${
                             profile.avgScore > 7 ? 'text-red-600' : profile.avgScore > 4 ? 'text-amber-600' : 'text-emerald-600'
                         }`}>
                             {profile.avgScore.toFixed(1)}
                         </span>
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ø Score</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="text-brand-500" size={24} />
                  Aktiv in diesen Städten
              </h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Stadt / PLZ</th>
                            <th className="px-6 py-4 text-center">Nerv-Faktor</th>
                            <th className="px-6 py-4 text-right">Anzahl</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {profile.cities.map((city, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link to={`/city/${city.name}`} className="font-medium text-slate-700 hover:text-brand-600 flex items-center gap-2">
                                        {city.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        city.avgScore > 7 ? 'bg-red-100 text-red-700' : city.avgScore > 4 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        Ø {city.avgScore.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                    {city.count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>

          <div className="md:col-span-1">
             <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 sticky top-24">
                <h3 className="text-brand-900 font-bold text-lg mb-2 flex items-center gap-2">
                    <BarChart3 size={20} />
                    Analyse
                </h3>
                <p className="text-brand-800/80 text-sm mb-4 leading-relaxed">
                    Diese Nummer ist in <strong>{profile.cities.length}</strong> {profile.cities.length === 1 ? 'Ort' : 'Orten'} aufgefallen.
                </p>
                
                {profile.cities.length > 1 && (
                    <div className="bg-white/60 p-3 rounded-lg text-sm text-brand-900 mb-4">
                        <span className="font-bold">Verdacht:</span> Überregionaler Händler oder Verteilerring.
                    </div>
                )}

                <Link to="/report" className="block w-full bg-brand-600 hover:bg-brand-700 text-white text-center font-bold py-3 rounded-xl transition-colors shadow-sm">
                    Neue Meldung hierzu
                </Link>
             </div>
          </div>
      </div>
    </div>
  );
};

export default PhoneDetails;