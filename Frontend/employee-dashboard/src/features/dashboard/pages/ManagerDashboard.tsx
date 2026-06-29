import React, { useEffect, useState } from 'react';
import { 
  FaUserTie, FaProjectDiagram, FaMoneyBillWave, FaCalendarTimes,
  FaCheck, FaTimes, FaBuilding, FaArrowUp, FaBriefcase, FaUserPlus
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { hrService, MONTHLY_GROWTH_MOCK } from '../../../services/hrService';
import type { Project, EmployeeOverview, LeaveRequest, DepartmentStats } from '../../../types/dashboard';

const ManagerDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeOverview[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats for the corporate hiring pipeline card
  const [hiringPositions] = useState([
    { role: 'Senior Frontend Architect', candidates: 4, department: 'Software Engineering' },
    { role: 'DevOps & Cloud Specialist', candidates: 2, department: 'Software Engineering' },
    { role: 'HR Operations Assistant', candidates: 3, department: 'Human Resources' },
  ]);

  const fetchData = async () => {
    try {
      const [empData, projData, deptData, leaveData] = await Promise.all([
        hrService.getEmployees(),
        hrService.getProjects(),
        hrService.getDepartments(),
        hrService.getLeaveRequests(),
      ]);
      setEmployees(empData);
      setProjects(projData);
      setDepartments(deptData);
      setLeaveRequests(leaveData);
    } catch (e) {
      console.error('Failed fetching manager dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Action: Approve Employee Leave request
   */
  const handleApproveLeave = async (id: string) => {
    try {
      await hrService.updateLeaveStatus(id, 'approved');
      await fetchData(); // Reload metrics dynamically
      alert('Leave request approved successfully.');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Action: Reject Employee Leave request
   */
  const handleRejectLeave = async (id: string) => {
    try {
      await hrService.updateLeaveStatus(id, 'rejected');
      await fetchData(); // Reload metrics dynamically
      alert('Leave request rejected.');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-xs font-semibold">Loading HR Analytics...</p>
      </div>
    );
  }

  // Calculate corporate aggregates
  const totalEmployeesCount = employees.length;
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'pending').length;
  
  // Calculate total budget vs spent from departments
  const totalBudget = departments.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = departments.reduce((acc, curr) => acc + curr.spent, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-heading">Corporate Command Center</h2>
          <p className="text-slate-500 text-xs mt-1">Hello Jane Doe, oversee corporate accounts, employee directories, and approvals.</p>
        </div>
      </div>

      {/* Corporate KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Headcount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Headcount</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{totalEmployeesCount}</h3>
            <span className="text-[10px] text-slate-400">Across {departments.length} departments</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
            <FaUserTie className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Projects</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{activeProjectsCount}</h3>
            <span className="text-[10px] text-slate-400">Out of {projects.length} milestones</span>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <FaProjectDiagram className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Corporate Spending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quarterly Expenses</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">${totalSpent.toLocaleString()}</h3>
            <span className="text-[10px] text-slate-400">Budget: ${totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
            <FaMoneyBillWave className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Pending Leaves requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Leaves</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{pendingLeavesCount}</h3>
            <span className="text-[10px] text-slate-400">Awaiting HR approvals</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
            <FaCalendarTimes className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue vs Expenses Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-sm text-slate-850 font-heading">Corporate Growth & Expenses</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Timeline monitoring of company revenue versus cost margins</p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-500">
              <FaArrowUp className="w-3 h-3 animate-bounce" />
              <span>+23.4% Revenue Growth</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_GROWTH_MOCK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #cbd5e1' }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Gross Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Operating Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Budgets Comparisons Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Department Cost Comparisons</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickFormatter={(v) => v.split(' ')[0]} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`]} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="budget" fill="#3b82f6" name="Allocation" radius={[3, 3, 0, 0]} />
                <Bar dataKey="spent" fill="#f97316" name="Spent" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Operations lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Department Directory table roster & Leaves Audits */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Department breakdown roster */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Department Directory Overview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Department Name</th>
                    <th className="py-2.5 text-right">Headcount</th>
                    <th className="py-2.5 text-right">Performance Avg</th>
                    <th className="py-2.5 text-right">Spent Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {departments.map((dept, idx) => {
                    const pctSpent = Math.round((dept.spent / dept.budget) * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <FaBuilding className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="text-slate-900 font-bold leading-tight">{dept.name}</span>
                        </td>
                        <td className="py-3 text-right">{dept.headcount} staff</td>
                        <td className="py-3 text-right text-emerald-500 font-bold">{dept.performance}%</td>
                        <td className="py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-slate-800 font-bold text-xs">{pctSpent}% spent</span>
                            <div className="w-20 bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${pctSpent > 90 ? 'bg-red-500' : 'bg-primary'}`} 
                                style={{ width: `${Math.min(pctSpent, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Leaves review list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Pending Leave Approvals</h4>
            <div className="divide-y divide-slate-150">
              {leaveRequests.filter(l => l.status === 'pending').length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs">No pending leave requests to audit.</div>
              ) : (
                leaveRequests.filter(l => l.status === 'pending').map((request) => (
                  <div key={request.id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.employeeAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'}
                        alt={request.employeeName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">{request.employeeName}</h5>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {request.department} &bull; <span className="capitalize">{request.type} Leave</span> &bull; {request.startDate} to {request.endDate}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 italic">"{request.reason}"</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      <button
                        onClick={() => handleApproveLeave(request.id)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                        title="Approve leave request"
                      >
                        <FaCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRejectLeave(request.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition cursor-pointer"
                        title="Reject leave request"
                      >
                        <FaTimes className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Hiring Pipeline summary and add employee link */}
        <div className="space-y-6">
          
          {/* Hiring pipeline card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Talent Acquisition Pipeline</h4>
            <div className="space-y-4">
              {hiringPositions.map((pos, idx) => (
                <div key={idx} className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-none last:pb-0">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-tight">{pos.role}</h5>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{pos.department}</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0">
                    {pos.candidates} candidates
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert('Demo: Redirecting to candidate matching pipeline...')}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <FaBriefcase className="w-3.5 h-3.5" />
              <span>Review Candidates</span>
            </button>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Corporate Management Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => alert('Demo redirect: Open employee administration registry')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <FaUserPlus className="w-4 h-4 text-slate-500" />
                <span>Onboard New Personnel</span>
              </button>
              <button
                onClick={() => alert('Demo redirect: Open financial corporate accounts audits')}
                className="w-full flex items-center space-x-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <FaBuilding className="w-4 h-4 text-slate-500" />
                <span>Allocate Department Budgets</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ManagerDashboard;
