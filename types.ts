export interface ExperienceRecord {
  company: string;
  companyLocation?: string;
  designation: string;
  from: string;
  to: string;
  salary?: string;
  reason?: string;
  achievement?: string;
}

export interface ChildDetail {
  name: string;
  gender: string;
  age: string;
}

export interface CandidateDocument {
  name: string;
  url: string;
  uploadedBy: string;
  uploadedDate: string;
  stage?: string;
}

export interface StatusTimelineEntry {
  status: string;
  timestamp: string;
  by: string;
  notes?: string;
}

export interface AuditLogEntry {
  action: string;
  timestamp: string;
  by: string;
  oldVal?: string;
  newVal?: string;
  field?: string;
  recipients?: string;
  notes?: string;
}

export interface InterviewStageData {
  interviewer: string;
  date: string;
  status: string;
  rating: string;
  notes: string;
  completedBy?: string;
  timestamp?: string;
  joiningDate?: string; // SDC/Dept specific
}

export interface JobApplication {
  id: string; // also serves as Ref No
  refNo: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  status: 'New' | 'Review' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Joined';
  
  // Job Specifics
  department: string;
  jobTitle: string;
  location: string;
  
  // Personal Details
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  bloodGroup: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  aadhar: string;
  pan: string;
  residentialAddress: string;
  permanentAddress: string;

  // Education Details
  pgDegree?: string;
  pgCollege?: string;
  pgYear?: string;
  pgMarks?: string;
  ugDegree?: string;
  ugCollege?: string;
  ugYear?: string;
  ugMarks?: string;
  diplomaInstitute?: string;
  diplomaBoard?: string;
  diplomaYear?: string;
  diplomaMarks?: string;
  sslcSchool?: string;
  sslcBoard?: string;
  sslcYear?: string;
  sslcMarks?: string;
  hscSchool?: string;
  hscBoard?: string;
  hscYear?: string;
  hscMarks?: string;

  // Skills & Family Details
  technicalSkills: string;
  fatherName: string;
  fatherAge?: string;
  fatherEmp?: string;
  fatherMobile?: string;
  fatherIncome?: string;
  motherName: string;
  motherAge?: string;
  motherEmp?: string;
  motherMobile?: string;
  motherIncome?: string;
  brothersCount?: string;
  brothersDetail?: string;
  sistersCount?: string;
  sistersDetail?: string;
  sibling1Income?: string;
  sibling2Income?: string;
  wifeName?: string;
  wifeAge?: string;
  wifeEmp?: string;
  wifeMobile?: string;
  wifeIncome?: string;
  noOfChildren?: string;
  childrenDetails?: ChildDetail[]; // parsed from Children Details (JSON)
  workExperience?: ExperienceRecord[]; // parsed from Work Experience (JSON)

  // Reference & Others
  refName?: string;
  refPosition?: string;
  refMobile?: string;
  refEmail?: string;
  hearSource?: string;
  vehicles?: string;
  licenceNo?: string;

  // Documents
  photoFile?: string; // URL
  resumeFile?: string; // URL
  additionalDocuments?: CandidateDocument[]; // parsed from Additional Documents (JSON)

  // Timelines & Audit
  statusTimeline?: StatusTimelineEntry[];
  auditLog?: AuditLogEntry[];

  // Interview Schedule
  interviewScheduleDate?: string;
  interviewScheduleTime?: string;
  interviewMode?: string;
  interviewVenue?: string;
  meetingLink?: string;

  // Panel assignments
  hrInterviewer?: string;
  hrDate?: string;
  sdc1Interviewer?: string;
  sdc1Date?: string;
  sdc2Interviewer?: string;
  sdc2Date?: string;
  deptInterviewer?: string;
  deptDate?: string;
  mgmtInterviewer?: string;
  mgmtDate?: string;

  // Multi-stage evaluation data
  hrStage?: InterviewStageData;
  sdc1Stage?: InterviewStageData;
  sdc2Stage?: InterviewStageData;
  deptStage?: InterviewStageData;
  mgmtStage?: InterviewStageData;

  // Email Tracking Info
  panelEmailSent?: 'Yes' | 'No';
  panelEmailSentDate?: string;
  panelEmailSentBy?: string;
  panelEmailRecipients?: string;
  panelNotificationStatus?: string;

  // AI evaluation
  aiScore?: number;
  aiSummary?: string;
  aiQuestions?: string[];
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceRequired: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange: string;
}

export interface PortalUser {
  uid: string; // Email / Username
  name: string;
  pwd?: string; // Password
  role: 'md' | 'hr' | 'sdc1' | 'sdc2' | 'manager' | 'mgmt';
  roleLabel: string; // Designation e.g. "Managing Director"
  dept?: string; // Assigned department for "manager"
}
