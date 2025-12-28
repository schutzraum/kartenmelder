import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import CityRankingList from '../components/CityRankingList';
import { reportService } from '../services/storage';
import { CityStat } from '../types';

const Home: React.FC = () => {
  const [recentStats, setRecentStats] = useState<CityStat[]>([]);
  const [allTimeStats, setAllTimeStats] = useState<CityStat[]>([]);

  useEffect(() => {
    setRecentStats(reportService.getStatsByCity(7));
    setAllTimeStats(reportService.getStatsByCity());
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-50 border-b border-slate-100 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
                src="https://images.unsplash.com/photo-1605218427306-635446a14c0c?q=80&w=2000&auto=format&fit=crop" 
                alt="Karte an Auto" 
                className="w-full h-full object-cover opacity-10 object-center mix-blend-multiply grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-brand-50/30 to-white"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight animate-slide-up">
            Nervige Karten? <br className="hidden md:block" />
            <span className="text-brand-600">Melde sie jetzt.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-100">
            Das anheften von Visitenkarten an Autos ist illegal. Zeige anderen, welche Anbieter in deiner Stadt besonders aggressiv vorgehen und <b>helfe Behörden, dagegen vorzugehen</b>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up delay-200">
            <Link 
              to="/report" 
              className="inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Jetzt Karte melden
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <CityRankingList 
            title="Top Nerv-Städte (7 Tage)" 
            cities={recentStats} 
            showButton 
          />
          <CityRankingList 
            title="Langzeit-Ranking" 
            cities={allTimeStats} 
            showButton 
          />
        </div>
      </section>
    </div>
  );
};

export default Home;