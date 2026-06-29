import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartPie, FaProjectDiagram, FaTasks, FaCalendarAlt, FaUser, 
  FaUsers, FaRunning, FaChartBar, FaUserTie, FaBuilding, 
  FaMoneyBillWave, FaClipboardCheck, FaChartLine, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import { ROLE_LABELS } from '../constants/roles';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  // Define navigation lists based on role privileges
  const getMenuItems = (): MenuItem[] => {
    const employeeItems: MenuItem[] = [
      { name: 'Dashboard', path: '/employee/dashboard', icon: FaChartPie },
      { name: 'Projects', path: '/employee/projects', icon: FaProjectDiagram },
      { name: 'Tasks', path: '/employee/tasks', icon: FaTasks },
      { name: 'Calendar', path: '/employee/calendar', icon: FaCalendarAlt },
      { name: 'Profile', path: '/employee/profile', icon: FaUser },
    ];

    const leadItems: MenuItem[] = [
      { name: 'Team Board', path: '/lead/team', icon: FaUsers },
      { name: 'Sprints', path: '/lead/sprints', icon: FaRunning },
      { name: 'Reports', path: '/lead/reports', icon: FaChartBar },
    ];

    const managerItems: MenuItem[] = [
      { name: 'Employees', path: '/manager/employees', icon: FaUserTie },
      { name: 'Departments', path: '/manager/departments', icon: FaBuilding },
      { name: 'Finance', path: '/manager/finance', icon: FaMoneyBillWave },
      { name: 'Approvals', path: '/manager/approvals', icon: FaClipboardCheck },
      { name: 'Analytics', path: '/manager/analytics', icon: FaChartLine },
      { name: 'Settings', path: '/manager/settings', icon: FaCog },
    ];

    if (user.role === 'manager') {
      return [...employeeItems, ...leadItems, ...managerItems];
    }
    if (user.role === 'lead') {
      return [...employeeItems, ...leadItems];
    }
    return employeeItems;
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-950 text-slate-350 border-r border-slate-900 select-none">
      <div>
        {/* Branding Title */}
        <div className="h-16 flex items-center px-6 border-b border-slate-900 gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-lg">
            <span className="text-white font-heading font-extrabold text-lg">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-white text-sm tracking-wide">Logisoft HR</span>
            <span className="text-[9px] text-primary uppercase font-bold tracking-widest">Enterprise</span>
          </div>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 border-b border-slate-900 flex items-center space-x-3">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-800"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white truncate leading-tight">{user.name}</h5>
            <span className="text-[9px] px-2 py-0.5 mt-1 inline-block bg-slate-900 border border-slate-800 rounded-full font-semibold text-primary uppercase tracking-wide">
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>

        {/* Scrollable list items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-900">
        <button
          onClick={() => {
            onCloseMobile();
            logout();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-red-400 hover:bg-red-950/20 transition cursor-pointer"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Disconnect Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop view (Expanded) & Laptop (Compact width rules handled in Layout parent) */}
      <aside className="hidden md:block md:w-64 lg:w-64 h-screen shrink-0 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile view (Slide Drawer overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          ></div>

          {/* Drawer content */}
          <div className="relative w-64 max-w-xs h-full bg-slate-950 shadow-2xl flex flex-col z-50 animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
