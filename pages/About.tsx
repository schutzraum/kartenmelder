import React from 'react';
import { ShieldCheck, Scale, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Über Kartenmelder</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Transparenz und Gemeinschaft gegen illegale Werbung.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-brand-100 p-3 rounded-xl text-brand-600 shrink-0">
                <ShieldCheck size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Unabhängige Initiative</h2>
                <p className="text-slate-600 leading-relaxed">
                    <strong>Kartenmelder</strong> ist eine private, unabhängige Plattform. Wir sind <strong>keine Behörde</strong> und stehen in keiner direkten Verbindung zu städtischen Ordnungsämtern oder der Polizei. Dieses Projekt entstand aus der Motivation heraus, das wachsende Problem illegaler Autohändler-Werbung ("Kärtchenstecker") sichtbar zu machen.
                </p>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600 shrink-0">
                <Users size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Gemeinsam Daten sammeln</h2>
                <p className="text-slate-600 leading-relaxed">
                    Einzelne Beschwerden gehen oft unter. Durch das systematische Sammeln von Meldungen durch Bürger schaffen wir eine Datenbasis, die das Ausmaß der Belästigung in bestimmten Stadtteilen objektiv belegbar macht. Wir dokumentieren Wiederholungstäter und zeigen Hotspots auf.
                </p>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0">
                <Scale size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Hilfe für Behörden</h2>
                <p className="text-slate-600 leading-relaxed">
                    Unser Ziel ist es, Behörden bei ihrer Arbeit zu unterstützen. Durch aggregierte Daten und Nachweise können Ordnungsämter gezielter gegen illegale Sondernutzung des öffentlichen Raums und unerlaubte Werbung vorgehen. Eine hohe Anzahl an Meldungen erhöht den Druck, gegen diese Praktiken vorzugehen.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;