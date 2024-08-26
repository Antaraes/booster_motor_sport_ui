import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useKeyboardShortcut } from '@/hooks/useKeyBoardShortcut';
import { logout } from '@/lib/index';
import { CircleUser, Menu, SearchIcon, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <div className="flex items-center shadow-md  sticky top-0 left-0 z-30 h-20 bg-white   drop-shadow-lg  gap-4 md:px-16 px-4">
      <div className={`flex justify-between items-center duration-300 w-full `}>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Menu
                  size={30}
                  className="  "
                  color="#040404"
                  onClick={toggleSidebar}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Sidebar ⌘+B</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <form className="w-full mx-auto hidden md:block ">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none rounded-3xl">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Button variant={'default'}>
            <Link href={'/'}>
              <Store className="md:hidden" color="white" />
              <p className="hidden md:flex">View Webiste</p>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-6 w-6" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut className="ms-4">
                  ⌘+Shift+K
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Support
                <DropdownMenuShortcut className="ms-4">
                  ⌘+L
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
