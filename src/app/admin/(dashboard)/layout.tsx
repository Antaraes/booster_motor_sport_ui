'use client';
import { useKeyboardShortcut } from '@/hooks/useKeyBoardShortcut';
import Navbar from '@/layout/admin/Navbar';
import Sidebar from '@/layout/admin/Sidebar';
import { logout } from '@/lib';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface layoutProps {
  children: React.ReactNode;
}

const Layout: FC<layoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const router = useRouter();
  const handleRoute = (route: string) => {
    router.push(route);
  };
  useKeyboardShortcut(['ctrl', 'b'], toggleSidebar);
  useKeyboardShortcut(['ctrl', 'k', 'shift'], () =>
    handleRoute('/admin/setting')
  );
  useKeyboardShortcut(['ctrl', 'l'], logout);
  useKeyboardShortcut(['alt', 't'], () => handleRoute('/admin/team'));
  return (
    <div className="flex min-h-screen">
      <Sidebar
        toggleSidebar={toggleSidebar}
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }  w-64 bg-background text-foreground flex-shrink-0 duration-200`}
      />
      {/* <Sidebar className="hidden" /> */}
      <div
        className={`flex-grow ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-0'} duration-200  bg-gray-100`}
      >
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={isSidebarOpen} />
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
