/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SavedMedicine {
  id: string;
  medicineId: string;
  customName: string;
  dosageTime: string[]; // e.g. ["08:00", "20:00"]
  notes?: string;
  takenToday?: boolean;
}

export interface HistoryItem {
  id: string;
  type: 'search' | 'analysis' | 'symptom' | 'ai_diagnosis';
  timestamp: string;
  title: string;
  subtitle: string;
  details: {
    medicinesAnalysed?: string[];
    symptomsChecked?: string[];
    riskScore?: number;
    notes?: string;
    matchedConditions?: { conditionName: string; confidence: number }[];
    aiPrimaryHypothesis?: string;
    aiEmpatheticNarrative?: string;
    aiConfidence?: number;
    aiMatches?: { condition: string; details: string; typicalInterventions: string; urgency: string }[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  cabinet: SavedMedicine[];
  history: HistoryItem[];
}

export interface SideEffect {
  name: string;
  percentage: number; // 0-100 indicating frequency
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: SideEffect[];
  warnings: string[];
  interactions: {
    withMedicineId: string;
    severity: 'High' | 'Moderate' | 'Low';
    effect: string;
  }[];
  riskLevel: 'Low' | 'Medium' | 'High';
  pillColor: string; // Tailwind color name like 'rose', 'blue', 'amber'
  pillShape: 'oval' | 'round' | 'capsule';
  imprint?: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  commonMedications: string[]; // references of medicineIds
  lifestyleTips: string[];
  severity: 'Mild' | 'Moderate' | 'Severe';
  warningSigns: string[]; // when to see a doctor immediately
}
