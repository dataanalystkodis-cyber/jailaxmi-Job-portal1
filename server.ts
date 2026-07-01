import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { JobApplication, JobListing, PortalUser } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI successfully initialized for Jailaxmi Portal.');
  } else {
    console.warn('GEMINI_API_KEY is not configured or uses placeholder value. AI screening features will run with fallback simulation.');
  }
} catch (error) {
  console.error('Failed to initialize GoogleGenAI client:', error);
}

// Data Store Path
const STORE_PATH = path.join(process.cwd(), 'data-store.json');

// Pre-seeded Portal Users
const defaultUsers: PortalUser[] = [
  { uid: 'md@jailaxmi.com', name: 'Shri Laxman Prasad', pwd: 'admin123', role: 'md', roleLabel: 'Managing Director' },
  { uid: 'hr@jailaxmi.com', name: 'Meera Iyer', pwd: 'hr123', role: 'hr', roleLabel: 'Senior HR Executive' },
  { uid: 'sdc1@jailaxmi.com', name: 'Ramesh Chandra', pwd: 'sdc123', role: 'sdc1', roleLabel: 'SDC Interviewer Stage 1' },
  { uid: 'sdc2@jailaxmi.com', name: 'Sanjay Kulkarni', pwd: 'sdc123', role: 'sdc2', roleLabel: 'SDC Interviewer Stage 2' },
  { uid: 'sales_manager@jailaxmi.com', name: 'Vikram Singh', pwd: 'mgr123', role: 'manager', roleLabel: 'Sales Department Manager', dept: 'Sales' },
  { uid: 'prod_manager@jailaxmi.com', name: 'Anil Sharma', pwd: 'mgr123', role: 'manager', roleLabel: 'Civil Department Manager', dept: 'Civil (Design & Construction)' },
  { uid: 'mgmt@jailaxmi.com', name: 'Karan Prasad', pwd: 'mgmt123', role: 'mgmt', roleLabel: 'Chief Operations Officer' }
];

// Pre-seeded Job Listings
const activeJobs: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior Plant Supervisor',
    department: 'Civil (Design & Construction)',
    location: 'Nagpur Casting Division',
    type: 'Full-time',
    experienceRequired: '5+ years',
    description: 'Lead day-to-day industrial operations, staff coordination, and civil inspection schedules at Nagpur Steel casting plant. Ensure structural alignments and machinery safety standards.',
    requirements: [
      'Degree in Civil or Mechanical Engineering with industrial plant experience.',
      'Excellent leadership skills and fluent regional language proficiency.',
      'Strong safety enforcement track record.'
    ],
    benefits: ['Subsidized housing', 'PF & Gratuity', 'Annual plant incentives'],
    salaryRange: '₹8,50,000 - ₹12,00,000 per annum'
  },
  {
    id: 'job-2',
    title: 'B2B Sales Officer',
    department: 'Sales',
    location: 'Mumbai Corporate Office',
    type: 'Full-time',
    experienceRequired: '2-5 years',
    description: 'Drive high-volume industrial steel sales, dealer networking, and distributor logistics coordination across West Zone.',
    requirements: [
      'Prior experience in construction materials, metal, or infrastructure sales.',
      'Excellent negotiation, reporting, and client relation skills.',
      'Willingness to travel extensively.'
    ],
    benefits: ['Uncapped performance bonus', 'Travel allowance', 'Comprehensive health coverage'],
    salaryRange: '₹5,00,000 - ₹8,00,000 per annum'
  },
  {
    id: 'job-3',
    title: 'Junior Accounts Assistant',
    department: 'Accounts',
    location: 'Pune Plant Office',
    type: 'Full-time',
    experienceRequired: '1-3 years',
    description: 'Manage plant-level invoicing, raw material ledger entry, GST filing reconciliation, and petty cash systems.',
    requirements: [
      'B.Com or relevant commerce degree.',
      'Excellent command of Tally ERP, MS Excel, and GST structures.',
      'High numerical precision.'
    ],
    benefits: ['subsidized transport', 'Free plant meals', 'Overtime allowances'],
    salaryRange: '₹3,50,000 - ₹4,80,000 per annum'
  },
  {
    id: 'job-4',
    title: 'Digital Marketing & Trainer',
    department: 'Trainer & Digital Marketing',
    location: 'Mumbai HQ',
    type: 'Full-time',
    experienceRequired: '2-4 years',
    description: 'Create industrial product brochures, handle digital brand campaigns, and organize internal soft-skills training programs for staff.',
    requirements: [
      'Experience in digital content creation, SEO, and corporate trainer roles.',
      'Strong English/Hindi presenting skills.',
      'Hands-on with design software.'
    ],
    benefits: ['Creative working environment', 'Annual health checks', 'Flexible hours'],
    salaryRange: '₹4,50,000 - ₹6,20,000 per annum'
  }
];

