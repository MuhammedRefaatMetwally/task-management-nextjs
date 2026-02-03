'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { MobileSidebar } from './mobile-sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex flex-shrink-0 items-center gap-2 px-3 py-2 md:px-4 ms-2 mt-2">
              <MobileSidebar />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden md:flex h-9 w-9"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>

              <Breadcrumbs />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}