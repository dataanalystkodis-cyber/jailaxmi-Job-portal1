import React, { useState } from 'react';
import { JobListing, JobApplication, ExperienceRecord, ChildDetail } from '../types';
import { 
  Briefcase, MapPin, DollarSign, Clock, FileText, CheckCircle2, 
  ArrowRight, User, GraduationCap, Users2, ShieldAlert, FileCode2,
  Calendar, Phone, Mail, Plus, Trash2, Award, Info
} from 'lucide-react';

interface CandidatePortalProps {
  jobs: JobListing[];
  onApplySubmit: (formData: any) => Promise<boolean>;
  langMode?: 'bilingual' | 'english' | 'tamil';
  setLangMode?: (mode: 'bilingual' | 'english' | 'tamil') => void;
}

export default function CandidatePortal({ 
  jobs, onApplySubmit, langMode: propLangMode, setLangMode: propSetLangMode 
}: CandidatePortalProps) {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [formStep, setFormStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successApp, setSuccessApp] = useState<JobApplication | null>(null);

  // Language format configuration
  const [localLangMode, setLocalLangMode] = useState<'bilingual' | 'english' | 'tamil'>('bilingual');
  const langMode = propLangMode || localLangMode;
  const setLangMode = propSetLangMode || setLocalLangMode;

  const t = (en: string, ta: string): string => {
    if (langMode === 'english') return en;
    if (langMode === 'tamil') return ta;
    return `${en} / ${ta}`;
  };

  // Position State Values
  const [appliedDept, setAppliedDept] = useState('');
  const [appliedTitle, setAppliedTitle] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');

  // Form State Values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [nationality, setNationality] = useState('Indian');
  const [religion, setReligion] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');

  // Sibling incomes
  const [sibling1Income, setSibling1Income] = useState('');
  const [sibling2Income, setSibling2Income] = useState('');

  // Education State Values
  const [pgDegree, setPgDegree] = useState('');
  const [pgCollege, setPgCollege] = useState('');
  const [pgYear, setPgYear] = useState('');
  const [pgMarks, setPgMarks] = useState('');
  const [ugDegree, setUgDegree] = useState('');
  const [ugCollege, setUgCollege] = useState('');
  const [ugYear, setUgYear] = useState('');
  const [ugMarks, setUgMarks] = useState('');
  const [diplomaInstitute, setDiplomaInstitute] = useState('');
  const [diplomaBoard, setDiplomaBoard] = useState('');
  const [diplomaYear, setDiplomaYear] = useState('');
  const [diplomaMarks, setDiplomaMarks] = useState('');
  const [sslcSchool, setSslcSchool] = useState('');
  const [sslcBoard, setSslcBoard] = useState('');
  const [sslcYear, setSslcYear] = useState('');
  const [sslcMarks, setSslcMarks] = useState('');
  const [hscSchool, setHscSchool] = useState('');
  const [hscBoard, setHscBoard] = useState('');
  const [hscYear, setHscYear] = useState('');
  const [hscMarks, setHscMarks] = useState('');

  // Skills & Family State Values
  const [technicalSkills, setTechnicalSkills] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherAge, setFatherAge] = useState('');
  const [fatherEmp, setFatherEmp] = useState('');
  const [fatherMobile, setFatherMobile] = useState('');
  const [fatherIncome, setFatherIncome] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherAge, setMotherAge] = useState('');
  const [motherEmp, setMotherEmp] = useState('');
  const [motherMobile, setMotherMobile] = useState('');
  const [motherIncome, setMotherIncome] = useState('');
  const [brothersCount, setBrothersCount] = useState('');
  const [brothersDetail, setBrothersDetail] = useState('');
  const [sistersCount, setSistersCount] = useState('');
  const [sistersDetail, setSistersDetail] = useState('');
  const [wifeName, setWifeName] = useState('');
  const [wifeAge, setWifeAge] = useState('');
  const [wifeEmp, setWifeEmp] = useState('');
  const [wifeMobile, setWifeMobile] = useState('');
  const [wifeIncome, setWifeIncome] = useState('');
  const [noOfChildren, setNoOfChildren] = useState('0');

  // Dynamic lists
  const [childrenDetails, setChildrenDetails] = useState<ChildDetail[]>([]);
  const [workExperience, setWorkExperience] = useState<ExperienceRecord[]>([]);

  // References & Others
  const [refName, setRefName] = useState('');
  const [refPosition, setRefPosition] = useState('');
  const [refMobile, setRefMobile] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [hearSource, setHearSource] = useState('Indeed');
  const [otherHearSource, setOtherHearSource] = useState('');
  const [vehicles, setVehicles] = useState('');
  const [licenceNo, setLicenceNo] = useState('');

  // Mandatory base64 files
  const [photoFile, setPhotoFile] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');

  // Auto pre-fill on selectedJob change
  React.useEffect(() => {
    if (selectedJob) {
      setAppliedDept(selectedJob.department || '');
      setAppliedTitle(selectedJob.title || '');
      setAppliedLocation(selectedJob.location || '');
    }
  }, [selectedJob]);

  // Read files and convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'resume') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'photo') {
          setPhotoFile(reader.result);
          setPhotoFileName(file.name);
        } else {
          setResumeFile(reader.result);
          setResumeFileName(file.name);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-fill age on DOB change if possible
  const handleDobChange = (val: string) => {
    setDob(val);
    try {
      if (!val) return;
      const dateObj = new Date(val);
      if (!isNaN(dateObj.getTime())) {
        const birthYear = dateObj.getFullYear();
        const curYear = new Date().getFullYear();
        setAge(String(curYear - birthYear));
      } else {
        const parts = val.split('/');
        if (parts.length === 3) {
          const birthYear = parseInt(parts[2]);
          const curYear = new Date().getFullYear();
          if (!isNaN(birthYear) && birthYear > 1900 && birthYear <= curYear) {
            setAge(String(curYear - birthYear));
          }
        }
      }
    } catch (e) {}
  };

  const handleAddExperience = () => {
    setWorkExperience([...workExperience, {
      company: '', companyLocation: '', designation: '', from: '', to: '', salary: '', reason: '', achievement: ''
    }]);
  };

  const handleRemoveExperience = (idx: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== idx));
  };

  const handleUpdateExperience = (idx: number, field: keyof ExperienceRecord, val: string) => {
    const updated = [...workExperience];
    updated[idx] = { ...updated[idx], [field]: val };
    setWorkExperience(updated);
  };

  const handleAddChild = () => {
    setChildrenDetails([...childrenDetails, { name: '', gender: 'Male', age: '' }]);
  };

  const handleRemoveChild = (idx: number) => {
    setChildrenDetails(childrenDetails.filter((_, i) => i !== idx));
  };

  const handleUpdateChild = (idx: number, field: keyof ChildDetail, val: string) => {
    const updated = [...childrenDetails];
    updated[idx] = { ...updated[idx], [field]: val };
    setChildrenDetails(updated);
  };

  const validateStep = (step: number) => {
    setErrorMsg('');
    if (step === 1) {
      if (!appliedDept || appliedDept === 'Select department' || !appliedTitle || !appliedLocation) {
        setErrorMsg('Please specify Department, Job Title, and Location for the position applied.');
        return false;
      }
    } else if (step === 2) {
      if (!firstName || !phone || !email || !dob || !gender || !aadhar) {
        setErrorMsg('Please fill in all mandatory personal fields (First Name, Phone, Email, DOB, Gender, Aadhar).');
        return false;
      }
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
    } else if (step === 3) {
      // Under Graduation details are not mandatory as requested
      return true;
    } else if (step === 4) {
      if (!technicalSkills) {
        setErrorMsg(t('Please declare your key Technical / Job skills.', 'உங்களது முக்கிய தொழில்நுட்ப / தொழில்முறை திறன்களை குறிப்பிடவும்.'));
        return false;
      }
      if (!fatherName || !fatherName.trim()) {
        setErrorMsg(t("Father's Name is mandatory.", "தந்தையின் பெயர் கட்டாயமாகும்."));
        return false;
      }
      if (!fatherMobile || !fatherMobile.trim()) {
        setErrorMsg(t("Father's Mobile Number is mandatory.", "தந்தையின் கைபேசி எண் கட்டாயமாகும்."));
        return false;
      }
      if (!motherName || !motherName.trim()) {
        setErrorMsg(t("Mother's Name is mandatory.", "தாயின் பெயர் கட்டாயமாகும்."));
        return false;
      }
      if (!motherMobile || !motherMobile.trim()) {
        setErrorMsg(t("Mother's Mobile Number is mandatory.", "தாயின் கைபேசி எண் கட்டாயமாகும்."));
        return false;
      }
    } else if (step === 6) {
      if (!photoFile) {
        setErrorMsg('Please upload a passport size photo (mandatory).');
        return false;
      }
      if (!resumeFile) {
        setErrorMsg('Please upload your resume (mandatory).');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setFormStep(formStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(formStep)) return;

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      position: appliedTitle || selectedJob?.title || 'General Applicant',
      department: appliedDept || selectedJob?.department || 'Administration',
      location: appliedLocation || selectedJob?.location || 'Mumbai HQ',
      firstName,
      lastName,
      dob,
      age,
      bloodGroup,
      gender,
      maritalStatus,
      nationality,
      religion,
      aadhar,
      pan,
      residentialAddress,
      permanentAddress,
      
      pgDegree, pgCollege, pgYear, pgMarks,
      ugDegree, ugCollege, ugYear, ugMarks,
      diplomaInstitute, diplomaBoard, diplomaYear, diplomaMarks,
      sslcSchool, sslcBoard, sslcYear, sslcMarks,
      hscSchool, hscBoard, hscYear, hscMarks,

      technicalSkills,
      fatherName, fatherAge, fatherEmp, fatherMobile, fatherIncome,
      motherName, motherAge, motherEmp, motherMobile, motherIncome,
      brothersCount, brothersDetail,
      sistersCount, sistersDetail,
      sibling1Income, sibling2Income,
      wifeName, wifeAge, wifeEmp, wifeMobile, wifeIncome,
      noOfChildren,
      childrenDetails,
      workExperience,

      refName, refPosition, refMobile, refEmail,
      hearSource: hearSource === 'Others' && otherHearSource ? `Others (${otherHearSource})` : hearSource,
      vehicles, licenceNo,
      photoFile: photoFile || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      resumeFile: resumeFile || 'https://example.com/resumes/candidate_uploaded.pdf'
    };

    try {
      const res = await fetch('/api/public-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        setSuccessApp(data.application);
      } else {
        setErrorMsg(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Could not process your form submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessApp(null);
    setSelectedJob(null);
    setFormStep(1);
    // Clear major fields
    setFirstName(''); setLastName(''); setPhone(''); setEmail(''); setDob(''); setAge(''); setAadhar(''); setPan('');
    setUgDegree(''); setUgCollege(''); setUgMarks(''); setTechnicalSkills(''); setWorkExperience([]);
    setPgDegree(''); setPgCollege(''); setPgYear(''); setPgMarks('');
    setDiplomaInstitute(''); setDiplomaBoard(''); setDiplomaYear(''); setDiplomaMarks('');
    setSslcSchool(''); setSslcBoard(''); setSslcYear(''); setSslcMarks('');
    setHscSchool(''); setHscBoard(''); setHscYear(''); setHscMarks('');
    setAppliedDept(''); setAppliedTitle(''); setAppliedLocation('');
    setSibling1Income(''); setSibling2Income('');
    setOtherHearSource('');
    setPhotoFile(''); setPhotoFileName('');
    setResumeFile(''); setResumeFileName('');
  };

  // IF APPLICATION SUBMITTED SUCCESSFULLY
  if (successApp) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-xl shadow-md p-8 border border-emerald-100 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-[#0F6E56]" />
        </div>
        <h3 className="text-2xl font-bold text-[#0F6E56]">Application Submitted!</h3>
        <p className="text-gray-600 mt-2">
          Thank you, <strong className="text-gray-950">{successApp.fullName}</strong>. Your profile has been successfully received by Jailaxmi Group's HR recruitment portal.
        </p>

        <div className="my-6 p-4 bg-[#f0faf6] border border-emerald-200 rounded-lg inline-block text-left">
          <div className="text-xs text-[#0F6E56] font-bold uppercase tracking-wider">Candidate Reference Number</div>
          <div className="text-xl font-mono font-bold text-gray-900 mt-1">{successApp.refNo}</div>
          <div className="text-[11px] text-gray-500 mt-1">Please quote this Ref No. for all future recruitment queries.</div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left text-xs text-amber-900 flex gap-2 mb-6">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <div>
            <strong>Next Steps:</strong> Clear preliminary screening. Once shortlisting criteria is completed, our panel will email you directly regarding schedule dates on <strong>{successApp.email}</strong>.
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="w-full py-3 bg-[#0F6E56] hover:bg-[#085041] text-white font-semibold rounded-lg transition"
        >
          Return to Job Openings
        </button>
      </div>
    );
  }

  // IF FORM MODAL NOT ACTIVE, SHOW JOB BOARD
  if (!selectedJob) {
    return (
      <div className="space-y-6">
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight">Open Job Opportunities</h2>
          <p className="text-gray-600 mt-2 text-sm max-w-lg mx-auto">
            Jailaxmi Group of Companies is inviting applications for our plants, logistics, and corporate divisions. Submit your profile today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between hover:border-[#0F6E56] hover:shadow-sm transition group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-emerald-50 text-[#0F6E56] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {job.department}
                  </span>
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Full-time
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-3 group-hover:text-[#0F6E56] transition">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </div>
                <p className="text-xs text-gray-600 mt-3 line-clamp-3">
                  {job.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#0F6E56]">Key Requirements:</div>
                  {job.requirements.slice(0, 2).map((req, i) => (
                    <div key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="text-[#0F6E56] font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400">Salary Package</span>
                  <div className="font-semibold text-gray-900 font-mono mt-0.5">{job.salaryRange}</div>
                </div>
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="px-4 py-2 bg-[#0F6E56] hover:bg-[#085041] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6-STEP RECRUITMENT APPLICATION FORM
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-4xl mx-auto animate-fade-in">
      {/* Form Header */}
      <div className="bg-[#0F6E56] text-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] bg-emerald-800 text-emerald-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t("📋 Job Application Form", "📋 வேலை விண்ணப்பப் படிவம்")}
            </span>
            <h2 className="text-2xl font-bold mt-2 font-display">
              {t("Jailaxmi Group — Staff Portal", "ஜெய்லக்ஷ்மி குரூப் — பணியாளர் போர்டல்")}
            </h2>
            <p className="text-xs text-emerald-100 mt-1 opacity-90">
              {t(
                "Please fill all required (*) fields accurately. Your application is saved securely and reviewed by our HR team.",
                "தேவையான அனைத்து (*) விவரங்களையும் துல்லியமாக நிரப்பவும். உங்கள் விண்ணப்பம் பாதுகாப்பாக சேமிக்கப்பட்டு மனிதவளக் குழுவால் பரிசீலிக்கப்படும்."
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Language Selector */}
            <div className="bg-emerald-950/40 p-0.5 rounded-lg border border-emerald-800/40 flex text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLangMode('english')}
                className={`px-2 py-1 rounded transition ${langMode === 'english' ? 'bg-white text-[#0F6E56]' : 'text-emerald-100 hover:text-white'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLangMode('tamil')}
                className={`px-2 py-1 rounded transition ${langMode === 'tamil' ? 'bg-white text-[#0F6E56]' : 'text-emerald-100 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLangMode('bilingual')}
                className={`px-2 py-1 rounded transition ${langMode === 'bilingual' ? 'bg-white text-[#0F6E56]' : 'text-emerald-100 hover:text-white'}`}
              >
                Bilingual
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setSelectedJob(null)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition flex-shrink-0"
            >
              {t("Cancel", "ரத்துசெய்")}
            </button>
          </div>
        </div>

        {/* Stepper Dot Indicator */}
        <div className="flex justify-center items-center gap-3 mt-6 border-t border-white/10 pt-4">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div 
              key={s} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                formStep === s 
                  ? 'bg-white ring-4 ring-white/20 scale-110' 
                  : formStep > s 
                    ? 'bg-emerald-300' 
                    : 'bg-emerald-800'
              }`}
            />
          ))}
        </div>

        {/* Stepper Title */}
        <div className="text-center text-xs font-bold text-emerald-100 mt-2 uppercase tracking-wide">
          {formStep === 1 && t("Step 1 of 6 — Position details", "படி 1 / 6 — பணியின் விவரங்கள்")}
          {formStep === 2 && t("Step 2 of 6 — Personal details", "படி 2 / 6 — தனிப்பட்ட விவரங்கள்")}
          {formStep === 3 && t("Step 3 of 6 — Academic credentials", "படி 3 / 6 — கல்வி தகுதிகள்")}
          {formStep === 4 && t("Step 4 of 6 — Family matrix & Technical skills", "படி 4 / 6 — குடும்ப மற்றும் தொழில்நுட்ப திறன்கள்")}
          {formStep === 5 && t("Step 5 of 6 — Professional Work Experience", "படி 5 / 6 — தொழில்முறை பணி அனுபவம்")}
          {formStep === 6 && t("Step 6 of 6 — References & Documents", "படி 6 / 6 — சான்றுகள் மற்றும் ஆவணங்கள்")}
        </div>
      </div>

      {/* Form Error Banner */}
      {errorMsg && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 p-4 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* STEP 1: POSITION DETAILS */}
        {formStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> {t("1. Position details", "1. பணியின் விவரங்கள்")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Department *", "துறை *")}</label>
                <select 
                  required
                  value={appliedDept} onChange={(e) => setAppliedDept(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                >
                  <option value="">{t("Select department", "துறையைத் தேர்ந்தெடுக்கவும்")}</option>
                  <option value="Sales">{t("Sales", "விற்பனை (Sales)")}</option>
                  <option value="Service">{t("Service", "சேவை (Service)")}</option>
                  <option value="Spares">{t("Spares", "உதிரிபாகங்கள் (Spares)")}</option>
                  <option value="Administration">{t("Administration", "நிர்வாகம் (Administration)")}</option>
                  <option value="HR">{t("HR", "மனிதவள மேம்பாடு (HR)")}</option>
                  <option value="Accounts">{t("Accounts", "கணக்குகள் (Accounts)")}</option>
                  <option value="Backend (Data Entry & Analysis)">{t("Backend (Data Entry & Analysis)", "பின்னணி தரவு உள்ளீடு (Backend)")}</option>
                  <option value="Customer Care">{t("Customer Care", "வாடிக்கையாளர் சேவை (Customer Care)")}</option>
                  <option value="Maintenance (Building & Machinery)">{t("Maintenance (Building & Machinery)", "பராமரிப்பு (Maintenance)")}</option>
                  <option value="Civil (Design & Construction)">{t("Civil (Design & Construction)", "சிவில் கட்டுமானம் (Civil)")}</option>
                  <option value="Trainer & Digital Marketing">{t("Trainer & Digital Marketing", "பயிற்சியாளர் & டிஜிட்டல் மார்க்கெட்டிங்")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Job title *", "பணியின் தலைப்பு *")}</label>
                <input 
                  type="text" required value={appliedTitle} onChange={(e) => setAppliedTitle(e.target.value)}
                  placeholder={t("e.g. Sales Executive", "எ.கா. விற்பனை அதிகாரி")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Location *", "பணிபுரியும் இடம் *")}</label>
                <input 
                  type="text" required value={appliedLocation} onChange={(e) => setAppliedLocation(e.target.value)}
                  placeholder={t("City / Branch", "நகரம் / கிளை")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL DETAILS */}
        {formStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4" /> {t("2. Candidate Demographics", "2. தனிப்பட்ட விவரங்கள்")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("First Name *", "முதல் பெயர் *")}</label>
                <input 
                  type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("e.g. Rajesh", "எ.கா. ராஜேஷ்")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Last Name / Suffix", "இறுதி பெயர் / விகுதி")}</label>
                <input 
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("e.g. Kumar Gounder", "எ.கா. குமார்")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Email Address *", "மின்னஞ்சல் முகவரி *")}</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("e.g. rajesh@gmail.com", "எ.கா. rajesh@gmail.com")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Phone / Mobile No. *", "தொலைபேசி / கைபேசி எண் *")}</label>
                <input 
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("e.g. +91 98765 43210", "எ.கா. +91 98765 43210")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Date of Birth *", "பிறந்த தேதி *")}</label>
                <input 
                  type="date" required value={dob} onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Age (Calculated)", "வயது (கணக்கிடப்பட்டது)")}</label>
                <input 
                  type="number" readOnly value={age} 
                  placeholder={t("Age", "வயது")} className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Blood Group *", "இரத்த வகை *")}</label>
                <select 
                  required
                  value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                >
                  <option value="">{t("Select Blood Group", "இரத்த வகையைத் தேர்ந்தெடுக்கவும்")}</option>
                  <option value="A1+ve">A1+ve (A1+)</option>
                  <option value="A1-ve">A1-ve (A1-)</option>
                  <option value="A+ve">A+ve</option>
                  <option value="A-ve">A-ve</option>
                  <option value="B+ve">B+ve</option>
                  <option value="B-ve">B-ve</option>
                  <option value="AB+ve">AB+ve</option>
                  <option value="AB-ve">AB-ve</option>
                  <option value="O+ve">O+ve</option>
                  <option value="O-ve">O-ve</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Gender *", "பாலினம் *")}</label>
                <select 
                  value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                >
                  <option value="Male">{t("Male", "ஆண் (Male)")}</option>
                  <option value="Female">{t("Female", "பெண் (Female)")}</option>
                  <option value="Prefer not to say">{t("Prefer not to say", "குறிப்பிட விரும்பவில்லை")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Marital Status", "திருமண நிலை")}</label>
                <select 
                  value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                >
                  <option value="Single">{t("Single", "திருமணமாகாதவர் (Single)")}</option>
                  <option value="Married">{t("Married", "திருமணமானவர் (Married)")}</option>
                  <option value="Divorced">{t("Divorced", "விவாகரத்தானவர் (Divorced)")}</option>
                  <option value="Widowed">{t("Widowed", "விதவை (Widowed)")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Aadhar Card Number *", "ஆதார் அட்டை எண் *")}</label>
                <input 
                  type="text" required value={aadhar} onChange={(e) => setAadhar(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("PAN Card Number", "பான் கார்டு எண்")}</label>
                <input 
                  type="text" value={pan} onChange={(e) => setPan(e.target.value)}
                  placeholder="e.g. ABCDE1234F" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t("Religion", "மதம்")}</label>
                <input 
                  type="text" value={religion} onChange={(e) => setReligion(e.target.value)}
                  placeholder={t("e.g. Hindu / Muslim / Christian", "எ.கா. இந்து / முஸ்லிம் / கிறிஸ்தவர்")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t("Residential Address (Current)", "தற்போதைய வீட்டு முகவரி")}</label>
              <textarea 
                rows={2} value={residentialAddress} onChange={(e) => setResidentialAddress(e.target.value)}
                placeholder={t("Full current address", "முழு தற்போதைய முகவரி")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600">{t("Permanent Address", "நிரந்தர முகவரி")}</label>
                <button 
                  type="button" 
                  onClick={() => setPermanentAddress(residentialAddress)}
                  className="text-[10px] text-[#0F6E56] font-bold underline"
                >
                  {t("Same as Current Address", "தற்போதைய முகவரியைப் போன்றது")}
                </button>
              </div>
              <textarea 
                rows={2} value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder={t("Full permanent address", "முழு நிரந்தர முகவரி")} className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: EDUCATION DETAILS */}
        {formStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> {t("3. Academic Credentials", "3. கல்வித் தகுதிகள்")}
            </h3>

            {/* PG (Post Graduation) */}
            <div className="space-y-2 border-l-2 border-emerald-600 pl-3">
              <div className="text-xs font-bold text-emerald-800">
                {t("Post Graduation Details (M.Tech, MBA, M.Com, etc.) (Optional)", "முதுகலை பட்டப்படிப்பு விவரங்கள் (M.Tech, MBA, M.Com, முதலியன) (விருப்பத்திற்குரியது)")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" placeholder={t("PG Degree Name", "முதுகலை பட்டத்தின் பெயர்")} value={pgDegree} onChange={(e) => setPgDegree(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("College / University", "கல்லூரி / பல்கலைக்கழகம்")} value={pgCollege} onChange={(e) => setPgCollege(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Passing Year (YYYY)", "தேர்ச்சி பெற்ற ஆண்டு (YYYY)")} value={pgYear} onChange={(e) => setPgYear(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Final score % or CGPA", "இறுதி மதிப்பெண் % அல்லது CGPA")} value={pgMarks} onChange={(e) => setPgMarks(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            {/* UG (Under Graduation) - NOT MANDATORY */}
            <div className="space-y-2 border-l-2 border-[#0F6E56] pl-3">
              <div className="text-xs font-bold text-[#0F6E56]">
                {t("Under Graduation Details (B.Tech, B.Com, BBA, B.Sc) (Optional)", "இளங்கலை பட்டப்படிப்பு விவரங்கள் (B.Tech, B.Com, BBA, B.Sc) (விருப்பத்திற்குரியது)")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" placeholder={t("UG Degree Name", "இளங்கலை பட்டத்தின் பெயர்")} value={ugDegree} onChange={(e) => setUgDegree(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("College / University", "கல்லூரி / பல்கலைக்கழகம்")} value={ugCollege} onChange={(e) => setUgCollege(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Passing Year (YYYY)", "தேர்ச்சி பெற்ற ஆண்டு (YYYY)")} value={ugYear} onChange={(e) => setUgYear(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Final Score %", "இறுதி மதிப்பெண் %")} value={ugMarks} onChange={(e) => setUgMarks(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            {/* Diploma */}
            <div className="space-y-2 border-l-2 border-amber-500 pl-3">
              <div className="text-xs font-bold text-amber-800">
                {t("Diploma Credentials (if any)", "பட்டயப் படிப்பு விவரங்கள் (ஏதேனும் இருப்பின்)")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" placeholder={t("Diploma Field", "பட்டயப் படிப்புத் துறை")} value={diplomaInstitute} onChange={(e) => setDiplomaInstitute(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Board / Institute", "வாரியம் / நிறுவனம்")} value={diplomaBoard} onChange={(e) => setDiplomaBoard(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Passing Year (YYYY)", "தேர்ச்சி பெற்ற ஆண்டு (YYYY)")} value={diplomaYear} onChange={(e) => setDiplomaYear(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder={t("Final Marks", "இறுதி மதிப்பெண் %")} value={diplomaMarks} onChange={(e) => setDiplomaMarks(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            {/* HSC School (Higher Secondary Certificate) */}
            <div className="space-y-2 border-l-2 border-blue-500 pl-3">
              <div className="text-xs font-bold text-blue-800">
                {t("Higher Secondary Details (HSC / 12th) *", "மேல்நிலைக் கல்வி விவரங்கள் (HSC / 12-ஆம் வகுப்பு) *")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" required placeholder={t("School Name *", "பள்ளியின் பெயர் *")} value={hscSchool} onChange={(e) => setHscSchool(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("Board (CBSE, State, etc.) *", "கல்வி வாரியம் (CBSE, மாநில, முதலியன) *")} value={hscBoard} onChange={(e) => setHscBoard(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("Passing Year (YYYY) *", "தேர்ச்சி பெற்ற ஆண்டு (YYYY) *")} value={hscYear} onChange={(e) => setHscYear(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("HSC Marks % *", "மதிப்பெண் சதவீதம் % *")} value={hscMarks} onChange={(e) => setHscMarks(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            {/* SSLC School */}
            <div className="space-y-2 border-l-2 border-gray-500 pl-3">
              <div className="text-xs font-bold text-gray-700">
                {t("Schooling Details (SSLC / 10th / Matriculation) *", "பள்ளி விவரங்கள் (SSLC / 10-ஆம் வகுப்பு) *")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" required placeholder={t("School Name *", "பள்ளியின் பெயர் *")} value={sslcSchool} onChange={(e) => setSslcSchool(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("Board (CBSE, State, etc.) *", "கல்வி வாரியம் (CBSE, மாநில, முதலியன) *")} value={sslcBoard} onChange={(e) => setSslcBoard(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("Passing Year (YYYY) *", "தேர்ச்சி பெற்ற ஆண்டு (YYYY) *")} value={sslcYear} onChange={(e) => setSslcYear(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" required placeholder={t("SSLC Marks % *", "மதிப்பெண் சதவீதம் % *")} value={sslcMarks} onChange={(e) => setSslcMarks(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FAMILY & SKILLS */}
        {formStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Users2 className="w-4 h-4" /> 4. Family Matrix & Technical Skills
            </h3>

            {/* Technical Skills */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Technical / Professional Skills <span className="text-red-500">*</span></label>
              <input 
                type="text" required value={technicalSkills} onChange={(e) => setTechnicalSkills(e.target.value)}
                placeholder="e.g. Invoicing, Site Management, Concrete Testing, AutoCAD, Tally ERP (comma separated)" 
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
              />
            </div>

            {/* Parent Details */}
            <div className="space-y-4 bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <div className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider mb-2 border-b border-gray-200 pb-1.5 flex items-center justify-between">
                <span>{t("Parents Demographic Record *", "பெற்றோரின் விவரங்கள் *")}</span>
                <span className="text-[10px] text-red-500 font-bold">{t("* Names & Mobile numbers are mandatory", "* பெயர்கள் & கைபேசி எண்கள் கட்டாயமாகும்")}</span>
              </div>
              
              {/* Father Details Row */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-gray-700 border-l-2 border-[#0F6E56] pl-2 flex items-center justify-between">
                  <span>{t("Father Details *", "தந்தையின் விவரங்கள் *")}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Father Name *", "தந்தையின் பெயர் *")}</label>
                    <input 
                      type="text" required placeholder={t("Father Name *", "தந்தையின் பெயர் *")} value={fatherName} onChange={(e) => setFatherName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Age", "வயது")}</label>
                    <input 
                      type="text" placeholder={t("Age", "வயது")} value={fatherAge} onChange={(e) => setFatherAge(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Mobile Number *", "கைபேசி எண் *")}</label>
                    <input 
                      type="tel" required placeholder={t("Mobile Number *", "கைபேசி எண் *")} value={fatherMobile} onChange={(e) => setFatherMobile(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Employment", "வேலை")}</label>
                    <input 
                      type="text" placeholder={t("Employment", "வேலை")} value={fatherEmp} onChange={(e) => setFatherEmp(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Monthly Income", "மாத வருமானம்")}</label>
                    <input 
                      type="text" placeholder={t("Monthly Income", "மாத வருமானம்")} value={fatherIncome} onChange={(e) => setFatherIncome(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Details Row */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="text-[11px] font-bold text-gray-700 border-l-2 border-[#0F6E56] pl-2 flex items-center justify-between">
                  <span>{t("Mother Details *", "தாயின் விவரங்கள் *")}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Mother Name *", "தாயின் பெயர் *")}</label>
                    <input 
                      type="text" required placeholder={t("Mother Name *", "தாயின் பெயர் *")} value={motherName} onChange={(e) => setMotherName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Age", "வயது")}</label>
                    <input 
                      type="text" placeholder={t("Age", "வயது")} value={motherAge} onChange={(e) => setMotherAge(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Mobile Number *", "கைபேசி எண் *")}</label>
                    <input 
                      type="tel" required placeholder={t("Mobile Number *", "கைபேசி எண் *")} value={motherMobile} onChange={(e) => setMotherMobile(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Employment", "வேலை")}</label>
                    <input 
                      type="text" placeholder={t("Employment", "வேலை")} value={motherEmp} onChange={(e) => setMotherEmp(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Monthly Income", "மாத வருமானம்")}</label>
                    <input 
                      type="text" placeholder={t("Monthly Income", "மாத வருமானம்")} value={motherIncome} onChange={(e) => setMotherIncome(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Siblings Detail */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("No. of Brothers", "சகோதரர்களின் எண்ணிக்கை")}</label>
                  <input 
                    type="number" value={brothersCount} onChange={(e) => setBrothersCount(e.target.value)}
                    placeholder="0" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("Brothers Job & Location Details", "சகோதரர்களின் பணி & இருப்பிட விவரங்கள்")}</label>
                  <input 
                    type="text" value={brothersDetail} onChange={(e) => setBrothersDetail(e.target.value)}
                    placeholder="e.g. Balbir Singh - Married - Accountant in Ludhiana" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("Brothers Monthly Income", "சகோதரர்களின் மாத வருமானம்")}</label>
                  <input 
                    type="text" value={sibling1Income} onChange={(e) => setSibling1Income(e.target.value)}
                    placeholder="e.g. ₹45,000" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("No. of Sisters", "சகோதரிகளின் எண்ணிக்கை")}</label>
                  <input 
                    type="number" value={sistersCount} onChange={(e) => setSistersCount(e.target.value)}
                    placeholder="0" className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("Sisters Job & Location Details", "சகோதரிகளின் பணி & இருப்பிட விவரங்கள்")}</label>
                  <input 
                    type="text" value={sistersDetail} onChange={(e) => setSistersDetail(e.target.value)}
                    placeholder="e.g. Pooja Devi - Married - Homemaker at Delhi" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{t("Sisters Monthly Income", "சகோதரிகளின் மாத வருமானம்")}</label>
                  <input 
                    type="text" value={sibling2Income} onChange={(e) => setSibling2Income(e.target.value)}
                    placeholder="e.g. ₹30,000" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>
            </div>

            {/* Spouse Detail */}
            <div className="space-y-3 bg-rose-50/50 border border-rose-100 p-4 rounded-xl">
              <div className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 border-b border-rose-100 pb-1.5">
                {t("Spouse Details", "துணைவியார் / கணவர் விவரங்கள்")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-rose-900/80 mb-1">{t("Spouse Name", "துணைவியார் / கணவர் பெயர்")}</label>
                  <input 
                    type="text" placeholder={t("Spouse Name", "துணைவியார் / கணவர் பெயர்")} value={wifeName} onChange={(e) => setWifeName(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-900/80 mb-1">{t("Age", "வயது")}</label>
                  <input 
                    type="text" placeholder={t("Age", "வயது")} value={wifeAge} onChange={(e) => setWifeAge(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-900/80 mb-1">{t("Spouse Mobile No", "கைபேசி எண்")}</label>
                  <input 
                    type="tel" placeholder={t("Spouse Mobile No", "கைபேசி எண்")} value={wifeMobile} onChange={(e) => setWifeMobile(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-900/80 mb-1">{t("Employment", "வேலை")}</label>
                  <input 
                    type="text" placeholder={t("Employment", "வேலை")} value={wifeEmp} onChange={(e) => setWifeEmp(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose-900/80 mb-1">{t("Monthly Income", "மாத வருமானம்")}</label>
                  <input 
                    type="text" placeholder={t("Monthly Income", "மாத வருமானம்")} value={wifeIncome} onChange={(e) => setWifeIncome(e.target.value)}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:border-rose-300"
                  />
                </div>
              </div>

              {/* Children details */}
              <div className="pt-3 border-t border-rose-100/60 mt-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-rose-950">Children Roster List</label>
                  <button 
                    type="button" onClick={handleAddChild}
                    className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Child
                  </button>
                </div>

                {childrenDetails.length === 0 ? (
                  <div className="text-center py-2 text-gray-400 text-[11px] italic">No children listed.</div>
                ) : (
                  <div className="space-y-2">
                    {childrenDetails.map((child, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-white border border-rose-100 p-2 rounded-lg">
                        <input 
                          type="text" required placeholder="Child's Full Name" value={child.name}
                          onChange={(e) => handleUpdateChild(idx, 'name', e.target.value)}
                          className="border border-gray-200 rounded p-1 text-xs outline-none focus:border-rose-300"
                        />
                        <select 
                          value={child.gender} onChange={(e) => handleUpdateChild(idx, 'gender', e.target.value)}
                          className="border border-gray-200 rounded p-1 text-xs outline-none"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <input 
                          type="number" required placeholder="Age" value={child.age}
                          onChange={(e) => handleUpdateChild(idx, 'age', e.target.value)}
                          className="border border-gray-200 rounded p-1 text-xs outline-none focus:border-rose-300"
                        />
                        <button 
                          type="button" onClick={() => handleRemoveChild(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded flex items-center justify-center justify-self-end w-8 h-8 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: WORK EXPERIENCE */}
        {formStep === 5 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
              <h3 className="text-sm uppercase font-bold tracking-wider text-[#0F6E56] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 5. Professional Work Experience
              </h3>
              <button 
                type="button" onClick={handleAddExperience}
                className="px-3 py-1.5 bg-[#f0faf6] hover:bg-emerald-50 text-[#0F6E56] text-xs font-bold border border-emerald-200 rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job Record
              </button>
            </div>

            {workExperience.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                No previous job records. Tick "Fresh Graduate" or click "Add Job Record" if experienced.
              </div>
            ) : (
              <div className="space-y-4">
                {workExperience.map((job, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative space-y-3">
                    <button 
                      type="button" onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider">Job Roster #{idx + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input 
                        type="text" required placeholder="Company Name" value={job.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="Company Location" value={job.companyLocation}
                        onChange={(e) => handleUpdateExperience(idx, 'companyLocation', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                      <input 
                        type="text" required placeholder="Designation" value={job.designation}
                        onChange={(e) => handleUpdateExperience(idx, 'designation', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />

                      <input 
                        type="text" required placeholder="From Date (MM/YYYY)" value={job.from}
                        onChange={(e) => handleUpdateExperience(idx, 'from', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                      <input 
                        type="text" required placeholder="To Date (or Present)" value={job.to}
                        onChange={(e) => handleUpdateExperience(idx, 'to', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="Monthly Salary (e.g. ₹25,000)" value={job.salary}
                        onChange={(e) => handleUpdateExperience(idx, 'salary', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" placeholder="Reason for Leaving" value={job.reason}
                        onChange={(e) => handleUpdateExperience(idx, 'reason', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                      <input 
                        type="text" placeholder="Key Responsibility or Achievement" value={job.achievement}
                        onChange={(e) => handleUpdateExperience(idx, 'achievement', e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 6: REFERENCES & DOCUMENTS */}
        {formStep === 6 && (
          <div className="space-y-6">
            {/* References */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Candidate Reference Checks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input 
                  type="text" placeholder="Reference Person Name" value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="text" placeholder="Position / Company" value={refPosition}
                  onChange={(e) => setRefPosition(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="tel" placeholder="Mobile / Phone" value={refMobile}
                  onChange={(e) => setRefMobile(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
                <input 
                  type="email" placeholder="Email Address" value={refEmail}
                  onChange={(e) => setRefEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                />
              </div>
            </div>

            {/* Miscellaneous */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Other Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("How did you hear about us?", "எங்களை எவ்வாறு கேள்விப்பட்டீர்கள்?")}</label>
                  <select 
                    value={hearSource} onChange={(e) => setHearSource(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  >
                    <option value="Indeed">Indeed</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Newspaper Advertisement">{t("Newspaper Advertisement", "செய்தித்தாள் விளம்பரம்")}</option>
                    <option value="Employee Referral">{t("Employee Referral", "ஊழியர் பரிந்துரை")}</option>
                    <option value="Direct Application">{t("Direct Application", "நேரடி விண்ணப்பம்")}</option>
                    <option value="Others">{t("Others", "மற்றவை")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Vehicles Owned", "உங்களிடம் உள்ள வாகனங்கள்")}</label>
                  <select 
                    value={vehicles} onChange={(e) => setVehicles(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  >
                    <option value="">{t("Select option", "விருப்பத்தைத் தேர்ந்தெடுக்கவும்")}</option>
                    <option value="Two-wheeler">{t("Two-wheeler", "இரு சக்கர வாகனம் (Two-wheeler)")}</option>
                    <option value="Four-wheeler">{t("Four-wheeler", "நான்கு சக்கர வாகனம் (Four-wheeler)")}</option>
                    <option value="Both">{t("Both (Two-wheeler & Four-wheeler)", "இரண்டும் (இரு & நான்கு சக்கர வாகனம்)")}</option>
                    <option value="None">{t("None", "ஏதுமில்லை")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">{t("Driving Licence Number", "ஓட்டுநர் உரிம எண்")}</label>
                  <input 
                    type="text" placeholder={t("e.g. MH-31-A-XXXX", "எ.கா. MH-31-A-XXXX")} value={licenceNo}
                    onChange={(e) => setLicenceNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
              </div>

              {hearSource === 'Others' && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Please specify source <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required value={otherHearSource} onChange={(e) => setOtherHearSource(e.target.value)}
                    placeholder="e.g. Job Fair, Banner, Friends"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>
              )}
            </div>

            {/* Mandatory Uploads */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#0F6E56] border-b border-gray-100 pb-1 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4" /> Required Upload Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Passport Photo */}
                <div className="border-2 border-dashed border-gray-200 hover:border-[#0F6E56] rounded-xl p-6 text-center transition bg-gray-50/50">
                  <label className="block cursor-pointer">
                    <input 
                      type="file" accept="image/*" className="hidden" 
                      onChange={(e) => handleFileChange(e, 'photo')}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#0F6E56]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Passport Size Photo <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-gray-400 font-medium">Click to upload JPG/PNG image</span>
                      {photoFileName ? (
                        <div className="text-emerald-700 text-xs font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded mt-2 border border-emerald-200">
                          ✓ {photoFileName}
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold mt-1">Required</span>
                      )}
                    </div>
                  </label>
                </div>

                {/* Resume File */}
                <div className="border-2 border-dashed border-gray-200 hover:border-[#0F6E56] rounded-xl p-6 text-center transition bg-gray-50/50">
                  <label className="block cursor-pointer">
                    <input 
                      type="file" accept=".pdf,.doc,.docx" className="hidden" 
                      onChange={(e) => handleFileChange(e, 'resume')}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#0F6E56]" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Resume / CV Document <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-gray-400 font-medium">Click to upload PDF or DOCX file</span>
                      {resumeFileName ? (
                        <div className="text-emerald-700 text-xs font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded mt-2 border border-emerald-200">
                          ✓ {resumeFileName}
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold mt-1">Required</span>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submission notice */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#064e3b] rounded-lg text-[11px] flex items-start gap-2">
              <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-[#0F6E56] focus:ring-[#0F6E56]" />
              <div>
                <strong>Declaration:</strong> I hereby declare that all entries, personal details, education marks, and job profiles listed above are authentic and correct to the best of my knowledge. I understand any misrepresentation leads to immediate rejection of candidate profile.
              </div>
            </div>
          </div>
        )}

        {/* Buttons footer */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
          {formStep > 1 ? (
            <button 
              type="button" onClick={handlePrev}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition"
            >
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {formStep < 6 ? (
            <button 
              type="button" onClick={handleNext}
              className="px-5 py-2.5 bg-[#0F6E56] hover:bg-[#085041] text-white font-bold text-xs rounded-lg flex items-center gap-1 transition"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white font-bold text-xs rounded-lg transition shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting Profile...' : 'Submit Final Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
