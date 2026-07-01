import React from 'react';
import { JobApplication } from '../types';

interface PrintProfileProps {
  candidate: JobApplication | null;
}

export default function PrintProfile({ candidate }: PrintProfileProps) {
  if (!candidate) return null;

  const getVal = (v: any) => {
    if (v === undefined || v === null || String(v).trim() === '') {
      return '—';
    }
    return String(v);
  };

  const name = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.fullName || 'Candidate';
  const now = new Date().toLocaleDateString('en-IN');

  const renderCell = (label: string, value: string, full = false) => (
    <div className={`p-2 border-r border-b border-gray-300 ${full ? 'col-span-3 border-r-0' : ''}`} key={label}>
      <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">{label}</div>
      <div className={`text-xs font-semibold ${value === '—' ? 'text-gray-400 italic font-normal' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  );

  const renderSection = (icon: string, title: string, content: React.ReactNode) => (
    <div className="mb-4 border border-gray-300 rounded-md overflow-hidden page-break-inside-avoid">
      <div className="bg-[#e8f5f0] text-[#0F6E56] font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 border-b border-gray-300 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </div>
      <div className="grid grid-cols-3 bg-white">
        {content}
      </div>
    </div>
  );

  return (
    <div id="print-profile-wrap" className="hidden print:block font-sans text-gray-900 bg-white p-4">
      {/* Header */}
      <div className="bg-[#0F6E56] text-white p-4 rounded-md mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold m-0">{name}</h2>
          <p className="text-[10px] text-emerald-100 mt-1 opacity-90">
            Ref: {candidate.refNo} | Department: {candidate.department} | Job: {candidate.jobTitle} | Status: {candidate.status}
          </p>
        </div>
        <div className="text-right text-[10px] text-emerald-100">
          <div>Printed: {now}</div>
          <div className="font-mono text-[9px] mt-1 opacity-75">Jailaxmi Staff Portal v4.0</div>
        </div>
      </div>

      {/* Position Detail */}
      {renderSection('📋', 'Position Applied For', [
        renderCell('Department', getVal(candidate.department)),
        renderCell('Job Title', getVal(candidate.jobTitle)),
        renderCell('Target Location', getVal(candidate.location))
      ])}

      {/* Interview Schedule (if scheduled) */}
      {(candidate.interviewScheduleDate || candidate.interviewScheduleTime || candidate.interviewMode) && 
        renderSection('📅', 'Interview Schedule', [
          renderCell('Interview Date', getVal(candidate.interviewScheduleDate)),
          renderCell('Interview Time', getVal(candidate.interviewScheduleTime)),
          renderCell('Interview Mode', getVal(candidate.interviewMode)),
          renderCell('Interview Venue', getVal(candidate.interviewVenue), true),
          renderCell('Meeting Link', getVal(candidate.meetingLink), true)
        ])
      }

      {/* Personal Details */}
      {renderSection('👤', 'Personal Details', [
        renderCell('Full Name', name, true),
        renderCell('Date of Birth', getVal(candidate.dob)),
        renderCell('Age', getVal(candidate.age)),
        renderCell('Blood Group', getVal(candidate.bloodGroup)),
        renderCell('Gender', getVal(candidate.gender)),
        renderCell('Marital Status', getVal(candidate.maritalStatus)),
        renderCell('Nationality', getVal(candidate.nationality)),
        renderCell('Religion', getVal(candidate.religion)),
        renderCell('Phone Number', getVal(candidate.phone)),
        renderCell('Email ID', getVal(candidate.email)),
        renderCell('Aadhar Card No.', getVal(candidate.aadhar)),
        renderCell('PAN Card No.', getVal(candidate.pan)),
        renderCell('Residential Address', getVal(candidate.residentialAddress), true),
        renderCell('Permanent Address', getVal(candidate.permanentAddress), true)
      ])}

      {/* Education */}
      {renderSection('🎓', 'Academic Qualifications', [
        renderCell('PG Degree', getVal(candidate.pgDegree)),
        renderCell('PG College/Inst', getVal(candidate.pgCollege)),
        renderCell('PG Passing Year', getVal(candidate.pgYear)),
        renderCell('PG Score / Marks %', getVal(candidate.pgMarks)),
        
        renderCell('UG Degree', getVal(candidate.ugDegree)),
        renderCell('UG College/Inst', getVal(candidate.ugCollege)),
        renderCell('UG Passing Year', getVal(candidate.ugYear)),
        renderCell('UG Score / Marks %', getVal(candidate.ugMarks)),

        renderCell('Diploma', getVal(candidate.diplomaInstitute)),
        renderCell('Diploma Board', getVal(candidate.diplomaBoard)),
        renderCell('Diploma Passing Year', getVal(candidate.diplomaYear)),
        renderCell('Diploma Score', getVal(candidate.diplomaMarks)),

        renderCell('HSC School', getVal(candidate.hscSchool)),
        renderCell('HSC Board', getVal(candidate.hscBoard)),
        renderCell('HSC Passing Year', getVal(candidate.hscYear)),
        renderCell('HSC Score %', getVal(candidate.hscMarks)),

        renderCell('SSLC School', getVal(candidate.sslcSchool)),
        renderCell('SSLC Board', getVal(candidate.sslcBoard)),
        renderCell('SSLC Passing Year', getVal(candidate.sslcYear)),
        renderCell('SSLC Score %', getVal(candidate.sslcMarks))
      ])}

      {/* Skills & Family Details */}
      {renderSection('💻', 'Skills & Family Details', [
        renderCell('Technical Skills', getVal(candidate.technicalSkills), true),
        renderCell('Father\'s Name', getVal(candidate.fatherName)),
        renderCell('Father\'s Age', getVal(candidate.fatherAge)),
        renderCell('Father\'s Employment', getVal(candidate.fatherEmp)),
        renderCell('Father\'s Mobile', getVal(candidate.fatherMobile)),
        renderCell('Father\'s Income', getVal(candidate.fatherIncome)),

        renderCell('Mother\'s Name', getVal(candidate.motherName)),
        renderCell('Mother\'s Age', getVal(candidate.motherAge)),
        renderCell('Mother\'s Employment', getVal(candidate.motherEmp)),
        renderCell('Mother\'s Mobile', getVal(candidate.motherMobile)),
        renderCell('Mother\'s Income', getVal(candidate.motherIncome)),

        renderCell('Brothers Count', getVal(candidate.brothersCount)),
        renderCell('Brothers Detail', getVal(candidate.brothersDetail), true),
        renderCell('Sisters Count', getVal(candidate.sistersCount)),
        renderCell('Sisters Detail', getVal(candidate.sistersDetail), true),

        renderCell('Spouse Name', getVal(candidate.wifeName)),
        renderCell('Spouse Age', getVal(candidate.wifeAge)),
        renderCell('Spouse Employment', getVal(candidate.wifeEmp)),
        renderCell('Spouse Mobile', getVal(candidate.wifeMobile)),
        renderCell('Spouse Income', getVal(candidate.wifeIncome)),

        renderCell('No of Children', getVal(candidate.noOfChildren)),
        renderCell(
          'Children Details',
          candidate.childrenDetails && candidate.childrenDetails.length > 0
            ? candidate.childrenDetails.map((c, i) => `Child ${i+1}: ${c.name} (${c.gender}, Age: ${c.age})`).join(' | ')
            : '—',
          true
        )
      ])}

      {/* Employment Record */}
      {renderSection('💼', 'Employment History', 
        candidate.workExperience && candidate.workExperience.length > 0 ? (
          candidate.workExperience.map((job, idx) => (
            <React.Fragment key={idx}>
              {renderCell(`Job ${idx + 1} - Company`, getVal(job.company), true)}
              {renderCell('Designation', getVal(job.designation))}
              {renderCell('Period', `${getVal(job.from)} to ${getVal(job.to)}`)}
              {renderCell('Location', getVal(job.companyLocation))}
              {renderCell('Salary (Monthly)', getVal(job.salary))}
              {renderCell('Reason for Leaving', getVal(job.reason))}
              {renderCell('Key Achievement', getVal(job.achievement), true)}
            </React.Fragment>
          ))
        ) : [
          renderCell('Work Experience', 'No previous employment records listed.', true)
        ]
      )}

      {/* References & Others */}
      {renderSection('📞', 'References & Other Details', [
        renderCell('Reference Name', getVal(candidate.refName)),
        renderCell('Reference Position', getVal(candidate.refPosition)),
        renderCell('Reference Mobile', getVal(candidate.refMobile)),
        renderCell('Reference Email', getVal(candidate.refEmail)),
        renderCell('Heard About Us', getVal(candidate.hearSource)),
        renderCell('Owned Vehicles', getVal(candidate.vehicles)),
        renderCell('Licence Number', getVal(candidate.licenceNo))
      ])}

      {/* Feedback Stages */}
      {renderSection('🎙', 'Interview Panel Feedback', [
        renderCell('HR Interviewer', getVal(candidate.hrInterviewer)),
        renderCell('HR Interview Status', getVal(candidate.hrStage?.status)),
        renderCell('HR Rating / Feedback', `${getVal(candidate.hrStage?.rating)} | ${getVal(candidate.hrStage?.notes)}`, true),

        renderCell('SDC Stage 1 Interviewer', getVal(candidate.sdc1Interviewer)),
        renderCell('SDC 1 Status', getVal(candidate.sdc1Stage?.status)),
        renderCell('SDC 1 Rating / Feedback', `${getVal(candidate.sdc1Stage?.rating)} | ${getVal(candidate.sdc1Stage?.notes)}`, true),

        renderCell('SDC Stage 2 Interviewer', getVal(candidate.sdc2Interviewer)),
        renderCell('SDC 2 Status', getVal(candidate.sdc2Stage?.status)),
        renderCell('SDC 2 Rating / Feedback', `${getVal(candidate.sdc2Stage?.rating)} | ${getVal(candidate.sdc2Stage?.notes)}`, true),

        renderCell('Dept Interviewer', getVal(candidate.deptInterviewer)),
        renderCell('Dept Status', getVal(candidate.deptStage?.status)),
        renderCell('Dept Joining Date', getVal(candidate.deptStage?.joiningDate)),
        renderCell('Dept Rating / Notes', `${getVal(candidate.deptStage?.rating)} | ${getVal(candidate.deptStage?.notes)}`, true),

        renderCell('Management Interviewer', getVal(candidate.mgmtInterviewer)),
        renderCell('Management Status', getVal(candidate.mgmtStage?.status)),
        renderCell('Management Notes', `${getVal(candidate.mgmtStage?.rating)} | ${getVal(candidate.mgmtStage?.notes)}`, true)
      ])}

      <div className="text-center mt-6 text-[10px] text-gray-400 border-t border-gray-200 pt-3">
        Jailaxmi Group of Companies · Confidential Recruitment Document · Authorized Internal Use Only
      </div>
    </div>
  );
}
