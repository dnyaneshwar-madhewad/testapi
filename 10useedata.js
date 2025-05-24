var onboardedCorps = [
  { 
    Corp_ID: "CORP001", 
    TranIDs: ["TXN001", "TXN002"], 
    Ben_IDs: ["BEN001", "BEN002"], 
    Limits: { daily: 10000, weekly: 50000, monthly: 200000 }, 
    ApprovedAmountLimit: 50000, 
    DebitAccts: ["9876543210", "9876543211"], 
    ActiveBenIDs: ["BEN001", "BEN002"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level1" 
  },
  { 
    Corp_ID: "CORP002", 
    TranIDs: ["TXN003", "TXN004"], 
    Ben_IDs: ["BEN003", "BEN004"], 
    Limits: { daily: 20000, weekly: 70000, monthly: 300000 }, 
    ApprovedAmountLimit: 75000, 
    DebitAccts: ["9876543220"], 
    ActiveBenIDs: ["BEN003"], 
    DeactivatedBenIDs: ["BEN004"], 
    Hierarchy: "Level2" 
  },
  { 
    Corp_ID: "CORP003", 
    TranIDs: ["TXN005"], 
    Ben_IDs: ["BEN005"], 
    Limits: { daily: 15000, weekly: 60000, monthly: 250000 }, 
    ApprovedAmountLimit: 60000, 
    DebitAccts: ["9876543230"], 
    ActiveBenIDs: ["BEN005"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level1" 
  },
  { 
    Corp_ID: "CORP004", 
    TranIDs: ["TXN006", "TXN007"], 
    Ben_IDs: ["BEN006", "BEN007"], 
    Limits: { daily: 25000, weekly: 100000, monthly: 400000 }, 
    ApprovedAmountLimit: 90000, 
    DebitAccts: ["9876543240"], 
    ActiveBenIDs: ["BEN006"], 
    DeactivatedBenIDs: ["BEN007"], 
    Hierarchy: "Level3" 
  },
  { 
    Corp_ID: "CORP005", 
    TranIDs: ["TXN008"], 
    Ben_IDs: ["BEN008"], 
    Limits: { daily: 12000, weekly: 55000, monthly: 220000 }, 
    ApprovedAmountLimit: 48000, 
    DebitAccts: ["9876543250"], 
    ActiveBenIDs: ["BEN008"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level1" 
  },
  { 
    Corp_ID: "CORP006", 
    TranIDs: ["TXN009", "TXN010"], 
    Ben_IDs: ["BEN009", "BEN010"], 
    Limits: { daily: 30000, weekly: 120000, monthly: 450000 }, 
    ApprovedAmountLimit: 100000, 
    DebitAccts: ["9876543260"], 
    ActiveBenIDs: ["BEN009", "BEN010"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level2" 
  },
  { 
    Corp_ID: "CORP007", 
    TranIDs: ["TXN011"], 
    Ben_IDs: ["BEN011"], 
    Limits: { daily: 18000, weekly: 65000, monthly: 270000 }, 
    ApprovedAmountLimit: 65000, 
    DebitAccts: ["9876543270"], 
    ActiveBenIDs: ["BEN011"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level3" 
  },
  { 
    Corp_ID: "CORP008", 
    TranIDs: ["TXN012", "TXN013"], 
    Ben_IDs: ["BEN012", "BEN013"], 
    Limits: { daily: 22000, weekly: 80000, monthly: 320000 }, 
    ApprovedAmountLimit: 72000, 
    DebitAccts: ["9876543280"], 
    ActiveBenIDs: ["BEN012"], 
    DeactivatedBenIDs: ["BEN013"], 
    Hierarchy: "Level1" 
  },
  { 
    Corp_ID: "CORP009", 
    TranIDs: ["TXN014"], 
    Ben_IDs: ["BEN014"], 
    Limits: { daily: 14000, weekly: 60000, monthly: 230000 }, 
    ApprovedAmountLimit: 54000, 
    DebitAccts: ["9876543290"], 
    ActiveBenIDs: ["BEN014"], 
    DeactivatedBenIDs: [], 
    Hierarchy: "Level2" 
  },
  { 
    Corp_ID: "CORP010", 
    TranIDs: ["TXN015", "TXN016"], 
    Ben_IDs: ["BEN015", "BEN016"], 
    Limits: { daily: 27000, weekly: 110000, monthly: 380000 }, 
    ApprovedAmountLimit: 85000, 
    DebitAccts: ["9876543300"], 
    ActiveBenIDs: ["BEN015"], 
    DeactivatedBenIDs: ["BEN016"], 
    Hierarchy: "Level3" 
  }
];
