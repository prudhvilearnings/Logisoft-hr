import React, { useEffect, useState } from 'react';
import { FaPlus, FaCheckCircle, FaSpinner, FaEye, FaArchive } from 'react-icons/fa';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { hrService } from '../../../services/hrService';
import type { Task, TaskPriority, TaskStatus } from '../../../types/dashboard';
import useAuthStore from '../../../store/authStore';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const user = useAuthStore((s) => s.user);

  // Form states for creating tasks
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectName, setProjectName] = useState('');
  const [assigneeName, setAssigneeName] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await hrService.getTasks();
      let filtered = data;
      if (user?.role === 'employee') {
        filtered = data.filter((t) => t.assigneeId === user.id);
      }
      if (!showArchived) {
        filtered = filtered.filter((t) => !t.isArchived);
      }
      setTasks(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [showArchived]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await hrService.createTask({
        title,
        priority,
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assigneeId: user?.id || 'unassigned',
        assigneeName: assigneeName || user?.name || 'Unassigned Staff',
        projectName: projectName || 'Logisoft Core HR Portal',
      });
      setShowAddModal(false);
      setTitle('');
      setPriority('medium');
      setProjectName('');
      setAssigneeName('');
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus = 'in_progress';
    if (currentStatus === 'todo') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'review';
    else if (currentStatus === 'review') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'todo';

    try {
      await hrService.updateTaskStatus(id, nextStatus);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await hrService.updateTask(id, { isArchived: true });
      await fetchTasks();
      alert('Task archived successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const bulkActions = [
    {
      label: 'Archive Selected',
      onClick: async (selected: Task[]) => {
        if (!window.confirm(`Are you sure you want to archive ${selected.length} task(s)?`)) return;
        try {
          await Promise.all(selected.map((t) => hrService.updateTask(t.id, { isArchived: true })));
          await fetchTasks();
          alert('Selected tasks archived successfully!');
        } catch (err) {
          console.error(err);
        }
      },
      className: 'bg-orange-550 hover:bg-orange-600 text-white shadow-sm',
    },
  ];

  const columns: Column<Task>[] = [
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      render: (row) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 block text-xs truncate">
            {row.title} {row.isArchived && <span className="text-orange-500 font-bold">(Archived)</span>}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">{row.projectName}</span>
        </div>
      ),
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      sortable: true,
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      filterable: true,
      filterOptions: ['low', 'medium', 'high'],
      render: (row) => {
        const variants: Record<TaskPriority, 'neutral' | 'warning' | 'danger'> = {
          low: 'neutral',
          medium: 'warning',
          high: 'danger',
        };
        return <Badge variant={variants[row.priority]}>{row.priority}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: ['todo', 'in_progress', 'review', 'done'],
      render: (row) => {
        const variants: Record<TaskStatus, 'neutral' | 'info' | 'warning' | 'success'> = {
          todo: 'neutral',
          in_progress: 'info',
          review: 'warning',
          done: 'success',
        };
        const labels: Record<TaskStatus, string> = {
          todo: 'Todo List',
          in_progress: 'In Progress',
          review: 'In Review',
          done: 'Completed',
        };
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {!row.isArchived && (
            <button
              onClick={() => handleArchive(row.id)}
              className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-lg transition cursor-pointer"
              title="Archive Task"
            >
              <FaArchive className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => handleUpdateStatus(row.id, row.status)}
            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition cursor-pointer"
            title="Cycle Task Status"
          >
            {row.status === 'done' ? <FaCheckCircle className="w-3 h-3 text-emerald-600" /> : <FaSpinner className="w-3 h-3 animate-spin text-emerald-500" />}
          </button>
          <button
            onClick={() => alert(`Task Detail Context:\nTitle: ${row.title}\nProject: ${row.projectName}\nAssignee: ${row.assigneeName}\nDue: ${row.dueDate}`)}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg transition cursor-pointer"
            title="Inspect Task"
          >
            <FaEye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Sprint Action Items</h2>
          <p className="text-slate-500 text-xs mt-1">
            {user?.role === 'employee' 
              ? 'Oversee and update your personal assigned tasks checklist.' 
              : 'Audit sprint items, assign tasks, and cycle development boards.'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-xs font-bold text-slate-550 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
            />
            <span>Show Archived</span>
          </label>

          <Button onClick={() => setShowAddModal(true)} variant="primary" size="md">
            <FaPlus className="w-3 h-3 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Table grid */}
      <Table
        columns={columns}
        data={tasks}
        isLoading={loading}
        searchPlaceholder="Search task title..."
        searchKeys={['title', 'projectName', 'assigneeName']}
        rowKey={(row) => row.id}
        bulkActions={bulkActions}
      />

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 z-10 relative">
            <h3 className="text-base font-bold text-slate-800 font-heading mb-4">Initialize Task Card</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Write unit tests for router guards"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Milestone Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Logisoft Core HR Portal"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                />
              </div>

              {user?.role !== 'employee' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Assign Developer Name</label>
                  <input
                    type="text"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="Alice Cooper"
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Priority Alert Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Create Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskListPage;
