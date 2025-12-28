import React from 'react';
import { Phone, CarFront } from 'lucide-react';

interface CardPreviewProps {
  phoneNumber: string;
  companyName?: string;
  location?: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({ phoneNumber, companyName, location }) => {
  return (
    <div className="relative w-full max-w-xs mx-auto aspect-[1.58/1] bg-white shadow-xl rounded-lg overflow-hidden border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-blue-500"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-brand-50 rounded-full opacity-50"></div>
        
        <div className="p-6 flex flex-col h-full justify-between relative z-10">
            <div>
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-1">
                    {companyName || 'AUTO ANKAUF'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Wir kaufen alle Autos • TÜV egal</p>
                {location && <p className="text-xs text-slate-400 mt-1">{location}</p>}
            </div>
            
            <div className="flex items-center space-x-2">
                <div className="bg-slate-900 text-white p-2 rounded-full">
                    <Phone size={16} />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">{phoneNumber}</span>
            </div>

            <div className="absolute bottom-4 right-4 text-slate-100">
                <CarFront size={48} strokeWidth={1} />
            </div>
        </div>
    </div>
  );
};

export default CardPreview;