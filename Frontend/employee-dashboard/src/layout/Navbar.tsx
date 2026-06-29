import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBars, FaSearch, FaBell, FaRegEnvelope, FaSun, FaMoon, 
  FaUser, FaSignOutAlt, FaBuilding, FaChevronDown 
} from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import { ROLE_LABELS } from '../constants/roles';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuthStore();
  const [isDark, setIsDark] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // References to handle click-outside dropdown closures
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mock notifications lists
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n_01',
      title: 'Leave Request Approved',
      body: 'Your sick leave request for July 1-2 has been approved by Jane Doe.',
      time: '10m ago',
      read: false,
    },
    {
      id: 'n_02',
      title: 'Sprint Review Scheduled',
      body: 'John Smith scheduled Sprint 24 Planning for July 3.',
      time: '1h ago',
      read: false,
    },
    {
      id: 'n_03',
      title: 'System Maintenance Update',
      body: 'Please review the updated Docker security and backup guidelines.',
      time: '1d ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Toggle dark class on root document
  const handleToggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 font-sans shadow-sm">
      {/* Left items: hamburger & search */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Toggle mobile sidebar */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <FaBars className="w-4 h-4" />
        </button>

        {/* Global search input */}
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FaSearch className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search tasks, projects, employees, reports..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary transition"
          />
        </div>
      </div>

      {/* Right items: message, notification, theme, profile */}
      <div className="flex items-center space-x-3">
        
        {/* Theme Toggle */}
        <button
          onClick={handleToggleTheme}
          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition cursor-pointer"
          aria-label="Toggle UI Theme"
        >
          {isDark ? <FaSun className="w-4 h-4 text-amber-500" /> : <FaMoon className="w-4 h-4" />}
        </button>

        {/* Messages Placeholder */}
        <button
          onClick={() => alert('Demo: Messages center integration planned for next phase.')}
          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition relative cursor-pointer"
          aria-label="Messages"
        >
          <FaRegEnvelope className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
        </button>

        {/* Notifications Panel Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition relative cursor-pointer"
            aria-label="Recent notifications list"
          >
            <FaBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-[8px] font-extrabold text-white rounded-full leading-none min-w-[14px] text-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-250 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Alerts & Actions</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-primary hover:underline font-bold transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">
                    No new alerts to review
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs leading-normal hover:bg-slate-50 transition relative flex flex-col ${
                        !notif.read ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium shrink-0 ml-2">{notif.time}</span>
                      </div>
                      <p className="text-slate-500 mt-1 pr-6">{notif.body}</p>
                      <button
                        onClick={(e) => deleteNotification(notif.id, e)}
                        className="absolute right-3 bottom-3 text-slate-450 hover:text-red-500 text-[10px] transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Menu Dropdown */}
        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1.5 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
              <span className="text-[9px] text-slate-400 mt-0.5 leading-none capitalize">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <FaChevronDown className="w-2.5 h-2.5 text-slate-455 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-slate-100 flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                <span className="text-[10px] text-slate-500 mt-1 leading-none truncate">{user.email}</span>
                {user.department && (
                  <div className="flex items-center text-[9px] text-slate-400 mt-2 gap-1.5 leading-none">
                    <FaBuilding className="w-2.5 h-2.5 shrink-0" />
                    <span>{user.department}</span>
                  </div>
                )}
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Redirecting to your Profile features...');
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 font-semibold transition cursor-pointer"
                >
                  <FaUser className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile Card</span>
                </button>
              </div>

              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center space-x-2.5 font-semibold transition cursor-pointer"
                >
                  <FaSignOutAlt className="w-3.5 h-3.5 text-red-400" />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
