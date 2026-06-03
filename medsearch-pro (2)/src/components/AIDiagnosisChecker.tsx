/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  Sparkles, Camera, UploadCloud, AlertCircle, Loader2, 
  ShieldAlert, Check, RefreshCw, HeartHandshake, ShieldCheck, 
  Plus, ArrowRight, Eye, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import moleculeNodes from '../assets/images/molecule_nodes_1780407011042.png';

interface AIDiagnosisCheckerProps {
  currentUser: User | null;
  onAddHistoryItem: (
    type: 'search' | 'analysis' | 'symptom' | 'ai_diagnosis',
    title: string,
    subtitle: string,
    details: any
  ) => void;
  onAuthNeed: () => void;
}

interface MatchCondition {
  condition: string;
  details: string;
  typicalInterventions: string;
  urgency: string;
}

interface DiagnosisResult {
  primaryHypothesis: string;
  empatheticNarrative: string;
  confidence: number;
  matches: MatchCondition[];
  disclaimer: string;
  warningSigns: string[];
  isPlanAFallback?: boolean;
  recDoctor?: string;
  isDangerous?: string;
}

const REASSURING_STATEMENTS = [
  "Initializing clinical diagnostic module...",
  "Encoding visual symptom characteristics...",
  "Applying medical database references...",
  "Evaluating multi-symptom overlays...",
  "Validating diagnostic urgency matrices...",
  "Generating safe care considerations..."
];

