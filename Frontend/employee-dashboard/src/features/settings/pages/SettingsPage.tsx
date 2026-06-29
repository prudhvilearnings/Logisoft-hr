import React, { useState } from 'react';
import { FaUserShield, FaSlidersH, FaCheckCircle } from 'react-icons/fa';
import { Button } from '../../../components/Button';

const SettingsPage: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [allowSelfTasking, setAllowSelfTasking] = useState(true);
  const [enableRecruitment, setEnableRecruitment] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo: Global HRMS application settings saved successfully!');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Global HR Settings</h2>
        <p className="text-slate-500 text-xs mt-1">Configure global application preferences, security timeouts, and user roles permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Policy guidelines */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-slate-800 text-sm font-heading flex items-center gap-2">
            <FaUserShield className="text-primary" />
            <span>Security Directives</span>
          </h3>
          <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed font-semibold">
            <p>
              Changes applied here take immediate effect across all user profiles.
            </p>
            <p>
              Session timeouts govern storage token sweeps. Setting timeouts too long increases security risks on shared terminals.
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-medium leading-normal">
            For advanced server policies and database sync overrides, contact Tech Ops at infrastructure@logisoft.com.
          </div>
        </div>

        {/* Center/Right: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General preferences */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs font-heading mb-4 flex items-center gap-2 select-none">
              <FaSlidersH className="text-slate-400" />
              <span>General Configurations</span>
            </h4>
            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              {/* Theme selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Application Theme Preference</label>
                <div className="flex space-x-2">
                  {['light', 'dark'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setThemeMode(t as any);
                        if (t === 'dark') document.documentElement.classList.add('dark');
                        else document.documentElement.classList.remove('dark');
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition border ${
                        themeMode === t 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {t} Mode
                    </button>
                  ))}
                </div>
              </div>

              {/* Session timeout */}
              <div>
                <label htmlFor="timeout" className="block text-xs font-semibold text-slate-500 mb-1">Session Inactivity Timeout (minutes)</label>
                <input
                  id="timeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="block w-32 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  min={5}
                  max={180}
                  required
                />
              </div>

              {/* Switches */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-700 leading-none">Task Self-Assignment</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Allow employees to assign tasks to themselves</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowSelfTasking}
                    onChange={(e) => setAllowSelfTasking(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-700 leading-none">Hiring Pipeline Board</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Enable recruitment pipelines widget in Command dashboard</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableRecruitment}
                    onChange={(e) => setEnableRecruitment(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button type="submit" variant="primary" size="md">
                  <FaCheckCircle className="w-3.5 h-3.5 mr-2" />
                  Save App Configurations
                </Button>
              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
