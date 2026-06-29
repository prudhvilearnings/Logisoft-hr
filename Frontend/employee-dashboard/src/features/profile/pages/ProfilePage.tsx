import React, { useState } from 'react';
import { FaLock, FaCheckCircle, FaBuilding, FaSlidersH } from 'react-icons/fa';
import { Button } from '../../../components/Button';
import useAuthStore from '../../../store/authStore';
import { ROLE_LABELS } from '../../../constants/roles';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [chatSounds, setChatSounds] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo: Personal profile details updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    alert('Demo: Your account password has been updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) return null;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">My Profile Dashboard</h2>
        <p className="text-slate-500 text-xs mt-1">Manage your personnel details, security credentials, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Details Overview */}
        <div className="space-y-6">
          
          {/* Avatar card */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-md mb-4"
            />
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{user.name}</h3>
            <span className="text-[9px] px-2.5 py-0.5 bg-slate-900 border border-slate-850 text-primary font-bold rounded-full uppercase tracking-wider mt-1 inline-block select-none">
              {ROLE_LABELS[user.role]}
            </span>

            <div className="border-t border-slate-100 mt-6 pt-4 w-full text-xs text-slate-500 space-y-2 text-left font-semibold">
              <div className="flex items-center space-x-2">
                <FaBuilding className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Department: {user.department || 'General Admin'}</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-450 mt-1">
                <span>Unique ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs font-heading flex items-center gap-2 select-none">
              <FaSlidersH className="text-slate-400" />
              <span>Workspace Settings</span>
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-700 leading-none">Email Notifications</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Alerts for task assignments</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-700 leading-none">Assistant Audio Alerts</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">Sounds when chatbot replies</span>
                </div>
                <input
                  type="checkbox"
                  checked={chatSounds}
                  onChange={(e) => setChatSounds(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Center/Right: Details Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile details form */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs font-heading mb-4 select-none">Personal Details</h4>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="block w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-400 outline-none select-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="md">
                  <FaCheckCircle className="w-3.5 h-3.5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change password form */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs font-heading mb-4 select-none">Change Password Credentials</h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" size="md">
                  <FaLock className="w-3.5 h-3.5 mr-2" />
                  Update Password
                </Button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