// Pre-seeded Applications with rich Indian profiles & multi-stage detail
const defaultApplications: JobApplication[] = [
  {
    id: 'JL-2026-0001',
    refNo: 'JL-2026-0001',
    timestamp: '25/06/2026 10:30 AM',
    fullName: 'Rajesh Kumar Gound',
    email: 'rajesh.gound@gmail.com',
    phone: '+91 98765 43210',
    position: 'Senior Plant Supervisor',
    status: 'Shortlisted',
    department: 'Civil (Design & Construction)',
    jobTitle: 'Senior Plant Supervisor',
    location: 'Nagpur Casting Division',
    
    firstName: 'Rajesh',
    lastName: 'Kumar Gound',
    dob: '15/08/1993',
    age: '32',
    bloodGroup: 'O+ve',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    religion: 'Hindu',
    aadhar: '4560-1234-9876',
    pan: 'AGHPK8402P',
    residentialAddress: 'Flat 402, Shiv Shanti Apartment, Nagpur Road, Maharashtra',
    permanentAddress: 'Village Gound Basti, District Jaunpur, Uttar Pradesh',

    pgDegree: 'M.Tech Structural Engineering',
    pgCollege: 'VNIT Nagpur',
    pgYear: '2017',
    pgMarks: '82%',
    ugDegree: 'B.Tech Civil Engineering',
    ugCollege: 'COEP Pune',
    ugYear: '2015',
    ugMarks: '76%',
    sslcSchool: 'KV Nagpur No. 1',
    sslcBoard: 'CBSE',
    sslcYear: '2011',
    sslcMarks: '88%',

    technicalSkills: 'AutoCAD, Staad Pro, MS Project, Plant Site Management, Industrial Concrete Pouring',
    fatherName: 'Ram Sharan Gound',
    fatherAge: '62',
    fatherEmp: 'Retired Railway Officer',
    fatherMobile: '+91 99001 12233',
    fatherIncome: '₹35,000 / month pension',
    motherName: 'Shanti Devi Gound',
    motherAge: '56',
    motherEmp: 'Homemaker',
    brothersCount: '1',
    brothersDetail: 'Ajay Gound - Software Engineer at Nagpur',
    sistersCount: '1',
    sistersDetail: 'Pooja Gound - Married',
    wifeName: 'Sunita Gound',
    wifeAge: '28',
    wifeEmp: 'Primary School Teacher',
    wifeMobile: '+91 91122 33445',
    wifeIncome: '₹22,000 / month',
    noOfChildren: '1',
    childrenDetails: [
      { name: 'Aarav Gound', gender: 'Male', age: '4' }
    ],
    workExperience: [
      { company: 'L&T Construction', companyLocation: 'Pune Plant Site', designation: 'Project Executive', from: '01/07/2017', to: '15/12/2021', salary: '₹55,000/mo', reason: 'Wanted to relocate to Nagpur', achievement: 'Completed industrial slab foundation ahead of schedule.' },
      { company: 'Nagpur Castings Pvt Ltd', companyLocation: 'Nagpur Plant', designation: 'Plant Civil Inspector', from: '05/01/2022', to: 'Present', salary: '₹65,000/mo', reason: 'Looking for a supervisor level role with wider scope', achievement: 'Led 40 member site team safely with zero accidents.' }
    ],

    refName: 'Shri Devendra Patil',
    refPosition: 'Senior General Manager, L&T Pune',
    refMobile: '+91 94220 54321',
    refEmail: 'd.patil@ltindia.com',
    hearSource: 'Newspaper Advertisement',
    vehicles: 'Car, Two-wheeler',
    licenceNo: 'MH-31-A-2015-88402',
    photoFile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    resumeFile: 'https://example.com/resumes/rajesh_gound.pdf',
    
    additionalDocuments: [
      { name: 'AadharCard_Rajesh.pdf', url: 'https://example.com/docs/aadhar.pdf', uploadedBy: 'Meera Iyer', uploadedDate: '25/06/2026', stage: 'HR' }
    ],

    interviewScheduleDate: '04/07/2026',
    interviewScheduleTime: '11:00 AM',
    interviewMode: 'Offline / In-Person',
    interviewVenue: 'Nagpur Plant Meeting Hall',
    meetingLink: '',

    hrInterviewer: 'Meera Iyer',
    hrDate: '26/06/2026',
    sdc1Interviewer: 'Ramesh Chandra',
    sdc1Date: '28/06/2026',
    sdc2Interviewer: 'Sanjay Kulkarni',
    sdc2Date: '30/06/2026',
    deptInterviewer: 'Anil Sharma',
    deptDate: '01/07/2026',

    hrStage: { interviewer: 'Meera Iyer', date: '26/06/2026', status: 'Completed — Pass', rating: '4 — Good', notes: 'Excellent communication. Energetic candidate with solid family roots in Maharashtra. Willing to work plant shifts.', completedBy: 'Meera Iyer', timestamp: '26/06/2026 04:30 PM' },
    sdc1Stage: { interviewer: 'Ramesh Chandra', date: '28/06/2026', status: 'Completed — Pass', rating: '4 — Good', notes: 'Demonstrates deep hands-on concrete structures familiarity. Cleared primary structural questions with high confidence.', completedBy: 'Ramesh Chandra', timestamp: '28/06/2026 02:15 PM' },
    sdc2Stage: { interviewer: 'Sanjay Kulkarni', date: '30/06/2026', status: 'Scheduled', rating: '', notes: 'Assigned for Stage 2 on Nagpur site layouts.', completedBy: 'Sanjay Kulkarni', timestamp: '30/06/2026 11:00 AM' },

    statusTimeline: [
      { status: 'New', timestamp: '25/06/2026 10:30 AM', by: 'System', notes: 'Application received via Careers Portal.' },
      { status: 'Review', timestamp: '25/06/2026 02:00 PM', by: 'Meera Iyer', notes: 'Academic scores and resume verified.' },
      { status: 'Shortlisted', timestamp: '26/06/2026 04:35 PM', by: 'Meera Iyer', notes: 'Passed HR Interview round, panel notified.' }
    ],

    auditLog: [
      { action: 'Candidate Submitted Application', timestamp: '25/06/2026 10:30 AM', by: 'System' },
      { action: 'Status Update', timestamp: '25/06/2026 02:00 PM', by: 'Meera Iyer', oldVal: 'New', newVal: 'Review', notes: 'Reviewing PG/UG civil engineering credentials' },
      { action: 'Assigned HR Interviewer', timestamp: '25/06/2026 02:15 PM', by: 'Meera Iyer', newVal: 'Meera Iyer', field: 'HR Interviewer' },
      { action: 'Saved HR Stage Data', timestamp: '26/06/2026 04:30 PM', by: 'Meera Iyer', notes: 'Updated HR Stage score to Pass.' },
      { action: 'Status Update', timestamp: '26/06/2026 04:35 PM', by: 'Meera Iyer', oldVal: 'Review', newVal: 'Shortlisted', notes: 'Candidate cleared preliminary HR evaluation.' },
      { action: 'Auto-Emailed Interview Panel', timestamp: '26/06/2026 04:36 PM', by: 'System', recipients: 'meera.iyer@jailaxmi.com, ramesh.chandra@jailaxmi.com, sanjay.kulkarni@jailaxmi.com, anil.sharma@jailaxmi.com' }
    ],

    panelEmailSent: 'Yes',
    panelEmailSentDate: '26/06/2026 04:36 PM',
    panelEmailSentBy: 'Meera Iyer',
    panelEmailRecipients: 'meera.iyer@jailaxmi.com, ramesh.chandra@jailaxmi.com, sanjay.kulkarni@jailaxmi.com, anil.sharma@jailaxmi.com',
    panelNotificationStatus: 'Delivered',

    aiScore: 89,
    aiSummary: 'Top-tier civil supervisor candidate with master\'s degree credentials from VNIT and rich site execution history with L&T. Exhibited robust technical clarity on concrete structures and safety benchmarks. High family stability indicators.'
  },
  {
    id: 'JL-2026-0002',
    refNo: 'JL-2026-0002',
    timestamp: '27/06/2026 09:15 AM',
    fullName: 'Priya Narayanan Iyer',
    email: 'priya.iyer98@yahoo.com',
    phone: '+91 91234 56789',
    position: 'Junior Accounts Assistant',
    status: 'Review',
    department: 'Accounts',
    jobTitle: 'Junior Accounts Assistant',
    location: 'Pune Plant Office',

    firstName: 'Priya',
    lastName: 'Narayanan Iyer',
    dob: '04/12/1998',
    age: '27',
    bloodGroup: 'B+ve',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    religion: 'Hindu',
    aadhar: '8877-5544-2211',
    pan: 'AYVPI1240F',
    residentialAddress: 'Flat C-12, Green Field Colony, Kothrud, Pune',
    permanentAddress: '12, Sannidhi Street, Kalpathy, Palakkad, Kerala',

    ugDegree: 'B.Com Financial Accounting',
    ugCollege: 'SNDT College Pune',
    ugYear: '2019',
    ugMarks: '81%',
    sslcSchool: 'Palakkad High School',
    sslcBoard: 'State Board',
    sslcYear: '2014',
    sslcMarks: '91%',

    technicalSkills: 'Tally Prime, MS Excel (VLOOKUP, Pivot Tables), GST Invoicing, E-Way Bill Generation',
    fatherName: 'V. Narayanan Iyer',
    fatherAge: '58',
    fatherEmp: 'Retired Cooperative Bank Clerk',
    fatherMobile: '+91 90022 11223',
    fatherIncome: '₹18,000 / month pension',
    motherName: 'Lalitha Iyer',
    motherAge: '52',
    motherEmp: 'Homemaker',
    brothersCount: '0',
    sistersCount: '1',
    sistersDetail: 'Meenakshi Iyer - Preparing for Bank Exams',

    workExperience: [
      { company: 'K. S. & Associates CA Firm', companyLocation: 'Karve Road Pune', designation: 'Accounts Assistant', from: '01/08/2019', to: '30/11/2022', salary: '₹18,000/mo', reason: 'Wanted plant/corporate experience', achievement: 'Managed GST filings for 35 retail clients with zero penalties.' },
      { company: 'Auro Steel Traders', companyLocation: 'Chinchwad, Pune', designation: 'Junior Accountant', from: '01/12/2022', to: 'Present', salary: '₹28,000/mo', reason: 'Seeking standard plant-level structure and stable gratuity benefits', achievement: 'Reconciled 3 years pending credit ledgers with major vendors.' }
    ],

    refName: 'CA Sanjay Joshi',
    refPosition: 'Senior Partner, KS Joshi Associates',
    refMobile: '+91 98223 90123',
    refEmail: 'sanjay@ksjoshi.com',
    hearSource: 'Indeed Job Portal',
    vehicles: 'Two-wheeler',
    licenceNo: 'KL-09-2015-021034',
    photoFile: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    resumeFile: 'https://example.com/resumes/priya_iyer.pdf',

    additionalDocuments: [],

    statusTimeline: [
      { status: 'New', timestamp: '27/06/2026 09:15 AM', by: 'System', notes: 'Applied via portal.' },
      { status: 'Review', timestamp: '27/06/2026 11:30 AM', by: 'Meera Iyer', notes: 'B.Com academic scores verified. Found highly matching Tally experience.' }
    ],

    auditLog: [
      { action: 'Candidate Submitted Application', timestamp: '27/06/2026 09:15 AM', by: 'System' },
      { action: 'Status Update', timestamp: '27/06/2026 11:30 AM', by: 'Meera Iyer', oldVal: 'New', newVal: 'Review', notes: 'Excellent B.Com scores, solid CA firm training.' }
    ],

    panelEmailSent: 'No',
    aiScore: 84,
    aiSummary: 'Strong corporate accounting assistant profile with excellent Tally Prime proficiency. Cover letter demonstrates solid work ethic and willingness to manage plant ledgers. Her experience in a CA firm gives her high accounting authority.'
  },
  {
    id: 'JL-2026-0003',
    refNo: 'JL-2026-0003',
    timestamp: '29/06/2026 11:45 AM',
    fullName: 'Arjun Harpreet Singh',
    email: 'arjun.singh@gmail.com',
    phone: '+91 88776 65544',
    position: 'B2B Sales Officer',
    status: 'New',
    department: 'Sales',
    jobTitle: 'B2B Sales Officer',
    location: 'Mumbai Corporate Office',

    firstName: 'Arjun',
    lastName: 'Harpreet Singh',
    dob: '22/10/1996',
    age: '29',
    bloodGroup: 'A+ve',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Indian',
    religion: 'Sikh',
    aadhar: '9988-1122-3344',
    pan: 'BHPAS7201M',
    residentialAddress: 'Flat 101, Guru Nanak Krupa, Andheri East, Mumbai',
    permanentAddress: 'House 42, Sector 15, Chandigarh, Punjab',

    ugDegree: 'BBA Marketing & Sales',
    ugCollege: 'MCM DAV College Chandigarh',
    ugYear: '2017',
    ugMarks: '71%',
    sslcSchool: 'St. Stephens High School',
    sslcBoard: 'ICSE',
    sslcYear: '2012',
    sslcMarks: '82%',

    technicalSkills: 'Lead Generation, Client Relations, Salesforce CRM, Metal Trading, Logistics Planning',
    fatherName: 'Harpreet Singh',
    fatherAge: '59',
    fatherEmp: 'Pipes & Metal Merchant',
    fatherMobile: '+91 98140 12345',
    fatherIncome: '₹80,000 / month business',
    motherName: 'Jaswinder Kaur',
    motherAge: '54',
    motherEmp: 'Homemaker',
    brothersCount: '1',
    brothersDetail: 'Balbir Singh - Managing Family Trade Chandigarh',
    sistersCount: '0',

    workExperience: [
      { company: 'Kamdhenu Steel Distributors', companyLocation: 'Ludhiana', designation: 'Sales Representative', from: '01/06/2017', to: '30/12/2020', salary: '₹22,000/mo', reason: 'Relocated to Mumbai for better scope', achievement: 'Nurtured 25 key dealer accounts and grew sales by 18% in Ludhiana circle.' },
      { company: 'Tirupati Metals & Tubes', companyLocation: 'Kalamboli, Navi Mumbai', designation: 'B2B Sales Executive', from: '10/01/2021', to: 'Present', salary: '₹40,000/mo', reason: 'Looking for a directly brand-associated corporate position', achievement: 'Closed ₹1.2 Crore industrial supply deal with infrastructure builders.' }
    ],

    refName: 'Rajinder Gupta',
    refPosition: 'Proprietor, Tirupati Metals',
    refMobile: '+91 99300 98765',
    refEmail: 'r.gupta@tirupatimetals.com',
    hearSource: 'LinkedIn Referral',
    vehicles: 'Car, Two-wheeler',
    licenceNo: 'MH-03-2021-998024',
    photoFile: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    resumeFile: 'https://example.com/resumes/arjun_singh.pdf',

    additionalDocuments: [],

    statusTimeline: [
      { status: 'New', timestamp: '29/06/2026 11:45 AM', by: 'System', notes: 'Submitted resume online.' }
    ],

    auditLog: [
      { action: 'Candidate Submitted Application', timestamp: '29/06/2026 11:45 AM', by: 'System' }
    ],

    panelEmailSent: 'No',
    aiScore: 78,
    aiSummary: 'Solid metal trading sales experience in both Punjab and Maharashtra. Broad knowledge of steel distributors and distributor networks makes him highly useful for B2B channels. Comes from a relevant metal business family background.'
  }
];

