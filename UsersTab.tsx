import React, { useState } from 'react';
import { PortalUser } from '../types';
import { 
  UserPlus, ShieldAlert, Key, ClipboardList, Trash2, Edit2, CheckCircle2, User, Mail, Shield
} from 'lucide-react';

interface UsersTabProps {
  users: PortalUser[];
  canManage: boolean;
  onAddUser: (data: any) => Promise<boolean>;
  onUpdateUser: (uid: string, data: any) => Promise<boolean>;
}

export default function UsersTab({ users, canManage, onAddUser, onUpdateUser }: UsersTabProps) {
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null);
  
  // Create state
  const [newName, setNewName] = useState('');
  const [newUid, setNewUid] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newRole, setNewRole] = useState('sdc1');
  const [newRoleLabel, setNewRoleLabel] = useState('SDC Stage 1 Interviewer');
  const [newDept, setNewDept] = useState('Civil (Design & Construction)');
  
  // Edit state
  const [editName, setEditName] = useState('');
  const [editPwd, setEditPwd] = useState('');
  const [editRole, setEditRole] = useState('sdc1');
  const [editRoleLabel, setEditRoleLabel] = useState('');
  const [editDept, setEditDept] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto set role label on change for better user experience
  const handleRoleChange = (role: string) => {
    setNewRole(role);
    if (role === 'md') {
      setNewRoleLabel('Managing Director');
    } else if (role === 'hr') {
      setNewRoleLabel('Senior HR Executive');
    } else if (role === 'sdc1') {
      setNewRoleLabel('SDC Stage 1 Interviewer');
    } else if (role === 'sdc2') {
      setNewRoleLabel('SDC Stage 2 Interviewer');
    } else if (role === 'manager') {
      setNewRoleLabel('Sales Department Manager');
    } else if (role === 'mgmt') {
      setNewRoleLabel('Chief Operations Officer');
    }
  };

  const handleEditRoleChange = (role: string) => {
    setEditRole(role);
    if (role === 'md') {
      setEditRoleLabel('Managing Director');
    } else if (role === 'hr') {
      setEditRoleLabel('Senior HR Executive');
    } else if (role === 'sdc1') {
      setEditRoleLabel('SDC Stage 1 Interviewer');
    } else if (role === 'sdc2') {
      setEditRoleLabel('SDC Stage 2 Interviewer');
    } else if (role === 'manager') {
      setEditRoleLabel('Department Manager');
    } else if (role === 'mgmt') {
      setEditRoleLabel('Chief Operations Officer');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setErrorMsg('');
    setSuccessMsg('');

    if (!newName || !newUid || !newPwd || !newRoleLabel) {
      setErrorMsg('Please fill in all user profile parameters.');
      return;
    }

    setLoading(true);
    const ok = await onAddUser({
      name: newName,
      uid: newUid,
      pwd: newPwd,
      role: newRole,
      roleLabel: newRoleLabel,
      dept: newRole === 'manager' ? newDept : undefined
    });

    if (ok) {
      setSuccessMsg('Portal access successfully authorized!');
      setNewName('');
      setNewUid('');
      setNewPwd('');
    } else {
      setErrorMsg('Failed to create user. Verify if email is already taken.');
    }
    setLoading(false);
  };

  const handleEditClick = (u: PortalUser) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditPwd(u.pwd || '');
    setEditRole(u.role);
    setEditRoleLabel(u.roleLabel);
    setEditDept(u.dept || 'Sales');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const ok = await onUpdateUser(editingUser.uid, {
      name: editName,
      pwd: editPwd,
      role: editRole,
      roleLabel: editRoleLabel,
      dept: editRole === 'manager' ? editDept : undefined
    });

    if (ok) {
      setSuccessMsg(`User ${editingUser.uid} successfully modified!`);
      setEditingUser(null);
    } else {
      setErrorMsg('Failed to update user profile parameters.');
    }
    setLoading(false);
  };

  const getAvatarInitials = (n: string) => {
    return n.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Left Column: Authorized Staff Directory (col-span-8 or 12 depending on privilege) */}
      <div className={`${canManage ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4`}>
        <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#0F6E56]" /> Registered Staff Roster
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Personnel with credential access to candidate screening</p>
          </div>
          <span className="text-[10px] bg-slate-100 text-gray-600 font-mono px-2 py-0.5 rounded-full">
            {users.length} Users Total
          </span>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0F6E56] rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Users Roster List */}
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar">
          {users.map((u) => (
            <div key={u.uid} className="py-3.5 flex justify-between items-center group hover:bg-slate-50/50 px-2 rounded-lg transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0F6E56] font-bold text-xs flex items-center justify-center border border-emerald-100 flex-shrink-0">
                  {getAvatarInitials(u.name)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    {u.name}
                    <span className={`text-[8px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      u.role === 'md' ? 'bg-red-50 text-red-600 font-bold border border-red-200' :
                      u.role === 'hr' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      u.role === 'manager' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-0.5">{u.roleLabel}</div>
                  <div className="text-[9px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-300" /> {u.uid}
                    {u.dept && <span className="text-gray-500">• Dept: {u.dept}</span>}
                  </div>
                </div>
              </div>

              {canManage && (
                <button 
                  onClick={() => handleEditClick(u)}
                  className="p-1.5 hover:bg-[#0F6E56]/10 text-gray-400 hover:text-[#0F6E56] rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Add / Modify Form Panel (col-span-4) only shown if Admin/HR */}
      {canManage && (
        <div className="lg:col-span-4 space-y-6">
          
          {/* USER EDIT POPUP / SHEET */}
          {editingUser ? (
            <div className="bg-[#f0faf6] border border-emerald-200 rounded-xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                <h3 className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider flex items-center gap-1">
                  <Edit2 className="w-4 h-4" /> Edit Access Profile
                </h3>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="text-[10px] text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Full Name</label>
                  <input 
                    type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Access Role</label>
                  <select 
                    value={editRole} onChange={(e) => handleEditRoleChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  >
                    <option value="md">md (Managing Director)</option>
                    <option value="hr">hr (HR Recruiter)</option>
                    <option value="sdc1">sdc1 (SDC Stage 1 Interviewer)</option>
                    <option value="sdc2">sdc2 (SDC Stage 2 Interviewer)</option>
                    <option value="manager">manager (Department Manager)</option>
                    <option value="mgmt">mgmt (Operations Head)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Designation Label</label>
                  <input 
                    type="text" required value={editRoleLabel} onChange={(e) => setEditRoleLabel(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                {editRole === 'manager' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Assigned Department</label>
                    <select 
                      value={editDept} onChange={(e) => setEditDept(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                    >
                      <option>Civil (Design & Construction)</option>
                      <option>Sales</option>
                      <option>Accounts</option>
                      <option>Trainer & Digital Marketing</option>
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] font-bold text-gray-500">Security Password</label>
                    <span className="text-[9px] text-[#0F6E56] font-mono flex items-center gap-0.5">
                      <Key className="w-2.5 h-2.5" /> MD Override
                    </span>
                  </div>
                  <input 
                    type="password" required value={editPwd} onChange={(e) => setEditPwd(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full py-2 bg-[#0F6E56] hover:bg-[#085041] text-white font-bold text-xs rounded-lg transition mt-4 shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save User Settings'}
                </button>
              </form>
            </div>
          ) : (
            /* ADD NEW USER FORM */
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b border-gray-50 pb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1">
                  <UserPlus className="w-4 h-4 text-[#0F6E56]" /> Add Access Profile
                </h3>
                <p className="text-[9px] text-gray-400 mt-0.5">Delegate corporate portals access to panel members</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Full Name</label>
                  <input 
                    type="text" required placeholder="e.g. Ramesh Chandra" value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Username (Email ID) <span className="text-red-500">*</span></label>
                  <input 
                    type="email" required placeholder="e.g. ramesh@jailaxmi.com" value={newUid}
                    onChange={(e) => setNewUid(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Role Level</label>
                  <select 
                    value={newRole} onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  >
                    <option value="md">md (Managing Director)</option>
                    <option value="hr">hr (HR Recruiter)</option>
                    <option value="sdc1">sdc1 (SDC Stage 1 Interviewer)</option>
                    <option value="sdc2">sdc2 (SDC Stage 2 Interviewer)</option>
                    <option value="manager">manager (Department Manager)</option>
                    <option value="mgmt">mgmt (Operations Head)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Corporate Designation Label</label>
                  <input 
                    type="text" required value={newRoleLabel} onChange={(e) => setNewRoleLabel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                {newRole === 'manager' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Assigned Department</label>
                    <select 
                      value={newDept} onChange={(e) => setNewDept(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                    >
                      <option>Civil (Design & Construction)</option>
                      <option>Sales</option>
                      <option>Accounts</option>
                      <option>Trainer & Digital Marketing</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Default Password</label>
                  <input 
                    type="password" required placeholder="Security Password" value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:border-[#0F6E56]"
                  />
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-[#0F6E56] to-[#1D9E75] text-white font-bold text-xs rounded-lg transition mt-4 shadow-sm"
                >
                  {loading ? 'Authorizing User...' : 'Authorize Access Role'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
