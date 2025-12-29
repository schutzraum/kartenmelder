
import { Report, CityStat, FeedbackEntry, AppSettings } from '../types';

const STORAGE_KEY = 'karten_melder_reports';
const FEEDBACK_KEY = 'karten_melder_feedback';
const SETTINGS_KEY = 'karten_melder_settings';

const loadReports = (): Report[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveReports = (reports: Report[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

const normalizePhone = (p: string) => p.replace(/\s/g, '');

export const reportService = {
  getAll: (): Report[] => {
    return loadReports().sort((a, b) => b.timestamp - a.timestamp);
  },

  getById: (id: string): Report | undefined => {
    return loadReports().find(r => r.id === id);
  },

  add: (report: Omit<Report, 'id' | 'timestamp'>): Report => {
    const reports = loadReports();
    const newReport: Report = {
      ...report,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    reports.push(newReport);
    saveReports(reports);
    return newReport;
  },

  update: (id: string, updates: Partial<Report>): Report | null => {
    const reports = loadReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const updated = { ...reports[index], ...updates };
    reports[index] = updated;
    saveReports(reports);
    return updated;
  },

  delete: (id: string) => {
    const reports = loadReports();
    const filtered = reports.filter(r => r.id !== id);
    saveReports(filtered);
  },

  getStatsByCity: (days?: number): CityStat[] => {
    const reports = loadReports();
    const now = Date.now();
    const cutoff = days ? now - (days * 24 * 60 * 60 * 1000) : 0;

    const filtered = reports.filter(r => r.timestamp >= cutoff);
    const cityMap: Record<string, { count: number; scoreSum: number; zip?: string }> = {};

    filtered.forEach(r => {
      // Grouping by city name
      const key = r.cityName || "Unbekannt";
      if (!cityMap[key]) {
        cityMap[key] = { count: 0, scoreSum: 0, zip: r.zipCode };
      }
      cityMap[key].count += 1;
      cityMap[key].scoreSum += r.nervScore;
    });

    return Object.entries(cityMap)
      .map(([name, data]) => ({
        name,
        zipCode: data.zip,
        count: data.count,
        avgScore: data.scoreSum / data.count
      }))
      .sort((a, b) => b.count - a.count);
  },

  getStatsByPhone: (phoneNumber: string): { count: number, avgScore: number } => {
    const target = normalizePhone(phoneNumber);
    const reports = loadReports().filter(r => normalizePhone(r.phoneNumber) === target);
    if (reports.length === 0) return { count: 0, avgScore: 0 };
    const sum = reports.reduce((acc, curr) => acc + curr.nervScore, 0);
    return { count: reports.length, avgScore: sum / reports.length };
  },

  getTopNumbersByCity: (cityName: string): { phoneNumber: string, count: number, avgScore: number, companyName?: string }[] => {
    const reports = loadReports().filter(r => (r.cityName || '').toLowerCase() === cityName.toLowerCase());
    
    const phoneMap: Record<string, { count: number, scoreSum: number, companyName?: string }> = {};

    reports.forEach(r => {
        const phone = r.phoneNumber;
        if (!phoneMap[phone]) {
            phoneMap[phone] = { count: 0, scoreSum: 0, companyName: r.companyName };
        }
        phoneMap[phone].count += 1;
        phoneMap[phone].scoreSum += r.nervScore;
        if (r.companyName) phoneMap[phone].companyName = r.companyName;
    });

    return Object.entries(phoneMap).map(([phoneNumber, data]) => ({
        phoneNumber,
        count: data.count,
        avgScore: data.scoreSum / data.count,
        companyName: data.companyName
    })).sort((a, b) => b.count - a.count);
  },

  getPhoneActivityProfile: (phoneNumber: string) => {
    const target = normalizePhone(phoneNumber);
    const reports = loadReports().filter(r => normalizePhone(r.phoneNumber) === target);
    
    if (reports.length === 0) return null;

    const cityStats: Record<string, { count: number, scoreSum: number }> = {};
    const companyNamesSet = new Set<string>();

    reports.forEach(r => {
        const cityKey = `${r.cityName} (${r.zipCode})`;
        if (!cityStats[cityKey]) {
            cityStats[cityKey] = { count: 0, scoreSum: 0 };
        }
        cityStats[cityKey].count++;
        cityStats[cityKey].scoreSum += r.nervScore;
        if (r.companyName) companyNamesSet.add(r.companyName.trim());
    });

    const cities = Object.entries(cityStats).map(([name, data]) => ({
        name,
        count: data.count,
        avgScore: data.scoreSum / data.count
    })).sort((a, b) => b.count - a.count);

    return {
        phoneNumber: reports[0].phoneNumber,
        companyNames: Array.from(companyNamesSet),
        totalCount: reports.length,
        avgScore: reports.reduce((acc, curr) => acc + curr.nervScore, 0) / reports.length,
        cities
    };
  },

  getSettings: () => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { feedbackEnabled: true };
  },

  updateSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  addFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    const list = stored ? JSON.parse(stored) : [];
    const newEntry = { ...feedback, id: Math.random().toString(36).substring(2, 9), timestamp: Date.now() };
    list.push(newEntry);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
    return newEntry;
  },

  getAllFeedback: () => {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? JSON.parse(stored).sort((a: any, b: any) => b.timestamp - a.timestamp) : [];
  },

  getFeedbackById: (id: string) => {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? JSON.parse(stored).find((f: any) => f.id === id) : undefined;
  },

  deleteFeedback: (id: string) => {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    if (!stored) return;
    const list = JSON.parse(stored).filter((f: any) => f.id !== id);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  }
};
