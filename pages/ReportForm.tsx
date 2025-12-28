import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/storage';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PLZ State management
  const [zipDigits, setZipDigits] = useState<string[]>(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    companyName: '',
    email: '',
    location: '', // Will hold the full PLZ
    description: '',
    nervScore: 5,
  });

  // Sync zipDigits to formData.location
  useEffect(() => {
    const fullZip = zipDigits.join('');
    setFormData(prev => ({ ...prev, location: fullZip }));
  }, [zipDigits]);

  // Specific handler for phone number to enforce format
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Remove non-digit characters
    const cleanVal = val.replace(/\D/g, '');
    
    // Basic formatting: Insert space after 4 digits (e.g. 0176 12345678)
    let formattedVal = cleanVal;
    if (cleanVal.length > 4) {
        formattedVal = cleanVal.substring(0, 4) + ' ' + cleanVal.substring(4);
    }
    
    setFormData(prev => ({ ...prev, phoneNumber: formattedVal }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // PLZ Logic
  const handleZipChange = (index: number, value: string) => {
    // Handle paste of full zip code in first field
    if (value.length === 5 && index === 0 && /^\d+$/.test(value)) {
        const chars = value.split('');
        setZipDigits(chars);
        inputRefs.current[4]?.focus();
        return;
    }

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    // Take only the last character entered (single digit per box)
    const char = value.slice(-1);
    
    const newDigits = [...zipDigits];
    newDigits[index] = char;
    setZipDigits(newDigits);

    // Auto-advance focus
    if (char && index < 4) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handleZipKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !zipDigits[index] && index > 0) {
        // Move back if deleting in an empty field
        inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nervScore: parseInt(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.location.length !== 5) {
        alert("Bitte gib eine vollständige 5-stellige Postleitzahl ein.");
        return;
    }

    setIsSubmitting(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const newReport = reportService.add({
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName || undefined,
        email: formData.email || undefined,
        location: formData.location, // Contains PLZ
        description: formData.description || undefined,
        nervScore: formData.nervScore,
      });
      setIsSubmitting(false);
      navigate(`/success/${newReport.id}`);
    }, 800);
  };

  // Calculate slider color
  const sliderColor = formData.nervScore <= 3 ? 'accent-brand-500' : formData.nervScore <= 7 ? 'accent-amber-500' : 'accent-red-500';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Neue Karte melden</h1>
          <p className="text-slate-400 text-sm mt-1">Hilf der Community und dokumentiere nervige Werbung.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Primary Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                Telefonnummer <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                required
                placeholder="0176 12345678"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-mono"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                />
            </div>

            <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  PLZ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 justify-between">
                    {zipDigits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={5} // Allow 5 specifically for the paste logic in first box, logically restricted to 1 by slicing
                            value={digit}
                            onChange={(e) => handleZipChange(index, e.target.value)}
                            onKeyDown={(e) => handleZipKeyDown(index, e)}
                            className="w-full h-12 text-center text-lg font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-200"
                            placeholder="0"
                        />
                    ))}
                </div>
            </div>
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
              Betrieb / Aufdruck (Optional)
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="z.B. Auto Export Müller"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          {/* Optional Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="flex items-center text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors focus:outline-none"
            >
              {showMore ? <ChevronUp size={16} className="mr-1"/> : <ChevronDown size={16} className="mr-1"/>}
              {showMore ? 'Weniger Angaben' : 'Weitere Angaben hinterlegen'}
            </button>
          </div>

          {/* Collapsible Section */}
          {showMore && (
            <div className="space-y-6 animate-fade-in bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="mail@beispiel.de"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Beschreibung / Hinweise
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="z.B. Karte steckte an der Seitenscheibe, sehr aufdringlich..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Nerv Score Slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <label htmlFor="nervScore" className="font-bold text-slate-800 flex items-center gap-2">
                    Nerv Score
                    <div className="group relative">
                        <Info size={16} className="text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Wie sehr nervt dich diese Karte? (Häufigkeit, Platzierung, etc.)
                        </div>
                    </div>
                </label>
                <span className={`text-2xl font-black ${formData.nervScore > 7 ? 'text-red-500' : formData.nervScore > 3 ? 'text-amber-500' : 'text-brand-500'}`}>
                    {formData.nervScore}/10
                </span>
            </div>
            
            <input
              type="range"
              id="nervScore"
              min="1"
              max="10"
              step="1"
              value={formData.nervScore}
              onChange={handleSliderChange}
              className={`w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer ${sliderColor}`}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
              <span>Normal genervt</span>
              <span>Extrem genervt</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.phoneNumber || formData.location.length < 5}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 
                ${isSubmitting || !formData.phoneNumber || formData.location.length < 5 ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:shadow-xl'}`}
            >
              {isSubmitting ? 'Wird gesendet...' : 'Meldung absenden'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportForm;