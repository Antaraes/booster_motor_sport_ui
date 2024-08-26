import { FC, useEffect, useState } from 'react';
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetTitle,
} from '@/components/ui/sheet';
import { CircleUser, MenuIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import WishlistIcon from '../Wishlist';
import ShoppingCart from '../ShoppingCart';
import useFetch from '@/hooks/useFetch';
import { getAllCategories } from '@/api';
import { setCategory } from '@/redux/features/categorySlice';
import { formatter, isAdminAuthenticated, isAuthenticated } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currency, logoutForUser } from '@/lib';
import NavigationDropDown from '../NavigationDropDown';

interface MobileNavProps {
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

const MobileNav: FC<MobileNavProps> = ({
  handleSearchSubmit,
  handleSearchChange,
  searchQuery,
}) => {
  const data = useAppSelector((state) => state.search.data);
  const name = useAppSelector((state) => state.category.name);
  const dispatch = useAppDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Home'); // State for active tab
  const searchquery = useSearchParams();

  const search = searchquery.get('category');
  const router = useRouter(); // Use the router to manipulate the query parameters
  const location = usePathname();

  const navMenu = [{ name: 'Home', href: '/' }];
  const isMobile = useMediaQueryProvide();
  const { data: categories, isLoading } = useFetch(
    'all-categories',
    getAllCategories
  );

  // Handle the active category and update the query parameter
  const handleCategoryClick = (category: string) => {
    dispatch(setCategory(category));
    // router.push(`?catgory=${category}`);
  };

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    search && setActiveCategory(search);
  }, [location, isMobile]);

  return (
    <div className="bg-white lg:hidden block">
      <div className="flex w-[90%] mx-auto justify-between py-5 ">
        <div>
          <Sheet onOpenChange={setIsMenuOpen} open={isMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden" color="white">
                <MenuIcon className="h-10 w-10" />
                <span className="sr-only">Toggle navigation menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="grid gap-2 py-10">
                <Link
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  href="/"
                >
                  Home
                </Link>
                <NavigationDropDown />
                {isAuthenticated() ? (
                  <>
                    <Link
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      href="/user/profile"
                    >
                      Profile
                    </Link>
                    <Link
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      href="/"
                      onClick={logoutForUser}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      href="/login"
                    >
                      Login
                    </Link>
                    <Link
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      href="/signup"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="md:hidden items-center flex gap-4">
          <WishlistIcon />
          <ShoppingCart />

          <Sheet onOpenChange={setIsSearchOpen} open={isSearchOpen}>
            <SheetTrigger asChild>
              <SearchIcon className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="top" className="bg-white h-[400px]">
              <AnimatePresence>
                <motion.div className="z-30">
                  <div className="flex justify-center w-full">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center bg-transparent p-2 mt-10"
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
                        className="ml-2 text-black rounded"
                      >
                        <SearchIcon />
                      </Button>
                    </form>
                  </div>
                  <div className="w-[80%] mx-auto">
                    {data && data.products?.length > 0 && (
                      <>
                        <p className="text-muted-foreground font-bold">
                          Products
                        </p>
                        <hr />
                      </>
                    )}
                    <div className="max-h-[150px] overflow-y-scroll text-xs">
                      {data &&
                        data.products?.map((product: any) => (
                          <Link
                            key={product._id}
                            href={`/${product._id}`}
                            className="my-2 flex justify-start items-center gap-3"
                          >
                            <Image
                              alt="Image"
                              width={100}
                              height={100}
                              className="object-contain w-20 h-20 block"
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.medias[0]?.path}`}
                            />
                            <div>
                              <p className="">{product.title}</p>
                              <p className="font-medium">
                                {currency}
                                {formatter.format(product.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>
                    {data && data.products?.length === 0 && (
                      <p className="text-center text-muted-foreground font-bold">
                        No Result Found
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default MobileNav;
