/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, SavedMedicine, HistoryItem } from '../types';
import { MEDICINES_DB } from '../data/medicines';
import { ShieldCheck, Plus, Trash, Check, Lock, Bell, Search, Activity, Brain, Clock, ClipboardList, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  currentUser: User | null;
  onUpdateCabinet: (updatedCabinet: SavedMedicine[]) => void;
  onAuthClick: () => void;
  onAddHistoryItem: (type: 'search' | 'analysis' | 'symptom' | 'ai_diagnosis', title: string, subtitle: string, details: any) => void;
}

export default function Dashboard({ currentUser, onUpdateCabinet, onAuthClick, onAddHistoryItem }: DashboardProps) {
  const [systolic, setSystolic] = React.useState('');
  const [diastolic, setDiastolic] = React.useState('');
  const [pulse, setPulse] = React.useState('');
  const [vitalsSaved, setVitalsSaved] = React.useState(false);

  const evaluateVitals = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    const hr = parseInt(pulse);

    if (isNaN(sys) || isNaN(dia) || isNaN(hr)) {
      return null;
    }

    let isDangerous = false;
    let statusTitle = "Normal & Healthy";
    let explanation = "Your blood pressure parameters and heart rate are within standard healthy reference ranges.";
    let specialty = "General Family Doctor / Practitioner";

    if (sys >= 180 || dia >= 120) {
      isDangerous = true;
      statusTitle = "Hypertensive Crisis (Emergency)";
      explanation = "Critical high BP parameters detected. These require urgent hospital rescue immediately.";
      specialty = "Cardiologist or Emergency Physician immediately!";
    } else if (sys >= 140 || dia >= 90) {
      statusTitle = "Stage 2 Hypertension";
      explanation = "Elevated blood pressure values. We advise regular monitoring and scheduling a clinician checkup.";
      isDangerous = sys >= 160 || dia >= 100;
      specialty = "Cardiologist / Primary Care Physician";
    } else if (sys >= 130 || dia >= 80) {
      statusTitle = "Stage 1 Hypertension";
      explanation = "Slightly high BP. Monitor salt intake, stress factors, and schedule routine checks.";
      specialty = "Primary Care Physician";
    } else if (sys < 90 || dia < 60) {
      statusTitle = "Hypotension (Low Pressure)";
      explanation = "Low blood pressure parameters. Check for faintness, extreme fatigue, or dehydration signs.";
      isDangerous = sys < 80 || dia < 50;
      specialty = "General Family Physician / Practitioner";
    }

    // Evaluate Heart Rate
    if (hr > 100) {
      statusTitle += " & Tachycardia";
      explanation += " Elevated resting heart rate detected (>100 bpm). Check for anxiety or physical stress.";
      if (hr > 120) isDangerous = true;
      specialty = "Cardiologist / Internal Medicine Specialist";
    } else if (hr < 50) {
      statusTitle += " & Bradycardia";
      explanation += " Low resting pulse parameter (<50 bpm), which can cause fatigue or slow vascular flow.";
      if (hr < 45) isDangerous = true;
      specialty = "Cardiologist / Arrhythmia Expert";
    }

    return {
      isDangerous,
      statusTitle,
      explanation,
      specialty
    };
  };

  const currentEval = evaluateVitals();

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEval) return;

    onAddHistoryItem(
      'analysis',
      `Logged Vitals: BP ${systolic}/${diastolic} mmHg`,
      `Pulse Rate: ${pulse} bpm - ${currentEval.statusTitle}`,
      {
        notes: `Physical Vital signs tracking. Evaluation: ${currentEval.explanation}. Suggested specialty to consult: ${currentEval.specialty}`,
        vitalsSystolic: systolic,
        vitalsDiastolic: diastolic,
        vitalsPulse: pulse,
        vitalsStatus: currentEval.statusTitle,
        vitalsDanger: currentEval.isDangerous ? 'Dangerous' : 'Safe'
      }
    );

    setVitalsSaved(true);
  };

  const handleResetVitalsForm = () => {
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setVitalsSaved(false);
  };

  // Get medicine catalog objects for saved cabinet items
  const getMedDetailsForSavedItem = (saved: SavedMedicine) => {
    return MEDICINES_DB.find(m => m.id === saved.medicineId);
  };

  // Toggle dose taken today
  const handleToggleTaken = (id: string) => {
    if (!currentUser) return;
    const nextCabinet = currentUser.cabinet.map(item => {
      if (item.id === id) {
        return { ...item, takenToday: !item.takenToday };
      }
      return item;
    });
    onUpdateCabinet(nextCabinet);
  };

  // Remove medicine from cupboard
  const handleRemoveCabinetItem = (id: string, name: string) => {
    if (!currentUser) return;
    const nextCabinet = currentUser.cabinet.filter(item => item.id !== id);
    onUpdateCabinet(nextCabinet);

    onAddHistoryItem(
      'analysis',
      `Removed from Cabinet: ${name}`,
      `Purged medication listing from patient cabinet`,
      { notes: 'Updated cabinet cupboard ledger' }
    );
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="text-brand-primary w-4.5 h-4.5" />;
      case 'analysis': return <Activity className="text-brand-primary w-4.5 h-4.5" style={{ color: 'var(--color-brand-primary)' }} />;
      case 'symptom': return <Brain className="text-brand-primary w-4.5 h-4.5" />;
      case 'ai_diagnosis': return <Sparkles className="text-amber-600 w-4.5 h-4.5" />;
      default: return <ClipboardList className="text-brand-muted w-4.5 h-4.5" />;
    }
  };

  return (
    <div className="space-y-8">
      {currentUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cabinet items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-brand-text text-sm tracking-tight">My Medicine Cabinet</h3>
                </div>
                <span className="text-[10px] text-brand-primary font-extrabold bg-brand-secondary/35 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Dose Tracker Active
                </span>
              </div>

              {currentUser.cabinet.length > 0 ? (
                <div className="space-y-3.5">
                  <AnimatePresence>
                    {currentUser.cabinet.map(item => {
                      const med = getMedDetailsForSavedItem(item);
                      if (!med) return null;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 rounded-xl border border-brand-border bg-brand-light/20 hover:bg-brand-light/45 transition-all space-y-3 relative overflow-hidden flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-brand-text text-sm leading-tight">{item.customName}</span>
                              <span className="text-[9px] font-mono font-bold text-brand-muted italic bg-white px-1.5 py-0.5 rounded border border-brand-border uppercase">
                                {med.genericName}
                              </span>
                            </div>

                            {item.notes && (
                              <p className="text-[11px] text-brand-muted font-sans italic bg-white/70 p-1.5 rounded border border-brand-border">
                                Note: {item.notes}
                              </p>
                            )}

                            {/* Schedule notification tags */}
                            <div className="flex items-center gap-1">
                              {item.dosageTime.map((time, idx) => (
                                <span key={idx} className="text-[9px] bg-brand-secondary/30 text-brand-primary border border-brand-border px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 uppercase">
                                  <Bell size={8} />
                                  <span>{time === '08:00' ? 'Morning' : time === '13:00' ? 'Noon' : 'Evening'} ({time})</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Dose Taken confirmation Toggle box */}
                            <button
                              onClick={() => handleToggleTaken(item.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                                item.takenToday
                                  ? 'bg-brand-primary border-brand-primary text-white'
                                  : 'bg-white border-brand-border text-brand-muted hover:bg-brand-light/50'
                              }`}
                            >
                              <Check size={12} className="stroke-[3]" />
                              <span>{item.takenToday ? 'Taken Today' : 'Mark Taken'}</span>
                            </button>

                            <button
                              onClick={() => handleRemoveCabinetItem(item.id, item.customName)}
                              className="p-1.5 rounded-lg border border-brand-border hover:border-rose-200 text-brand-muted hover:text-rose-600 bg-white hover:bg-rose-50/50 transition-colors cursor-pointer"
                              title="Delete from Cabinet"
                              id={`cabinet-delete-${item.id}`}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-10 px-4 border border-dashed border-brand-border rounded-xl bg-brand-light/10">
                  <p className="text-xs text-brand-text font-semibold">Cabinet box is empty.</p>
                  <p className="text-[10px] text-brand-muted mt-1 max-w-sm mx-auto">
                    Search medications in the first tab and click <strong>"Add to Personal Cabinet"</strong> to track items, schedule dose notifications, and maintain a daily intake log.
                  </p>
                </div>
              )}
            </div>

            {/* ❤️ CLINICAL HEALTH VITALS MONITOR (BLOOD PRESSURE & HEART RATE PULSE LOGGER) */}
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-brand-text text-sm tracking-tight">❤️ Health Vitals Monitor</h3>
                </div>
                {systolic || diastolic || pulse ? (
                  <button
                    onClick={handleResetVitalsForm}
                    className="text-[10px] text-brand-muted hover:text-brand-text font-bold cursor-pointer transition-colors"
                  >
                    Clear Form
                  </button>
                ) : (
                  <span className="text-[9px] text-brand-muted font-mono uppercase tracking-wide">
                    Real-time Coded Logic
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveVitals} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-brand-text uppercase tracking-wide font-sans">Systolic (mmHg)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 120"
                      min="70"
                      max="220"
                      value={systolic}
                      onChange={(e) => { setSystolic(e.target.value); setVitalsSaved(false); }}
                      className="w-full rounded-xl p-2.5 border border-brand-border text-xs focus:border-brand-primary focus:outline-none bg-transparent transition-all placeholder:text-brand-muted/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-brand-text uppercase tracking-wide font-sans">Diastolic (mmHg)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 80"
                      min="40"
                      max="140"
                      value={diastolic}
                      onChange={(e) => { setDiastolic(e.target.value); setVitalsSaved(false); }}
                      className="w-full rounded-xl p-2.5 border border-brand-border text-xs focus:border-brand-primary focus:outline-none bg-transparent transition-all placeholder:text-brand-muted/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-brand-text uppercase tracking-wide font-sans">Pulse (bpm)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 72"
                      min="35"
                      max="200"
                      value={pulse}
                      onChange={(e) => { setPulse(e.target.value); setVitalsSaved(false); }}
                      className="w-full rounded-xl p-2.5 border border-brand-border text-xs focus:border-brand-primary focus:outline-none bg-transparent transition-all placeholder:text-brand-muted/50"
                    />
                  </div>
                </div>

                {/* Live Evaluator Output display inside the form */}
                {currentEval && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border border-brand-border bg-[#FAF9F6] space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-3.5 w-3.5 shrink-0">
                        {currentEval.isDangerous ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 shadow-[0_0_6px_rgba(224,36,36,0.5)]"></span>
                          </>
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A]/50 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#16A34A] shadow-[0_0_6px_rgba(14,153,60,0.5)]"></span>
                          </>
                        )}
                      </div>
                      <span className={`text-xs font-extrabold ${currentEval.isDangerous ? 'text-rose-700' : 'text-[#16A34A]'}`}>
                        Status: {currentEval.statusTitle}
                      </span>
                    </div>

                    <p className="text-[11px] text-brand-muted leading-relaxed font-sans font-medium">
                      {currentEval.explanation}
                    </p>

                    <div className="pt-1.5 border-t border-brand-border/60 text-[10.5px] font-bold text-brand-text flex flex-wrap items-center gap-1">
                      <span className="text-brand-muted font-medium font-sans">Clinician Recommended:</span>
                      <span className="text-[#A26D54] italic">{currentEval.specialty}</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!currentEval || vitalsSaved}
                    className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-semibold tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer font-sans"
                  >
                    {vitalsSaved ? (
                      <>
                        <Check size={14} className="stroke-[2.5]" />
                        <span>VITALS LOGGED IN LEDGER</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} className="stroke-[2.5]" />
                        <span>RECORD VITALS ON LEDGER</span>
                      </>
                    )}
                  </button>
                  {vitalsSaved && (
                    <button
                      type="button"
                      onClick={handleResetVitalsForm}
                      className="px-3.5 py-2.5 bg-white hover:bg-brand-light/50 text-brand-muted hover:text-brand-text border border-brand-border rounded-xl text-xs font-bold transition-all"
                    >
                      New Log
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Historical diagnostic audit ledger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-brand-primary" />
                  <h3 className="font-bold text-brand-text text-sm tracking-tight">Audit & History Ledger</h3>
                </div>
                <span className="text-[9px] font-bold text-brand-muted font-mono">Secure Local Persistence</span>
              </div>

              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
                {currentUser.history && currentUser.history.length > 0 ? (
                  currentUser.history.slice().reverse().map(hist => (
                    <div
                      key={hist.id}
                      className="p-3.5 rounded-xl border border-brand-border bg-white hover:bg-brand-light/20 transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 leading-none">
                          <div className="p-1.5 bg-brand-light rounded-lg border border-brand-border">
                            {getHistoryIcon(hist.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-text leading-tight">{hist.title}</h4>
                            <p className="text-[10px] text-brand-muted mt-0.5 leading-none font-medium">{hist.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-brand-muted font-mono font-medium whitespace-nowrap">
                          {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Detail overlays */}
                      {hist.details?.medicinesAnalysed && hist.details.medicinesAnalysed.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 pl-8">
                          {hist.details.medicinesAnalysed.map((m, idx) => (
                            <span key={idx} className="text-[9px] bg-brand-light text-brand-text font-bold px-2 py-0.5 rounded border border-brand-border/40">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {hist.details?.matchedConditions && hist.details.matchedConditions.length > 0 && (
                        <div className="space-y-1 pl-8 mt-1.5 pt-1.5 border-t border-brand-border">
                          <span className="text-[9px] uppercase font-bold text-brand-muted leading-none">Recognized Health Indices</span>
                          <div className="space-y-1">
                            {hist.details.matchedConditions.map((mc, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-brand-text/90">
                                <span>{mc.conditionName}</span>
                                <span className="text-brand-primary font-mono">{mc.confidence}% match</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {hist.details?.aiPrimaryHypothesis && (
                        <div className="space-y-1 pl-8 mt-1.5 pt-1.5 border-t border-brand-border text-[11px]">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-[9px] uppercase text-brand-muted leading-none">Primary Hypothesis</span>
                            <span className="text-[#A26D54] font-mono">{hist.details.aiConfidence}% match</span>
                          </div>
                          <p className="font-extrabold text-brand-text/90 mt-0.5">{hist.details.aiPrimaryHypothesis}</p>
                          {hist.details.aiEmpatheticNarrative && (
                            <p className="text-[10px] text-brand-muted leading-relaxed mt-1 font-sans font-medium">{hist.details.aiEmpatheticNarrative}</p>
                          )}
                        </div>
                      )}

                      {hist.details?.aiMatches && hist.details.aiMatches.length > 0 && (
                        <div className="space-y-1.5 pl-8 mt-1.5 pt-1.5 border-t border-brand-border text-[10px]">
                          <span className="text-[9px] uppercase font-bold text-brand-muted leading-none block mb-1">Alternative Candidates</span>
                          <div className="space-y-1">
                            {hist.details.aiMatches.map((am, idx) => (
                              <div key={idx} className="p-1.5 bg-brand-light/30 rounded border border-brand-border/40 text-[10px]">
                                <div className="flex items-center justify-between font-bold text-brand-text">
                                  <span>{am.condition}</span>
                                  <span className="text-[8px] bg-brand-secondary/50 text-brand-primary px-1.5 rounded leading-none py-0.5 font-bold">{am.urgency}</span>
                                </div>
                                <p className="text-[9.5px] text-brand-muted mt-0.5 font-sans leading-normal">{am.details}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {hist.details?.notes && (
                        <p className="text-[10.5px] text-brand-muted leading-relaxed italic pl-8 font-sans">
                          {hist.details.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-brand-muted font-medium">
                    No diagnostic history records registered.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Not logged in interface view */
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-brand-border shadow-md text-center space-y-6">
          <div className="p-4 bg-brand-secondary/35 text-brand-primary rounded-2xl w-14 h-14 flex items-center justify-center mx-auto shadow-md border border-brand-border/30">
            <Lock size={28} className="stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-brand-text tracking-tight">Locked Client-Side Vault</h2>
            <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium">
              To persist physical medicines, schedule dose alerts, view cumulative interactive combinations advice, and maintain a historical search log ledger, please log in with your dedicated secure account key.
            </p>
          </div>

          <div className="p-4 bg-brand-light/50 border border-brand-border rounded-xl space-y-3.5">
            <div className="flex items-start gap-3 text-left">
              <span className="p-1 px-2 bg-white rounded font-mono font-bold text-[10px] text-[#A26D54] tracking-wider border border-brand-border">SECURE</span>
              <div className="space-y-0.5 text-xs text-brand-text/90 font-medium font-sans">
                <span>Everything is stored completely inside your browser's private indexed local db. Offline safety, absolute data custody.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onAuthClick}
              className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              id="dashboard-unlock-btn"
            >
              SIGN IN / GET SECURITY KEY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
