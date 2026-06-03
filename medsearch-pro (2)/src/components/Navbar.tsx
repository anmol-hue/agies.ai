/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, LogIn, LogOut, Search, ShieldCheck, Activity, Brain, LayoutDashboard, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'search' | 'interactions' | 'symptoms' | 'ai_diagnosis' | 'dashboard';
  setActiveTab: (tab: 'search' | 'interactions' | 'symptoms' | 'ai_diagnosis' | 'dashboard') => void;
  currentUser: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, currentUser, onAuthClick, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-brand-border/80 px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[#1E2B25] flex items-center justify-center text-[#DCE5E2] shadow-lg shadow-brand-primary/20">
          <ShieldCheck size={22} className="stroke-[2.5]" />
        </div>
        <div>
          <span className="font-display font-extrabold text-brand-text tracking-tighter text-xl leading-none uppercase">
            tpis<span className="text-[#A26D54] font-black">.agies</span>
          </span>
          <div className="flex items-center gap-1.5 text-[9px] text-brand-muted font-bold tracking-widest uppercase mt-0.5">
            <span className="h-1.5 w-1.5 bg-[#2E473F] rounded-full animate-pulse"></span>
            <span>Local Secure Engine</span>
          </div>
        </div>
      </div>

      {/* Tabs - Modern Pill-shaped design like the user's reference */}
      <nav className="flex items-center gap-1 bg-[#F0F4F2] border border-brand-border/60 p-1.5 rounded-2xl shadow-inner max-w-full overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 ${
            activeTab === 'search'
              ? 'bg-[#1E2B25] text-white shadow-md'
              : 'text-brand-muted hover:text-brand-text hover:bg-white/50'
          }`}
          id="nav-search-tab"
        >
          <Search size={14} className="stroke-[2.5]" />
          <span>Search & Analyze</span>
        </button>

        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 ${
            activeTab === 'interactions'
              ? 'bg-[#1E2B25] text-white shadow-md'
              : 'text-brand-muted hover:text-brand-text hover:bg-white/50'
          }`}
          id="nav-interactions-tab"
        >
          <Activity size={14} className="stroke-[2.5]" />
          <span>Interactions</span>
        </button>

        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 ${
            activeTab === 'symptoms'
              ? 'bg-[#1E2B25] text-white shadow-md'
              : 'text-brand-muted hover:text-brand-text hover:bg-white/50'
          }`}
          id="nav-symptoms-tab"
        >
          <Brain size={14} className="stroke-[2.5]" />
          <span>Symptom Checker</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_diagnosis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 ${
            activeTab === 'ai_diagnosis'
              ? 'bg-gradient-to-r from-[#A26D54] to-[#C99E82] text-white shadow-md font-extrabold'
              : 'text-[#855D49] hover:text-[#5C3F30] hover:bg-white/50'
          }`}
          id="nav-ai-diagnosis-tab"
        >
          <Sparkles size={14} className="stroke-[2.5] text-white animate-pulse" />
          <span>AI Disease Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-[#1E2B25] text-white shadow-md'
              : 'text-brand-muted hover:text-brand-text hover:bg-white/50'
          }`}
          id="nav-dashboard-tab"
        >
          <LayoutDashboard size={14} className="stroke-[2.5]" />
          <span>Cabinet & Ledger</span>
        </button>
      </nav>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-3 bg-white/80 py-1 pl-3.5 pr-1.5 rounded-2xl border border-brand-border shadow-sm">
            <div className="flex flex-col text-right">
              <span className="text-xs font-extrabold text-brand-text leading-tight">{currentUser.name}</span>
              <span className="text-[9px] text-[#A26D54] font-bold tracking-wider uppercase font-display">Patient Profile</span>
            </div>
            <div className="h-8 w-8 rounded-xl bg-[#E2ECE8] text-[#1E2B25] flex items-center justify-center font-bold text-xs shadow-inner">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-brand-muted hover:text-brand-text hover:bg-brand-light rounded-xl transition-colors"
              title="Sign Out"
              id="nav-logout-btn"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E2B25] hover:bg-[#33443C] active:scale-[0.97] text-white rounded-2xl text-xs font-extrabold tracking-wider transition-all shadow-md shadow-brand-primary/10 uppercase"
            id="nav-login-btn"
          >
            <LogIn size={14} />
            <span>SIGN IN</span>
          </button>
        )}
      </div>
    </header>
  );
}
