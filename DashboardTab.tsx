import React from 'react';
import { JobApplication } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend 
} from 'recharts';
import { 
  Users, CheckCircle2, AlertCircle, FileText, Ban, GraduationCap, Building2, Eye, Mail
} from 'lucide-react';

interface DashboardTabProps {
  applications: JobApplication[];
  onSelectCandidate: (candidate: JobApplication) => void;
}

export default function DashboardTab({ applications, onSelectCandidate }: DashboardTabProps) {
  // Aggregate Metrics
  const total = applications.length;
  const countByStatus = (status: string) => applications.filter(a => a.status === status).length;
  
  const stats = [
    { label: 'Total Applicants', val: total, color: 'border-l-4 border-[#0F6E56]', bg: 'bg-[#f0faf6]', text: 'text-[#0F6E56]', icon: Users },
    { label: 'New / Pending', val: countByStatus('New'), color: 'border-l-4 border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', icon: FileText },
    { label: 'Under Review', val: countByStatus('Review'), color: 'border-l-4 border-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
    { label: 'Shortlisted', val: countByStatus('Shortlisted'), color: 'border-l-4 border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', icon: Eye },
    { label: 'Selected', val: countByStatus('Selected'), color: 'border-l-4 border-[#1D9E75]', bg: 'bg-emerald-50/50', text: 'text-emerald-600', icon: CheckCircle2 },
    { label: 'Rejected', val: countByStatus('Rejected'), color: 'border-l-4 border-red-500', bg: 'bg-red-50', text: 'text-red-600', icon: Ban },
    { label: 'Joined Team', val: countByStatus('Joined'), color: 'border-l-4 border-teal-500', bg: 'bg-teal-50', text: 'text-teal-600', icon: GraduationCap }
  ];

  // Pipeline Status chart data
  const pipelineData = [
    { name: 'New', count: countByStatus('New'), fill: '#a855f7' },
    { name: 'Review', count: countByStatus('Review'), fill: '#f59e0b' },
    { name: 'Shortlisted', count: countByStatus('Shortlisted'), fill: '#3b82f6' },
    { name: 'Selected', count: countByStatus('Selected'), fill: '#1d9e75' },
    { name: 'Rejected', count: countByStatus('Rejected'), fill: '#ef4444' },
    { name: 'Joined', count: countByStatus('Joined'), fill: '#0f6e56' }
  ];

  // Department representation data
  const deptMap: Record<string, number> = {};
  applications.forEach(a => {
    const d = a.department || 'Administration';
    deptMap[d] = (deptMap[d] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, count]) => ({
    name,
    count
  }));

  // Recent applications (take up to 5)
  const recentApps = [...applications]
    .sort((a, b) => {
      // simple lexicographical sort or fallback
      return b.refNo.localeCompare(a.refNo);
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 7 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {stats.map((s, idx) => {
          const IconComponent = s.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 ${s.color} hover:shadow transition`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{s.label}</span>
                <div className={`p-1 rounded ${s.bg}`}>
                  <IconComponent className={`w-3.5 h-3.5 ${s.text}`} />
                </div>
              </div>
              <div className="text-2xl font-black font-mono text-gray-900 mt-2">{s.val}</div>
            </div>
          );
        })}
      </div>

      {/* Main split dashboard section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Applicants (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0F6E56]" /> Recent Form Submissions
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Most recent incoming recruitment profiles</p>
            </div>
            <span className="text-[10px] bg-[#0F6E56]/10 text-[#0F6E56] font-bold px-2 py-0.5 rounded-full uppercase">
              Latest Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-2 font-semibold">Ref / Name</th>
                  <th className="pb-2 font-semibold">Position</th>
                  <th className="pb-2 font-semibold text-center">Score</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentApps.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 group transition">
                    <td className="py-3">
                      <div className="font-mono text-[10px] text-gray-400">{candidate.refNo}</div>
                      <div className="font-bold text-gray-900 group-hover:text-[#0F6E56] transition">{candidate.fullName}</div>
                    </td>
                    <td className="py-3 text-gray-600">
                      <div>{candidate.jobTitle}</div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{candidate.department}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                        (candidate.aiScore || 0) >= 85 
                          ? 'bg-emerald-50 text-[#0F6E56]' 
                          : (candidate.aiScore || 0) >= 70 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'bg-slate-100 text-gray-600'
                      }`}>
                        {candidate.aiScore || '—'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        candidate.status === 'New' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                        candidate.status === 'Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        candidate.status === 'Shortlisted' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        candidate.status === 'Selected' ? 'bg-emerald-50 text-[#0F6E56] border border-emerald-200' :
                        candidate.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-200' :
                        'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => onSelectCandidate(candidate)}
                        className="p-1 px-2.5 bg-gray-50 hover:bg-[#0F6E56] hover:text-white rounded text-[10px] font-bold text-gray-600 transition"
                      >
                        Vetting
                      </button>
                    </td>
                  </tr>
                ))}

                {recentApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No applications currently registered in portal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Charts Panels (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 p-5 space-y-6 shadow-sm flex flex-col justify-between">
          
          {/* Chart 1: Hiring Status Pipe */}
          <div className="space-y-3">
            <div className="border-b border-gray-50 pb-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Hiring Pipeline Funnel</h4>
              <p className="text-[9px] text-gray-400">Total volume of candidates grouped by stages</p>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }} 
                    cursor={{ fill: 'rgba(15, 110, 86, 0.05)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Dept Demographics */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="border-b border-gray-50 pb-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Department Distribution</h4>
              <p className="text-[9px] text-gray-400">Volume index across production &amp; business lines</p>
            </div>
            <div className="h-44">
              {deptData.length === 0 ? (
                <div className="text-center text-gray-400 text-xs py-12">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 8, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#0F6E56" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
