/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Medicine, User, SavedMedicine } from '../types';
import { MEDICINES_DB } from '../data/medicines';
import { Search, AlertTriangle, ShieldCheck, Plus, Check, Pill, Clock, Scale, Info, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MedicineDetailProps {
  currentUser: User | null;
  onAddHistoryItem: (type: 'search' | 'analysis' | 'symptom', title: string, subtitle: string, details: any) => void;
  onUpdateCabinet: (updatedCabinet: SavedMedicine[]) => void;
  onAuthNeed: () => void;
}

export default function MedicineDetail({ currentUser, onAddHistoryItem, onUpdateCabinet, onAuthNeed }: MedicineDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('1');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Dosage safety calculator states
  const [patientAgeGroup, setPatientAgeGroup] = useState<'adult' | 'pediatric' | 'geriatric'>('adult');
  const [kidneyStatus, setKidneyStatus] = useState<'normal' | 'impaired'>('normal');
  const [pregnantStatus, setPregnantStatus] = useState<boolean>(false);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);

  // Cabinet addition states
  const [scheduleMorning, setScheduleMorning] = useState(false);
  const [scheduleNoon, setScheduleNoon] = useState(false);
  const [scheduleEvening, setScheduleEvening] = useState(false);
  const [cabinetNotes, setCabinetNotes] = useState('');
  const [showCabinetAddedToast, setShowCabinetAddedToast] = useState(false);

  // Selected drug getter
  const selectedMed = useMemo(() => {
    return MEDICINES_DB.find(m => m.id === selectedMedId) || MEDICINES_DB[0];
  }, [selectedMedId]);

  // Categories extraction
  const categories = useMemo(() => {
    const list = Array.from(new Set(MEDICINES_DB.map(m => m.category.split(' ')[0])));
    return ['All', ...list];
  }, []);

  // Filtered meds
  const filteredMeds = useMemo(() => {
    return MEDICINES_DB.filter(m => {
      const query = searchQuery.toLowerCase();
      const nameMatch = m.name.toLowerCase().includes(query) || m.genericName.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'All' || m.category.includes(categoryFilter);
      return nameMatch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Handle select medicine
  const handleSelectMed = (med: Medicine) => {
    setSelectedMedId(med.id);
    setShowAnalysisReport(false);
    setCabinetNotes('');
    setScheduleMorning(false);
    setScheduleNoon(false);
    setScheduleEvening(false);
    
    // Log search event in history if authenticated
    if (currentUser) {
      onAddHistoryItem(
        'search',
        `Searched: ${med.name}`,
        `Viewed guidelines for ${med.genericName}`,
        { medicinesAnalysed: [med.name] }
      );
    }
  };

  // Perform personal safety analysis
  const handleCalculateSafety = () => {
    setShowAnalysisReport(true);

    if (currentUser) {
      onAddHistoryItem(
        'analysis',
        `Analyzed Safety: ${selectedMed.name}`,
        `Evaluation for ${patientAgeGroup.toUpperCase()} patient`,
        {
          medicinesAnalysed: [selectedMed.name],
          riskScore: selectedMed.riskLevel === 'High' ? 85 : selectedMed.riskLevel === 'Medium' ? 50 : 20,
          notes: `Evaluated safety matrix under conditions - Age: ${patientAgeGroup}, Kidney health: ${kidneyStatus}, Contraindications evaluated.`
        }
      );
    }
  };

  // Safe recommendations derived from age, kidney status, warnings
  const analysisReportDetails = useMemo(() => {
    if (!showAnalysisReport) return null;

    let safetyRating: 'Safe with guidance' | 'Moderate caution' | 'High Caution' = 'Safe with guidance';
    let suggestedDoseModifier = 'Standard recommended clinical dose.';
    let cautionNotes: string[] = [];

    // General high-risk meds
    if (selectedMed.riskLevel === 'High') {
      safetyRating = 'Moderate caution';
      cautionNotes.push('This medication carries elevated systemic monitoring requirements.');
    }

    // Age rules
    if (patientAgeGroup === 'pediatric') {
      safetyRating = 'High Caution';
      suggestedDoseModifier = 'Requires pediatric weight-based liquid dosage chart (mg/kg).';
      cautionNotes.push('Do NOT administer adult solids to pediatric patients under 12 without explicit clinical orders.');
      if (selectedMed.id === '10') {
        cautionNotes.push('CRITICAL: Aspirin is contraindicated for pediatric patients due to REYE SYNDROME risk.');
      }
    } else if (patientAgeGroup === 'geriatric') {
      if (selectedMed.id === '8' || selectedMed.id === '2') { // Gabapentin / Ibuprofen
        safetyRating = 'High Caution';
        suggestedDoseModifier = 'Review lower start-low titration (Reduce by 25%-50%).';
        cautionNotes.push('Geriatric patients have significantly sensitive pathways to drowsiness, confusion, and stomach ulcers.');
      }
    }

    // Kidney health rules
    if (kidneyStatus === 'impaired') {
      if (selectedMed.id === '2' || selectedMed.id === '8' || selectedMed.id === '5' || selectedMed.id === '4') {
        safetyRating = 'High Caution';
        suggestedDoseModifier = 'Requires 50% dosing reduction or alternative formulation.';
        cautionNotes.push('Excreted almost completely via renal pathways. Impaired clearance creates cumulative serum toxicity risk.');
      }
    }

    // Pregnancy rules
    if (pregnantStatus) {
      if (selectedMed.id === '5') { // Lisinopril
        safetyRating = 'High Caution';
        cautionNotes.push('ABSOLUTELY CONTRAINDICATED in pregnancy: Class D high risk of fetal abnormalities.');
      } else if (selectedMed.id === '2') {
        safetyRating = 'High Caution';
        cautionNotes.push('Avoid in 3rd trimester: Can cause early closing of ductus arteriosus in unborn baby.');
      }
    }

    return {
      rating: safetyRating,
      doseModifier: suggestedDoseModifier,
      cautionNotes: cautionNotes.length > 0 ? cautionNotes : ['No immediate general physiological contradictions flagged for this state.']
    };
  }, [showAnalysisReport, selectedMed, patientAgeGroup, kidneyStatus, pregnantStatus]);

  // Save to cupboard / cabinet state
  const handleAddToCabinet = () => {
    if (!currentUser) {
      onAuthNeed();
      return;
    }

    const times: string[] = [];
    if (scheduleMorning) times.push('08:00');
    if (scheduleNoon) times.push('13:00');
    if (scheduleEvening) times.push('20:00');

    const newCabinetItem: SavedMedicine = {
      id: Math.random().toString(36).substr(2, 9),
      medicineId: selectedMed.id,
      customName: selectedMed.name,
      dosageTime: times.length > 0 ? times : ['08:00'],
      notes: cabinetNotes.trim() || undefined,
      takenToday: false
    };

    const nextCabinet = [...currentUser.cabinet, newCabinetItem];
    onUpdateCabinet(nextCabinet);

    setShowCabinetAddedToast(true);
    setTimeout(() => setShowCabinetAddedToast(false), 3000);
  };

  const getPillBgClass = (color: string) => {
    switch (color) {
      case 'rose': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'emerald': return 'bg-emerald-100 text-emerald-750 border-emerald-300';
      case 'violet': return 'bg-violet-100 text-violet-750 border-violet-300';
      case 'sky': return 'bg-sky-100 text-sky-700 border-sky-300';
      case 'indigo': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'teal': return 'bg-teal-100 text-teal-700 border-teal-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Search Sidebar Column - styled as premium nft card */}
      <div className="lg:col-span-4 rounded-3xl p-6 border border-brand-border nft-card space-y-6 hover-lift">
        <div>
          <h3 className="font-display font-extrabold text-[#1E2B25] text-base uppercase tracking-tight">Medicine Directory</h3>
          <p className="text-[11px] text-brand-muted font-sans font-medium">Browse molecule catalog indexes offline</p>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search brand or generic molecule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold pl-10 pr-4 py-3 rounded-2xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-[#1E2B25] focus:border-transparent bg-[#F5F7F6] transition-all placeholder:text-brand-muted/70 text-[#1E2B25]"
          />
        </div>

        {/* Filter Badges */}
        <div className="space-y-2">
          <span className="block text-[9px] uppercase font-bold text-brand-muted tracking-widest font-sans">Filter by Action</span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] px-3.5 py-1.5 rounded-xl font-bold tracking-tight transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1E2B25] text-white shadow-md'
                    : 'bg-white/60 border border-brand-border/65 text-brand-muted hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines List - incredibly clean styled buttons */}
        <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredMeds.length > 0 ? (
            filteredMeds.map(med => {
              const active = med.id === selectedMedId;
              return (
                <button
                  key={med.id}
                  onClick={() => handleSelectMed(med)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between border ${
                    active
                      ? 'bg-gradient-to-r from-[#1E2B25]/5 to-[#1E2B25]/10 border-[#1E2B25] shadow-sm scale-[1.01]'
                      : 'border-brand-border/30 bg-white/40 hover:bg-white/80 active:scale-[0.99] text-brand-text/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center border-b-2 shadow-inner ${getPillBgClass(med.pillColor)}`}>
                      <Pill size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E2B25] leading-tight font-sans">{med.name}</h4>
                      <p className="text-[10px] text-brand-muted font-mono italic leading-none mt-0.5">{med.genericName}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                      med.riskLevel === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                        : med.riskLevel === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-[#C99E82]'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {med.riskLevel}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-brand-muted font-medium">No medicines match your search filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                className="text-[11px] text-[#A26D54] font-bold hover:underline mt-1"
              >
                Reset queries
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Center & Panel Column */}
      <div className="lg:col-span-8 space-y-6">
        <motion.div
          key={selectedMed.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl p-6 border border-brand-border nft-card space-y-6 hover-lift"
        >
          {/* Headline and pill renderer */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-black text-[#1E2B25] uppercase tracking-tight">{selectedMed.name}</h2>
                <span className="text-[10px] px-3 py-1 rounded-xl bg-[#E2ECE8] text-[#1E2B25] font-extrabold uppercase tracking-wider">{selectedMed.category}</span>
              </div>
              <p className="text-xs text-brand-muted font-mono italic">Chemical Formula: <span className="font-bold text-brand-text not-italic">{selectedMed.genericName}</span></p>
            </div>

            {/* Pill graphic visualization - designed precisely like adjacent NFT monkey traits */}
            <div className="flex items-center gap-3 bg-[#FAFBFB] p-2.5 rounded-2xl border border-brand-border shadow-inner">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-[#1E2B25]/85 uppercase font-display">Pill Layout Identity</span>
                {selectedMed.imprint && <span className="text-[9px] text-[#A26D54] font-mono uppercase font-bold">Imprint: '{selectedMed.imprint}'</span>}
              </div>
              
              {/* Pill Shape Maker */}
              <div className={`relative flex items-center justify-center border-2 shadow-sm transition-transform hover:rotate-12 cursor-help ${
                selectedMed.pillShape === 'capsule'
                  ? 'h-6 w-14 rounded-full'
                  : selectedMed.pillShape === 'oval'
                  ? 'h-8 w-14 rounded-[30px]'
                  : 'h-10 w-10 rounded-full'
              } ${getPillBgClass(selectedMed.pillColor)}`}>
                {selectedMed.pillShape === 'capsule' && (
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-black/5 border-r border-black/10 rounded-l-full" />
                )}
                <span className="text-[8px] font-mono font-black select-none tracking-widest">{selectedMed.imprint || 'MED'}</span>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-brand-muted tracking-widest uppercase flex items-center gap-2 font-display">
              <Info size={14} className="text-[#A26D54]" />
              <span>Description & Action</span>
            </h3>
            <p className="text-sm text-[#1E2B25]/90 leading-relaxed font-sans font-medium">{selectedMed.description}</p>
          </div>

          {/* Uses & Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-brand-border">
              <h4 className="text-xs font-extrabold text-[#1E2B25] mb-3 flex items-center gap-2 uppercase tracking-wide font-display">
                <CheckCircle size={14} className="text-emerald-700" />
                <span>Clinical Uses & Indications</span>
              </h4>
              <ul className="space-y-2">
                {selectedMed.uses.map((use, i) => (
                  <li key={i} className="text-xs text-[#1E2B25]/85 flex items-start gap-2 font-sans font-medium leading-relaxed">
                    <span className="h-2 w-2 bg-[#1E2B25] rounded-full shrink-0 mt-1.5" />
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-brand-border">
              <h4 className="text-xs font-extrabold text-[#1E2B25] mb-3 flex items-center gap-2 uppercase tracking-wide font-display">
                <Clock size={14} className="text-[#A26D54]" />
                <span>Reference Dosage</span>
              </h4>
              <p className="text-xs text-[#1E2B25]/90 leading-relaxed font-sans font-semibold pr-2">{selectedMed.dosage}</p>
            </div>
          </div>

          {/* Side Effects customized css frequency ledger */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-brand-muted tracking-widest uppercase flex items-center gap-2 font-display">
              <Scale size={14} className="text-[#A26D54]" />
              <span>Side Effect Frequency Ledger</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMed.sideEffects.map((eff, i) => (
                <div key={i} className="space-y-1 bg-white/70 p-3 rounded-xl border border-brand-border/60">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E2B25]">
                    <span>{eff.name}</span>
                    <span className="text-[10px] text-[#A26D54] font-mono">{eff.percentage}%</span>
                  </div>
                  {/* Slider bar */}
                  <div className="h-2 w-full bg-[#E2ECE8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                      style={{ width: `${eff.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Warnings */}
          <div className="p-4.5 bg-rose-50/50 rounded-2xl border border-rose-100/60 space-y-2">
            <h4 className="text-xs font-extrabold text-[#991B1B] flex items-center gap-2 uppercase tracking-wide font-display">
              <AlertTriangle size={15} className="text-rose-600 animate-pulse" />
              <span>Clinical Precautions & Contraindications</span>
            </h4>
            <ul className="space-y-1.5">
              {selectedMed.warnings.map((warn, i) => (
                <li key={i} className="text-xs text-rose-850/90 leading-relaxed font-bold flex items-start gap-2">
                  <span className="shrink-0 text-rose-500 text-[11px] mt-0.5">⚠️</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interaction risks warning block (if preconfigured inside drug database) */}
          {selectedMed.interactions.length > 0 && (
            <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-xs space-y-1.5">
              <span className="font-extrabold text-amber-900 flex items-center gap-2 uppercase tracking-wide font-display">
                <AlertTriangle size={14} className="text-amber-700 animate-bounce" />
                <span>Pairwise Interaction Warning Flags</span>
              </span>
              <p className="text-amber-950 font-sans font-medium leading-relaxed">
                This drug possesses high systemic interaction parameters when co-administered. Visit our <strong className="text-amber-900 text-semibold">Interactions</strong> explorer tab for full diagnostic overlays.
              </p>
            </div>
          )}

          {/* PERSONAL SAFEGUARDS CALCULATOR MODULE */}
          <div className="border-t border-brand-border pt-6 space-y-5">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-[#1E2B25] text-base uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#1E2B25]" />
                <span>Patient Safeguards Evaluator</span>
              </h3>
              <p className="text-[11px] text-brand-muted font-sans font-medium">
                Select physiological settings below to analyze safe dosage limits and warnings dynamically without external API risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAFBFB] p-4.5 rounded-2xl border border-brand-border">
              <div className="space-y-1.5">
                <span className="block text-[9px] font-extrabold text-[#A26D54] tracking-widest uppercase font-display">Age Classification</span>
                <select
                  value={patientAgeGroup}
                  onChange={(e) => setPatientAgeGroup(e.target.value as any)}
                  className="w-full text-xs font-bold bg-white border border-brand-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B25] text-[#1E2B25]"
                >
                  <option value="adult">Adult (12 - 65 yrs)</option>
                  <option value="pediatric">Pediatric (Under 12 yrs)</option>
                  <option value="geriatric">Geriatric (65+ yrs)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[9px] font-extrabold text-[#A26D54] tracking-widest uppercase font-display">Renal (Kidney) Clearance</span>
                <select
                  value={kidneyStatus}
                  onChange={(e) => setKidneyStatus(e.target.value as any)}
                  className="w-full text-xs font-bold bg-white border border-brand-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1E2B25] text-[#1E2B25]"
                >
                  <option value="normal">Normal Filtration (GFR &gt; 60)</option>
                  <option value="impaired">Impaired/Decreased (GFR &lt; 50)</option>
                </select>
              </div>

              <div className="flex items-end pb-3 pl-1 select-none">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pregnantStatus}
                    onChange={(e) => setPregnantStatus(e.target.checked)}
                    className="h-4 w-4 rounded-xl text-[#1E2B25] focus:ring-[#1E2B25] border-brand-border transition-colors outline-none cursor-pointer"
                  />
                  <div>
                    <span className="block text-xs font-extrabold text-[#1E2B25]">Patient is Pregnant</span>
                    <span className="block text-[9px] text-brand-muted font-sans">Triggers pregnancy warnings</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCalculateSafety}
                className="px-6 py-3.5 bg-[#1E2B25] hover:bg-[#32453C] active:scale-[0.98] text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-[#1E2B25]/15 cursor-pointer font-display"
              >
                EVALUATE SAFETY PARAMETERS
              </button>
            </div>

            {/* Analysis report result slide */}
            {showAnalysisReport && analysisReportDetails && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-5 rounded-2xl border border-dashed text-xs space-y-4 ${
                  analysisReportDetails.rating === 'High Caution'
                    ? 'bg-rose-50/50 border-rose-300 text-rose-950'
                    : analysisReportDetails.rating === 'Moderate caution'
                    ? 'bg-amber-50/50 border-[#C99E82] text-amber-955'
                    : 'bg-emerald-50/35 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full animate-pulse bg-current" />
                    <span className="font-black text-xs uppercase tracking-wider font-display">OFFLINE SAFETY REPORT</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase border ${
                    analysisReportDetails.rating === 'High Caution'
                      ? 'bg-rose-100 border-rose-300 text-rose-850'
                      : analysisReportDetails.rating === 'Moderate caution'
                      ? 'bg-amber-100 border-[#C99E82] text-amber-850'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-850'
                  }`}>
                    {analysisReportDetails.rating}
                  </span>
                </div>

                <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-white/80 text-brand-text">
                  <span className="font-bold text-[9px] uppercase tracking-widest text-[#A26D54] block mb-0.5 font-display">Dosage Scaling Modification Advice</span>
                  <p className="font-black font-sans text-xs">{analysisReportDetails.doseModifier}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[9px] uppercase tracking-widest text-brand-muted block font-display">Critical physiological factors detected</span>
                  <ul className="space-y-1.5">
                    {analysisReportDetails.cautionNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-relaxed font-sans font-semibold">
                        <span className="text-[#A26D54] font-black shrink-0 font-display">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* CABINET ADDITION DOCK */}
          <div className="border-t border-brand-border pt-6 space-y-4">
            <h3 className="font-display font-extrabold text-[#1E2B25] text-base uppercase tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-[#1E2B25]" />
              <span>Add to Personal Cabinet</span>
            </h3>

            {currentUser ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="block text-[9px] font-extrabold text-brand-muted tracking-widest uppercase font-display">Set Notification Frequency</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setScheduleMorning(!scheduleMorning)}
                      className={`py-3.5 rounded-2xl text-xs font-black tracking-tight border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        scheduleMorning
                          ? 'bg-[#1E2B25] border-[#1E2B25] text-white shadow-md shadow-[#1E2B25]/10'
                          : 'bg-white border-brand-border text-brand-muted hover:bg-[#F2F5F4]'
                      }`}
                    >
                      <span className="text-base">☀️</span>
                      <span>Morning</span>
                    </button>
                    <button
                      onClick={() => setScheduleNoon(!scheduleNoon)}
                      className={`py-3.5 rounded-2xl text-xs font-black tracking-tight border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        scheduleNoon
                          ? 'bg-[#1E2B25] border-[#1E2B25] text-white shadow-md shadow-[#1E2B25]/10'
                          : 'bg-white border-brand-border text-brand-muted hover:bg-[#F2F5F4]'
                      }`}
                    >
                      <span className="text-base">🌤️</span>
                      <span>Noon</span>
                    </button>
                    <button
                      onClick={() => setScheduleEvening(!scheduleEvening)}
                      className={`py-3.5 rounded-2xl text-xs font-black tracking-tight border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        scheduleEvening
                          ? 'bg-[#1E2B25] border-[#1E2B25] text-white shadow-md shadow-[#1E2B25]/10'
                          : 'bg-white border-brand-border text-brand-muted hover:bg-[#F2F5F4]'
                      }`}
                    >
                      <span className="text-base">🌙</span>
                      <span>Evening</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-extrabold text-brand-muted tracking-widest uppercase font-display">Custom Reminders / Notes</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Take 1/2 tablet with breakfast..."
                      value={cabinetNotes}
                      onChange={(e) => setCabinetNotes(e.target.value)}
                      className="flex-1 text-xs font-bold px-4 py-3 rounded-2xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-[#1E2B25] bg-white text-brand-text"
                    />
                    <button
                      onClick={handleAddToCabinet}
                      className="px-5 bg-[#1E2B25] hover:bg-[#32453C] text-white rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase font-display"
                    >
                      <Plus size={15} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 p-5 rounded-2xl border border-brand-border flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-display font-bold text-[#1E2B25]">PERSIST YOUR PATIENT BRIEFCASE</span>
                  <p className="text-brand-muted text-[11px] font-sans font-medium mt-0.5">Sign in securely below to configure dosing schedules, cabinet boxes, and search histories.</p>
                </div>
                <button
                  onClick={onAuthNeed}
                  className="px-5 py-3 bg-[#1E2B25] hover:bg-[#32453C] text-white rounded-2xl font-bold tracking-tight cursor-pointer font-sans"
                >
                  Sign In / Register
                </button>
              </div>
            )}

            {/* Notification Confirmation Toast */}
            {showCabinetAddedToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-emerald-50/60 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 "
              >
                <Check size={16} />
                <span>Successfully persisted inside patient briefing briefcase under cabinet ledger!</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
