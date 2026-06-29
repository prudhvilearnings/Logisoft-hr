import React, { useEffect, useState } from 'react';
import { FaBuilding, FaMoneyBillWave, FaChartPie, FaPercent } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table';
import { hrService } from '../../../services/hrService';
import type { DepartmentStats } from '../../../types/dashboard';

const CHARTS_COLORS = ['#3b82f6', '#10b981', '#7c3aed', '#f97316'];

const FinancePage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await hrService.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBudget = departments.reduce((acc, curr) => acc + curr.budget, 0);
  const totalSpent = departments.reduce((acc, curr) => acc + curr.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const remainingRate = totalBudget > 0 ? Math.round((totalRemaining / totalBudget) * 100) : 0;

  const pieData = departments.map((d) => ({
    name: d.name.split(' ')[0],
    value: d.spent,
  }));

  const columns: Column<DepartmentStats>[] = [
    {
      key: 'name',
      header: 'Department',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <FaBuilding className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-slate-900 font-bold leading-tight">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Budget Allocated',
      sortable: true,
      render: (row) => <span>${row.budget.toLocaleString()}</span>,
    },
    {
      key: 'spent',
      header: 'Budget Spent',
      sortable: true,
      render: (row) => <span className="text-orange-550">${row.spent.toLocaleString()}</span>,
    },
    {
      key: 'spentRatio',
      header: 'Spent Ratio',
      render: (row) => {
        const pct = Math.round((row.spent / row.budget) * 100);
        return (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min(pct, 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">{pct}%</span>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-xs font-semibold">Loading Accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Finance & Budget Reports</h2>
        <p className="text-slate-500 text-xs mt-1">Audit department allocations, spending ratios, and budget limits.</p>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Allocated Budget</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-heading">${totalBudget.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <FaMoneyBillWave className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Spent Budget</span>
            <h3 className="text-xl font-extrabold text-slate-855 text-orange-505 font-heading">${totalSpent.toLocaleString()}</h3>
          </div>
          <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
            <FaChartPie className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Capacity</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-heading">${totalRemaining.toLocaleString()}</h3>
            <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {remainingRate}% remaining
            </span>
          </div>
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
            <FaPercent className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recharts comparison graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Allocated vs Spent Bar */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-4">Allocation vs Expenditure</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickFormatter={(v) => v.split(' ')[0]} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`]} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="budget" fill="#3b82f6" name="Allocated Budget" radius={[3, 3, 0, 0]} />
                <Bar dataKey="spent" fill="#ef4444" name="Spent Budget" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses distribution Pie */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-2">Cost Share Distribution</h3>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHARTS_COLORS[index % CHARTS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-slate-550 border-t border-slate-100 pt-3">
            {pieData.map((data, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHARTS_COLORS[idx % CHARTS_COLORS.length] }}></span>
                <span>{data.name}: ${data.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Roster table */}
      <Table
        columns={columns}
        data={departments}
        rowKey={(row) => row.name}
      />

    </div>
  );
};

export default FinancePage;
