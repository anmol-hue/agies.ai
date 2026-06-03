/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, SavedMedicine } from './types';
import Navbar from './components/Navbar';
import MedicineDetail from './components/MedicineDetail';
import InteractionChecker from './components/InteractionChecker';
import SymptomChecker from './components/SymptomChecker';
import AIDiagnosisChecker from './components/AIDiagnosisChecker';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { Heart, ShieldCheck, Database, CalendarDays, KeyRound, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clinicalArt from './assets/images/clinical_art_1780406988908.png';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'interactions' | 'symptoms' | 'ai_diagnosis' | 'dashboard'>('search');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Retrieve user index on initial session load
  useEffect(() => {
    try {
      const loggedUserId = localStorage.getItem('medsearch_current_user_id');
      const usersData = localStorage.getItem('medsearch_users');
      if (loggedUserId && usersData) {
        const users: User[] = JSON.parse(usersData);
        const match = users.find(u => u.id === loggedUserId);
        if (match) {
          setCurrentUser(match);
        }
      }
    } catch {
       console.error("Local Storage is inaccessible in current window state.");
    }
  }, []);

  // Set auth success
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard'); // switch to briefcase upon secure registration or signin
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('medsearch_current_user_id');
    setCurrentUser(null);
    setActiveTab('search');
  };

  // Push audit history events
  const handleAddHistoryItem = (type: 'search' | 'analysis' | 'symptom', title: string, subtitle: string, details: any) => {
    if (!currentUser) return;
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date().toISOString(),
      title,
      subtitle,
      details
    };

    const updatedUser: User = {
      ...currentUser,
      history: [...(currentUser.history || []), newItem]
    };

    setCurrentUser(updatedUser);

    // Save to localized db index
    try {
      const usersData = localStorage.getItem('medsearch_users');
      if (usersData) {
        const users: User[] = JSON.parse(usersData);
        const nextUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
        localStorage.setItem('medsearch_users', JSON.stringify(nextUsers));
      }
    } catch (err) {
      console.error("Failed to commit history item.", err);
    }
  };

  // Update cabinet items
  const handleUpdateCabinet = (updatedCabinet: SavedMedicine[]) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      cabinet: updatedCabinet
    };

    setCurrentUser(updatedUser);

    try {
      const usersData = localStorage.getItem('medsearch_users');
      if (usersData) {
        const users: User[] = JSON.parse(usersData);
        const nextUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
        localStorage.setItem('medsearch_users', JSON.stringify(nextUsers));
      }
    } catch (err) {
      console.error("Failed to update cupboard status.", err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col text-brand-text selection:bg-brand-primary/10 selection:text-brand-text">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Modern Minimalist Editorial Hero & Billboard - inspired by the uploaded NFT UI layout */}
        <div className="relative overflow-hidden rounded-3xl border border-white/20 nft-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover-lift">
          {/* Subtle colored spotlight blur spots for ultra modern premium depth */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#CBD8D3]/30 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative space-y-6 max-w-2xl text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E2B25]/5 border border-[#1E2B25]/10 text-xs font-bold tracking-widest text-[#1E2B25] uppercase font-display">
              <Sparkles size={13} className="text-[#A26D54]" /> Discover, Check & Monitor
            </span>
            <div className="space-y-4">
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#1E2B25] leading-[1.05] tracking-tight uppercase">
                RARE CLINICAL <br />
                <span className="text-[#A26D54] font-light italic">INTELLIGENCE</span>
              </h1>
              <p className="text-[#5F6763] text-sm md:text-base leading-relaxed font-sans max-w-lg font-medium">
                Standardized diagnostic rule indices engineered beautifully to analyze active molecules, check multi-drug cross interactions, and evaluate safe symptom profiles offline.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => setActiveTab('ai_diagnosis')}
                className="px-6 py-3.5 bg-[#1E2B25] hover:bg-[#2A3B34] text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-black/10 flex items-center gap-2 cursor-pointer"
              >
                <span>Run AI Scan</span>
                <span className="text-[10px] text-[#DCE5E2] opacity-80">(Beta)</span>
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('nav-interactions-tab');
                  if (element) {
                    element.click();
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveTab('interactions');
                  }
                }}
                className="px-5 py-3.5 hover:bg-black/5 text-[#1E2B25] rounded-2xl text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 border border-black/10 cursor-pointer"
              >
                <span>Check Interactions</span>
              </button>
            </div>
          </div>
          
          {/* Aesthetic Modern Illustration block on right */}
          <div className="relative max-w-sm w-full shrink-0 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border/60 bg-white shadow-xl aspect-[4/3] hover-lift group">
              <img 
                src={clinicalArt} 
                alt="Molecular diagnostic overview" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E2B25]/80 via-[#1E2B25]/45 to-transparent p-5 text-white">
                <span className="text-[8px] uppercase font-display tracking-widest font-black text-rose-300">tpis.agies active model</span>
                <h4 className="text-sm font-display font-black leading-tight uppercase mt-0.5">Clinical Insight Node</h4>
              </div>
            </div>
            
            <div className="nft-glass-panel rounded-2xl p-4 border border-white/40 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#5F6763] uppercase tracking-wider text-[9px]">Symptom analysis latency</span>
                <span className="text-[#1E2B25] font-mono">0.02s</span>
              </div>
              <div className="w-full bg-[#E2ECE8] h-1 rounded-full overflow-hidden">
                <div className="h-full bg-[#A26D54] rounded-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Top welcome status display indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="nft-card p-5 rounded-2xl border border-brand-border flex items-center justify-between shadow-sm hover-lift">
            <div className="space-y-1">
              <span className="block text-[9px] font-extrabold text-brand-muted uppercase tracking-wider font-display">Database Status</span>
              <span className="block text-xs font-black text-brand-text flex items-center gap-2 mt-1 leading-none">
                <span className="h-2.5 w-2.5 bg-[#16A34A] rounded-full animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.3)]"></span>
                <span className="uppercase font-display">Local Compliant</span>
              </span>
            </div>
            <div className="p-3 bg-[#E2ECE8] text-[#1E2B25] rounded-xl shadow-inner">
              <Database size={16} />
            </div>
          </div>

          <div className="nft-card p-5 rounded-2xl border border-brand-border flex items-center justify-between shadow-sm hover-lift">
            <div className="space-y-1">
              <span className="block text-[9px] font-extrabold text-brand-muted uppercase tracking-wider font-display">Medical Records</span>
              <span className="block text-sm font-black text-[#1E2B25] font-display uppercase tracking-tight">10 core Molecules</span>
            </div>
            <div className="p-3 bg-[#F4EDE8] text-[#A26D54] rounded-xl shadow-inner">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="nft-card p-5 rounded-2xl border border-brand-border flex items-center justify-between shadow-sm hover-lift">
            <div className="space-y-1">
              <span className="block text-[9px] font-extrabold text-brand-muted uppercase tracking-wider font-display">Cabinet Items</span>
              <span className="block text-sm font-black text-[#1E2B25] font-display uppercase tracking-tight">
                {currentUser ? currentUser.cabinet.length : 0} Items
              </span>
            </div>
            <div className="p-3 bg-[#E2ECE8] text-[#1E2B25] rounded-xl shadow-inner">
              <CalendarDays size={16} />
            </div>
          </div>

          <div className="nft-card p-5 rounded-2xl border border-brand-border flex items-center justify-between shadow-sm hover-lift">
            <div className="space-y-1">
              <span className="block text-[9px] font-extrabold text-brand-muted uppercase tracking-wider font-display">Ledger Security</span>
              <span className="block text-xs font-black text-brand-text flex items-center gap-1.5 mt-1 leading-none uppercase font-display">
                <span>{currentUser ? 'LOCKED VAULT' : 'GUEST SYSTEM'}</span>
              </span>
            </div>
            <div className={`p-3 rounded-xl shadow-inner ${currentUser ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#E2ECE8] text-brand-muted'}`}>
              <KeyRound size={16} />
            </div>
          </div>
        </div>

        {/* Tab Components Selector */}
        <div className="relative min-h-[500px]">
          {activeTab === 'search' && (
            <MedicineDetail
              currentUser={currentUser}
              onAddHistoryItem={handleAddHistoryItem}
              onUpdateCabinet={handleUpdateCabinet}
              onAuthNeed={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'interactions' && (
            <InteractionChecker
              currentUser={currentUser}
              onAddHistoryItem={handleAddHistoryItem}
            />
          )}

          {activeTab === 'symptoms' && (
            <SymptomChecker
              currentUser={currentUser}
              onAddHistoryItem={handleAddHistoryItem}
            />
          )}

          {activeTab === 'ai_diagnosis' && (
            <AIDiagnosisChecker
              currentUser={currentUser}
              onAddHistoryItem={handleAddHistoryItem}
              onAuthNeed={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              onUpdateCabinet={handleUpdateCabinet}
              onAuthClick={() => setIsAuthOpen(true)}
              onAddHistoryItem={handleAddHistoryItem}
            />
          )}
        </div>
      </main>

      {/* Footer Disclaimer banner - absolutely mandatory for health analytics products */}
      <footer className="bg-[#2D302E] text-white py-10 px-8 text-xs border-t border-[#425C51]/20 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <Heart className="text-[#D6E2DD] h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm">tpis.agies Safety Protocol</span>
            </div>
            <p className="text-[#8A8E8B] leading-relaxed font-sans">
              Disclaimer: All data and mapping outcomes are based on standardized diagnostic rules running offline within your browser. They do NOT replace professional medical advice, clinical evaluations, or diagnostics. Consult your healthcare physician or clinician before changing dosing patterns or executing therapeutic drug updates.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-[#8A8E8B] font-mono">
            <span>Server status: OFFLINE COMPLIANT</span>
            <span>Security context: SECURE PATIENT PROFILE</span>
            <span>Local Database standard: MED_SECURE_VER_1.0</span>
          </div>
        </div>
      </footer>

      {/* Auth modal drawer overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
