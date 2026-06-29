import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEye, FaArchive } from 'react-icons/fa';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { hrService } from '../../../services/hrService';
import type { Project, ProjectStatus } from '../../../types/dashboard';
import useAuthStore from '../../../store/authStore';

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const user = useAuthStore((s) => s.user);

  // Form states for creating a new project
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planning');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await hrService.getProjects();
      if (showArchived) {
        setProjects(data);
      } else {
        setProjects(data.filter((p) => !p.isArchived && p.status !== 'archived'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [showArchived]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await hrService.createProject({
        name,
        manager: manager || user?.name || 'Unassigned',
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        teamSize: Number(teamSize),
        description,
        status,
      });
      setShowAddModal(false);
      setName('');
      setManager('');
      setDueDate('');
      setTeamSize(1);
      setDescription('');
      setStatus('planning');
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await hrService.deleteProject(id);
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await hrService.updateProject(id, { isArchived: true, status: 'archived' });
      await fetchProjects();
      alert('Project archived successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const bulkActions = [
    {
      label: 'Archive Selected',
      onClick: async (selected: Project[]) => {
        if (!window.confirm(`Are you sure you want to archive ${selected.length} project(s)?`)) return;
        try {
          await Promise.all(selected.map((p) => hrService.updateProject(p.id, { isArchived: true, status: 'archived' })));
          await fetchProjects();
          alert('Selected projects archived successfully!');
        } catch (err) {
          console.error(err);
        }
      },
      className: 'bg-orange-550 hover:bg-orange-600 text-white shadow-sm',
    },
  ];

  // Define table columns
  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      sortable: true,
      render: (row) => (
        <div className="max-w-xs">
          <span className="font-bold text-slate-800 block text-xs truncate">{row.name}</span>
          <span className="text-[10px] text-slate-400 block truncate">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'manager',
      header: 'Manager',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: ['planning', 'active', 'on_hold', 'completed', 'archived'],
      render: (row) => {
        const variants: Record<ProjectStatus, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
          planning: 'info',
          active: 'warning',
          on_hold: 'danger',
          completed: 'success',
          archived: 'neutral',
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2 w-24">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${row.progress}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: 'teamSize',
      header: 'Staff Count',
      sortable: true,
      render: (row) => <span>{row.teamSize} developers</span>,
    },
    {
      key: 'dueDate',
      header: 'Timeline Limit',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status !== 'archived' && (
            <button
              onClick={() => handleArchive(row.id)}
              className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-lg transition cursor-pointer"
              title="Archive Project"
            >
              <FaArchive className="w-3 h-3" />
            </button>
          )}
          {user?.role === 'manager' && (
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition cursor-pointer"
              title="Delete Project"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => alert(`Project detail summary:\nName: ${row.name}\nProgress: ${row.progress}%\nManager: ${row.manager}`)}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer"
            title="View details"
          >
            <FaEye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Sprint Project Portfolios</h2>
          <p className="text-slate-500 text-xs mt-1">Review active software project portfolios, spending tracks, and staff load.</p>
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

          {user?.role === 'manager' && (
            <Button onClick={() => setShowAddModal(true)} variant="primary" size="md">
              <FaPlus className="w-3 h-3 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      </div>

      {/* Reusable Data Table grid */}
      <Table
        columns={columns}
        data={projects}
        isLoading={loading}
        searchPlaceholder="Search projects by name..."
        searchKeys={['name', 'description', 'manager']}
        rowKey={(row) => row.id}
        bulkActions={bulkActions}
      />

      {/* Modal Dialog for creating projects */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 z-10 relative">
            <h3 className="text-base font-bold text-slate-800 font-heading mb-4">Initialize Software Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Stripe Checkout Gateway Integration"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Manager</label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="Jane Doe"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Timeline Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Development Size</label>
                  <input
                    type="number"
                    value={teamSize}
                    min={1}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status Phase</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="planning">Planning Phase</option>
                  <option value="active">Active Track</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed Phase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Abstract</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize project specifications..."
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs h-20 resize-none focus:bg-white focus:border-primary transition outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Create Milestone</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectListPage;
