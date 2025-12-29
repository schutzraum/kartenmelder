
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/storage';
import { plzService } from '../services/plzService';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, MapPin, PlusCircle } from 'lucide-react';

const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [zipDigits, setZipDigits] = useState<string[]>(['', '', '', '', '']);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState<string>('');
  const [isValidFormat, setIsValidFormat] = useState<boolean>(false);
  const [isKnownPlz, setIsKnownPlz] = useState<boolean>(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    companyName: '',
    email: '',
    description: '',
    nervScore: 5,
  });

  useEffect(() => {
    const fullZip = zipDigits.join('');
    if (fullZip.length === 5) {
      setIsValidFormat(true);
      const city = plzService.getCity(fullZip);
      setDetectedCity(city);
      setIsKnownPlz(!!city);
      if (city) setManualCity(''); // Reset manual if known
    } else {
      setIsValidFormat(false);
      setDetectedCity(null);
      setIsKnownPlz(false);
    }
  }, [zipDigits]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/[^\d+ ]/g, '');
    setFormData(prev => ({ ...prev, phoneNumber: cleanVal }));
  };

  const handleZipChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const newDigits = [...zipDigits];
    newDigits[index] = char;
    setZipDigits(newDigits);
    if (char && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleZipKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !zipDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    if (paste.length === 5) {
      setZipDigits(paste.split(''));
      inputRefs.current[4]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullZip = zipDigits.join('');
    
    if (!isValidFormat) {
        alert("Bitte gib eine vollständige Postleitzahl ein.");
        return;
    }

    const finalCity = detectedCity || manualCity;
    if (!finalCity) {
        alert("Bitte gib einen Ortsnamen für diese Postleitzahl an.");
        return;
    }

    setIsSubmitting(true);
    
    // If it's a new PLZ-City mapping, save it to the custom database
    if (!detectedCity && manualCity) {
        plzService.addCustomPlz(fullZip, manualCity);
    }

    setTimeout(() => {
      const newReport = reportService.add({
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName || undefined,
        email: formData.email || undefined,
        zipCode: fullZip,
        cityName: finalCity,
        location: `${finalCity} (${fullZip})`,
        description: formData.description || undefined,
        nervScore: formData.nervScore,
      });
      setIsSubmitting(false);
      navigate(`/success/${newReport.id}`);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
        <div className="bg-slate-900 px-8 py-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MapPin size={80} />
          </div>
          <h1 className="text-2xl font-bold">Neue Karte melden</h1>
          <p className="text-slate-400 text-sm mt-1">Helfe mit, illegale Werbung zu dokumentieren.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Telefonnummer *</label>
                <input
                    type="text"
                    required
                    placeholder="+49 176 ..."
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-brand-500 bg-slate-50 focus:bg-white outline-none transition-all font-mono text-lg"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Postleitzahl *</label>
                <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                    {zipDigits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleZipChange(index, e.target.value)}
                            onKeyDown={(e) => handleZipKeyDown(index, e)}
                            className={`w-full h-14 text-center text-xl font-black border-2 rounded-xl outline-none transition-all ${
                                isKnownPlz ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 
                                isValidFormat ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 bg-slate-50 focus:border-brand-500'
                            }`}
                        />
                    ))}
                </div>
                {detectedCity && (
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mt-2 animate-slide-up">
                        <CheckCircle2 size={14} /> Bestätigt: {detectedCity}
                    </div>
                )}
                {isValidFormat && !detectedCity && (
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mt-2 animate-pulse">
                        <AlertCircle size={14} /> Neue PLZ erkannt! Bitte Ort angeben:
                    </div>
                )}
            </div>
          </div>

          {isValidFormat && !detectedCity && (
            <div className="space-y-2 animate-slide-up">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle size={14} className="text-brand-500" /> Ortsname für {zipDigits.join('')} *
                </label>
                <input
                    type="text"
                    required
                    placeholder="z.B. Musterstadt"
                    className="w-full px-5 py-4 rounded-xl border-2 border-amber-200 focus:border-brand-500 bg-amber-50/30 focus:bg-white outline-none transition-all text-lg font-semibold"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                />
                <p className="text-[10px] text-slate-400">Dieser Ort wird zukünftig automatisch für diese PLZ vorgeschlagen.</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Betrieb / Name auf der Karte</label>
            <input
              type="text"
              placeholder="z.B. Export-Ankauf-Express"
              className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-brand-500 bg-slate-50 focus:bg-white outline-none transition-all"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="flex items-center text-brand-600 font-bold text-sm hover:text-brand-700 transition-colors"
            >
              {showMore ? <ChevronUp size={18} className="mr-1"/> : <ChevronDown size={18} className="mr-1"/>}
              {showMore ? 'Weniger Details' : 'Weitere Angaben hinzufügen'}
            </button>
          </div>

          {showMore && (
            <div className="space-y-6 animate-fade-in bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Deine E-Mail (für Rückfragen)</label>
                <input
                    type="email"
                    placeholder="email@beispiel.de"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Zusatzinfos (z.B. Fundort)</label>
                <textarea
                    rows={3}
                    placeholder="Wo genau hing die Karte?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <label className="font-black text-slate-800 text-lg">Nerv-Score</label>
                    <span className="text-xs text-slate-400">Wie belästigend war die Werbung?</span>
                </div>
                <div className={`text-3xl font-black px-4 py-1 rounded-2xl transition-colors ${
                    formData.nervScore > 7 ? 'bg-red-100 text-red-600' : 
                    formData.nervScore > 4 ? 'bg-amber-100 text-amber-600' : 'bg-brand-100 text-brand-600'
                }`}>
                    {formData.nervScore}
                </div>
            </div>
            <input
              type="range" min="1" max="10" step="1"
              value={formData.nervScore}
              onChange={(e) => setFormData({...formData, nervScore: parseInt(e.target.value)})}
              className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600 mb-2"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span>Etwas nervig</span>
                <span>Nervig</span>
                <span>Super nervig</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.phoneNumber || !isValidFormat || (!isKnownPlz && !manualCity)}
            className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-xl transition-all transform active:scale-[0.98]
              ${isSubmitting || !formData.phoneNumber || !isValidFormat || (!isKnownPlz && !manualCity) ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/40'}`}
          >
            {isSubmitting ? 'Übermittlung...' : 'Meldung jetzt absenden'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
