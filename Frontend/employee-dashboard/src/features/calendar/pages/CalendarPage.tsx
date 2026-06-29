import React, { useState } from 'react';
import { FaClock, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { Button } from '../../../components/Button';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'sprint' | 'sync' | 'leave' | 'general';
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'ev_01',
      title: 'Sprint 24 Review & Retrospective',
      date: '2026-07-03',
      time: '14:00 - 15:30',
      location: 'Zoom Conference ID 441',
      type: 'sprint',
    },
    {
      id: 'ev_02',
      title: 'AWS Cloud Data Migration Sync',
      date: '2026-07-05',
      time: '10:00 - 11:00',
      location: 'Slack Dev Huddle',
      type: 'sync',
    },
    {
      id: 'ev_03',
      title: 'David Miller - Approved Summer Vacation',
      date: '2026-07-10',
      time: 'All Day Event',
      location: 'Grand Canyon National Park',
      type: 'leave',
    },
    {
      id: 'ev_04',
      title: 'Global HR Compliance Policy Audit',
      date: '2026-07-06',
      time: '11:00 - 12:30',
      location: 'HQ Boardroom C',
      type: 'general',
    },
  ]);

  // States for adding a new event
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EventItem['type']>('general');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEv: EventItem = {
      id: `ev_${Date.now()}`,
      title,
      date,
      time: time || '12:00 - 13:00',
      location: location || 'Online Huddle',
      type,
    };
    setEvents((prev) => [...prev, newEv]);
    setShowAddModal(false);
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setType('general');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-heading">Calendar Agenda</h2>
          <p className="text-slate-500 text-xs mt-1">Review upcoming company sprints, sync meetings, and department leaves.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="md">
          <FaPlus className="w-3 h-3 mr-2" />
          Schedule Event
        </Button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Agenda Cards list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 font-heading">Scheduled Sprints & Syncs</h3>
          {events.length === 0 ? (
            <div className="bg-white p-6 border border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
              No upcoming events registered.
            </div>
          ) : (
            events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:border-slate-350 hover:shadow transition duration-150 flex items-start space-x-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border select-none ${
                    ev.type === 'sprint' ? 'bg-blue-50 border-blue-100 text-blue-500' :
                    ev.type === 'sync' ? 'bg-emerald-50 border-emerald-105 text-emerald-600' :
                    ev.type === 'leave' ? 'bg-orange-50 border-orange-100 text-orange-500' :
                    'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <span className="text-[10px] font-extrabold uppercase leading-none">
                      {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-base font-extrabold font-heading mt-0.5 leading-none">
                      {new Date(ev.date).getDate()}
                    </span>
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{ev.title}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-400 font-semibold select-none">
                      <div className="flex items-center space-x-1.5">
                        <FaClock className="w-3 h-3 text-slate-400" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Right Side: Mini Calendar visual simulator card */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 text-sm font-heading mb-4">Agenda Guidelines</h3>
          <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed font-semibold">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 block"></span>
              <span>Development Sprint Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
              <span>DevOps Cloud Syncs</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 block"></span>
              <span>Approved Leave Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 block"></span>
              <span>Compliance Policies Meetings</span>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-5 pt-4 text-[10px] text-slate-400 leading-normal font-medium">
            To synchronize events with external calendars (Google Calendar or MS Outlook), please visit your Profile Integration Preferences page.
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 z-10 relative">
            <h3 className="text-base font-bold text-slate-800 font-heading mb-4">Schedule Calendar Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Cloud Security Sync"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 14:00 - 15:30"
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Meeting Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Zoom ID or Boardroom A"
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Event Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventItem['type'])}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-primary transition outline-none"
                >
                  <option value="general">General Meeting</option>
                  <option value="sprint">Sprint Roadmap Review</option>
                  <option value="sync">DevOps Cloud Sync</option>
                  <option value="leave">Staff Leave Calendar</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" onClick={() => setShowAddModal(false)} variant="outline" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Schedule Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarPage;
