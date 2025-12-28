export interface Report {
  id: string;
  phoneNumber: string;
  companyName?: string;
  email?: string;
  location: string; // City/Address - Required for ranking logic, but optional in UI (default to "Unbekannt")
  description?: string;
  nervScore: number; // 1-10
  timestamp: number;
}

export interface CityStat {
  name: string;
  count: number;
  avgScore: number;
}

export interface FeedbackEntry {
  id: string;
  name?: string;
  email?: string;
  message: string;
  timestamp: number;
}

export interface AppSettings {
  feedbackEnabled: boolean;
}

export enum SortOption {
  DATE_DESC = 'DATE_DESC',
  SCORE_DESC = 'SCORE_DESC',
  SCORE_ASC = 'SCORE_ASC',
}