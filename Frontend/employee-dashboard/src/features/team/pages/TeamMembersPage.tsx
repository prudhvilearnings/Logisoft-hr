import React, { useEffect, useState } from 'react';
import { FaTasks, FaUser, FaTrash } from 'react-icons/fa';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { hrService } from '../../../services/hrService';
import type { EmployeeOverview } from '../../../types/dashboard';

const TeamMembersPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeOverview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await hrService.getEmployees();
      // Filter only members within Software Engineering team
      setEmployees(data.filter(e => e.department === 'Software Engineering'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to offboard/remove this developer from the team?')) return;
    try {
      await hrService.deleteEmployee(id);
      await fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<EmployeeOverview>[] = [
    {
      key: 'name',
      header: 'Developer Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold shrink-0">
            <FaUser className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="block text-slate-800 font-bold leading-tight">{row.name}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">{row.role}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Deployment Status',
      sortable: true,
      filterable: true,
      filterOptions: ['active', 'on_leave', 'remote'],
      render: (row) => {
        const variants: Record<EmployeeOverview['status'], 'success' | 'warning' | 'info'> = {
          active: 'success',
          on_leave: 'warning',
          remote: 'info',
        };
        const labels = {
          active: 'Office Desk',
          on_leave: 'Sick Leave',
          remote: 'Work Remote',
        };
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>;
      },
    },
    {
      key: 'workload',
      header: 'Active Tasks Load',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1.5 text-xs text-slate-600">
          <FaTasks className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.workload} tasks assigned</span>
        </div>
      ),
    },
    {
      key: 'performanceScore',
      header: 'Sprint Efficiency rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-2 w-28">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${row.performanceScore}%` }}></div>
          </div>
          <span className="text-[10px] text-emerald-500 font-extrabold">{row.performanceScore}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleRemove(row.id)}
          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-505 text-red-500 rounded-lg transition cursor-pointer"
          title="Remove developer from team"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Team Developers Board</h2>
        <p className="text-slate-500 text-xs mt-1">Review active software developers statuses, performance indicators, and sprint workloads.</p>
      </div>

      {/* Roster Table */}
      <Table
        columns={columns}
        data={employees}
        isLoading={loading}
        searchPlaceholder="Search developers..."
        searchKeys={['name', 'role']}
        rowKey={(row) => row.id}
      />

    </div>
  );
};

export default TeamMembersPage;