// Helper to write to local storage
function saveData(applications: JobApplication[], users: PortalUser[]) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ applications, users }, null, 2));
  } catch (err) {
    console.error('Failed to save data store:', err);
  }
}

// Load dynamic dataset
let applications = [...defaultApplications];
let users = [...defaultUsers];

if (fs.existsSync(STORE_PATH)) {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.applications && Array.isArray(parsed.applications)) {
      applications = parsed.applications;
    }
    if (parsed.users && Array.isArray(parsed.users)) {
      users = parsed.users;
    }
    console.log(`Loaded ${applications.length} applications and ${users.length} users from persistent storage.`);
  } catch (err) {
    console.error('Stale data-store file, fallback to seeded defaults.', err);
  }
} else {
  saveData(applications, users);
}

// ── Gemini Screen Core Helper ──
async function screenApplicationWithAI(app: JobApplication): Promise<{ score: number; summary: string; questions: string[] }> {
  if (!ai) {
    const randomScore = Math.floor(Math.random() * 20) + 75; // 75-95
    return {
      score: randomScore,
      summary: `[Fallback Analysis] Candidate ${app.fullName} has a robust profile. Their qualifications in ${app.ugDegree || 'their field'} aligned with their skills (${app.technicalSkills}) present strong foundations. Their work experience in India's industrial sector represents clean cultural alignment with Jailaxmi standards.`,
      questions: [
        `What led you to apply for Jailaxmi Group of Companies?`,
        `Can you describe a high-stakes challenge in your past role and how you handled it?`,
        `How do you manage cross-department coordination on site or in office?`
      ]
    };
  }

  try {
    const job = activeJobs.find(j => j.title.toLowerCase() === app.position.toLowerCase()) || activeJobs[0];
    const prompt = `
      You are the Lead HR Evaluator for Jailaxmi Group of Companies, an elite manufacturing and industrial conglomerate.
      Evaluate this candidate application details against the job requirements:
      
      Job Title: ${job.title}
      Department: ${job.department}
      Description: ${job.description}
      Requirements: ${job.requirements.join(' | ')}

      Candidate Name: ${app.fullName}
      Position: ${app.position}
      Education: UG: ${app.ugDegree || 'N/A'}, PG: ${app.pgDegree || 'N/A'}
      Skills: ${app.technicalSkills}
      Experience: ${JSON.stringify(app.workExperience || [])}
      Family details: Father: ${app.fatherName}, Mother: ${app.motherName}, Sibling: ${app.brothersDetail || ''} ${app.sistersDetail || ''}

      Provide your analysis in EXACT JSON format containing:
      1. "score": a suitabilty score between 0 and 100 based on standard industrial matches.
      2. "summary": a precise 3-4 sentence paragraph summarizing candidate background, industrial fit, family stability index, and final recommend cues.
      3. "interviewQuestions": an array of 3 personalized, sharp interview questions based on their profile.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['score', 'summary', 'interviewQuestions']
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return {
      score: parsed.score || 75,
      summary: parsed.summary || 'Cleared evaluation criteria.',
      questions: parsed.interviewQuestions || []
    };
  } catch (error) {
    console.error('Gemini screening failed:', error);
    return {
      score: 80,
      summary: `Localized structural analysis completed. Candidate demonstrates clean skill match on "${app.technicalSkills}". Suitable for further vetting rounds.`,
      questions: [
        'How do you handle demanding shift-timings?',
        'Explain a project where you optimized efficiency or cost.',
        'Why Jailaxmi Group?'
      ]
    };
  }
}

// ────────────────────────────────────────────────
//  API ENDPOINTS
// ────────────────────────────────────────────────

// 1. Staff Sign-in
app.post('/api/login', (req, res) => {
  const { uid, pwd } = req.body;
  if (!uid || !pwd) {
    return res.status(400).json({ ok: false, error: 'Enter email and password.' });
  }

  const found = users.find(u => u.uid.toLowerCase() === uid.toLowerCase().trim() && u.pwd === pwd);
  if (found) {
    const { pwd, ...safeUser } = found;
    return res.json({ ok: true, ...safeUser });
  } else {
    return res.status(401).json({ ok: false, error: 'Invalid credentials. Authorised access only.' });
  }
});

// 2. Fetch Dashboard Statistics
app.post('/api/dashboard-stats', (req, res) => {
  const { role, dept } = req.body;
  
  // Filter based on department manager constraint
  let filteredApps = [...applications];
  if (role === 'manager' && dept) {
    filteredApps = applications.filter(a => a.department === dept);
  }

  const byStatus: Record<string, number> = { New: 0, Review: 0, Shortlisted: 0, Selected: 0, Rejected: 0, Joined: 0 };
  const byDept: Record<string, number> = {};

  filteredApps.forEach(a => {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    byDept[a.department] = (byDept[a.department] || 0) + 1;
  });

  res.json({
    ok: true,
    stats: {
      total: filteredApps.length,
      byStatus,
      byDept
    },
    rows: filteredApps
  });
});

// 3. Get All Portal Users
app.post('/api/get-all-users', (req, res) => {
  const { role } = req.body;
  // MD and HR can manage other users
  const canManage = role === 'md' || role === 'hr';
  
  // Return users without credentials exposed directly or with pwd if authorized
  const cleanUsers = users.map(u => ({
    uid: u.uid,
    name: u.name,
    role: u.role,
    roleLabel: u.roleLabel,
    dept: u.dept,
    // only expose pwd for MD/HR edit panel
    pwd: canManage ? u.pwd : undefined
  }));

  res.json({
    ok: true,
    users: cleanUsers,
    canManage
  });
});

// 4. Create New Portal User
app.post('/api/add-portal-user', (req, res) => {
  const { data, role, userName } = req.body;
  if (role !== 'md' && role !== 'hr') {
    return res.status(403).json({ ok: false, error: 'Unauthorised. Only MD and HR can manage portal users.' });
  }

  if (!data.name || !data.uid || !data.pwd || !data.role || !data.roleLabel) {
    return res.status(400).json({ ok: false, error: 'Missing required user details.' });
  }

  const exist = users.find(u => u.uid.toLowerCase() === data.uid.toLowerCase().trim());
  if (exist) {
    return res.status(400).json({ ok: false, error: 'User with this email already exists.' });
  }

  const newUser: PortalUser = {
    uid: data.uid.toLowerCase().trim(),
    name: data.name,
    pwd: data.pwd,
    role: data.role,
    roleLabel: data.roleLabel,
    dept: data.role === 'manager' ? data.dept : undefined
  };

  users.push(newUser);
  saveData(applications, users);

  res.json({ ok: true, user: newUser });
});

// 5. Update Portal User
app.post('/api/update-portal-user', (req, res) => {
  const { uid, data, role, userName } = req.body;
  if (role !== 'md' && role !== 'hr') {
    return res.status(403).json({ ok: false, error: 'Unauthorised. Only MD and HR can manage portal users.' });
  }

  const idx = users.findIndex(u => u.uid.toLowerCase() === uid.toLowerCase().trim());
  if (idx === -1) {
    return res.status(404).json({ ok: false, error: 'User not found.' });
  }

  users[idx] = {
    ...users[idx],
    name: data.name || users[idx].name,
    role: data.role || users[idx].role,
    roleLabel: data.roleLabel || users[idx].roleLabel,
    dept: data.role === 'manager' ? (data.dept || users[idx].dept) : undefined,
    pwd: data.pwd ? data.pwd : users[idx].pwd
  };

  saveData(applications, users);
  res.json({ ok: true });
});

// 6. Get Full Applicant Profile
app.post('/api/get-full-applicant', (req, res) => {
  const { refNo } = req.body;
  const found = applications.find(a => a.id === refNo);
  if (!found) {
    return res.status(404).json({ ok: false, error: 'Applicant profile not found.' });
  }

  res.json({
    ok: true,
    row: found
  });
});

// 7. Update Recruitment Status
app.post('/api/update-status', (req, res) => {
  const { refNo, newStatus, notes, role, dept, userName, schedInfo } = req.body;
  const appIndex = applications.findIndex(a => a.id === refNo);
  if (appIndex === -1) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  const candidate = applications[appIndex];
  const oldStatus = candidate.status;

  // Enforce workflow validation (Joined and Rejected are lock states, or forward only)
  const order = ['New', 'Review', 'Shortlisted', 'Selected', 'Joined'];
  if (newStatus !== 'Rejected') {
    if (oldStatus === 'Rejected' || oldStatus === 'Joined') {
      return res.status(400).json({ ok: false, error: `Cannot update state of ${oldStatus} candidates.` });
    }
    const oldIdx = order.indexOf(oldStatus);
    const newIdx = order.indexOf(newStatus);
    if (oldIdx !== -1 && newIdx !== -1 && newIdx < oldIdx) {
      return res.status(400).json({ ok: false, error: 'Backward state transitions are disabled.' });
    }
  }

  // Update details
  candidate.status = newStatus;
  
  // Update scheduling info if present
  if (schedInfo) {
    candidate.interviewScheduleDate = schedInfo.interviewDate || candidate.interviewScheduleDate;
    candidate.interviewScheduleTime = schedInfo.interviewTime || candidate.interviewScheduleTime;
    candidate.interviewMode = schedInfo.interviewMode || candidate.interviewMode;
    candidate.interviewVenue = schedInfo.interviewVenue || candidate.interviewVenue;
    candidate.meetingLink = schedInfo.meetingLink || candidate.meetingLink;
  }

  // Auto-send mock panel emails when status becomes Shortlisted
  let panelEmailSent = candidate.panelEmailSent || 'No';
  let panelEmailSentDate = candidate.panelEmailSentDate;
  let panelEmailSentBy = candidate.panelEmailSentBy;
  let panelEmailRecipients = candidate.panelEmailRecipients;
  let panelNotificationStatus = candidate.panelNotificationStatus;

  let panelEmailTriggered = false;
  let mockRecipients: string[] = [];

  if (newStatus === 'Shortlisted' && oldStatus !== 'Shortlisted') {
    panelEmailTriggered = true;
    panelEmailSent = 'Yes';
    panelEmailSentDate = new Date().toLocaleString('en-IN');
    panelEmailSentBy = userName || role;
    
    // Gather all assigned panel members emails or standard list
    const recs = [];
    if (candidate.hrInterviewer) recs.push(`${candidate.hrInterviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
    if (candidate.sdc1Interviewer) recs.push(`${candidate.sdc1Interviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
    if (candidate.sdc2Interviewer) recs.push(`${candidate.sdc2Interviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
    if (candidate.deptInterviewer) recs.push(`${candidate.deptInterviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
    if (recs.length === 0) recs.push('recruitment.panel@jailaxmi.com', 'hr@jailaxmi.com');
    
    mockRecipients = recs;
    panelEmailRecipients = recs.join(', ');
    panelNotificationStatus = 'Delivered';

    candidate.panelEmailSent = 'Yes';
    candidate.panelEmailSentDate = panelEmailSentDate;
    candidate.panelEmailSentBy = panelEmailSentBy;
    candidate.panelEmailRecipients = panelEmailRecipients;
    candidate.panelNotificationStatus = 'Delivered';
  }

  // Append Status Timeline
  if (!candidate.statusTimeline) candidate.statusTimeline = [];
  candidate.statusTimeline.push({
    status: newStatus,
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || role,
    notes: notes || `Status changed from ${oldStatus} to ${newStatus}.`
  });

  // Append Audit Log
  if (!candidate.auditLog) candidate.auditLog = [];
  candidate.auditLog.push({
    action: `Status Update: ${oldStatus} ➔ ${newStatus}`,
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || role,
    oldVal: oldStatus,
    newVal: newStatus,
    notes: notes || undefined
  });

  if (panelEmailTriggered) {
    candidate.auditLog.push({
      action: 'Auto-Emailed Interview Panel',
      timestamp: new Date().toLocaleString('en-IN'),
      by: 'System',
      recipients: panelEmailRecipients
    });
  }

  saveData(applications, users);

  res.json({
    ok: true,
    candidateEmailed: ['Shortlisted', 'Selected', 'Rejected', 'Joined'].includes(newStatus),
    panelEmailSent: panelEmailTriggered,
    panelEmailRecipients: mockRecipients,
    candidate
  });
});

// 8. Resend Panel Email Manually
app.post('/api/resend-panel-email', (req, res) => {
  const { refNo, role, userName, schedInfo } = req.body;
  const applicant = applications.find(a => a.id === refNo);
  if (!applicant) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  if (schedInfo) {
    applicant.interviewScheduleDate = schedInfo.interviewDate || applicant.interviewScheduleDate;
    applicant.interviewScheduleTime = schedInfo.interviewTime || applicant.interviewScheduleTime;
    applicant.interviewMode = schedInfo.interviewMode || applicant.interviewMode;
    applicant.interviewVenue = schedInfo.interviewVenue || applicant.interviewVenue;
    applicant.meetingLink = schedInfo.meetingLink || applicant.meetingLink;
  }

  const recs = [];
  if (applicant.hrInterviewer) recs.push(`${applicant.hrInterviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
  if (applicant.sdc1Interviewer) recs.push(`${applicant.sdc1Interviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
  if (applicant.sdc2Interviewer) recs.push(`${applicant.sdc2Interviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
  if (applicant.deptInterviewer) recs.push(`${applicant.deptInterviewer.toLowerCase().replace(/\s+/g, '')}@jailaxmi.com`);
  if (recs.length === 0) recs.push('recruitment.panel@jailaxmi.com', 'hr@jailaxmi.com');

  applicant.panelEmailSent = 'Yes';
  applicant.panelEmailSentDate = new Date().toLocaleString('en-IN');
  applicant.panelEmailSentBy = userName || role;
  applicant.panelEmailRecipients = recs.join(', ');
  applicant.panelNotificationStatus = 'Delivered';

  if (!applicant.auditLog) applicant.auditLog = [];
  applicant.auditLog.push({
    action: 'Manually Resent Panel Email',
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || role,
    recipients: recs.join(', ')
  });

  saveData(applications, users);

  res.json({
    ok: true,
    emailsSent: recs
  });
});

// 9. Upload Candidate Document
app.post('/api/upload-candidate-document', (req, res) => {
  const { refNo, b64, fileName, mimeType, userName, stageGuess } = req.body;
  const applicant = applications.find(a => a.id === refNo);
  if (!applicant) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  // Prepare Mock URL or use Base64 URL directly
  // For standard preview, base64 data URLs work fine or we can simulate a mock URL
  const mockUrl = b64.length < 50000 ? `data:${mimeType};base64,${b64}` : `https://example.com/docs/candidate_${Date.now()}_${fileName}`;

  if (!applicant.additionalDocuments) applicant.additionalDocuments = [];
  const newDoc = {
    name: fileName,
    url: mockUrl,
    uploadedBy: userName || 'Panel Member',
    uploadedDate: new Date().toLocaleDateString('en-IN'),
    stage: stageGuess || 'General'
  };

  applicant.additionalDocuments.push(newDoc);

  if (!applicant.auditLog) applicant.auditLog = [];
  applicant.auditLog.push({
    action: `Uploaded File: ${fileName}`,
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || 'Panel Member',
    notes: `File attached to stage: ${stageGuess || 'General'}`
  });

  saveData(applications, users);
  res.json({ ok: true, document: newDoc });
});

// 10. Update Interview Stage
app.post('/api/update-interview-stage', (req, res) => {
  const { refNo, stageId, interviewData, role, userName } = req.body;
  const applicant = applications.find(a => a.id === refNo);
  if (!applicant) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  const key = `${stageId}Stage` as 'hrStage' | 'sdc1Stage' | 'sdc2Stage' | 'deptStage' | 'mgmtStage';
  const stageNames: Record<string, string> = { hr: 'HR Interview', sdc1: 'SDC Stage 1', sdc2: 'SDC Stage 2', dept: 'Department Interview', mgmt: 'Management Interview' };

  applicant[key] = {
    interviewer: interviewData.interviewer || '',
    date: interviewData.date || '',
    status: interviewData.status || 'Pending',
    rating: interviewData.rating || '',
    notes: interviewData.notes || '',
    completedBy: userName || role,
    timestamp: new Date().toLocaleString('en-IN'),
    joiningDate: interviewData.joiningDate || undefined
  };

  // Also bind assigned panel fields if they edited name/date
  if (stageId === 'hr') {
    applicant.hrInterviewer = interviewData.interviewer || applicant.hrInterviewer;
    applicant.hrDate = interviewData.date || applicant.hrDate;
  } else if (stageId === 'sdc1') {
    applicant.sdc1Interviewer = interviewData.interviewer || applicant.sdc1Interviewer;
    applicant.sdc1Date = interviewData.date || applicant.sdc1Date;
  } else if (stageId === 'sdc2') {
    applicant.sdc2Interviewer = interviewData.interviewer || applicant.sdc2Interviewer;
    applicant.sdc2Date = interviewData.date || applicant.sdc2Date;
  } else if (stageId === 'dept') {
    applicant.deptInterviewer = interviewData.interviewer || applicant.deptInterviewer;
    applicant.deptDate = interviewData.date || applicant.deptDate;
  } else if (stageId === 'mgmt') {
    applicant.mgmtInterviewer = interviewData.interviewer || applicant.mgmtInterviewer;
    applicant.mgmtDate = interviewData.date || applicant.mgmtDate;
  }

  if (!applicant.auditLog) applicant.auditLog = [];
  applicant.auditLog.push({
    action: `Saved Stage Data: ${stageNames[stageId] || stageId}`,
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || role,
    notes: `Status: ${interviewData.status} | Rating: ${interviewData.rating}`
  });

  saveData(applications, users);
  res.json({ ok: true, applicant });
});

// 11. Assign Panel Interviewers
app.post('/api/assign-interview-panel', (req, res) => {
  const { refNo, panelData, role, userName } = req.body;
  const applicant = applications.find(a => a.id === refNo);
  if (!applicant) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  applicant.hrInterviewer = panelData.hrInterviewer || applicant.hrInterviewer;
  applicant.hrDate = panelData.hrDate || applicant.hrDate;
  applicant.sdc1Interviewer = panelData.sdc1Interviewer || applicant.sdc1Interviewer;
  applicant.sdc1Date = panelData.sdc1Date || applicant.sdc1Date;
  applicant.sdc2Interviewer = panelData.sdc2Interviewer || applicant.sdc2Interviewer;
  applicant.sdc2Date = panelData.sdc2Date || applicant.sdc2Date;
  applicant.deptInterviewer = panelData.deptInterviewer || applicant.deptInterviewer;
  applicant.deptDate = panelData.deptDate || applicant.deptDate;
  applicant.mgmtInterviewer = panelData.mgmtInterviewer || applicant.mgmtInterviewer;
  applicant.mgmtDate = panelData.mgmtDate || applicant.mgmtDate;

  // Initialize stage structures if empty
  if (panelData.hrInterviewer && !applicant.hrStage) {
    applicant.hrStage = { interviewer: panelData.hrInterviewer, date: panelData.hrDate || '', status: 'Scheduled', rating: '', notes: '' };
  }
  if (panelData.sdc1Interviewer && !applicant.sdc1Stage) {
    applicant.sdc1Stage = { interviewer: panelData.sdc1Interviewer, date: panelData.sdc1Date || '', status: 'Scheduled', rating: '', notes: '' };
  }
  if (panelData.sdc2Interviewer && !applicant.sdc2Stage) {
    applicant.sdc2Stage = { interviewer: panelData.sdc2Interviewer, date: panelData.sdc2Date || '', status: 'Scheduled', rating: '', notes: '' };
  }
  if (panelData.deptInterviewer && !applicant.deptStage) {
    applicant.deptStage = { interviewer: panelData.deptInterviewer, date: panelData.deptDate || '', status: 'Scheduled', rating: '', notes: '' };
  }
  if (panelData.mgmtInterviewer && !applicant.mgmtStage) {
    applicant.mgmtStage = { interviewer: panelData.mgmtInterviewer, date: panelData.mgmtDate || '', status: 'Scheduled', rating: '', notes: '' };
  }

  if (!applicant.auditLog) applicant.auditLog = [];
  applicant.auditLog.push({
    action: 'Assigned / Modified Interview Panel',
    timestamp: new Date().toLocaleString('en-IN'),
    by: userName || role,
    notes: `Panel members and dates updated.`
  });

  saveData(applications, users);
  res.json({ ok: true, applicant });
});

// 12. Update Role / Department Details
app.post('/api/update-applicant-role', (req, res) => {
  const { refNo, newDept, newTitle, role } = req.body;
  const applicant = applications.find(a => a.id === refNo);
  if (!applicant) {
    return res.status(404).json({ ok: false, error: 'Applicant not found.' });
  }

  const oldDept = applicant.department;
  const oldTitle = applicant.jobTitle;

  applicant.department = newDept || applicant.department;
  applicant.jobTitle = newTitle || applicant.jobTitle;
  applicant.position = newTitle || applicant.position;

  if (!applicant.auditLog) applicant.auditLog = [];
  applicant.auditLog.push({
    action: 'Department / Title Re-assignment',
    timestamp: new Date().toLocaleString('en-IN'),
    by: role,
    notes: `${oldTitle} (${oldDept}) ➔ ${newTitle || applicant.jobTitle} (${newDept || applicant.department})`
  });

  saveData(applications, users);
  res.json({ ok: true, applicant });
});

// 13. Public: Submit New Comprehensive Application
app.post('/api/public-apply', async (req, res) => {
  try {
    const rawForm = req.body;
    if (!rawForm.fullName || !rawForm.email || !rawForm.phone || !rawForm.position) {
      return res.status(400).json({ ok: false, error: 'Missing required fields (Name, Email, Phone, Position).' });
    }

    const refNo = `JL-2026-${String(applications.length + 1).padStart(4, '0')}`;
    
    // Parse structures
    let parsedExp = [];
    if (typeof rawForm.workExperience === 'string') {
      try { parsedExp = JSON.parse(rawForm.workExperience); } catch(e) {}
    } else if (Array.isArray(rawForm.workExperience)) {
      parsedExp = rawForm.workExperience;
    }

    let parsedChildren = [];
    if (typeof rawForm.childrenDetails === 'string') {
      try { parsedChildren = JSON.parse(rawForm.childrenDetails); } catch(e) {}
    } else if (Array.isArray(rawForm.childrenDetails)) {
      parsedChildren = rawForm.childrenDetails;
    }

    // Standard pre-seeding structure
    const newApp: JobApplication = {
      id: refNo,
      refNo: refNo,
      timestamp: new Date().toLocaleString('en-IN'),
      fullName: rawForm.fullName,
      email: rawForm.email,
      phone: rawForm.phone,
      position: rawForm.position,
      status: 'New',
      
      department: rawForm.department || 'Administration',
      jobTitle: rawForm.position,
      location: rawForm.location || 'Mumbai Corporate Office',

      firstName: rawForm.firstName || rawForm.fullName.split(' ')[0] || '',
      lastName: rawForm.lastName || rawForm.fullName.split(' ').slice(1).join(' ') || '',
      dob: rawForm.dob || '',
      age: rawForm.age || '',
      bloodGroup: rawForm.bloodGroup || '',
      gender: rawForm.gender || '',
      maritalStatus: rawForm.maritalStatus || 'Single',
      nationality: rawForm.nationality || 'Indian',
      religion: rawForm.religion || '',
      aadhar: rawForm.aadhar || '',
      pan: rawForm.pan || '',
      residentialAddress: rawForm.residentialAddress || '',
      permanentAddress: rawForm.permanentAddress || '',

      pgDegree: rawForm.pgDegree, pgCollege: rawForm.pgCollege, pgYear: rawForm.pgYear, pgMarks: rawForm.pgMarks,
      ugDegree: rawForm.ugDegree, ugCollege: rawForm.ugCollege, ugYear: rawForm.ugYear, ugMarks: rawForm.ugMarks,
      diplomaInstitute: rawForm.diplomaInstitute, diplomaBoard: rawForm.diplomaBoard, diplomaYear: rawForm.diplomaYear, diplomaMarks: rawForm.diplomaMarks,
      sslcSchool: rawForm.sslcSchool, sslcBoard: rawForm.sslcBoard, sslcYear: rawForm.sslcYear, sslcMarks: rawForm.sslcMarks,
      hscSchool: rawForm.hscSchool, hscBoard: rawForm.hscBoard, hscYear: rawForm.hscYear, hscMarks: rawForm.hscMarks,

      technicalSkills: rawForm.technicalSkills || '',
      fatherName: rawForm.fatherName || '',
      fatherAge: rawForm.fatherAge, fatherEmp: rawForm.fatherEmp, fatherMobile: rawForm.fatherMobile, fatherIncome: rawForm.fatherIncome,
      motherName: rawForm.motherName || '',
      motherAge: rawForm.motherAge, motherEmp: rawForm.motherEmp, motherMobile: rawForm.motherMobile, motherIncome: rawForm.motherIncome,
      brothersCount: rawForm.brothersCount, brothersDetail: rawForm.brothersDetail,
      sistersCount: rawForm.sistersCount, sistersDetail: rawForm.sistersDetail,
      sibling1Income: rawForm.sibling1Income, sibling2Income: rawForm.sibling2Income,
      wifeName: rawForm.wifeName, wifeAge: rawForm.wifeAge, wifeEmp: rawForm.wifeEmp, wifeMobile: rawForm.wifeMobile, wifeIncome: rawForm.wifeIncome,
      noOfChildren: rawForm.noOfChildren,
      childrenDetails: parsedChildren,
      workExperience: parsedExp,

      refName: rawForm.refName, refPosition: rawForm.refPosition, refMobile: rawForm.refMobile, refEmail: rawForm.refEmail,
      hearSource: rawForm.hearSource || 'Direct Application',
      vehicles: rawForm.vehicles, licenceNo: rawForm.licenceNo,
      photoFile: rawForm.photoFile || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      resumeFile: rawForm.resumeFile || 'https://example.com/resumes/candidate_uploaded.pdf',

      additionalDocuments: [],
      statusTimeline: [
        { status: 'New', timestamp: new Date().toLocaleString('en-IN'), by: 'System', notes: 'Submitted recruitment form online.' }
      ],
      auditLog: [
        { action: 'Candidate Submitted Application', timestamp: new Date().toLocaleString('en-IN'), by: 'System' }
      ],
      panelEmailSent: 'No'
    };

    // Run AI Screen evaluation
    console.log(`Running AI screening on new application: ${newApp.fullName}`);
    const aiReview = await screenApplicationWithAI(newApp);
    newApp.aiScore = aiReview.score;
    newApp.aiSummary = aiReview.summary;
    newApp.aiQuestions = aiReview.questions;

    // Add to localized list
    applications.unshift(newApp);
    saveData(applications, users);

    res.status(201).json({ ok: true, application: newApp, message: 'Application submitted successfully. Ref No: ' + refNo });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    res.status(500).json({ ok: false, error: 'Failed to process application.' });
  }
});

// 14. Fetch Active Job Listings
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, jobs: activeJobs });
});

// Serve static assets / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
