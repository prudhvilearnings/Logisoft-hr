import React from 'react';
import { FaFileCsv, FaFilePdf, FaTrophy, FaChartLine } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Button } from '../../../components/Button';
import { SPRINT_VELOCITY_MOCK, WEEKLY_PROGRESS_MOCK } from '../../../services/hrService';

const ReportsPage: React.FC = () => {
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Demo: Exporting Sprint Reports metrics in ${format.toUpperCase()} format...`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Sprint Performance Reports</h2>
          <p className="text-slate-500 text-xs mt-1">Export metrics summaries, velocity reports, and weekly team benchmarks.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
            <FaFileCsv className="w-3.5 h-3.5 mr-2 text-emerald-500" />
            Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="secondary" size="sm">
            <FaFilePdf className="w-3.5 h-3.5 mr-2 text-red-400" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical Velocity */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-4 flex items-center gap-2">
            <FaTrophy className="text-amber-500" />
            <span>Sprint Story Points Completion</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPRINT_VELOCITY_MOCK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="planned" fill="#3b82f6" name="Planned Stories" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completed Stories" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burn down or Weekly progress */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-4 flex items-center gap-2">
            <FaChartLine className="text-primary" />
            <span>Weekly Tasks Closure Frequency</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_PROGRESS_MOCK} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="tasks" stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 6 }} name="Completed Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
