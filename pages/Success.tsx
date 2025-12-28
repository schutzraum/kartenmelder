import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/storage';
import { Report } from '../types';
import NervScoreChart from '../components/NervScoreChart';
import CardPreview from '../components/CardPreview';
import { CheckCircle, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';

const Success: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | undefined>(undefined);
  const [phoneStats, setPhoneStats] = useState<{ count: number; avgScore: number }>({ count: 0, avgScore: 0 });

  useEffect(() => {
    if (id) {
      const r = reportService.getById(id);
      setReport(r);
      if (r) {
        setPhoneStats(reportService.getStatsByPhone(r.phoneNumber));
      }
    }
  }, [id]);

  if (!report) {
    return <div className="text-center py-20 text-slate-400">Lade Daten...</div>;
  }

  // Logic for dynamic text based on report count tiers
  const count = phoneStats.count;
  let feedbackTitle = "Meldung erfolgreich!";
  let feedbackText = "";
  let feedbackColor = "text-emerald-600";
  let bgIconColor = "bg-emerald-100";

  if (count <= 1) {
    feedbackTitle = "Meldung erfolgreich!";
    feedbackText = "Diese Karte scheint neu zu sein oder taucht hier zum ersten Mal auf.";
  } else if (count <= 10) {
    feedbackTitle = "Wiederholungstäter!";
    feedbackText = "Dieser Anbieter ist bereits einigen Nutzern aufgefallen. Wir behalten das im Auge.";
    feedbackColor = "text-amber-600";
    bgIconColor = "bg-amber-100";
  } else if (count <= 50) {
    feedbackTitle = "Bekanntes Ärgernis!";
    feedbackText = "Dieser Händler ist sehr aktiv. Deine Meldung hilft, das Ausmaß zu dokumentieren.";
    feedbackColor = "text-orange-600";
    bgIconColor = "bg-orange-100";
  } else {
    feedbackTitle = "Massen-Spammer!";
    feedbackText = "Unglaublich! Dieser Anbieter flutet ganze Stadtteile. Eine extrem nervige Quelle.";
    feedbackColor = "text-red-600";
    bgIconColor = "bg-red-100";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 p-10 text-center border-b border-slate-100">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${bgIconColor} ${feedbackColor} rounded-full mb-6 animate-fade-in shadow-sm`}>
            {count > 10 ? <AlertTriangle size={40} strokeWidth={2.5} /> : <CheckCircle size={40} strokeWidth={2.5} />}
          </div>
          <h1 className={`text-3xl md:text-4xl font-black ${feedbackColor} mb-3 tracking-tight`}>{feedbackTitle}</h1>
          <p className="text-slate-600 font-medium text-lg mb-6 max-w-xl mx-auto leading-relaxed">{feedbackText}</p>
          
          <div className="inline-block bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm text-slate-700 font-semibold animate-slide-up">
            Diese Karte wurde bisher <span className="text-brand-600 font-black text-lg">{count} Mal</span> gemeldet.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
            
          {/* Left Column: Visuals */}
          <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-white border-r border-slate-100">
            <div className="mb-8 w-full">
                <CardPreview 
                    phoneNumber={report.phoneNumber} 
                    companyName={report.companyName} 
                    location={report.location} 
                />
            </div>
            
            <div className="w-full bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <span className="font-medium">Verbreitungs-Level</span>
                    <span className="font-bold text-slate-900">{Math.min(count, 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${count > 50 ? 'bg-red-500' : count > 10 ? 'bg-orange-500' : 'bg-brand-500'}`}
                        style={{ width: `${Math.min(count * 2, 100)}%` }}
                    ></div>
                </div>
            </div>
          </div>

          {/* Right Column: Score & Details */}
          <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
            <div className="mb-6 animate-fade-in">
                {/* Showing Average Score based on all reports for this number */}
               <NervScoreChart score={Math.round(phoneStats.avgScore)} size={220} />
            </div>
             <div className="text-xs text-slate-400 mb-8 uppercase font-bold tracking-wide max-w-[200px] mx-auto leading-relaxed">
                Durchschnittlicher Nerv-Score dieses Betreibers
            </div>
            
            <div className="space-y-4 w-full text-left">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Meldung für PLZ</span>
                        <span className="text-slate-900 font-bold text-lg tracking-tight">{report.location || 'Unbekannt'}</span>
                    </div>
                </div>
                {report.description && (
                    <div className="p-5 bg-amber-50 rounded-xl text-sm text-amber-900 italic border border-amber-100 relative">
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-amber-50 border-t border-l border-amber-100 transform rotate-45"></div>
                        "{report.description}"
                    </div>
                )}
            </div>
          </div>

        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
             <Link to="/" className="flex items-center text-slate-500 hover:text-brand-600 font-bold transition-colors py-2 px-4 rounded-lg hover:bg-white">
                <ArrowLeft size={18} className="mr-2" />
                Zurück zur Startseite
             </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;