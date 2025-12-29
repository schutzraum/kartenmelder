import React, { useEffect, useState } from 'react';
import { reportService } from '../services/storage';
import { Report, FeedbackEntry } from '../types';
import { Trash2, Edit2, Save, X, Search, Lock, LogOut, Plus, Check, MessageSquare, AlertTriangle, ToggleLeft, ToggleRight, Mail, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  // Auth State - Persist in Session to allow navigation to Details page
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // View State
  const [activeTab, setActiveTab] = useState<'reports' | 'feedback'>('reports');

  // Reports State
  const [reports, setReports] = useState<Report[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Report>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  // Fix: Added cityName and zipCode to state to satisfy Report interface
  const [newReport, setNewReport] = useState({
    phoneNumber: '',
    cityName: '',
    zipCode: '',
    companyName: '',
    nervScore: 5
  });

  // Feedback State
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    refreshReports();
    refreshFeedback();
    const settings = reportService.getSettings();
    setFeedbackEnabled(settings.feedbackEnabled);
  };

  const refreshReports = () => {
    setReports(reportService.getAll());
  };

  const refreshFeedback = () => {
    setFeedbackList(reportService.getAllFeedback());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin-x' && password === 'pass-x') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Zugangsdaten ungültig.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setUsername('');
    setPassword('');
    // Resetting state with updated properties
    setNewReport({ phoneNumber: '', cityName: '', zipCode: '', companyName: '', nervScore: 5 });
  };

  // --- Reports Logic ---
  const validateScore = (value: number): number => {
    if (isNaN(value)) return 0;
    return Math.max(0, Math.min(10, value));
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('Möchtest du diese Meldung wirklich löschen?')) {
      reportService.delete(id);
      refreshReports();
    }
  };

  const startEdit = (report: Report) => {
    setEditingId(report.id);
    setEditForm({ ...report });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      const safeScore = validateScore(editForm.nervScore || 0);
      reportService.update(editingId, { ...editForm, nervScore: safeScore });
      refreshReports();
      setEditingId(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nervScore') {
      setEditForm({ ...editForm, nervScore: parseInt(value) });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nervScore') {
      setNewReport({ ...newReport, nervScore: parseInt(value) });
    } else {
      setNewReport({ ...newReport, [name]: value });
    }
  };

  const saveNew = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated validation for mandatory fields
    if (!newReport.phoneNumber || !newReport.cityName || !newReport.zipCode) {
      alert("Telefon, Stadt und PLZ sind Pflichtfelder.");
      return;
    }
    // Fix: Pass cityName, zipCode, and constructed location to satisfy Report interface
    reportService.add({
      phoneNumber: newReport.phoneNumber,
      cityName: newReport.cityName,
      zipCode: newReport.zipCode,
      location: `${newReport.cityName} (${newReport.zipCode})`,
      companyName: newReport.companyName || undefined,
      nervScore: validateScore(newReport.nervScore),
      description: "Manuell durch Admin hinzugefügt"
    });
    refreshReports();
    setIsAdding(false);
    setNewReport({ phoneNumber: '', cityName: '', zipCode: '', companyName: '', nervScore: 5 });
  };

  // --- Feedback Logic ---

  const handleDeleteFeedback = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click
    if (window.confirm('Möchtest du dieses Feedback löschen?')) {
      reportService.deleteFeedback(id);
      refreshFeedback();
    }
  };

  const toggleFeedback = () => {
    const newState = !feedbackEnabled;
    setFeedbackEnabled(newState);
    reportService.updateSettings({ feedbackEnabled: newState });
  };

  const truncateMessage = (msg: string) => {
      if (msg.length <= 60) return msg;
      return msg.substring(0, 60) + '...';
  };

  const filteredReports = reports.filter(r => 
    r.phoneNumber.includes(searchTerm) || 
    r.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render Login ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
           <div className="bg-slate-900 p-8 text-center">
             <div className="mx-auto bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-brand-500 shadow-lg ring-4 ring-slate-800/50">
               <Lock size={32} />
             </div>
             <h1 className="text-2xl font-bold text-white">Admin Login</h1>
             <p className="text-slate-400 text-sm mt-2">Geschützter Bereich</p>
           </div>
           
           <form onSubmit={handleLogin} className="p-8 space-y-5">
             {loginError && (
               <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-center justify-center">
                 {loginError}
               </div>
             )}
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Benutzername</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={e => setUsername(e.target.value)}
                 className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                 placeholder="Benutzer eingeben"
                 autoFocus
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Passwort</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={e => setPassword(e.target.value)}
                 className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                 placeholder="•••••••"
               />
             </div>
             <button type="submit" className="w-full bg-brand-600 text-white py-3.5 rounded-lg font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5 mt-2">
               Einloggen
             </button>
           </form>
        </div>
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Verwaltung der Plattform</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-lg border border-slate-200 transition-all text-sm font-medium">
                <LogOut size={16} /> Abmelden
            </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 max-w-md">
            <button
                onClick={() => setActiveTab('reports')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'reports' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <AlertTriangle size={16} /> Meldungen
            </button>
            <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'feedback' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <MessageSquare size={16} /> Feedback
            </button>
        </div>

        {/* --- REPORTS TAB --- */}
        {activeTab === 'reports' && (
            <>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Meldungen suchen..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all shadow-sm ${isAdding ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-brand-600 text-white border-transparent hover:bg-brand-700'}`}
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                        {isAdding ? 'Abbrechen' : 'Neuer Eintrag'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white rounded-xl shadow-lg border-2 border-brand-100 mb-8 overflow-hidden animate-fade-in">
                        <div className="bg-brand-50 px-6 py-3 border-b border-brand-100 flex items-center gap-2 text-brand-800 font-bold">
                            <Plus size={18} /> Neuen Eintrag erstellen
                        </div>
                        {/* Updated form to collect cityName and zipCode */}
                        <form onSubmit={saveNew} className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefon *</label>
                                <input type="text" name="phoneNumber" value={newReport.phoneNumber} onChange={handleNewChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="0176..." required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stadt *</label>
                                <input type="text" name="cityName" value={newReport.cityName} onChange={handleNewChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Stadt" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PLZ *</label>
                                <input type="text" name="zipCode" value={newReport.zipCode} onChange={handleNewChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="12345" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Betrieb</label>
                                <input type="text" name="companyName" value={newReport.companyName} onChange={handleNewChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Optional" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Score (0-10)</label>
                                <input type="number" name="nervScore" min="0" max="10" value={newReport.nervScore} onChange={handleNewChange} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                            <div className="md:col-span-1">
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-sm">
                                    <Check size={18} /> Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                        <tr>
                        <th className="px-6 py-3">Datum</th>
                        <th className="px-6 py-3">Telefon</th>
                        <th className="px-6 py-3">Ort</th>
                        <th className="px-6 py-3">Betrieb</th>
                        <th className="px-6 py-3 text-center">Score</th>
                        <th className="px-6 py-3 text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredReports.map(report => {
                        const isEditing = editingId === report.id;
                        return (
                            <tr key={report.id} className={isEditing ? 'bg-brand-50' : 'hover:bg-slate-50'}>
                            <td className="px-6 py-4 text-slate-500">{new Date(report.timestamp).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">
                                {isEditing ? <input name="phoneNumber" value={editForm.phoneNumber || ''} onChange={handleEditChange} className="border border-slate-300 p-1.5 rounded w-full focus:ring-2 focus:ring-brand-500 outline-none" /> : report.phoneNumber}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                {isEditing ? <input name="location" value={editForm.location || ''} onChange={handleEditChange} className="border border-slate-300 p-1.5 rounded w-full focus:ring-2 focus:ring-brand-500 outline-none" /> : report.location || '-'}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                {isEditing ? <input name="companyName" value={editForm.companyName || ''} onChange={handleEditChange} className="border border-slate-300 p-1.5 rounded w-full focus:ring-2 focus:ring-brand-500 outline-none" /> : report.companyName || '-'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {isEditing ? (
                                <input type="number" min="0" max="10" name="nervScore" value={editForm.nervScore} onChange={handleEditChange} className="border border-slate-300 p-1.5 rounded w-16 text-center focus:ring-2 focus:ring-brand-500 outline-none" />
                                ) : (
                                    <span className={`inline-block w-6 h-6 rounded text-center leading-6 font-bold text-xs ${report.nervScore > 7 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{report.nervScore}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <button onClick={saveEdit} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded transition-colors"><Save size={16} /></button>
                                            <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded transition-colors"><X size={16} /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(report)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteReport(report.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                                        </>
                                    )}
                                </div>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                    {filteredReports.length === 0 && <div className="p-8 text-center text-slate-400">Keine Meldungen gefunden.</div>}
                </div>
            </>
        )}

        {/* --- FEEDBACK TAB --- */}
        {activeTab === 'feedback' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-between shadow-sm">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Feedback Formular Status</h3>
                        <p className="text-slate-500 text-sm">Aktivieren oder deaktivieren des Feedback-Formulars auf der Website.</p>
                    </div>
                    <button 
                        onClick={toggleFeedback}
                        className={`flex items-center gap-3 px-4 py-2 rounded-full font-bold transition-all ${feedbackEnabled ? 'bg-emerald-100 text-emerald-700 pr-5' : 'bg-slate-100 text-slate-500 pl-5'}`}
                    >
                        {feedbackEnabled ? (
                            <><ToggleRight size={24} /> Aktiviert</>
                        ) : (
                            <>Deaktiviert <ToggleLeft size={24} /></>
                        )}
                    </button>
                </div>

                <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Datum</th>
                                <th className="px-6 py-4">Absender</th>
                                <th className="px-6 py-4">Nachricht (Auszug)</th>
                                <th className="px-6 py-4 text-right">Aktion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {feedbackList.length > 0 ? (
                                feedbackList.map(entry => (
                                    <tr 
                                        key={entry.id} 
                                        className="hover:bg-slate-50 cursor-pointer group"
                                        onClick={() => navigate(`/admin/feedback/${entry.id}`)}
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            {new Date(entry.timestamp).toLocaleDateString()} <span className="text-xs">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-800 whitespace-nowrap">
                                            <div className="font-bold">{entry.name || 'Anonym'}</div>
                                            {entry.email && (
                                                <div className="text-slate-400 flex items-center gap-1 text-xs mt-0.5">
                                                    <Mail size={10} /> {entry.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 min-w-[300px] max-w-md">
                                            <div className="flex items-center gap-2 group-hover:text-brand-600 transition-colors">
                                                <span className="truncate">{truncateMessage(entry.message)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="Details ansehen"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteFeedback(e, entry.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Löschen"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        Keine Feedback-Einträge vorhanden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};

export default Admin;