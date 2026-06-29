import React, { useEffect, useState } from 'react';
import { 
  FaUsers, FaTrophy, FaExclamationCircle, 
  FaClipboardCheck, FaPlus, FaCheck, FaUndo, FaCalendarAlt
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { hrService, SPRINT_VELOCITY_MOCK } from '../../../services/hrService';
import type { Task, Project, EmployeeOverview, LeaveRequest } from '../../../types/dashboard';
import useAuthStore from '../../../store/authStore';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

const CHARTS_COLORS = ['#3b82f6', '#10b981', '#7c3aed', '#f59e0b', '#ef4444'];

const TeamLeadDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const [employees, setEmployees] = useState<EmployeeOverview[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for assigning a new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskProject, setTaskProject] = useState('');

  // Leave Form modal states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchData = async () => {
    if (!user) return;
    try {
      const [empData, taskData, projData, leaveData] = await Promise.all([
        hrService.getEmployees(),
        hrService.getTasks(),
        hrService.getProjects(),
        hrService.getLeaveRequests(),
      ]);
      setEmployees(empData.filter(e => e.department === 'Software Engineering'));
      setTasks(taskData);
      setProjects(projData);
      setLeaveRequests(leaveData.filter(l => l.employeeId === user.id));
    } catch (e) {
      console.error('Failed fetching team lead dashboard metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleApproveTask = async (taskId: string) => {
    try {
      await hrService.updateTaskStatus(taskId, 'done');
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      await hrService.updateTaskStatus(taskId, 'in_progress');
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !assigneeId || !taskProject) return;

    const assigneeName = employees.find(emp => emp.id === assigneeId)?.name || 'Unassigned';
    
    try {
      await hrService.createTask({
        title: newTaskTitle,
        priority: taskPriority,
        status: 'todo',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assigneeId,
        assigneeName,
        projectName: taskProject,
      });

      setNewTaskTitle('');
      setAssigneeId('');
      setTaskProject('');
      setTaskPriority('medium');
      await fetchData();
      alert('Task assigned successfully!');
    } catch (err) {
      console.error(err);
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
        <p className="text-slate-500 mt-4 text-xs font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  // Calculate software engineering specific items
  const softwareDevTasks = tasks.filter(t => 
    employees.some(e => e.id === t.assigneeId)
  );

  const completedIssues = softwareDevTasks.filter(t => t.status === 'done').length;
  const openIssues = softwareDevTasks.filter(t => t.status !== 'done').length;
  const pendingReviews = softwareDevTasks.filter(t => t.status === 'review');

  const developerWorkloads = employees.map(emp => {
    const count = softwareDevTasks.filter(t => t.assigneeId === emp.id && t.status !== 'done').length;
    return { name: emp.name.split(' ')[0], value: count };
  }).filter(d => d.value > 0);

  const workloadChartData = developerWorkloads.length > 0 ? developerWorkloads : [{ name: 'None', value: 0 }];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-heading">Team Overview</h2>
          <p className="text-slate-500 text-xs mt-1">Hello {user.name}, supervise workloads and direct leaves.</p>
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

      {/* Roster KPI widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Developers size */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supervised Staff</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{employees.length}</h3>
            <span className="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">Active Roster</span>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <FaUsers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Completed sprint targets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Targets</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{completedIssues}</h3>
            <span className="text-[10px] text-slate-400">Total sprint tasks done</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
            <FaTrophy className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending review queues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Peer Reviews</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{pendingReviews.length}</h3>
            <span className="text-[10px] text-slate-400">Awaiting leader clearance</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
            <FaExclamationCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Open backlog remaining */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Open Backlog Load</span>
            <h3 className="text-2xl font-extrabold text-slate-800 font-heading">{openIssues}</h3>
            <span className="text-[10px] text-slate-400">Active tasks remaining</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
            <FaClipboardCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Graphs layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sprint planned vs completed Area velocity Recharts */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-4">Sprint Delivery History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPRINT_VELOCITY_MOCK} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="planned" fill="#3b82f6" name="Planned Targets" radius={[3, 3, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completed Targets" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Load share distribution donut Recharts */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-2">Team Workloads Share</h3>
          <div className="h-36 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workloadChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {workloadChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHARTS_COLORS[index % CHARTS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {workloadChartData.length > 0 && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-slate-800 font-heading">{openIssues}</span>
                <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">Remaining</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-550 border-t border-slate-100 pt-3">
            {workloadChartData.map((data, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHARTS_COLORS[idx % CHARTS_COLORS.length] }}></span>
                <span>{data.name}: {data.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Team Roster & Task Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Team members table roster & Pending Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Team member list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Team Developers Directory</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Name / Role</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Pending Load</th>
                    <th className="py-2.5 text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {employees.map((emp) => {
                    const empPendingTasks = softwareDevTasks.filter(t => t.assigneeId === emp.id && t.status !== 'done').length;
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-primary shrink-0 uppercase">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="block text-slate-900 font-bold leading-tight">{emp.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">{emp.role}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            emp.status === 'active' ? 'bg-emerald-50 text-emerald-500' : emp.status === 'remote' ? 'bg-indigo-50 text-indigo-505' : 'bg-orange-50 text-orange-500'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="py-3">{empPendingTasks} tasks pending</td>
                        <td className="py-3 text-right text-emerald-500 font-bold">{emp.performanceScore}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Pending Peer Reviews</h4>
            <div className="divide-y divide-slate-150">
              {pendingReviews.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs">No pending review pipelines to audit.</div>
              ) : (
                pendingReviews.map((task) => (
                  <div key={task.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">{task.title}</h5>
                      <span className="text-[10px] text-slate-400 block mt-1">Submitted by <span className="font-semibold text-slate-600">{task.assigneeName}</span> &bull; {task.projectName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveTask(task.id)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                        title="Approve and Complete"
                      >
                        <FaCheck className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRejectTask(task.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition cursor-pointer"
                        title="Reject and Re-open"
                      >
                        <FaUndo className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Task Assigner Form & Leave Requests list */}
        <div className="space-y-6">
          
          {/* Assigner form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h4 className="font-bold text-sm text-slate-850 font-heading mb-4">Assign Development Task</h4>
            <form className="space-y-4" onSubmit={handleAssignTask}>
              {/* Task Title */}
              <div>
                <label htmlFor="taskTitle" className="block text-xs font-semibold text-slate-400 mb-1">Task Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Axios response wrappers"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition"
                  required
                />
              </div>

              {/* Associate Project */}
              <div>
                <label htmlFor="assocProj" className="block text-xs font-semibold text-slate-400 mb-1">Project Milestone</label>
                <select
                  id="assocProj"
                  value={taskProject}
                  onChange={(e) => setTaskProject(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition"
                  required
                >
                  <option value="">Select Milestone</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.name}>{proj.name}</option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label htmlFor="assignee" className="block text-xs font-semibold text-slate-400 mb-1">Assign Developer</label>
                <select
                  id="assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition"
                  required
                >
                  <option value="">Select Team Member</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setTaskPriority(pri)}
                      className={`py-2 border text-[10px] font-bold rounded-xl capitalize transition ${
                        taskPriority === pri 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit assign button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-xs font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition cursor-pointer"
                >
                  <FaPlus className="w-3 h-3" />
                  <span>Assign Action Item</span>
                </button>
              </div>

            </form>
          </div>

          {/* Leave Tracker */}
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

export default TeamLeadDashboard;
