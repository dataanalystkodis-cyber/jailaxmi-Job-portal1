import React, { useState } from 'react';
import { JobApplication, PortalUser, ExperienceRecord, ChildDetail } from '../types';
import { 
  X, Printer, Mail, Upload, Calendar, Edit, FileText, CheckCircle2, 
  User, GraduationCap, Users2, Briefcase, Clock, ShieldCheck, 
  ArrowRight, Heart, Award, Key, AlertCircle, RefreshCw, Star, ArrowUpRight
} from 'lucide-react';

interface DetailModalProps {
  candidate: JobApplication | null;
  currentUser: PortalUser;
  onClose: () => void;
  onStatusUpdate: (newStatus: string, notes: string, schedInfo?: any) => Promise<boolean>;
  onPanelAssign: (panelData: any) => Promise<boolean>;
  onStageUpdate: (stageId: string, stageData: any) => Promise<boolean>;
  onRoleUpdate: (newDept: string, newTitle: string) => Promise<boolean>;
  onFileUpload: (fileName: string, b64: string, mimeType: string, stage: string) => Promise<boolean>;
  onResendPanelEmail: (schedInfo?: any) => Promise<boolean>;
  langMode?: 'bilingual' | 'english' | 'tamil';
}

export default function DetailModal({
  candidate, currentUser, onClose, onStatusUpdate, onPanelAssign, onStageUpdate, onRoleUpdate, onFileUpload, onResendPanelEmail,
  langMode = 'bilingual'
}: DetailModalProps) {
  if (!candidate) return null;

  const t = (en: string, ta: string): string => {
    if (langMode === 'english') return en;
    if (langMode === 'tamil') return ta;
    return `${en} / ${ta}`;
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'family' | 'experience' | 'vetting' | 'audit'>('profile');
  
  // Status update states
  const [newStatus, setNewStatus] = useState(candidate.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  // Sched info states (only mandatory or prompt when setting Shortlisted)
  const [intDate, setIntDate] = useState(candidate.interviewScheduleDate || '');
  const [intTime, setIntTime] = useState(candidate.interviewScheduleTime || '');
  const [intMode, setIntMode] = useState(candidate.interviewMode || 'Offline / In-Person');
  const [intVenue, setIntVenue] = useState(candidate.interviewVenue || 'Jailaxmi Corporate Office');
  const [intLink, setIntLink] = useState(candidate.meetingLink || '');

  // Panel assignments states
  const [panelHr, setPanelHr] = useState(candidate.hrInterviewer || '');
  const [panelHrDate, setPanelHrDate] = useState(candidate.hrDate || '');
  const [panelSdc1, setPanelSdc1] = useState(candidate.sdc1Interviewer || '');
  const [panelSdc1Date, setPanelSdc1Date] = useState(candidate.sdc1Date || '');
  const [panelSdc2, setPanelSdc2] = useState(candidate.sdc2Interviewer || '');
  const [panelSdc2Date, setPanelSdc2Date] = useState(candidate.sdc2Date || '');
  const [panelDept, setPanelDept] = useState(candidate.deptInterviewer || '');
  const [panelDeptDate, setPanelDeptDate] = useState(candidate.deptDate || '');
  const [panelMgmt, setPanelMgmt] = useState(candidate.mgmtInterviewer || '');
  const [panelMgmtDate, setPanelMgmtDate] = useState(candidate.mgmtDate || '');
  const [savingPanel, setSavingPanel] = useState(false);

  // Stage feedback states
  const [feedbackStage, setFeedbackStage] = useState<'hr' | 'sdc1' | 'sdc2' | 'dept' | 'mgmt'>('hr');
  const [editInterviewer, setEditInterviewer] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');
  const [editRating, setEditRating] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editJoiningDate, setEditJoiningDate] = useState('');
  const [savingStage, setSavingStage] = useState(false);

  // Role update states
  const [editDeptName, setEditDeptName] = useState(candidate.department || '');
  const [editTitleName, setEditTitleName] = useState(candidate.jobTitle || '');
  const [savingRole, setSavingRole] = useState(false);

  // File upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStage, setUploadStage] = useState('HR');
  const [uploading, setUploading] = useState(false);

  // Feedback notifications
  const [successBanner, setSuccessBanner] = useState('');

  const loadStageForEdit = (stageId: 'hr' | 'sdc1' | 'sdc2' | 'dept' | 'mgmt') => {
    setFeedbackStage(stageId);
    const s = candidate[`${stageId}Stage` as 'hrStage' | 'sdc1Stage' | 'sdc2Stage' | 'deptStage' | 'mgmtStage'];
    
    // Auto populate defaults or current data
    setEditInterviewer(s?.interviewer || candidate[`${stageId}Interviewer` as 'hrInterviewer' | 'sdc1Interviewer' | 'sdc2Interviewer' | 'deptInterviewer' | 'mgmtInterviewer'] || '');
    setEditDate(s?.date || candidate[`${stageId}Date` as 'hrDate' | 'sdc1Date' | 'sdc2Date' | 'deptDate' | 'mgmtDate'] || '');
    setEditStatus(s?.status || 'Scheduled');
    setEditRating(s?.rating || '');
    setEditNotes(s?.notes || '');
    setEditJoiningDate(s?.joiningDate || '');
  };

  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStage(true);
    setSuccessBanner('');
    
    const ok = await onStageUpdate(feedbackStage, {
      interviewer: editInterviewer,
      date: editDate,
      status: editStatus,
      rating: editRating,
      notes: editNotes,
      joiningDate: feedbackStage === 'dept' ? editJoiningDate : undefined
    });

    if (ok) {
      setSuccessBanner(`Interview stage feedback for "${feedbackStage.toUpperCase()}" saved successfully!`);
    }
    setSavingStage(false);
  };

  const handlePanelAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPanel(true);
    setSuccessBanner('');

    const ok = await onPanelAssign({
      hrInterviewer: panelHr, hrDate: panelHrDate,
      sdc1Interviewer: panelSdc1, sdc1Date: panelSdc1Date,
      sdc2Interviewer: panelSdc2, sdc2Date: panelSdc2Date,
      deptInterviewer: panelDept, deptDate: panelDeptDate,
      mgmtInterviewer: panelMgmt, mgmtDate: panelMgmtDate
    });

    if (ok) {
      setSuccessBanner('Recruitment panel members and schedules assigned successfully!');
    }
    setSavingPanel(false);
  };

  const handleRoleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRole(true);
    setSuccessBanner('');

    const ok = await onRoleUpdate(editDeptName, editTitleName);
    if (ok) {
      setSuccessBanner('Department & Title modified on candidate file.');
    }
    setSavingRole(false);
  };

  // Status transitions forward check
  const isTransitionAllowed = (curr: string, next: string) => {
    if (next === 'Rejected') return true;
    const order = ['New', 'Review', 'Shortlisted', 'Selected', 'Joined'];
    const currIdx = order.indexOf(curr);
    const nextIdx = order.indexOf(next);
    if (currIdx === -1 || nextIdx === -1) return true;
    return nextIdx >= currIdx; // forward only
  };

  const handleStatusChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError('');
    setSuccessBanner('');

    if (!isTransitionAllowed(candidate.status, newStatus)) {
      setStatusError('Workflow rule violated: Backward state transitions are disabled.');
      return;
    }

    // Require scheduling fields when moving to Shortlisted
    if (newStatus === 'Shortlisted' && (!intDate || !intVenue)) {
      setStatusError('Mandatory Parameters Missing: Please provide Interview Date and Venue/Location when shortlisting.');
      return;
    }

    setUpdatingStatus(true);
    const ok = await onStatusUpdate(newStatus, statusNotes, {
      interviewDate: intDate,
      interviewTime: intTime,
      interviewMode: intMode,
      interviewVenue: intVenue,
      meetingLink: intLink
    });

    if (ok) {
      setSuccessBanner(`Recruitment state changed to: "${newStatus.toUpperCase()}"!`);
      setStatusNotes('');
    } else {
      setStatusError('Workflow transition failed. Verify server data rules.');
    }
    setUpdatingStatus(false);
  };

  const handleManualEmailSend = async () => {
    setSuccessBanner('');
    const ok = await onResendPanelEmail({
      interviewDate: intDate,
      interviewTime: intTime,
      interviewMode: intMode,
      interviewVenue: intVenue,
      meetingLink: intLink
    });
    if (ok) {
      setSuccessBanner('Complete recruitment profile and calendar invite resent to the panel successfully.');
    }
  };

  // Simulated File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setSuccessBanner('');

    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(',')[1] || '';
      const ok = await onFileUpload(uploadFile.name, b64, uploadFile.type, uploadStage);
      if (ok) {
        setSuccessBanner(`Candidate file attached: "${uploadFile.name}" under ${uploadStage} stage.`);
        setUploadFile(null);
      }
      setUploading(false);
    };
    reader.readAsDataURL(uploadFile);
  };

  const getRatingStars = (rating: string) => {
    const val = parseInt(rating.split(' ')[0]);
    if (isNaN(val)) return null;
    return (
      <div className="flex gap-0.5 text-amber-500 mt-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} className={`w-3.5 h-3.5 ${s <= val ? 'fill-current' : 'opacity-20'}`} />
        ))}
      </div>
    );
  };

  const handlePrintClick = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-40 p-4 overflow-y-auto print:hidden">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white p-5 flex-shrink-0 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 overflow-hidden bg-white/10 flex-shrink-0">
              <img 
                src={candidate.photoFile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"} 
                alt="Profile" className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display">{candidate.fullName}</h2>
                <span className="text-[10px] bg-white/20 border border-white/20 font-mono px-2 py-0.5 rounded">
                  Ref: {candidate.refNo}
                </span>
                <span className="text-[10px] bg-emerald-950/40 font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {candidate.status}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1.5 opacity-90">
                <Briefcase className="w-3.5 h-3.5" /> {candidate.jobTitle} ({candidate.department}) · Applied on {candidate.timestamp?.split(' ')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrintClick}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              title="Print standard hiring form"
            >
              <Printer className="w-4 h-4" /> Print Form
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner inside Modal */}
        {successBanner && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-3 text-xs font-bold text-[#0F6E56] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Tab Row Selector */}
        <div className="bg-gray-100 border-b border-gray-200 flex-shrink-0 px-4 py-1.5 flex gap-1 overflow-x-auto">
          {[
            { id: 'profile', label: 'Demographics', icon: User },
            { id: 'academic', label: 'Academics', icon: GraduationCap },
            { id: 'family', label: 'Family Matrix', icon: Users2 },
            { id: 'experience', label: 'Employment', icon: Briefcase },
            { id: 'vetting', label: 'Interview Vetting', icon: Clock },
            { id: 'audit', label: 'Audit Trail & Files', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'vetting') loadStageForEdit('hr');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${
                  activeTab === tab.id 
                    ? 'bg-white text-[#0F6E56] shadow-xs' 
                    : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Core Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {/* AI SUMMARY INSIGHT PANELS */}
          {activeTab === 'profile' && candidate.aiSummary && (
            <div className="bg-gradient-to-r from-emerald-50/50 to-blue-50/30 border border-emerald-200/60 rounded-xl p-4 flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 border border-emerald-200 flex flex-col justify-center items-center text-[#0F6E56] font-bold font-mono">
                <span className="text-[10px] leading-none opacity-70">AI</span>
                <span className="text-base leading-none mt-0.5">{candidate.aiScore || 85}</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs uppercase tracking-wider font-bold text-[#0F6E56]">Gemini Smart Evaluator Insight</div>
                <p className="text-xs text-gray-700 leading-relaxed italic">{candidate.aiSummary}</p>
                {candidate.aiQuestions && candidate.aiQuestions.length > 0 && (
                  <div className="pt-2 border-t border-gray-200/50 mt-2">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Suggested Candidate Questions:</div>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs text-[#0F6E56] font-medium">
                      {candidate.aiQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: PROFILE DEMOGRAPHICS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Matrix */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3.5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t("Candidate Demographics", "விண்ணப்பதாரர் சுயவிவரம்")}</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400">{t("First Name", "முதல் பெயர்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.firstName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Last Name", "இறுதி பெயர்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.lastName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Date of Birth", "பிறந்த தேதி")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.dob || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Age", "வயது")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.age || '—'} {t("Years", "வயது")}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Blood Group", "இரத்த வகை")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.bloodGroup || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Gender", "பாலினம்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {candidate.gender === 'Male' ? t("Male", "ஆண்") :
                         candidate.gender === 'Female' ? t("Female", "பெண்") :
                         candidate.gender === 'Prefer not to say' ? t("Prefer not to say", "குறிப்பிட விரும்பவில்லை") :
                         candidate.gender || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Marital Status", "திருமண நிலை")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">
                        {candidate.maritalStatus === 'Single' ? t("Single", "ஒற்றையர்") :
                         candidate.maritalStatus === 'Married' ? t("Married", "திருமணமானவர்") :
                         candidate.maritalStatus || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Religion", "மதம்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.religion || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Identity Credentials */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3.5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Contact & Identity Codes</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400">Phone Mobile</span>
                      <p className="font-semibold text-[#0F6E56] mt-0.5 font-mono">{candidate.phone || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email ID</span>
                      <p className="font-semibold text-gray-900 mt-0.5 font-mono">{candidate.email || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Aadhar Card</span>
                      <p className="font-semibold text-gray-900 mt-0.5 font-mono">{candidate.aadhar || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">PAN Card</span>
                      <p className="font-semibold text-gray-900 mt-0.5 font-mono">{candidate.pan || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Owned Vehicles</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{candidate.vehicles || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Licence Number</span>
                      <p className="font-semibold text-gray-900 mt-0.5 font-mono">{candidate.licenceNo || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400">Residential Address (Current)</span>
                  <p className="font-semibold text-gray-900 mt-0.5 leading-relaxed">{candidate.residentialAddress || '—'}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-400">Permanent Address</span>
                  <p className="font-semibold text-gray-900 mt-0.5 leading-relaxed">{candidate.permanentAddress || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS ROSTER */}
          {activeTab === 'academic' && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#e8f5f0] text-[#0F6E56] font-bold border-b border-gray-200">
                    <th className="p-3">Education Level</th>
                    <th className="p-3">Degree Name</th>
                    <th className="p-3">Institute / College / Board</th>
                    <th className="p-3 text-center">Passing Year</th>
                    <th className="p-3 text-right">Score / Marks %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-gray-900">Post Graduation (PG)</td>
                    <td className="p-3 text-gray-800">{candidate.pgDegree || '—'}</td>
                    <td className="p-3 text-gray-600">{candidate.pgCollege || '—'}</td>
                    <td className="p-3 text-center font-mono">{candidate.pgYear || '—'}</td>
                    <td className="p-3 text-right font-bold text-gray-900 font-mono">{candidate.pgMarks || '—'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-[#f0faf6]/10">
                    <td className="p-3 font-semibold text-gray-900">Under Graduation (UG)</td>
                    <td className="p-3 text-gray-800 font-bold">{candidate.ugDegree || '—'}</td>
                    <td className="p-3 text-gray-600">{candidate.ugCollege || '—'}</td>
                    <td className="p-3 text-center font-mono">{candidate.ugYear || '—'}</td>
                    <td className="p-3 text-right font-bold text-[#0F6E56] font-mono">{candidate.ugMarks || '—'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-gray-900">Diploma Credentials</td>
                    <td className="p-3 text-gray-800">{candidate.diplomaInstitute || '—'}</td>
                    <td className="p-3 text-gray-600">{candidate.diplomaBoard || '—'}</td>
                    <td className="p-3 text-center font-mono">{candidate.diplomaYear || '—'}</td>
                    <td className="p-3 text-right font-semibold text-gray-900 font-mono">{candidate.diplomaMarks || '—'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-[#f0faf6]/5">
                    <td className="p-3 font-semibold text-gray-900">Higher Secondary (HSC / 12th)</td>
                    <td className="p-3 text-gray-800">{candidate.hscSchool || '—'}</td>
                    <td className="p-3 text-gray-600">{candidate.hscBoard || '—'}</td>
                    <td className="p-3 text-center font-mono">{candidate.hscYear || '—'}</td>
                    <td className="p-3 text-right font-semibold text-[#0F6E56] font-mono">{candidate.hscMarks || '—'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-gray-900">High School (SSLC / 10th)</td>
                    <td className="p-3 text-gray-800">{candidate.sslcSchool || '—'}</td>
                    <td className="p-3 text-gray-600">{candidate.sslcBoard || '—'}</td>
                    <td className="p-3 text-center font-mono">{candidate.sslcYear || '—'}</td>
                    <td className="p-3 text-right font-semibold text-gray-900 font-mono">{candidate.sslcMarks || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: FAMILY MATRIX */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              
              {/* Parent roster */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                <h3 className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider">{t("Parents Demographic Record", "பெற்றோரின் விவரங்கள்")}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-white border border-gray-100 rounded-lg">
                    <thead>
                      <tr className="bg-slate-50 text-gray-500 font-bold border-b border-gray-100">
                        <th className="p-2 pl-3">{t("Relation", "உறவு")}</th>
                        <th className="p-2">{t("Full Name", "முழு பெயர்")}</th>
                        <th className="p-2 text-center">{t("Age", "வயது")}</th>
                        <th className="p-2">{t("Mobile Number", "கைபேசி எண்")}</th>
                        <th className="p-2">{t("Employment", "பணி")}</th>
                        <th className="p-2 text-right pr-3">{t("Income", "வருமானம்")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="p-2 pl-3 font-bold text-gray-900">{t("Father", "தந்தை")}</td>
                        <td className="p-2">{candidate.fatherName || '—'}</td>
                        <td className="p-2 text-center font-mono">{candidate.fatherAge || '—'}</td>
                        <td className="p-2 font-semibold text-[#0F6E56] font-mono">{candidate.fatherMobile || '—'}</td>
                        <td className="p-2">{candidate.fatherEmp || '—'}</td>
                        <td className="p-2 text-right font-mono pr-3 font-semibold">{candidate.fatherIncome || '—'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 pl-3 font-bold text-gray-900">{t("Mother", "தாய்")}</td>
                        <td className="p-2">{candidate.motherName || '—'}</td>
                        <td className="p-2 text-center font-mono">{candidate.motherAge || '—'}</td>
                        <td className="p-2 font-semibold text-[#0F6E56] font-mono">{candidate.motherMobile || '—'}</td>
                        <td className="p-2">{candidate.motherEmp || '—'}</td>
                        <td className="p-2 text-right font-mono pr-3 font-semibold">{candidate.motherIncome || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Siblings & Spouse Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Siblings */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3.5 border border-gray-100 text-xs">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t("Siblings Information", "சகோதர / சகோதரி விவரங்கள்")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">{t("Brothers Count", "சகோதரர்களின் எண்ணிக்கை")}</span>
                      <p className="font-bold text-gray-900 mt-0.5">{candidate.brothersCount || '0'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{t("Sisters Count", "சகோதரிகளின் எண்ணிக்கை")}</span>
                      <p className="font-bold text-gray-900 mt-0.5">{candidate.sistersCount || '0'}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-200/50">
                      <span className="text-gray-400">{t("Brothers Job & Location details", "சகோதரர்களின் பணி & இருப்பிட விவரங்கள்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5 italic">{candidate.brothersDetail || '—'}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-200/50">
                      <span className="text-gray-400">{t("Sisters Job & Location details", "சகோதரிகளின் பணி & இருப்பிட விவரங்கள்")}</span>
                      <p className="font-semibold text-gray-900 mt-0.5 italic">{candidate.sistersDetail || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Spouse Details */}
                <div className="bg-rose-50/20 border border-rose-100 rounded-xl p-4 space-y-3.5 text-xs">
                  <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">{t("Spouse Details", "துணைவியார் / கணவர் விவரங்கள்")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-rose-900/60">{t("Spouse Name", "துணைவியார் / கணவர் பெயர்")}</span>
                      <p className="font-bold text-gray-950 mt-0.5">{candidate.wifeName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-rose-900/60">{t("Age", "வயது")}</span>
                      <p className="font-bold text-gray-950 mt-0.5">{candidate.wifeAge || '—'}</p>
                    </div>
                    <div>
                      <span className="text-rose-900/60">{t("Spouse Mobile No.", "கைபேசி எண்")}</span>
                      <p className="font-bold text-gray-950 mt-0.5 font-mono">{candidate.wifeMobile || '—'}</p>
                    </div>
                    <div>
                      <span className="text-rose-900/60">{t("Employment Status", "வேலை நிலை")}</span>
                      <p className="font-semibold text-gray-950 mt-0.5">{candidate.wifeEmp || '—'}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-rose-100/40">
                      <span className="text-rose-900/60">{t("Monthly Income", "மாத வருமானம்")}</span>
                      <p className="font-bold text-gray-950 mt-0.5 font-mono">{candidate.wifeIncome || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Children details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Children Details Roster</h3>
                {!candidate.childrenDetails || candidate.childrenDetails.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No children details registered on candidate file.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {candidate.childrenDetails.map((child, i) => (
                      <div key={i} className="bg-white border border-gray-200 p-2.5 rounded-lg text-xs space-y-1">
                        <div className="font-bold text-gray-950">{child.name}</div>
                        <div className="text-gray-500 font-medium">Gender: {child.gender} | Age: {child.age}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EMPLOYMENT HISTORY */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="border-l-2 border-[#0F6E56] pl-4 space-y-6">
                {candidate.workExperience && candidate.workExperience.length > 0 ? (
                  candidate.workExperience.map((job, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2.5 relative shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-slate-100 text-gray-600 font-bold px-2.5 py-1 rounded">
                            {job.from} to {job.to}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 mt-2">{job.designation}</h4>
                          <p className="text-xs text-[#0F6E56] font-semibold">{job.company} · <span className="text-gray-400">{job.companyLocation}</span></p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400">Monthly Remuneration</span>
                          <div className="font-bold font-mono text-xs text-gray-900">{job.salary}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2.5 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400">Reason for Leaving</span>
                          <p className="font-medium text-gray-800 mt-0.5 leading-relaxed">{job.reason || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Key Achievement / Site Responsibility</span>
                          <p className="font-semibold text-gray-900 mt-0.5 leading-relaxed">{job.achievement || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-400 text-xs italic">
                    Candidate file registers as fresh graduate. No employment records.
                  </div>
                )}
              </div>

              {/* References check */}
              <div className="bg-[#f0faf6] border border-emerald-200 rounded-xl p-4 space-y-3.5">
                <h3 className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider">Candidate Reference Checks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-800/70">Reference Name</span>
                    <p className="font-bold text-gray-900 mt-0.5">{candidate.refName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-emerald-800/70">Position / Company</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{candidate.refPosition || '—'}</p>
                  </div>
                  <div>
                    <span className="text-emerald-800/70">Mobile / Phone</span>
                    <p className="font-semibold text-[#0F6E56] font-mono mt-0.5">{candidate.refMobile || '—'}</p>
                  </div>
                  <div>
                    <span className="text-emerald-800/70">Email ID</span>
                    <p className="font-semibold text-gray-900 font-mono mt-0.5">{candidate.refEmail || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INTERVIEW VETTING */}
          {activeTab === 'vetting' && (
            <div className="space-y-6">
              
              {/* Left Stage Quick Navigator & Edit Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Stage Navigator (col-span-4) */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Vetting Stages</div>
                  {[
                    { id: 'hr', label: 'HR Interview Round', s: candidate.hrStage },
                    { id: 'sdc1', label: 'SDC Stage 1 Technical', s: candidate.sdc1Stage },
                    { id: 'sdc2', label: 'SDC Stage 2 Practical', s: candidate.sdc2Stage },
                    { id: 'dept', label: 'Department Manager', s: candidate.deptStage },
                    { id: 'mgmt', label: 'Management Evaluation', s: candidate.mgmtStage }
                  ].map((stg) => (
                    <button
                      key={stg.id}
                      onClick={() => loadStageForEdit(stg.id as any)}
                      className={`w-full p-3 rounded-lg text-left border text-xs flex justify-between items-start transition ${
                        feedbackStage === stg.id 
                          ? 'bg-[#0F6E56]/10 border-[#0F6E56] text-[#0F6E56] font-bold shadow-xs' 
                          : 'bg-white border-gray-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div>{stg.label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {stg.s?.interviewer || 'Not assigned'}
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        stg.s?.status === 'Completed — Pass' ? 'bg-emerald-50 text-[#0F6E56]' :
                        stg.s?.status === 'Completed — Fail' ? 'bg-red-50 text-red-600' :
                        stg.s?.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-50 text-gray-400'
                      }`}>
                        {stg.s?.status || 'Pending'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Edit Form (col-span-8) */}
                <div className="lg:col-span-8 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-1.5">
                    <Edit className="w-4 h-4 text-[#0F6E56]" /> Update {feedbackStage.toUpperCase()} Evaluation Stage
                  </h3>

                  <form onSubmit={handleStageSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Assigned Evaluator</label>
                        <input 
                          type="text" required value={editInterviewer} onChange={(e) => setEditInterviewer(e.target.value)}
                          placeholder="Interviewer Name" className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Target Date</label>
                        <input 
                          type="text" required value={editDate} onChange={(e) => setEditDate(e.target.value)}
                          placeholder="e.g. 04/07/2026" className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Evaluation Outcome</label>
                        <select 
                          value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                        >
                          <option>Scheduled</option>
                          <option>Completed — Pass</option>
                          <option>Completed — Fail</option>
                          <option>Pending</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Score rating (e.g. 4 — Good)</label>
                        <select 
                          value={editRating} onChange={(e) => setEditRating(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                        >
                          <option value="">No rating selected</option>
                          <option value="5 — Outstanding">5 — Outstanding</option>
                          <option value="4 — Good">4 — Good</option>
                          <option value="3 — Average">3 — Average</option>
                          <option value="2 — Below Average">2 — Below Average</option>
                          <option value="1 — Poor">1 — Poor</option>
                        </select>
                      </div>
                    </div>

                    {feedbackStage === 'dept' && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Recommended Joining Date (if pass)</label>
                        <input 
                          type="text" value={editJoiningDate} onChange={(e) => setEditJoiningDate(e.target.value)}
                          placeholder="e.g. 15/07/2026" className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Interview / Technical feedback logs</label>
                      <textarea 
                        rows={3} required value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Detail technical feedback, soft skills behavior index, and recommendation logs." 
                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                      />
                    </div>

                    <button 
                      type="submit" disabled={savingStage}
                      className="px-5 py-2.5 bg-[#0F6E56] hover:bg-[#085041] text-white text-xs font-bold rounded-lg transition"
                    >
                      {savingStage ? 'Saving Feedback...' : 'Authorize Stage Verification'}
                    </button>
                  </form>
                </div>

              </div>

              {/* PANEL SCHEDULING FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                
                {/* Assign / Modify Panel members */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                  <h4 className="text-xs uppercase font-bold text-gray-900 tracking-wider mb-3">
                    Assign Recruitment Vetting Panel
                  </h4>
                  <form onSubmit={handlePanelAssignSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" placeholder="HR Interviewer" value={panelHr} onChange={(e) => setPanelHr(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="HR Date" value={panelHrDate} onChange={(e) => setPanelHrDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" placeholder="SDC Stage 1" value={panelSdc1} onChange={(e) => setPanelSdc1(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="SDC 1 Date" value={panelSdc1Date} onChange={(e) => setPanelSdc1Date(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" placeholder="SDC Stage 2" value={panelSdc2} onChange={(e) => setPanelSdc2(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="SDC 2 Date" value={panelSdc2Date} onChange={(e) => setPanelSdc2Date(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" placeholder="Dept Interviewer" value={panelDept} onChange={(e) => setPanelDept(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="Dept Date" value={panelDeptDate} onChange={(e) => setPanelDeptDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" placeholder="Management" value={panelMgmt} onChange={(e) => setPanelMgmt(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="Management Date" value={panelMgmtDate} onChange={(e) => setPanelMgmtDate(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>

                    <button 
                      type="submit" disabled={savingPanel}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition"
                    >
                      {savingPanel ? 'Updating Panel...' : 'Modify Panel Assignments'}
                    </button>
                  </form>
                </div>

                {/* Role and department modifications */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div>
                    <h4 className="text-xs uppercase font-bold text-gray-900 tracking-wider">
                      Department &amp; Title Re-assignment
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Modify applied position file parameters if necessary</p>
                  </div>
                  <form onSubmit={handleRoleUpdateSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Assigned Corporate Line</label>
                      <select 
                        value={editDeptName} onChange={(e) => setEditDeptName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none"
                      >
                        <option>Civil (Design & Construction)</option>
                        <option>Sales</option>
                        <option>Accounts</option>
                        <option>Trainer & Digital Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Applied Designation Title</label>
                      <input 
                        type="text" required value={editTitleName} onChange={(e) => setEditTitleName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>

                    <button 
                      type="submit" disabled={savingRole}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition"
                    >
                      {savingRole ? 'Saving...' : 'Authorize Parameter Update'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL & COMPILATIONS */}
          {activeTab === 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Documents & File uploads (col-span-6) */}
              <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Document Chest</h4>
                  <p className="text-[9px] text-gray-400">Attached files, certifications, and candidate documents</p>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 border border-gray-200 p-2.5 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-900">Primary_Resume.pdf</div>
                      <span className="text-[9px] text-gray-400">Main attached CV file</span>
                    </div>
                    <a 
                      href={candidate.resumeFile || '#'} 
                      target="_blank" rel="noopener noreferrer"
                      className="p-1 px-2.5 bg-emerald-50 hover:bg-[#0F6E56] hover:text-white rounded text-[10px] font-bold text-[#0F6E56] transition"
                    >
                      Inspect CV
                    </a>
                  </div>

                  {candidate.additionalDocuments && candidate.additionalDocuments.length > 0 ? (
                    candidate.additionalDocuments.map((doc, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-200 p-2.5 rounded-lg text-xs flex justify-between items-center animate-fade-in">
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{doc.name}</div>
                          <span className="text-[9px] text-gray-400">Uploaded by {doc.uploadedBy} on {doc.uploadedDate} ({doc.stage})</span>
                        </div>
                        <a 
                          href={doc.url} download 
                          className="p-1 px-2.5 bg-[#0F6E56]/10 hover:bg-[#0F6E56] hover:text-white rounded text-[10px] font-bold text-[#0F6E56] transition"
                        >
                          Download
                        </a>
                      </div>
                    ))
                  ) : null}
                </div>

                {/* File Upload Form */}
                <form onSubmit={handleFileUploadSubmit} className="bg-slate-50/50 border border-dashed border-gray-200 rounded-xl p-4 space-y-3 mt-4">
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#0F6E56]" /> Attach Verification Artifact
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Stage Vetting</label>
                      <select 
                        value={uploadStage} onChange={(e) => setUploadStage(e.target.value)}
                        className="bg-white border border-gray-300 rounded p-1 w-full text-xs"
                      >
                        <option>HR</option>
                        <option>SDC 1</option>
                        <option>SDC 2</option>
                        <option>Dept</option>
                        <option>Mgmt</option>
                        <option>Aadhar / Identity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 mb-0.5">Select File</label>
                      <input 
                        type="file" required onChange={handleFileChange}
                        className="bg-white border border-gray-300 rounded p-0.5 w-full text-xs"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" disabled={!uploadFile || uploading}
                    className="w-full py-1.5 bg-[#0F6E56] hover:bg-[#085041] text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </div>

              {/* Right Column: Complete Status Timelines & Audit Logs (col-span-6) */}
              <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between max-h-[450px] overflow-y-auto custom-scrollbar">
                
                {/* Timeline */}
                <div className="space-y-3">
                  <div className="border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Hiring Audit Logs</h4>
                    <p className="text-[9px] text-gray-400">Timestamp logs of every action on candidate file</p>
                  </div>

                  <div className="space-y-3 text-[10.5px]">
                    {candidate.auditLog && candidate.auditLog.map((log, idx) => (
                      <div key={idx} className="bg-slate-50/50 p-2 border border-gray-100 rounded-lg space-y-1">
                        <div className="flex justify-between font-mono text-[9px] text-gray-400">
                          <span>{log.timestamp}</span>
                          <span className="font-bold text-[#0F6E56]">{log.by}</span>
                        </div>
                        <div className="font-bold text-gray-900">{log.action}</div>
                        {log.notes && <p className="text-gray-500 italic">Notes: {log.notes}</p>}
                        {log.recipients && <p className="text-blue-600 font-mono text-[8px] truncate">Panel Emailed: {log.recipients}</p>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Status Workflow Operations Bottom Footer */}
        <div className="bg-slate-50 border-t border-gray-200 p-4 flex-shrink-0 flex justify-between items-center">
          
          {/* Panel Email Notification Box */}
          <div className="text-xs max-w-sm">
            {candidate.panelEmailSent === 'Yes' ? (
              <div className="text-emerald-800 flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-[#0F6E56]" /> 
                <span>
                  Panel Notified on <strong className="font-bold text-[#0F6E56]">{candidate.panelEmailSentDate?.split(' ')[0]}</strong> ({candidate.panelNotificationStatus})
                </span>
              </div>
            ) : (
              <div className="text-gray-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> 
                <span>Panel has not been emailed regarding schedules.</span>
              </div>
            )}
          </div>

          {/* Core Status Update Panel Forms */}
          <form onSubmit={handleStatusChangeSubmit} className="flex items-center gap-2">
            
            {newStatus === 'Shortlisted' && (
              <div className="bg-[#f0faf6] border border-emerald-200 p-2 rounded-lg text-[10px] space-y-1 text-emerald-950 max-w-xs mr-2 flex flex-col">
                <strong className="text-[#0F6E56]">Active Scheduling required:</strong>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <input 
                    type="text" required placeholder="Date (e.g. 05/07/2026)" value={intDate} onChange={(e) => setIntDate(e.target.value)}
                    className="bg-white border rounded p-0.5 outline-none font-semibold text-gray-900"
                  />
                  <input 
                    type="text" placeholder="Time (e.g. 11:00 AM)" value={intTime} onChange={(e) => setIntTime(e.target.value)}
                    className="bg-white border rounded p-0.5 outline-none font-semibold text-gray-900"
                  />
                  <input 
                    type="text" required placeholder="Location Venue" value={intVenue} onChange={(e) => setIntVenue(e.target.value)}
                    className="bg-white border rounded p-0.5 col-span-2 outline-none font-semibold text-gray-900"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <select
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setStatusError('');
                }}
                className="bg-white border border-gray-300 rounded-lg p-1.5 text-xs font-semibold outline-none text-gray-800"
              >
                <option value="New">Set status: New</option>
                <option value="Review">Set status: Under Review</option>
                <option value="Shortlisted">Set status: Shortlisted</option>
                <option value="Selected">Set status: Selected (Offer)</option>
                <option value="Joined">Set status: Joined Team</option>
                <option value="Rejected">Set status: Rejected</option>
              </select>
              {statusError && <span className="text-[9px] text-red-600 font-bold mt-0.5">{statusError}</span>}
            </div>

            <input 
              type="text" 
              placeholder="Action logs comments..." 
              value={statusNotes} 
              onChange={(e) => setStatusNotes(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg p-1.5 text-xs outline-none w-48 text-gray-900 font-semibold"
            />

            <button
              type="submit"
              disabled={updatingStatus}
              className="p-1.5 px-4 bg-[#0F6E56] hover:bg-[#085041] text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
            >
              {updatingStatus ? 'Updating...' : 'Authorize State'}
            </button>

            {candidate.status === 'Shortlisted' && (
              <button
                type="button"
                onClick={handleManualEmailSend}
                className="p-1.5 bg-slate-800 hover:bg-slate-950 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                title="Resend candidates profile to the assigned panel"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Notify Panel
              </button>
            )}
          </form>

        </div>

      </div>
    </div>
  );
}