export default function AIDiagnosisChecker({ currentUser, onAddHistoryItem, onAuthNeed }: AIDiagnosisCheckerProps) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(REASSURING_STATEMENTS[0]);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedToLedger, setSavedToLedger] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading texts for high-end premium aesthetic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % REASSURING_STATEMENTS.length;
        setLoadingStatus(REASSURING_STATEMENTS[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Convert File to Base64
  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to extract image file parameters.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setDescription('');
    setImage(null);
    setMimeType(null);
    setResult(null);
    setError(null);
    setSavedToLedger(false);
  };

  // Call the server API
  const handleAnalyze = async () => {
    if (!description.trim() && !image) {
      setError('Please provide a symptom description or upload/capture a visual image to check.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSavedToLedger(false);

    try {
      const response = await fetch('/api/ai-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          image,
          mimeType
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server diagnostic evaluation failed.');
      }

      const parsedJSON: DiagnosisResult = await response.json();
      setResult(parsedJSON);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'We encountered an error contacting the diagnostic AI server. Please retry in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    if (!currentUser) {
      onAuthNeed();
      return;
    }

    onAddHistoryItem(
      'ai_diagnosis',
      `AI Disease Check: ${result.primaryHypothesis}`,
      `${result.confidence}% Match Score`,
      {
        aiPrimaryHypothesis: result.primaryHypothesis,
        aiEmpatheticNarrative: result.empatheticNarrative,
        aiConfidence: result.confidence,
        aiMatches: result.matches,
        notes: description
      }
    );

    setSavedToLedger(true);
  };

  return (
    <div className="space-y-6">
      {/* Intro Panel banner */}
      <div className="rounded-3xl p-6 border border-brand-border nft-card relative overflow-hidden hover-lift duration-300">
        <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-bl from-brand-primary/5 to-transparent rounded-full -mr-10 -mt-10 animate-pulse" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white border border-brand-border text-[#1E2B25] rounded-2xl shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-display font-black text-[#1E2B25] uppercase tracking-tight flex items-center gap-2">
              AI Symptom & Skin Analyzer
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed max-w-4xl font-sans font-medium">
              Take or upload a picture of a dermatological symptom (rash, allergy, spot) or write down a descriptive journal. Our server-side clinical AI scanner checks molecular & structural conditions, matching potential syndromes instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column (Left Side) */}
        <div className="lg:col-span-5 rounded-3xl p-6 border border-brand-border nft-card space-y-5 hover-lift">
          <div className="flex items-center justify-between border-b border-brand-border pb-3.5">
            <h3 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">Diagnostic Workspace</h3>
            {(image || description) && (
              <button
                onClick={handleReset}
                className="text-[10px] text-brand-muted hover:text-brand-text font-bold cursor-pointer flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <RefreshCw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* SENSOR CAPTURE PANEL */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#1E2B25] uppercase tracking-wider font-display text-[10px]">Visual Evidence (Upload / Snapshot)</label>
            
            {image ? (
              <div className="relative rounded-2xl overflow-hidden border border-brand-border group aspect-video bg-white/40 flex items-center justify-center">
                <img 
                  src={image} 
                  alt="Symptom capture preview" 
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={selectFile}
                    className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-xs font-extrabold text-[#1E2B25] shadow-sm flex items-center gap-1.5 transition-all transform scale-95 group-hover:scale-100 cursor-pointer uppercase font-display"
                  >
                    <UploadCloud size={14} />
                    <span>Replace</span>
                  </button>
                  <button
                    onClick={() => { setImage(null); setMimeType(null); }}
                    className="p-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-extrabold text-white shadow-sm flex items-center gap-1.5 transition-all transform scale-95 group-hover:scale-100 cursor-pointer uppercase font-display"
                  >
                    <RefreshCw size={14} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={selectFile}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer aspect-video flex flex-col justify-center items-center gap-2.5 ${
                  dragActive 
                    ? 'border-[#1E2B25] bg-white/60 scale-[0.99] shadow-inner' 
                    : 'border-brand-border hover:border-brand-primary/50 bg-[#FAFBFB]/30 hover:bg-white/40'
                }`}
              >
                <div className="h-11 w-11 bg-white border border-brand-border text-[#1E2B25] rounded-xl flex items-center justify-center shadow-sm">
                  <Camera size={20} className="stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1E2B25] font-display uppercase tracking-wider">Drop photo here or click</p>
                  <p className="text-[10px] text-brand-muted mt-1 max-w-[240px] mx-auto font-sans font-medium">
                    Supports skin, throat, eyes or labels (PNG, JPG, up to 25MB). Auto-focus works on phones.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION PANEL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#1E2B25] uppercase tracking-wider font-display text-[10px]">Symptom Journal & Description</label>
              <span className="text-[10px] text-brand-muted font-mono font-bold">{description.length}/1000</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you feel (e.g. 'Dry patches of skin that are extremely itchy on my arms for 3 days, spreading slowly...')"
              maxLength={1000}
              className="w-full h-32 rounded-2xl p-4 border border-brand-border text-xs focus:border-[#1E2B25] focus:outline-none transition-all placeholder:text-brand-muted/70 custom-scrollbar bg-white/40 focus:bg-white leading-relaxed font-sans font-medium"
            />
          </div>

          {/* TRIGGER BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={loading || (!description.trim() && !image)}
            className="w-full py-4 bg-[#1E2B25] hover:bg-[#2C3F34] active:scale-[0.985] text-white rounded-2xl text-xs font-black tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#1E2B25]/10 cursor-pointer font-display uppercase"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin text-white" />
                <span>ANALYST EVALUATING...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-white fill-current" />
                <span>COMMENCE AI SCAN</span>
              </>
            )}
          </button>

          {/* Error drawer */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-2.5 text-[11px] leading-relaxed"
              >
                <AlertCircle size={14} className="shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Output Column (Right Side) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              /* High-End Loading Screen */
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-3xl p-8 border border-brand-border nft-card text-center py-24 space-y-6 hover-lift"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-[#FAFBFB] rounded-2xl border border-brand-border shadow-inner">
                  <Loader2 size={32} className="text-[#1E2B25] animate-spin stroke-[2]" />
                  <div className="absolute inset-x-0 bottom-0 top-0 bg-[#1E2B25]/5 rounded-2xl animate-ping" />
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  <h4 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">Clinical Assessment In-Progress</h4>
                  <p className="text-xs text-[#A26D54] font-black uppercase tracking-wider h-4 animate-pulse">
                    {loadingStatus}
                  </p>
                  <p className="text-[10px] text-brand-muted leading-relaxed font-sans mt-3 font-medium">
                    Our multi-layer evaluation matches localized databases using generative diagnostic modeling. Offline encryption limits external footprint.
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              /* Diagnosis Report Result Panel */
              <motion.div
                key="results-panel"
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                className="space-y-6"
              >
                {/* primary health report view */}
                <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Clinical Hypothesis</span>
                      <h3 className="text-base font-black text-brand-text tracking-tight flex items-center gap-1.5">
                        {result.primaryHypothesis}
                      </h3>
                    </div>
                    {/* Score badge indicator */}
                    <div className="flex items-center gap-2 bg-brand-light/75 border border-brand-border p-1.5 px-3 rounded-xl shadow-inner">
                      <span className="text-[10px] font-bold text-brand-muted">Match Score:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[#A26D54] font-black text-sm italic">{result.confidence}%</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                      </div>
                    </div>
                  </div>

                  {/* Narrative paragraph */}
                  <div className="space-y-1 bg-brand-light/20 p-4 rounded-xl border border-brand-border/60">
                    <span className="text-[9px] font-bold text-brand-muted uppercase tracking-wider block">Physiographical Overview</span>
                    <p className="text-xs text-brand-text/90 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                      {result.empatheticNarrative}
                    </p>
                  </div>

                  {/* Plan A Fallback Active Banner */}
                  {result.isPlanAFallback && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 text-amber-900/95 rounded-xl flex items-center gap-2.5 text-[10.5px] font-sans font-medium">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span><strong>Plan A Backup System Active:</strong> Rule-based diagnostic match (No-AI server backup protocol).</span>
                    </div>
                  )}

                  {/* Danger Light and Doctor Specialist Referral Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Glowing Danger Status Lamp */}
                    <div className="p-4 rounded-xl border border-brand-border bg-brand-light/10 flex items-center gap-3.5">
                      <div className="relative flex h-4 w-4 shrink-0">
                        {result.isDangerous === "Dangerous" ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 shadow-[0_0_8px_rgba(224,36,36,0.6)]"></span>
                          </>
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A]/50 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.6)]"></span>
                          </>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-brand-muted block tracking-wider font-sans">Danger/Urgency Level</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`h-2.5 w-2.5 rounded-full ${result.isDangerous === "Dangerous" ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                          <p className={`text-xs font-extrabold ${result.isDangerous === "Dangerous" ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {result.isDangerous === "Dangerous" 
                              ? "Dangerous Condition (Red Light Alert)" 
                              : "Safe Stable Condition (Green Light Secure)"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Doctor specialty badge */}
                    <div className="p-4 rounded-xl border border-brand-border bg-brand-light/10 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-brand-border text-[#A26D54]">
                        <HeartHandshake size={15} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-brand-muted block tracking-wider font-sans">Doctor to Consult</span>
                        <p className="text-xs font-black text-brand-text">
                          See: <span className="text-[#A26D54] italic">{result.recDoctor || "Family Care Doctor / Practitioner"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Matches List */}
                  <div className="space-y-3 pt-1">
                    <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">Candidate Condition Spectrum</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.matches.map((item, idx) => (
                        <div key={idx} className="p-4 bg-[#FAF9F6] border border-brand-border rounded-xl space-y-2 flex flex-col justify-between hover:shadow-sm transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-brand-text">{item.condition}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none ${
                                item.urgency.toLowerCase().includes('emergency') || item.urgency.toLowerCase().includes('alert')
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                  : 'bg-brand-secondary/40 text-brand-primary border border-brand-secondary/40'
                              }`}>
                                {item.urgency}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-brand-muted leading-relaxed font-sans leading-relaxed">
                              {item.details}
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-brand-border/60 mt-2 text-[10px] font-medium text-brand-text/80">
                            <span className="font-bold text-brand-primary block text-[8px] uppercase tracking-wider mb-0.5">Primary Reliefs</span>
                            {item.typicalInterventions}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning emergency triggers (Red flags) */}
                  {result.warningSigns && result.warningSigns.length > 0 && (
                    <div className="bg-rose-50/40 border border-rose-200/60 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-700">
                        <ShieldAlert size={14} className="stroke-[2.5]" />
                        <h4 className="text-[10px] font-bold uppercase tracking-wider">Clinical Emergent Red Flags</h4>
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-[10px] text-rose-900/90 font-sans leading-relaxed">
                        {result.warningSigns.map((sign, idx) => (
                          <li key={idx}>{sign}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* SAVE TO HISTORY */}
                  <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-brand-border">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#16A34A]" />
                      <span className="text-[10px] text-brand-muted font-sans font-medium">Auto-compiled diagnostic report.</span>
                    </div>

                    <button
                      onClick={handleSaveToHistory}
                      disabled={savedToLedger}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                        savedToLedger
                          ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-brand-text hover:bg-brand-text/90 text-white shadow-md'
                      }`}
                    >
                      {savedToLedger ? (
                        <>
                          <Check size={12} className="stroke-[2.5]" />
                          <span>Saved in secure Patient Ledger</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} className="stroke-[2.5]" />
                          <span>Record on Patient Ledger</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Secure clinical disclaimer banner */}
                <div className="bg-[#FAFBFB] border border-brand-border rounded-2xl p-4.5 flex items-start gap-3">
                  <div className="p-1 bg-white border border-brand-border rounded-xl text-brand-muted shrink-0 mt-0.5 shadow-sm">
                    <ClipboardList size={14} />
                  </div>
                  <div className="space-y-1 text-[10.5px] leading-relaxed text-brand-muted font-sans font-medium">
                    <span className="font-extrabold text-[#1E2B25] uppercase block text-[8px] tracking-wider font-display">Clinical Statement Disclaimer</span>
                    <p>{result.disclaimer}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Idle screen placeholder with gorgeous molecular nodes illustration */
              <motion.div
                key="idle-placeholder"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl p-6 border border-brand-border nft-card space-y-6 hover-lift text-center py-16 px-6"
              >
                <div className="relative max-w-[240px] mx-auto aspect-square rounded-2xl overflow-hidden border border-brand-border/60 shadow-md">
                  <img 
                    src={moleculeNodes} 
                    alt="Active molecular analysis network" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1E2B25]/5" />
                </div>
                
                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="font-display font-extrabold text-[#1E2B25] text-sm uppercase tracking-tight">AI Diagnosis Engine Ready</h4>
                  <p className="text-xs text-brand-muted leading-relaxed font-sans font-medium">
                    Upload visual symptoms or describe physical discomforts inside the left work desk. We will run live matching analyses mapping alternative candidate ranges, recommended clinician specialties, and responsive green/red urgency indicators instantly.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

