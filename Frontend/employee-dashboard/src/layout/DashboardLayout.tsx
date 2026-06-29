import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatbotWidget from '../features/chatbot/components/ChatbotWidget';

const DashboardLayout: React.FC = () => {
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  const handleToggleMobileSidebar = () => {
    setIsOpenMobileSidebar((prev) => !prev);
  };

  const handleCloseMobileSidebar = () => {
    setIsOpenMobileSidebar(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* Dynamic Adaptive Sidebar navigation */}
      <Sidebar 
        isOpenMobile={isOpenMobileSidebar} 
        onCloseMobile={handleCloseMobileSidebar} 
      />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Dynamic Top Navigation Bar */}
        <Navbar onToggleMobileSidebar={handleToggleMobileSidebar} />

        {/* Scrollable Workspace Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Floating HR Assistant Chatbot */}
        <ChatbotWidget />

        {/* Simple Footer */}
        <footer className="h-10 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between px-6 text-[10px] text-slate-400 font-semibold select-none">
          <span>Logisoft HRMS Portal &bull; Enterprise Operations Panel</span>
          <span>Version 1.4.2</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
