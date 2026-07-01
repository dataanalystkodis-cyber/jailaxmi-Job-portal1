import React, { useState, useEffect } from 'react';
import { JobApplication, JobListing, PortalUser } from './types';
import Topbar from './components/Topbar';
import CandidatePortal from './components/CandidatePortal';
import DashboardTab from './components/DashboardTab';
import UsersTab from './components/UsersTab';
import DetailModal from './components/DetailModal';
import PrintProfile from './components/PrintProfile';
import { 
  Search, ShieldAlert, Key, Factory, Info, CheckCircle2, User, Lock, 
  ChevronRight, Calendar, Mail, FileCode2, ClipboardList, Briefcase, Eye
} from 'lucide-react';

export default function App() {
  // Global Language Configuration
  const [langMode, setLangMode] = useState<'bilingual' | 'english' | 'tamil'>('bilingual');

  const t = (en: string, ta: string): string => {
    if (langMode === 'english') return en;
    if (langMode === 'tamil') return ta;
    return `${en} / ${ta}`;
  };

  // General State
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);
  const [showStaffArea, setShowStaffArea] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // DB States
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [portalUsers, setPortalUsers] = useState<PortalUser[]>([]);
  const [canManageUsers, setCanManageUsers] = useState<boolean>(false);

  // Selected Candidate
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);

  // Filters
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showPhotos, setShowPhotos] = useState<boolean>(true);

  // Auth Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPwd, setLoginPwd] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  // Load initial public job openings
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJobs(data.jobs || []);
        }
      })
      .catch(err => console.error('Failed to load active jobs:', err));
  }, []);

  // Sync session and statistical metrics on login/change
  useEffect(() => {
    // Check local storage for persistent session
    const cachedUser = localStorage.getItem('jailaxmi_user');
    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setCurrentUser(u);
        setShowStaffArea(true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  // Unified data fetch from backend
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      // 1. Fetch filtered stats and applications roster
      const statRes = await fetch('/api/dashboard-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentUser.role, dept: currentUser.dept })
      });
      const statData = await statRes.json();
      if (statData.ok) {
        setApplications(statData.rows || []);
      }

      // 2. Fetch staff roster
      const userRes = await fetch('/api/get-all-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentUser.role })
      });
      const userData = await userRes.json();
      if (userData.ok) {
        setPortalUsers(userData.users || []);
        setCanManageUsers(userData.canManage || false);
      }

      // 3. Keep selected candidate updated in live view if modal open
      if (selectedCandidate) {
        const checkRes = await fetch('/api/get-full-applicant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refNo: selectedCandidate.refNo })
        });
        const checkData = await checkRes.json();
        if (checkData.ok) {
          setSelectedCandidate(checkData.row);
        }
      }
    } catch (e) {
      console.error('Data sync failed:', e);
    }
  };

  // Secure sign-in processor
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPwd) {
      setLoginError('Please enter both parameters.');
      return;
    }

    setLoadingLogin(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: loginEmail, pwd: loginPwd })
      });
      const data = await res.json();
      if (data.ok) {
        const safeUser: PortalUser = {
          uid: data.uid,
          name: data.name,
          role: data.role,
          roleLabel: data.roleLabel,
          dept: data.dept
        };
        setCurrentUser(safeUser);
        localStorage.setItem('jailaxmi_user', JSON.stringify(safeUser));
        setLoginEmail('');
        setLoginPwd('');
      } else {
        setLoginError(data.error || 'Authorisation failed.');
      }
    } catch (err) {
      setLoginError('Server connection failed.');
    } finally {
      setLoadingLogin(false);
    }
  };

  // Secure sign-out processor
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jailaxmi_user');
    setApplications([]);
    setPortalUsers([]);
    setSelectedCandidate(null);
  };

  // ────────── WORKFLOW OPERATIONS FORWARD PASSES ──────────

  const handleStatusUpdate = async (newStatus: string, notes: string, schedInfo?: any) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          newStatus,
          notes,
          role: currentUser.role,
          dept: currentUser.dept,
          userName: currentUser.name,
          schedInfo
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleStageUpdate = async (stageId: string, stageData: any) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/update-interview-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          stageId,
          interviewData: stageData,
          role: currentUser.role,
          userName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handlePanelAssign = async (panelData: any) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/assign-interview-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          panelData,
          role: currentUser.role,
          userName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleRoleUpdate = async (newDept: string, newTitle: string) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/update-applicant-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          newDept,
          newTitle,
          role: currentUser.role
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleFileUpload = async (fileName: string, b64: string, mimeType: string, stage: string) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/upload-candidate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          fileName,
          b64,
          mimeType,
          stageGuess: stage,
          userName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleResendPanelEmail = async (schedInfo?: any) => {
    if (!selectedCandidate || !currentUser) return false;
    try {
      const res = await fetch('/api/resend-panel-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: selectedCandidate.refNo,
          role: currentUser.role,
          userName: currentUser.name,
          schedInfo
        })
      });
      const data = await res.json();
      if (data.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // ────────── PORTAL ACCESS AUTHORIZATIONS ──────────

  const handleAddUser = async (data: any) => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/add-portal-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          role: currentUser.role,
          userName: currentUser.name
        })
      });
      const result = await res.json();
      if (result.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleUpdateUser = async (uid: string, data: any) => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/update-portal-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          data,
          role: currentUser.role,
          userName: currentUser.name
        })
      });
      const result = await res.json();
      if (result.ok) {
        await refreshData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // ────────── APPLICANTS LIST FILTERING LOGICS ──────────

  const filteredApplicants = applications.filter((candidate) => {
    // 1. Search criteria text match
    const lowerSearch = searchText.toLowerCase().trim();
    const matchSearch = 
      !lowerSearch ||
      candidate.fullName.toLowerCase().includes(lowerSearch) ||
      candidate.refNo.toLowerCase().includes(lowerSearch) ||
      candidate.jobTitle.toLowerCase().includes(lowerSearch) ||
      candidate.department.toLowerCase().includes(lowerSearch) ||
      candidate.phone.toLowerCase().includes(lowerSearch) ||
      candidate.email.toLowerCase().includes(lowerSearch);

    // 2. Tab status filter
    const matchStatus = statusFilter === 'All' || candidate.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Count pills badges
  const getPillBadgeCount = (status: string) => {
    if (status === 'All') return applications.length;
    return applications.filter(a => a.status === status).length;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'All': return t("All", "அனைத்தும்");
      case 'New': return t("New", "புதியவை");
      case 'Review': return t("Review", "பரிசீலனை");
      case 'Shortlisted': return t("Shortlisted", "பரிந்துரைக்கப்பட்டவை");
      case 'Selected': return t("Selected", "தேர்ந்தெடுக்கப்பட்டவை");
      case 'Joined': return t("Joined", "பணியில் சேர்ந்தவர்கள்");
      case 'Rejected': return t("Rejected", "நிராகரிக்கப்பட்டவை");
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f2] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#0F6E56]/20">
      
      {/* Dynamic Printing Wrapper Block (Only visible during standard print layout trigger) */}
      <PrintProfile candidate={selectedCandidate} />

      {/* Primary Navigation Topbar */}
      <Topbar 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        showStaffArea={showStaffArea}
        setShowStaffArea={setShowStaffArea}
        langMode={langMode}
        setLangMode={setLangMode}
      />

      {/* Main Responsive Body Space */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex-1 flex flex-col justify-start print:hidden">
        
        {/* VIEW 1: PUBLIC CAREERS PORTAL */}
        {!showStaffArea && (
          <CandidatePortal 
            jobs={jobs}
            onApplySubmit={async () => {
              await refreshData();
              return true;
            }}
            langMode={langMode}
            setLangMode={setLangMode}
          />
        )}

        {/* VIEW 2: STAFF SECURE ENCLAVE */}
        {showStaffArea && (
          <div className="flex-1 flex flex-col justify-start">
            
            {/* If Not Signed-in, show elegant Lock gateway card */}
            {!currentUser ? (
              <div className="max-w-md w-full mx-auto my-12 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                <div className="bg-[#0F6E56] text-white p-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 mx-auto shadow-inner">
                    <Lock className="w-5 h-5 text-emerald-200" />
                  </div>
                  <h3 className="text-xl font-bold font-display">Staff Authentication Gateway</h3>
                  <p className="text-xs text-emerald-100 opacity-90">Secure personnel access to Jailaxmi Group vetting rosters</p>
                </div>

                <form onSubmit={handleSignIn} className="p-6 space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Corporate Email ID</label>
                    <input 
                      type="email" required placeholder="e.g. hr@jailaxmi.com" value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Access Password</label>
                    <input 
                      type="password" required placeholder="Security Password" value={loginPwd}
                      onChange={(e) => setLoginPwd(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56] font-semibold"
                    />
                  </div>

                  <button
                    type="submit" disabled={loadingLogin}
                    className="w-full py-3 bg-[#0F6E56] hover:bg-[#085041] text-white font-bold text-xs rounded-lg transition shadow-md disabled:opacity-50"
                  >
                    {loadingLogin ? 'Validating Credentials...' : 'Sign In securely'}
                  </button>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-[11px] text-gray-500 leading-relaxed space-y-1 mt-4">
                    <div className="font-bold text-gray-700 uppercase tracking-wide text-[9px] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-400" /> Tester Accounts Pre-seeded:
                    </div>
                    <div>
                      • <strong className="text-[#0F6E56]">HR Desk:</strong> hr@jailaxmi.com (password: <code className="bg-slate-200/60 font-bold font-mono px-1">hr123</code>)
                    </div>
                    <div>
                      • <strong className="text-[#0F6E56]">Managing Director:</strong> md@jailaxmi.com (password: <code className="bg-slate-200/60 font-bold font-mono px-1">admin123</code>)
                    </div>
                    <div>
                      • <strong className="text-[#0F6E56]">Civil Dept Manager:</strong> prod_manager@jailaxmi.com (password: <code className="bg-slate-200/60 font-bold font-mono px-1">mgr123</code>)
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* If Logged-in, show secure panels depending on active sub-bar tab */
              <div className="flex-grow flex flex-col justify-start">
                
                {/* SUB TAB 1: DASHBOARD METRICS */}
                {activeTab === 'dashboard' && (
                  <DashboardTab 
                    applications={applications}
                    onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
                  />
                )}

                {/* SUB TAB 2: APPLICANTS DIRECTORY */}
                {activeTab === 'applicants' && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Upper search & Quick stats pills */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3">
                      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        
                        {/* Search input and Photo view option wrapper */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-2xl">
                          <div className="relative flex-grow">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            <input 
                              type="text" 
                              placeholder={t("Search by name, Ref No, title, department, or phone...", "பெயர், குறிப்பு எண், பணி, துறை அல்லது தொலைபேசி மூலம் தேடுங்கள்...")}
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              className="w-full bg-slate-50 border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg text-xs outline-none focus:border-[#0F6E56] font-semibold text-gray-800"
                            />
                          </div>
                          
                          {/* Photo display toggle switch */}
                          <label className="inline-flex items-center justify-between sm:justify-start gap-2.5 cursor-pointer bg-slate-50 border border-gray-200 px-3.5 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-slate-100 transition select-none">
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                checked={showPhotos} 
                                onChange={(e) => setShowPhotos(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4.5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0F6E56]"></div>
                            </div>
                            <span>{t("📷 Show Photos", "📷 புகைப்படங்களைக் காட்டு")}</span>
                          </label>
                        </div>

                        {/* Informative notice */}
                        <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-lg max-w-md hidden lg:flex items-center gap-1.5 font-medium">
                          <Info className="w-4 h-4 text-[#0F6E56] flex-shrink-0" />
                          <span>
                            <strong>{t("Workflow Discipline:", "பணி ஒழுக்கம்:")}</strong> {t("Shortlisting candidates auto-notifies assigned panel members regarding dates and location coordinates.", "தேர்வு செய்யப்பட்ட விண்ணப்பதாரர்களுக்கு நேர்காணல் தேதி மற்றும் இருப்பிட விவரங்கள் தானாகவே மின்னஞ்சல் மூலம் அனுப்பப்படும்.")}
                          </span>
                        </div>

                      </div>

                      {/* Status Filter pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                        {['All', 'New', 'Review', 'Shortlisted', 'Selected', 'Joined', 'Rejected'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                              statusFilter === status 
                                ? 'bg-[#0F6E56] text-white shadow' 
                                : 'bg-slate-50 text-gray-500 hover:bg-slate-100'
                            }`}
                          >
                            <span>{getStatusLabel(status)}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                              statusFilter === status ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-gray-600'
                            }`}>
                              {getPillBadgeCount(status)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Applicants data table */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                              <th className="p-4">{t("Applicant File Code", "விண்ணப்பக் குறியீடு")}</th>
                              <th className="p-4">{t("Candidate Name", "விண்ணப்பதாரர் பெயர்")}</th>
                              <th className="p-4">{t("Target Job / Division", "விண்ணப்பித்த பணி / பிரிவு")}</th>
                              <th className="p-4 text-center">{t("Score", "மதிப்பெண்")}</th>
                              <th className="p-4">{t("Recruitment Status", "விண்ணப்ப நிலை")}</th>
                              <th className="p-4">{t("Panel Email", "குழு மின்னஞ்சல்")}</th>
                              <th className="p-4 text-right">{t("Actions", "செயல்கள்")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredApplicants.map((candidate) => (
                              <tr key={candidate.id} className="hover:bg-slate-50/50 group transition">
                                <td className="p-4 font-mono text-[11px] text-gray-500 font-bold">
                                  {candidate.refNo}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    {showPhotos && (
                                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 shadow-xs">
                                        <img 
                                          src={candidate.photoFile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                                          alt="Candidate" 
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-bold text-gray-900 group-hover:text-[#0F6E56] transition">
                                        {candidate.fullName}
                                      </div>
                                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{candidate.email} · {candidate.phone}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-700 font-medium">
                                  <div>{candidate.jobTitle}</div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                                    {candidate.department}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`inline-block font-mono font-black px-2.5 py-0.5 rounded text-[10.5px] ${
                                    (candidate.aiScore || 0) >= 85 
                                      ? 'bg-emerald-50 text-[#0F6E56]' 
                                      : (candidate.aiScore || 0) >= 70 
                                        ? 'bg-amber-50 text-amber-700' 
                                        : 'bg-slate-100 text-gray-600'
                                  }`}>
                                    {candidate.aiScore || '—'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                                    candidate.status === 'New' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                    candidate.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    candidate.status === 'Shortlisted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                    candidate.status === 'Selected' ? 'bg-emerald-50 text-[#0F6E56] border-emerald-200' :
                                    candidate.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                    'bg-teal-50 text-teal-700 border-teal-200'
                                  }`}>
                                    {candidate.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  {candidate.panelEmailSent === 'Yes' ? (
                                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-max">
                                      ✉ {t("Sent", "அனுப்பப்பட்டது")}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 font-semibold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1.5 w-max">
                                      {t("Not sent", "அனுப்பப்படவில்லை")}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  <button 
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className="p-1.5 px-3 bg-[#0F6E56]/10 text-[#0F6E56] hover:bg-[#0F6E56] hover:text-white rounded-lg text-xs font-bold transition shadow-xs"
                                  >
                                    {t("Vetting Profile", "விவரங்களைச் சரிபார்க்கவும்")}
                                  </button>
                                </td>
                              </tr>
                            ))}

                            {filteredApplicants.length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                  No candidates match the selected filters or search parameters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* SUB TAB 3: USERS & PERMISSIONS (MD and HR ONLY) */}
                {activeTab === 'users' && (currentUser.role === 'md' || currentUser.role === 'hr') && (
                  <UsersTab 
                    users={portalUsers}
                    canManage={canManageUsers}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                  />
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* CORE DETAIL MODAL POPUP */}
      {selectedCandidate && currentUser && (
        <DetailModal 
          candidate={selectedCandidate}
          currentUser={currentUser}
          onClose={() => setSelectedCandidate(null)}
          onStatusUpdate={handleStatusUpdate}
          onPanelAssign={handlePanelAssign}
          onStageUpdate={handleStageUpdate}
          onRoleUpdate={handleRoleUpdate}
          onFileUpload={handleFileUpload}
          onResendPanelEmail={handleResendPanelEmail}
          langMode={langMode}
        />
      )}

      {/* Standard Corporate Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 mt-auto text-center text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div>© {new Date().getFullYear()} Jailaxmi Group of Companies. All Rights Reserved.</div>
          <div className="text-[10px] text-slate-500 font-mono">
            Secure Recruitment Portal v4.0 · Plant Vetting Engines · Nagpur Casting · Chinchwad Steel · Mumbai HQ
          </div>
        </div>
      </footer>

    </div>
  );
}
