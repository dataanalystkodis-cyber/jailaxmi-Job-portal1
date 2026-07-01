import React from 'react';
import { PortalUser } from '../types';
import { Factory, LogOut, Lock, UserCircle2, Briefcase } from 'lucide-react';

interface TopbarProps {
  currentUser: PortalUser | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  showStaffArea: boolean;
  setShowStaffArea: (show: boolean) => void;
  langMode: 'bilingual' | 'english' | 'tamil';
  setLangMode: (mode: 'bilingual' | 'english' | 'tamil') => void;
}

export default function Topbar({
  currentUser, activeTab, setActiveTab, onLogout, showStaffArea, setShowStaffArea,
  langMode, setLangMode
}: TopbarProps) {
  const t = (en: string, ta: string): string => {
    if (langMode === 'english') return en;
    if (langMode === 'tamil') return ta;
    return `${en} / ${ta}`;
  };

  return (
    <header className="bg-[#0F6E56] text-white sticky top-0 z-30 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
            <Factory className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-base font-black font-display tracking-tight leading-none uppercase">
              {t("Jailaxmi Group of Companies", "ஜெய்லக்ஷ்மி நிறுவனக் குழுமம்")}
            </h1>
            <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-widest mt-1 inline-block">
              {t("Staff & Recruitment Portal", "ஊழியர்கள் மற்றும் ஆட்சேர்ப்பு போர்டல்")}
            </span>
          </div>
        </div>

        {/* Portal view controller & profile */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Universal Language Selector bar in Header */}
          <div className="bg-[#085041] p-1 rounded-lg flex items-center border border-emerald-900/40 gap-1">
            <button 
              type="button"
              onClick={() => setLangMode('english')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                langMode === 'english' ? 'bg-[#0F6E56] text-white shadow' : 'text-emerald-100 hover:text-white'
              }`}
            >
              EN
            </button>
            <button 
              type="button"
              onClick={() => setLangMode('tamil')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                langMode === 'tamil' ? 'bg-[#0F6E56] text-white shadow' : 'text-emerald-100 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button 
              type="button"
              onClick={() => setLangMode('bilingual')}
              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                langMode === 'bilingual' ? 'bg-[#0F6E56] text-white shadow' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Both / இருமொழி
            </button>
          </div>

          {/* Toggler between Candidate Careers & Staff Vetting Area */}
          <div className="bg-[#085041] p-1 rounded-lg flex items-center border border-emerald-900/40">
            <button
              onClick={() => setShowStaffArea(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                !showStaffArea 
                  ? 'bg-[#0F6E56] text-white shadow' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> {t("Careers", "பணிகள்")}
            </button>
            <button
              onClick={() => setShowStaffArea(true)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                showStaffArea 
                  ? 'bg-[#0F6E56] text-white shadow' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> {t("Staff Area", "ஊழியர் பகுதி")} 🔒
            </button>
          </div>

          {/* Logged in Profile chips */}
          {currentUser && showStaffArea && (
            <div className="flex items-center gap-3 border-l border-emerald-800 pl-4 animate-fade-in">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[9px] uppercase font-bold tracking-wider text-emerald-200 mt-0.5">
                  {currentUser.roleLabel}
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-[#085041] text-[#1D9E75] flex items-center justify-center font-bold border border-emerald-800 text-xs shadow-xs" title={currentUser.name}>
                {currentUser.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 bg-[#085041] hover:bg-red-900/50 hover:text-red-200 text-emerald-100 rounded-lg transition"
                title="Secure sign-out of Jailaxmi system"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Navigation sub-bar (Only shown when staff user is logged in and Staff area is visible) */}
      {currentUser && showStaffArea && (
        <div className="bg-[#085041] border-t border-[#064236] px-4 md:px-6 flex gap-1 overflow-x-auto">
          <div className="max-w-7xl mx-auto w-full flex gap-1.5">
            {[
              { id: 'dashboard', label_en: 'Recruitment Stats', label_ta: 'ஆட்சேர்ப்பு புள்ளிவிவரங்கள்' },
              { id: 'applicants', label_en: 'All Applicants', label_ta: 'அனைத்து விண்ணப்பதாரர்கள்' },
              { id: 'users', label_en: 'Staff Logins', label_ta: 'ஊழியர் உள்நுழைவுகள்' }
            ].map((tab) => {
              // Department managers don't get users tab
              if (tab.id === 'users' && currentUser.role !== 'md' && currentUser.role !== 'hr') {
                return null;
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                    activeTab === tab.id 
                      ? 'border-white text-white bg-white/5' 
                      : 'border-transparent text-emerald-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(tab.label_en, tab.label_ta)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
