import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { hrService } from '../../../services/hrService';
import type { LeaveRequest } from '../../../types/dashboard';

const ApprovalsPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await hrService.getLeaveRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await hrService.updateLeaveStatus(id, 'approved');
      await fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await hrService.updateLeaveStatus(id, 'rejected');
      await fetchRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<LeaveRequest>[] = [
    {
      key: 'employeeName',
      header: 'Staff Member',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.employeeAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'}
            alt={row.employeeName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div>
            <span className="block text-slate-800 font-bold leading-tight">{row.employeeName}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">{row.department}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Category',
      sortable: true,
      render: (row) => <span className="capitalize">{row.type} Leave</span>,
    },
    {
      key: 'timeline',
      header: 'Leave Period',
      render: (row) => <span>{row.startDate} to {row.endDate}</span>,
    },
    {
      key: 'reason',
      header: 'Comment Reason',
      render: (row) => <span className="text-slate-500 italic">"{row.reason}"</span>,
    },
    {
      key: 'status',
      header: 'Decision Status',
      sortable: true,
      filterable: true,
      filterOptions: ['pending', 'approved', 'rejected'],
      render: (row) => {
        const variants: Record<LeaveRequest['status'], 'warning' | 'success' | 'danger'> = {
          pending: 'warning',
          approved: 'success',
          rejected: 'danger',
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === 'pending' ? (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition cursor-pointer"
                title="Approve Leave"
              >
                <FaCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition cursor-pointer"
                title="Reject Leave"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-semibold italic">Processed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Leave Approvals Console</h2>
        <p className="text-slate-500 text-xs mt-1">Review active leave request submissions, approve vacation slots, and dismiss tickets.</p>
      </div>

      {/* Roster Table */}
      <Table
        columns={columns}
        data={requests}
        isLoading={loading}
        searchPlaceholder="Search employee name..."
        searchKeys={['employeeName', 'department', 'reason']}
        rowKey={(row) => row.id}
      />

    </div>
  );
};

export default ApprovalsPage;
