import React, { useEffect, useState } from 'react';
import { 
  FaProjectDiagram, FaCheckCircle, FaHourglassHalf, 
  FaCalendarAlt, FaClock, FaListUl, FaPlus 
} from 'react-icons/fa';
import { 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { hrService } from '../../../services/hrService';
import type { Task, Project, LeaveRequest } from '../../../types/dashboard';
import useAuthStore from '../../../store/authStore';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

const EmployeeDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Leave Form modal states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [projData, taskData, leaveData] = await Promise.all([
        hrService.getProjects(),
        hrService.getTasks(),
        hrService.getLeaveRequests(),
      ]);
      setProjects(projData.filter(p => p.manager === 'Jane Doe' || p.id === 'proj_01'));
      setTasks(taskData.filter(t => t.assigneeId === user.id));
      setLeaveRequests(leaveData.filter(l => l.employeeId === user.id));
    } catch (e) {
      console.error('Failed fetching employee metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleTaskStatus = async (taskId: string, currentStatus: Task['status']) => {
    if (!user) return;
    const nextStatus: Task['status'] = currentStatus === 'done' ? 'in_progress' : 'done';
    try {
      await hrService.updateTaskStatus(taskId, nextStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !startDate || !endDate || !reason.trim()) return;

    try {
      await hrService.createLeaveRequest({
        employeeId: user.id,
        employeeName: user.name,
        employeeAvatar: user.avatar,
        department: user.department || 'Software Engineering',
        type: leaveType,
        startDate,
        endDate,
        reason,
      });
      setShowLeaveModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      await fetchData();
      alert('Leave request submitted successfully for approval.');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-xs font-semibold">Loading your workspace...</p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const pendingTasks = todoTasks + inProgressTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const donutData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: pendingTasks },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-heading">Workspace Summary</h2>
          <p className="text-slate-555 text-slate-500 text-xs mt-1">Hello {user.name}, check your sprint tasks and request leave approvals.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowLeaveModal(true)} variant="outline" size="sm">
            <FaPlus className="w-3 h-3 mr-1.5" />
            Request Leave
          </Button>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm select-none">
            <FaCalendarAlt className="w-3.5 h-3.5 text-primary" />
            <span>Sprint 24: Ending July 5, 2026</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Projects</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{projects.length}</h3>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Active</span>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <FaProjectDiagram className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Tasks</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{completedTasks}</h3>
            <span className="text-[10px] text-slate-400">Out of {totalTasks} assigned</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
            <FaCheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Action Items</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{pendingTasks}</h3>
            <span className="text-[10px] text-slate-400">{inProgressTasks} In Progress</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
            <FaHourglassHalf className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Task Completion Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Task Completion Rate</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{completionRate}%</h3>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-accent shadow-inner">
            <FaListUl className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Checklists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Projects progress lists */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-850 font-heading">My Active Projects</h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 truncate block">{proj.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{proj.description}</span>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="w-24 bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-550 min-w-[24px] text-right">{proj.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist task table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-850 font-heading">My Task Checklist</h3>
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tasks assigned to your queue.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <div key={task.id} className="py-3 flex items-start space-x-3.5 first:pt-0 last:pb-0">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => handleToggleTaskStatus(task.id, task.status)}
                      className="h-4 w-4 border-slate-350 text-emerald-500 rounded focus:ring-emerald-450 mt-0.5 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold block ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{task.projectName}</span>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Mini charts and logs */}
        <div className="space-y-6">
          
          {/* Donut completed tasks card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-2 w-full text-left">Task Ratio Breakdown</h4>
            <div className="w-full h-36 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-800 font-heading">{completionRate}%</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Completed</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-[10px] font-semibold text-slate-550 border-t border-slate-100 pt-3 w-full justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{completedTasks} Done</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span>{pendingTasks} Remaining</span>
              </div>
            </div>
          </div>

          {/* Leave requests tracker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">My Leave Requests</h4>
            {leaveRequests.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No leave requests raised.</p>
            ) : (
              <div className="space-y-3">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block capitalize">{req.type} Leave</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{req.startDate} to {req.endDate}</span>
                    </div>
                    <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}>
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Milestone Deadlines</h4>
            <div className="space-y-3.5">
              {tasks.filter(t => t.status !== 'done').slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                    <FaClock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate leading-tight">{task.title}</h5>
                    <div className="flex items-center space-x-2 mt-1 select-none">
                      <span className="text-[9px] text-slate-400 font-medium">Due {task.dueDate}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      <span className={`text-[8px] font-bold uppercase ${task.priority === 'high' ? 'text-red-500' : 'text-slate-400'}`}>{task.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Leave Request modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShowLeaveModal(false)}></div>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 z-10 relative">
            <h3 className="text-base font-bold text-slate-800 font-heading mb-4">Submit Leave Request</h3>
            <form onSubmit={handleRequestLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveRequest['type'])}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="vacation">Annual Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="maternity">Maternity/Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Reason Description</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Vacation with family"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs h-20 resize-none focus:bg-white focus:border-primary transition outline-none"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={() => setShowLeaveModal(false)} variant="outline" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Submit Ticket</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;
