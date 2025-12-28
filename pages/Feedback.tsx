import React, { useState, useEffect } from 'react';
import { reportService } from '../services/storage';
import { MessageSquare, Send, CheckCircle, Lock } from 'lucide-react';

const Feedback: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const settings = reportService.getSettings();
    setIsEnabled(settings.feedbackEnabled);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    reportService.addFeedback({
      name: formData.name || undefined,
      email: formData.email || undefined,
      message: formData.message
    });
    setSubmitted(true);
  };

  if (!isEnabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <Lock size={32} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Feedback deaktiviert</h1>
        <p className="text-slate-500">Das Feedback-Formular ist momentan nicht verfügbar.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-emerald-700 mb-2">Vielen Dank!</h1>
        <p className="text-slate-600 mb-8">Dein Feedback wurde erfolgreich übermittelt.</p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
          }}
          className="text-brand-600 font-medium hover:underline"
        >
          Weiteres Feedback senden
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 text-brand-600 rounded-xl mb-4">
            <MessageSquare size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Dein Feedback</h1>
        <p className="text-slate-500 mt-2">Hast du Verbesserungsvorschläge oder Fehler gefunden? Lass es uns wissen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name (Optional)</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dein Name"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="deine@email.de"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
              Nachricht <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Was können wir besser machen?"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!formData.message.trim()}
              className={`w-full flex items-center justify-center py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all 
                ${!formData.message.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5'}`}
            >
              Feedback absenden <Send size={18} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;