import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reportService } from '../services/storage';
import { FeedbackEntry } from '../types';
import { ArrowLeft, Mail, User, Calendar, Trash2, MessageSquare } from 'lucide-react';

const AdminFeedbackDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<FeedbackEntry | undefined>(undefined);
  
  // Check auth
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth') === 'true';
    if (!isAuth) {
        navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    if (id) {
      setEntry(reportService.getFeedbackById(id));
    }
  }, [id]);

  const handleDelete = () => {
      if (id && window.confirm("Möchtest du dieses Feedback endgültig löschen?")) {
          reportService.deleteFeedback(id);
          navigate('/admin');
      }
  };

  if (!entry) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Link to="/admin" className="text-slate-500 hover:text-slate-700 flex items-center gap-2 mb-4">
                <ArrowLeft size={16} /> Zurück zum Dashboard
            </Link>
            <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
                Eintrag nicht gefunden.
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <Link to="/admin" className="text-slate-500 hover:text-brand-600 flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft size={18} /> Zurück zur Übersicht
            </Link>
            <button 
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
                <Trash2 size={18} /> Löschen
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Feedback Details</h1>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-slate-600">
                            <User size={18} className="text-slate-400" />
                            <span className="font-semibold text-slate-800">{entry.name || 'Anonym'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <Mail size={18} className="text-slate-400" />
                            <span>{entry.email || 'Keine Email angegeben'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <Calendar size={18} className="text-slate-400" />
                            <span>{new Date(entry.timestamp).toLocaleDateString()} um {new Date(entry.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                    <MessageSquare size={24} />
                </div>
            </div>

            <div className="p-8">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Nachricht</label>
                <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                    {entry.message}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminFeedbackDetails;