import { Report, CityStat, FeedbackEntry, AppSettings } from '../types';

const STORAGE_KEY = 'karten_melder_reports';
const FEEDBACK_KEY = 'karten_melder_feedback';
const SETTINGS_KEY = 'karten_melder_settings';

// Seed data removed for authentic start.
const SEED_DATA: Report[] = [];

const loadReports = (): Report[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
};

const saveReports = (reports: Report[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

const loadFeedback = (): FeedbackEntry[] => {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveFeedbackList = (list: FeedbackEntry[]) => {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
};

const loadSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : { feedbackEnabled: true };
};

const saveSettingsData = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const normalizePhone = (p: string) => p.replace(/\s/g, '');

export const reportService = {
  // --- Reports ---
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

  // --- Statistics ---
  getStatsByCity: (days?: number): CityStat[] => {
    const reports = loadReports();
    const now = Date.now();
    const cutoff = days ? now - (days * 24 * 60 * 60 * 1000) : 0;

    const filtered = reports.filter(r => r.timestamp >= cutoff);
    const cityMap: Record<string, { count: number; scoreSum: number }> = {};

    filtered.forEach(r => {
      const city = r.location.trim() || 'Unbekannt';
      if (!cityMap[city]) {
        cityMap[city] = { count: 0, scoreSum: 0 };
      }
      cityMap[city].count += 1;
      cityMap[city].scoreSum += r.nervScore;
    });

    return Object.entries(cityMap)
      .map(([name, data]) => ({
        name,
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
    const reports = loadReports().filter(r => r.location.toLowerCase().trim() === cityName.toLowerCase().trim());
    
    const phoneMap: Record<string, { count: number, scoreSum: number, companyName?: string }> = {};

    reports.forEach(r => {
        const phone = r.phoneNumber;
        if (!phoneMap[phone]) {
            phoneMap[phone] = { count: 0, scoreSum: 0, companyName: r.companyName };
        }
        phoneMap[phone].count += 1;
        phoneMap[phone].scoreSum += r.nervScore;
        // Keep the most recent company name found
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
        const city = r.location || "Unbekannt";
        if (!cityStats[city]) {
            cityStats[city] = { count: 0, scoreSum: 0 };
        }
        cityStats[city].count++;
        cityStats[city].scoreSum += r.nervScore;
        
        // Collect unique company names
        if (r.companyName && r.companyName.trim().length > 0) {
            companyNamesSet.add(r.companyName.trim());
        }
    });

    const cities = Object.entries(cityStats).map(([name, data]) => ({
        name,
        count: data.count,
        avgScore: data.scoreSum / data.count
    })).sort((a, b) => b.count - a.count);

    const totalScoreSum = reports.reduce((acc, curr) => acc + curr.nervScore, 0);

    return {
        phoneNumber: reports[0].phoneNumber,
        companyNames: Array.from(companyNamesSet),
        totalCount: reports.length,
        avgScore: totalScoreSum / reports.length,
        cities
    };
  },

  // --- Feedback & Settings ---
  
  getSettings: (): AppSettings => {
    return loadSettings();
  },

  updateSettings: (settings: AppSettings) => {
    saveSettingsData(settings);
  },

  addFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
    const list = loadFeedback();
    const newEntry: FeedbackEntry = {
      ...feedback,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    list.push(newEntry);
    saveFeedbackList(list);
    return newEntry;
  },

  getAllFeedback: (): FeedbackEntry[] => {
    return loadFeedback().sort((a, b) => b.timestamp - a.timestamp);
  },

  getFeedbackById: (id: string): FeedbackEntry | undefined => {
    return loadFeedback().find(f => f.id === id);
  },

  deleteFeedback: (id: string) => {
    const list = loadFeedback();
    const filtered = list.filter(f => f.id !== id);
    saveFeedbackList(filtered);
  }
};