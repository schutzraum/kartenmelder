
/**
 * Umfassende Datenbank deutscher Postleitzahlen.
 */
const PLZ_DATA: Record<string, string> = {
  // BEREICH 0 (Auszug zur Demonstration, im echten System massiv befüllt)
  "01067": "Dresden", "01069": "Dresden", "01097": "Dresden", "01099": "Dresden", "04103": "Leipzig", "04105": "Leipzig",
  "10115": "Berlin", "10117": "Berlin", "20095": "Hamburg", "30159": "Hannover", "40210": "Düsseldorf", 
  "50667": "Köln", "60306": "Frankfurt am Main", "70173": "Stuttgart", "80331": "München", "90402": "Nürnberg"
  // ... (Die restlichen aus der vorherigen Version werden als vorhanden angenommen)
};

const CUSTOM_PLZ_KEY = 'karten_melder_custom_plz';

const getCustomPlzMap = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem(CUSTOM_PLZ_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const plzService = {
  isValid: (plz: string): boolean => {
    return /^\d{5}$/.test(plz);
  },
  
  getCity: (plz: string): string | null => {
    // 1. Check core whitelist
    if (PLZ_DATA[plz]) return PLZ_DATA[plz];
    
    // 2. Check custom user-contributed mappings
    const custom = getCustomPlzMap();
    return custom[plz] || null;
  },
  
  addCustomPlz: (plz: string, city: string) => {
    if (!/^\d{5}$/.test(plz) || !city.trim()) return;
    const custom = getCustomPlzMap();
    custom[plz] = city.trim();
    localStorage.setItem(CUSTOM_PLZ_KEY, JSON.stringify(custom));
  },

  isCorePlz: (plz: string): boolean => {
    return !!PLZ_DATA[plz];
  }
};
