import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaUserTie, FaEye, FaUsers, FaChevronRight, FaSitemap } from 'react-icons/fa';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { hrService } from '../../../services/hrService';
import type { EmployeeOverview } from '../../../types/dashboard';

const EmployeesAdminPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'table' | 'hierarchy'>('table');

  // Form states for creating employees
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Software Engineering');
  const [status, setStatus] = useState<EmployeeOverview['status']>('active');
  const [teamLeaderId, setTeamLeaderId] = useState('');
  const [isTeamLeader, setIsTeamLeader] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await hrService.getEmployees();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    try {
      await hrService.createEmployee({
        name,
        role,
        department,
        status,
        teamLeaderId: isTeamLeader ? undefined : (teamLeaderId || undefined),
        isTeamLeader: isTeamLeader || undefined,
      });
      setShowAddModal(false);
      setName('');
      setRole('');
      setDepartment('Software Engineering');
      setStatus('active');
      setTeamLeaderId('');
      setIsTeamLeader(false);
      await fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to offboard this employee?')) return;
    try {
      await hrService.deleteEmployee(id);
      await fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassignLeader = async (employeeId: string, leaderId: string) => {
    try {
      await hrService.updateEmployee(employeeId, {
        teamLeaderId: leaderId || undefined,
      });
      await fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const teamLeaders = employees.filter((e) => e.isTeamLeader);
  const unassignedEmployees = employees.filter((e) => !e.isTeamLeader && !e.teamLeaderId);

  const columns: Column<EmployeeOverview>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold shrink-0 text-slate-500">
            <FaUserTie className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-slate-800 font-bold leading-tight">{row.name}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">
              {row.role} {row.isTeamLeader && <span className="text-primary font-bold">(Leader)</span>}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      filterable: true,
      filterOptions: ['Software Engineering', 'Human Resources', 'Product Management', 'Marketing & Sales'],
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const variants: Record<EmployeeOverview['status'], 'success' | 'warning' | 'info'> = {
          active: 'success',
          on_leave: 'warning',
          remote: 'info',
        };
        const labels = {
          active: 'Office Desk',
          on_leave: 'Sick Leave',
          remote: 'Remote Desk',
        };
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
      },
    },
    {
      key: 'leaderName',
      header: 'Report Leader',
      render: (row) => {
        if (row.isTeamLeader) return <span className="text-[10px] text-slate-400 italic font-semibold">Self (Team Leader)</span>;
        const leader = employees.find((e) => e.id === row.teamLeaderId);
        return leader ? (
          <span className="text-xs text-slate-700 font-bold">{leader.name}</span>
        ) : (
          <span className="text-[10px] text-slate-400 italic">None (Unassigned)</span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition cursor-pointer"
            title="Delete Record"
          >
            <FaTrash className="w-3 h-3" />
          </button>
          <button
            onClick={() => alert(`Employee context summary:\nName: ${row.name}\nRole: ${row.role}\nLeader ID: ${row.teamLeaderId || 'None'}`)}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg transition cursor-pointer"
            title="View Details"
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Personnel Directory Administration</h2>
          <p className="text-slate-500 text-xs mt-1">Audit employee profiles, onboard new hires, assign reporting leaders, and check records.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="md">
          <FaPlus className="w-3 h-3 mr-2" />
          Onboard Employee
        </Button>
      </div>

      {/* Tabs controllers */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'table' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FaUsers className="w-4 h-4" />
          <span>All Staff List</span>
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'hierarchy' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FaSitemap className="w-4 h-4" />
          <span>Reporting Structure Tree</span>
        </button>
      </div>

      {/* Renders Active Tab */}
      {activeTab === 'table' ? (
        <Table
          columns={columns}
          data={employees}
          isLoading={loading}
          searchPlaceholder="Search employees by name..."
          searchKeys={['name', 'role', 'department']}
          rowKey={(row) => row.id}
        />
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Team Leaders Section */}
          <div className="grid grid-cols-1 gap-6">
            {teamLeaders.map((leader) => {
              const children = employees.filter((e) => e.teamLeaderId === leader.id);
              return (
                <div key={leader.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  {/* Leader Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        <FaUserTie className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 leading-none">{leader.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">{leader.role} • {leader.department}</span>
                      </div>
                    </div>
                    <Badge variant="info">Team Leader</Badge>
                  </div>

                  {/* Employees Group list */}
                  <div className="pl-6 space-y-2">
                    <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none mb-3">Direct Reports ({children.length})</h5>
                    {children.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">No direct reports assigned to this leader.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {children.map((emp) => (
                          <div key={emp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <FaChevronRight className="w-2.5 h-2.5 text-slate-400" />
                              <div>
                                <span className="font-bold text-xs text-slate-800 block leading-tight">{emp.name}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{emp.role}</span>
                              </div>
                            </div>
                            
                            {/* Reassign select dropdown */}
                            <select
                              value={emp.teamLeaderId || ''}
                              onChange={(e) => handleReassignLeader(emp.id, e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 py-1 px-1.5 focus:outline-none transition cursor-pointer"
                            >
                              {teamLeaders.map((tl) => (
                                <option key={tl.id} value={tl.id}>Lead: {tl.name}</option>
                              ))}
                              <option value="">Unassign</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Unassigned Staff Panel */}
            {unassignedEmployees.length > 0 && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="font-extrabold text-sm text-slate-700 leading-none">Unassigned Employees</h4>
                  <Badge variant="neutral">Pending reporting assignment</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                  {unassignedEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-800 block leading-tight">{emp.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">{emp.role}</span>
                      </div>
                      
                      {/* Assign dropdown */}
                      <select
                        value=""
                        onChange={(e) => handleReassignLeader(emp.id, e.target.value)}
                        className="bg-slate-50 border border-slate-250 rounded-lg text-[9px] font-bold text-slate-655 text-slate-500 py-1 px-1.5 focus:outline-none transition cursor-pointer"
                      >
                        <option value="">-- Select Leader --</option>
                        {teamLeaders.map((tl) => (
                          <option key={tl.id} value={tl.id}>{tl.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onboard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 z-10 relative">
            <h3 className="text-base font-bold text-slate-800 font-heading mb-4">Onboard Corporate Employee</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Employee Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Professional Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Cloud Operations Architect"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Assign Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Office Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeOverview['status'])}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="active">Office Desk</option>
                  <option value="remote">Remote Workspace</option>
                  <option value="on_leave">Leave Status</option>
                </select>
              </div>

              {/* Team Leader Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="leadercheck"
                  checked={isTeamLeader}
                  onChange={(e) => {
                    setIsTeamLeader(e.target.checked);
                    if (e.target.checked) setTeamLeaderId('');
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                />
                <label htmlFor="leadercheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Is this employee a Team Leader?
                </label>
              </div>

              {/* Select Leader if not a leader */}
              {!isTeamLeader && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Reporting Team Leader</label>
                  <select
                    value={teamLeaderId}
                    onChange={(e) => setTeamLeaderId(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  >
                    <option value="">-- No Leader (Unassigned) --</option>
                    {teamLeaders.map((tl) => (
                      <option key={tl.id} value={tl.id}>{tl.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Onboard Employee</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeesAdminPage;
