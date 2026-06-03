/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Medicine, User } from '../types';
import { MEDICINES_DB } from '../data/medicines';
import { Plus, X, ShieldAlert, Check, ShieldCheck, HelpCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractionCheckerProps {
  currentUser: User | null;
  onAddHistoryItem: (type: 'search' | 'analysis' | 'symptom', title: string, subtitle: string, details: any) => void;
}

export default function InteractionChecker({ currentUser, onAddHistoryItem }: InteractionCheckerProps) {
  const [selectedMeds, setSelectedMeds] = useState<Medicine[]>([]);

  // Filter out already selected medicines for selector drop-down
  const availableMeds = useMemo(() => {
    return MEDICINES_DB.filter(m => !selectedMeds.some(sel => sel.id === m.id));
  }, [selectedMeds]);

  // Add drug to checking list
  const handleAddMed = (med: Medicine) => {
    if (selectedMeds.length >= 5) return; // limit to 5 concurrently
    const nextMeds = [...selectedMeds, med];
    setSelectedMeds(nextMeds);

    // Record check execution in history if logged in
    if (currentUser && nextMeds.length >= 2) {
      onAddHistoryItem(
        'analysis',
        `Checked Drug Interactions`,
        `Checked risk index across ${nextMeds.length} drugs`,
        {
          medicinesAnalysed: nextMeds.map(m => m.name),
          riskScore: nextMeds.some(m => m.riskLevel === 'High') ? 70 : 30
        }
      );
    }
  };

  // Remove drug from lists
  const handleRemoveMed = (medId: string) => {
    setSelectedMeds(selectedMeds.filter(m => m.id !== medId));
  };

  // Clear overall board
  const handleClearAll = () => {
    setSelectedMeds([]);
  };

  // Compute pairwise interaction warnings on selected list
  const interactionResults = useMemo(() => {
    if (selectedMeds.length < 2) return null;

    const pairsMatched: { med1: Medicine; med2: Medicine; severity: 'High' | 'Moderate' | 'Low'; effect: string }[] = [];
    let absoluteMaxSeverity: 'High' | 'Moderate' | 'Low' | 'Clear' = 'Clear';

    for (let i = 0; i < selectedMeds.length; i++) {
      const m1 = selectedMeds[i];
      for (let j = i + 1; j < selectedMeds.length; j++) {
        const m2 = selectedMeds[j];

        // Check if there are pre-recorded interactions in database in either direction
        const interactionFrom1 = m1.interactions.find(inter => inter.withMedicineId === m2.id);
        const interactionFrom2 = m2.interactions.find(inter => inter.withMedicineId === m1.id);
        
        const matchingRule = interactionFrom1 || interactionFrom2;

        if (matchingRule) {
          pairsMatched.push({
            med1: m1,
            med2: m2,
            severity: matchingRule.severity,
            effect: matchingRule.effect
          });

          // update master severity scale
          if (matchingRule.severity === 'High') {
            absoluteMaxSeverity = 'High';
          } else if (matchingRule.severity === 'Moderate' && absoluteMaxSeverity !== 'High') {
            absoluteMaxSeverity = 'Moderate';
          } else if (matchingRule.severity === 'Low' && absoluteMaxSeverity !== 'High' && absoluteMaxSeverity !== 'Moderate') {
            absoluteMaxSeverity = 'Low';
          }
        }
      }
    }

    return {
      pairs: pairsMatched,
      overallSeverity: absoluteMaxSeverity === 'Clear' && pairsMatched.length === 0 ? 'Clear' : absoluteMaxSeverity
    };
  }, [selectedMeds]);

  return (
    <div className="space-y-6">
      {/* Intro Board */}
      <div className="rounded-3xl p-6 border border-brand-border nft-card space-y-2 hover-lift">
        <h2 className="text-xl font-display font-black text-[#1E2B25] uppercase tracking-tight">Drug-to-Drug Interaction Index</h2>
        <p className="text-xs text-brand-muted leading-relaxed max-w-4xl font-sans font-medium">
          Multi-drug therapy can trigger adverse internal clearance bottlenecks or synergistic actions. Select up to <strong>5 medicines</strong> from the database to highlight potential physiological conflicts instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selector Sidebar Column */}
        <div className="lg:col-span-5 rounded-3xl p-6 border border-brand-border nft-card space-y-5 hover-lift">
          <div className="flex items-center justify-between border-b border-brand-border pb-3.5">
            <h3 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight font-display">Add Medicines</h3>
            <span className="text-[10px] text-brand-muted font-extrabold font-mono uppercase tracking-wider">{selectedMeds.length}/5 Selected</span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {availableMeds.length > 0 ? (
              availableMeds.map(med => (
                <button
                  key={med.id}
                  disabled={selectedMeds.length >= 5}
                  onClick={() => handleAddMed(med)}
                  className="w-full text-left p-3 rounded-2xl border border-brand-border/40 bg-white/40 hover:bg-white/80 hover:border-brand-primary/40 transition-all flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-xl bg-[#E2ECE8] text-[#1E2B25] flex items-center justify-center text-xs font-black font-sans shadow-sm">
                      <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1E2B25] leading-tight font-sans">{med.name}</h4>
                      <p className="text-[9px] text-brand-muted font-mono italic leading-none mt-0.5">{med.category}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#A26D54] hover:underline uppercase tracking-wide">Add</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-brand-muted font-semibold">
                All available platform medicines added.
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Board Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Deck panel */}
          <div className="rounded-3xl p-6 border border-brand-border nft-card space-y-5 hover-lift">
            <div className="flex items-center justify-between border-b border-brand-border pb-3.5">
              <h3 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">Diagnostic Deck</h3>
              {selectedMeds.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[10px] text-rose-600 font-extrabold hover:underline cursor-pointer uppercase tracking-wider"
                >
                  Clear Deck
                </button>
              )}
            </div>

            {selectedMeds.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                <AnimatePresence>
                  {selectedMeds.map(med => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 bg-[#E2ECE8] text-[#1E2B25] pl-4 pr-2.5 py-2 rounded-2xl border border-brand-border text-xs font-extrabold font-sans"
                    >
                      <span>{med.name}</span>
                      <button
                        onClick={() => handleRemoveMed(med.id)}
                        className="p-1 hover:bg-[#1E2B25]/10 rounded-xl text-brand-muted cursor-pointer transition-colors"
                        id={`deck-remove-${med.id}`}
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 px-4 border border-dashed border-brand-border/60 rounded-2xl bg-[#FAFBFB]/50 space-y-3.5">
                <div className="h-10 w-10 bg-white border border-brand-border rounded-full flex items-center justify-center mx-auto text-[#1E2B25] shadow-sm">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1E2B25] uppercase tracking-wide font-display">Deck is vacant</p>
                  <p className="text-[10px] text-brand-muted font-medium mt-1">Add two or more medications from the sidebar to inspect matching warnings.</p>
                </div>
              </div>
            )}
          </div>

          {/* Verification Indicators details */}
          {selectedMeds.length >= 2 && interactionResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Overall warning gauge */}
              <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                interactionResults.overallSeverity === 'High'
                  ? 'bg-rose-50/50 border-rose-225'
                  : interactionResults.overallSeverity === 'Moderate'
                  ? 'bg-amber-50/50 border-amber-225'
                  : interactionResults.overallSeverity === 'Low'
                  ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                  : 'bg-emerald-50/30 border-emerald-225'
              }`}>
                <div className={`p-3 rounded-xl shrink-0 ${
                  interactionResults.overallSeverity === 'High'
                    ? 'bg-rose-100 text-rose-600 animate-bounce'
                    : interactionResults.overallSeverity === 'Moderate'
                    ? 'bg-amber-100 text-amber-600'
                    : interactionResults.overallSeverity === 'Low'
                    ? 'bg-[#DBEAFE] text-blue-600'
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {interactionResults.overallSeverity === 'Clear' ? (
                    <ShieldCheck size={22} className="stroke-[2.5]" />
                  ) : (
                    <ShieldAlert size={22} className="stroke-[2.5]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm text-[#1E2B25] tracking-tight uppercase">
                    Interaction Result: <span className="underline">{interactionResults.overallSeverity} RISK</span>
                  </h4>
                  <p className="text-xs text-brand-text/95 leading-relaxed font-sans font-medium pr-1">
                    {interactionResults.overallSeverity === 'High' && 'CRITICAL CAUTION: One or more dangerous pairwise interactions detected in the active list. Concurrent consumption is strictly dangerous and requires doctor intervention.'}
                    {interactionResults.overallSeverity === 'Moderate' && 'CAUTION ADVISORY: Moderate absorption or excretion overlaps found. Can increase collateral side-effects or lessen medication effects.'}
                    {interactionResults.overallSeverity === 'Low' && 'MILD OVERLAP DETECTED: Low level pharmacodynamics effects indicated. Check individual labels or consult pharmacists.'}
                    {interactionResults.overallSeverity === 'Clear' && 'No pre-known clinical interactions registered within our offline database across this particular collection. Ideal but check labels anyway.'}
                  </p>
                </div>
              </div>

              {/* Pairwise specific list items */}
              {interactionResults.pairs.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[9px] font-extrabold text-brand-muted tracking-widest uppercase font-display">Identified Interactions Ledger</h4>
                  <div className="space-y-3">
                    {interactionResults.pairs.map((pair, i) => (
                      <div
                        key={i}
                        className={`p-4.5 rounded-2xl border bg-white/70 shadow-sm space-y-2.5 relative overflow-hidden ${
                          pair.severity === 'High'
                            ? 'border-l-4 border-l-[#B91C1C] border-brand-border'
                            : pair.severity === 'Moderate'
                            ? 'border-l-4 border-l-[#C94A29] border-brand-border'
                            : 'border-l-4 border-l-[#1E2B25] border-brand-border'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="font-display font-black text-[#1E2B25]">
                            {pair.med1.name} + {pair.med2.name}
                          </span>
                          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase border ${
                            pair.severity === 'High'
                              ? 'bg-rose-50 border-rose-250 text-rose-700'
                              : pair.severity === 'Moderate'
                              ? 'bg-amber-50 border-[#C99E82] text-amber-700'
                              : 'bg-[#E2ECE8] border-[#1E2B25]/20 text-[#1E2B25]'
                          }`}>
                            {pair.severity} Severity
                          </span>
                        </div>
                        <p className="text-xs text-brand-text/90 leading-relaxed font-sans font-medium mt-1">
                          {pair.effect}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

