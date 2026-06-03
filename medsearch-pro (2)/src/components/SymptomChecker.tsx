/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { HealthCondition, User } from '../types';
import { CONDITIONS_DB, ALL_SYMPTOMS } from '../data/conditions';
import { MEDICINES_DB } from '../data/medicines';
import { ShieldCheck, Brain, Plus, Check, Play, AlertOctagon, RefreshCw, ChevronRight, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SymptomCheckerProps {
  currentUser: User | null;
  onAddHistoryItem: (type: 'search' | 'analysis' | 'symptom', title: string, subtitle: string, details: any) => void;
}

export default function SymptomChecker({ currentUser, onAddHistoryItem }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Toggle symptom select
  const handleToggleSymptom = (sym: string) => {
    setShowAnalysis(false);
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Clear selections
  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowAnalysis(false);
  };

  // Compute matched conditions with confidence scores
  const matchedConditions = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];

    const matches = CONDITIONS_DB.map(condition => {
      const matchCount = condition.symptoms.filter(sym => selectedSymptoms.includes(sym)).length;
      const confidence = Math.round((matchCount / condition.symptoms.length) * 100);

      return {
        condition,
        matchCount,
        confidence
      };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.confidence - a.confidence);

    return matches;
  }, [selectedSymptoms]);

  // Execute diagnostic evaluation
  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;
    setShowAnalysis(true);

    // Save diagnostic checklist in history if authenticated
    if (currentUser) {
      const conditionNames = matchedConditions.slice(0, 3).map(m => m.condition.name);
      
      onAddHistoryItem(
        'symptom',
        `Symptom Check: ${selectedSymptoms.slice(0, 3).join(', ')}${selectedSymptoms.length > 3 ? '...' : ''}`,
        `Identified: ${conditionNames.length > 0 ? conditionNames.join(', ') : 'No strong offline matches'}`,
        {
          symptomsChecked: selectedSymptoms,
          matchedConditions: matchedConditions.map(mc => ({
            conditionName: mc.condition.name,
            confidence: mc.confidence
          }))
        }
      );
    }
  };

  // Get medicine name from ID
  const getMedicineName = (id: string) => {
    return MEDICINES_DB.find(m => m.id === id)?.name || 'Recommended Therapy';
  };

  return (
    <div className="space-y-6">
      {/* Intro Panel */}
      <div className="rounded-3xl p-6 border border-brand-border nft-card space-y-2 hover-lift">
        <h2 className="text-xl font-display font-black text-[#1E2B25] uppercase tracking-tight">Interactive Symptom Analyst</h2>
        <p className="text-xs text-brand-muted leading-relaxed max-w-4xl font-sans font-medium">
          Identify safety warning guidelines and standard conditions dynamically using our highly optimized deterministic clinical mapping logic. Check relevant symptoms below to load metrics, corresponding medicines, and diagnostic confidence scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Symptoms Select Board Column */}
        <div className="lg:col-span-5 rounded-3xl p-6 border border-brand-border nft-card space-y-5 hover-lift">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-[#1E2B25] animate-pulse" />
              <h3 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">Select Symptoms</h3>
            </div>
            {selectedSymptoms.length > 0 && (
              <button
                onClick={handleReset}
                className="text-[10px] text-brand-muted font-bold hover:text-brand-text flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <RefreshCw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Checklist grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {ALL_SYMPTOMS.map(symptom => {
              const checked = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => handleToggleSymptom(symptom)}
                  className={`text-left text-xs p-3 rounded-2xl border transition-all flex items-center justify-between font-sans font-extrabold cursor-pointer ${
                    checked
                      ? 'bg-gradient-to-r from-[#1E2B25]/5 to-[#1E2B25]/10 border-[#1E2B25] text-[#1E2B25] shadow-sm'
                      : 'bg-white/40 border-brand-border/40 text-brand-text/85 hover:bg-white hover:border-brand-primary/40'
                  }`}
                >
                  <span>{symptom}</span>
                  <div className={`h-4.5 w-4.5 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    checked
                      ? 'bg-[#1E2B25] border-[#1E2B25] text-white'
                      : 'border-brand-border bg-white'
                  }`}>
                    {checked && <Check size={10} className="stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              disabled={selectedSymptoms.length === 0}
              onClick={handleAnalyze}
              className="w-full sm:w-auto px-6 py-4 bg-[#1E2B25] hover:bg-[#32453C] active:scale-[0.98] text-white rounded-2xl text-xs font-black tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#1E2B25]/10 cursor-pointer font-display uppercase"
              id="symptom-analyze-btn"
            >
              <Play size={10} className="fill-current text-white stroke-none" />
              <span>RUN COMBINATORIAL DIAGNOSIS</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Matches Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {showAnalysis ? (
            <div className="space-y-6">
              <div className="rounded-3xl p-6 border border-brand-border nft-card space-y-5 hover-lift">
                <h3 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight flex items-center gap-2 border-b border-brand-border pb-3">
                  <ShieldCheck size={18} className="text-[#1E2B25] font-bold" />
                  <span>Combinatorial Match Report</span>
                </h3>

                {matchedConditions.length > 0 ? (
                  <div className="space-y-6">
                    {matchedConditions.map(({ condition, confidence, matchCount }) => (
                      <div
                        key={condition.id}
                        className="border border-brand-border rounded-2xl overflow-hidden bg-white/40 shadow-inner"
                      >
                        {/* Header card with match confidence scale */}
                        <div className="bg-[#FAFBFB] p-4.5 border-b border-brand-border flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="font-display font-extrabold text-[#1E2B25] text-sm tracking-tight">{condition.name}</h4>
                            <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                              condition.severity === 'Severe'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : condition.severity === 'Moderate'
                                ? 'bg-amber-50 text-amber-700 border-[#C99E82]'
                                : 'bg-[#E2ECE8] text-[#1E2B25] border-[#1E2B25]/20'
                            }`}>
                              {condition.severity} Severity Index
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-brand-muted font-mono font-bold">{matchCount} matched symptoms</span>
                            <div className="flex items-center gap-1.5 bg-[#1E2B25]/5 border border-[#1E2B25]/10 px-2.5 py-1 rounded-xl text-[#1E2B25] font-black font-mono text-xs">
                              <span>Score:</span>
                              <span className="text-sm font-black">{confidence}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="p-4.5 space-y-4 text-xs font-sans font-medium">
                          {/* Description text */}
                          <div>
                            <span className="block text-[9px] font-extrabold text-brand-muted tracking-widest uppercase mb-1 font-display">Clinical Profile</span>
                            <p className="text-[#1E2B25]/90 leading-relaxed font-sans">{condition.description}</p>
                          </div>

                          {/* Related meds references */}
                          {condition.commonMedications.length > 0 && (
                            <div>
                              <span className="block text-[9px] font-extrabold text-brand-muted tracking-widest uppercase mb-2 font-display">Standard Related Interventions</span>
                              <div className="flex flex-wrap gap-1.5">
                                {condition.commonMedications.map(medId => (
                                  <span key={medId} className="px-3 py-1.5 rounded-xl bg-[#FAFBFB] border border-brand-border text-[#1E2B25] text-[10px] font-extrabold uppercase font-sans">
                                    {getMedicineName(medId)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Lifestyle guidance suggestions */}
                          <div>
                            <span className="block text-[9px] font-extrabold text-brand-muted tracking-widest uppercase mb-1.5 flex items-center gap-1.5 font-display">
                              <Sparkles size={11} className="text-[#A26D54]" />
                              <span>Non-Pharmaceutical Self Care Actions</span>
                            </span>
                            <ul className="space-y-1.5 text-[#1E2B25]/85 leading-relaxed pl-1">
                              {condition.lifestyleTips.slice(0, 3).map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-[11px] font-medium font-sans">
                                  <span className="text-[#A26D54] mt-0.5 font-bold">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Critical Red Flag Signs */}
                          <div className="p-4 bg-rose-50/50 border border-dashed border-rose-200 rounded-2xl space-y-1.5">
                            <span className="font-black text-rose-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-display">
                              <AlertOctagon size={13} className="text-rose-600 animate-pulse" />
                              <span>Critical Warning Trigger Indicators</span>
                            </span>
                            <ul className="space-y-1 pl-0.5">
                              {condition.warningSigns.map((sign, index) => (
                                <li key={index} className="text-rose-700/80 leading-normal text-[11px] flex items-start gap-1.5 font-sans font-bold">
                                  <ChevronRight size={10} className="stroke-[3] shrink-0 mt-1" />
                                  <span>{sign}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-brand-muted">No matching conditions identified in our secure local database.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl p-6 border border-brand-border nft-card space-y-4 hover-lift text-center py-20 px-4">
              <div className="h-14 w-14 bg-[#FAFBFB] border border-brand-border text-[#1E2B25] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Brain size={24} className="stroke-[1.5]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">Diagnostic Engine Ideal</h4>
                <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium">
                  Select your current physical symptoms inside the catalog selector, then trigger calculations. We'll present statistical confidence matches mapping directly to standard conditions and safety warnings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
