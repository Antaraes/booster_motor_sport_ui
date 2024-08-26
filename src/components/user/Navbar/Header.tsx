import { FC, useEffect, useState } from 'react';
import ShoppingCart from '@/components/user/ShoppingCart';
import WishlistIcon from '@/components/user/Wishlist';
import {
  CircleUser,
  DollarSign,
  Globe,
  Mail,
  Phone,
  SearchIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavLink from './NavLink';
import useFetch from '@/hooks/useFetch';
import { get_user_profile, getAllCategories } from '@/api';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setCategory } from '@/redux/features/categorySlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logout, logoutForUser } from '@/lib';
import {
  formatCategories,
  isAdminAuthenticated,
  isAuthenticated,
} from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import NavigationDropDown from '../NavigationDropDown';

interface HeaderProps {
  isSearchOpen: boolean;
  toggleSearch: () => void;
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  setCategory: (category: string) => void;
}

const Header: FC<HeaderProps> = ({
  isSearchOpen,
  toggleSearch,
  handleSearchSubmit,
  handleSearchChange,
  searchQuery,
  setCategory: setSearchCategory,
}) => {
  const { data } = useFetch('all-categories', getAllCategories);
  const authenticated = isAuthenticated();
  const {
    data: profileDatas,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['get-user-profile'],
    queryFn: get_user_profile,
    enabled: authenticated,
  });

  const location = usePathname();
  const dispatch = useAppDispatch();
  const name = useAppSelector((state) => state.category.name);
  // State to track the active link
  const router = useRouter();

  const handleNavLinkClick = (category: string) => {
    dispatch(setCategory(category));
    // router.push(`?catgory=${category}`);
  };
  const handleChange = (e: string) => {
    setSearchCategory(e);
  };

  const formattedCategories = formatCategories(data?.data);

  return (
    <header className="lg:flex mb-4 flex-col hidden relative w-full h-auto min-h-20 shrink-0 bg-white border-b-2 drop-shadow-sm lg:justify-around">
      <section className="bg-primary text-white lg:block hidden">
        <div className="w-full lg:w-[80%] text-xs mx-auto py-2 flex justify-between items-center">
          <div className="flex gap-3">
            <Phone size={15} />
            <a href={`tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`}>
              {process.env.NEXT_PUBLIC_COMPANY_PHONE}
            </a>
            <Mail size={15} />
            <a
              className=""
              href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_MAIL}`}
            >
              {process.env.NEXT_PUBLIC_COMPANY_MAIL}
            </a>
          </div>
          <div className="flex gap-3">
            <DollarSign size={15} />
            <p>USD</p>
            <Globe size={15} />
            <a
              className=""
              href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_MAIL}`}
            >
              ENG
            </a>
          </div>
        </div>
      </section>
      <section className="lg:block hidden bg-accent-foreground text-white">
        <div className="w-[90%] lg:w-[80%] mx-auto py-3 flex justify-between items-center">
          <div className="font-bold text-xl lg:text-3xl">
            {process.env.NEXT_PUBLIC_COMPANY_NAME}
          </div>
          {location === '/' && (
            <div className="flex justify-center items-center">
              <Select onValueChange={handleChange}>
                <SelectTrigger className="min-w-[180px] w-auto mx-5">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {data &&
                    formattedCategories.map((category: any, index: number) => (
                      <SelectItem
                        className="hover:bg-primary hover:text-white"
                        key={index}
                        value={category._id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex justify-center w-full">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-transparent "
                >
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="link"
                    className=" text-white rounded"
                  >
                    <SearchIcon />
                  </Button>
                </form>
              </div>
            </div>
          )}
          <div className="flex justify-center items-start gap-5">
            <WishlistIcon />
            <ShoppingCart />
            {isAuthenticated() && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    {profileDatas?.data?.user?.avatar &&
                    profileDatas?.data?.user?.avatar !== '' ? (
                      <div className="max-h-52 max-w-52">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${profileDatas?.data.user.avatar}`}
                          alt="Avatar"
                          width="80"
                          height="80"
                          className="w-8 h-8 p-1 rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <CircleUser className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/user/profile')}
                  >
                    Profile
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
                  <DropdownMenuItem onClick={logoutForUser}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </section>
      <section className="bg-background text-background-foreground flex justify-between h-full w-[80%] mx-auto">
        <div className=" flex justify-between gap-4">
          <div className="   whitespace-nowrap px-4 py-2 flex space-x-4">
            <Link
              href={{ pathname: '/' }}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ease-in-out hover:text-primary/90 relative before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] before:bg-primary/90 after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0 ${
                location === '/'
                  ? 'after:w-[100%] text-primary after:right-0'
                  : 'hover:after:w-[50%] after:right-[50%] text-black'
              } after:bottom-0 after:bg-primary`}
            >
              Home
            </Link>

            <Link
              href={{ pathname: '/aboutus' }}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ease-in-out hover:text-primary/90 relative before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] before:bg-primary/90 after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0 ${
                location === '/aboutus'
                  ? 'after:w-[100%] text-primary after:right-0'
                  : 'hover:after:w-[50%] after:right-[50%] text-black'
              } after:bottom-0 after:bg-primary`}
            >
              About Us
            </Link>
            {formattedCategories && formattedCategories.length > 3 ? (
              <NavigationDropDown />
            ) : (
              formattedCategories.map((category: any) => (
                <NavLink
                  key={category.id}
                  name={category.name}
                  isActive={name === category.name}
                  category={category}
                />
              ))
            )}
          </div>
        </div>
        {!isAuthenticated() && !isAdminAuthenticated() && (
          <>
            <div className="flex items-center">
              <Link
                className={`cursor-pointer relative inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-8 text-base md:text-sm font-medium transition-all ease-in-out  hover:text-primary/90 
                    before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] before:bg-primary/90 
                    after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0
                        hover:after:w-[50%] after:right-[50%] text-black
                    } after:bottom-0  after:bg-primary`}
                href="/login"
              >
                Login
              </Link>
              <Link
                className={`cursor-pointer relative inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-8 text-base md:text-sm font-medium transition-all ease-in-out  hover:text-primary/90 
                    before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] before:bg-primary/90 
                    after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0 
                        hover:after:w-[50%] after:right-[50%] text-black
                    } after:bottom-0  after:bg-primary`}
                href="/signup"
              >
                Signup
              </Link>
            </div>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
