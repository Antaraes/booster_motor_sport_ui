'use client';
import { useKeyboardShortcut } from '@/hooks/useKeyBoardShortcut';
import useSearchQuery from '@/hooks/useSearchQuery';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import Headroom from 'react-headroom';
import debounce from 'lodash/debounce';
import { setData } from '@/redux/features/searchSlice';
import Header from '@/components/user/Navbar/Header';
import MobileNav from '@/components/user/Navbar/MobileNav';
import toast from 'react-hot-toast';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const page = '1';
  const limit = '10';

  const data = useAppSelector((state) => state.search.data);
  const dispatch = useAppDispatch();
  const location = usePathname();
  const {
    data: searchedData,
    isLoading,
    error,
    refetch,
  } = useSearchQuery(
    page,
    limit,
    searchText,
    category == 'all' ? '' : category
  );

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  useKeyboardShortcut(['ctrl', 'shift', 'f'], () => toggleSearch());

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // debounceSearch(event.target.value);
  };

  const debounceSearch = debounce((query: string) => {
    refetch();
  }, 300);

  useEffect(() => {
    if (searchedData) {
      dispatch(setData(searchedData.data.data));
    }

    if (searchedData?.data.data.products.length === 0) {
      toast.success(
        "Sorry, we couldn't find the product you're looking for. Please try searching for another item or explore our popular categories!",
        {
          icon: '⚠️',
          duration: 3000,
        }
      );
      setSearchQuery('');
    }
  }, [searchedData, setData]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [location]);
  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    setSearchText(searchQuery);
  };
  return (
    <Headroom style={{ transition: 'all .5s ease-in-out', zIndex: 50 }}>
      <Header
        isSearchOpen={isSearchOpen}
        toggleSearch={toggleSearch}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        setCategory={setCategory}
      />
      <MobileNav
        handleSearchSubmit={handleSearchSubmit}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
    </Headroom>
  );
};

export default Navbar;
