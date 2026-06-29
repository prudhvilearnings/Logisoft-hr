import React, { useEffect, useState } from 'react';
import { FaRunning, FaClock } from 'react-icons/fa';
import { Badge } from '../../../components/Badge';
import { hrService } from '../../../services/hrService';
import type { Task, TaskStatus } from '../../../types/dashboard';

const SprintBoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSprintTasks = async () => {
    setLoading(true);
    try {
      const data = await hrService.getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintTasks();
  }, []);

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    try {
      await hrService.updateTaskStatus(id, status);
      await fetchSprintTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-xs font-semibold">Loading Sprint Kanban...</p>
      </div>
    );
  }

  const columns: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
  const columnLabels: Record<TaskStatus, string> = {
    todo: 'Sprint Backlog',
    in_progress: 'Development',
    review: 'QA Testing',
    done: 'Closed Sprint',
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Sprint Kanban Board</h2>
          <p className="text-slate-500 text-xs mt-1">Review active backlog sprints, move statuses, and check closed items.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
          <FaRunning className="w-4 h-4 text-primary animate-pulse" />
          <span>Sprint 24 Active (End Date: July 5)</span>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((colKey) => {
          const colTasks = tasks.filter((t) => t.status === colKey);
          return (
            <div key={colKey} className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex flex-col h-[550px] min-w-[250px]">
              {/* Column header */}
              <div className="flex items-center justify-between mb-4 select-none">
                <span className="font-bold text-xs text-slate-700 font-heading leading-none">{columnLabels[colKey]}</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-bold text-[9px] leading-none min-w-[18px] text-center">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {colTasks.length === 0 ? (
                  <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-450 text-[10px] py-12">
                    Empty Column
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm hover:border-slate-350 transition duration-150 space-y-3 cursor-pointer"
                    >
                      <h4 className="font-bold text-xs text-slate-800 leading-snug">{task.title}</h4>
                      <p className="text-[9px] text-slate-400 font-medium leading-none">{task.projectName}</p>
                      
                      <div className="flex items-center justify-between select-none">
                        <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'}>
                          {task.priority}
                        </Badge>
                        <div className="flex items-center space-x-1.5 text-[8px] text-slate-400 font-semibold">
                          <FaClock className="w-2.5 h-2.5" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>

                      {/* Move controls inside Card */}
                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-medium">Move:</span>
                        <div className="flex space-x-1">
                          {colKey !== 'todo' && (
                            <button
                              onClick={() => {
                                const idx = columns.indexOf(colKey);
                                handleUpdateStatus(task.id, columns[idx - 1]);
                              }}
                              className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] text-slate-500 rounded-lg transition"
                            >
                              &larr;
                            </button>
                          )}
                          {colKey !== 'done' && (
                            <button
                              onClick={() => {
                                const idx = columns.indexOf(colKey);
                                handleUpdateStatus(task.id, columns[idx + 1]);
                              }}
                              className="px-1.5 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[9px] text-slate-500 rounded-lg transition"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SprintBoardPage;
