import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => setSidebarCollapsed((prev) => !prev);
  const handleMobileToggle = () => setMobileOpen((prev) => !prev);
  const handleMobileClose = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-recast-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      <Header
        onMenuToggle={handleMobileToggle}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main
        className={`
          pt-16 min-h-screen transition-all duration-300 ease-in-out
          ml-0 md:ml-64
          ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}
        `}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
