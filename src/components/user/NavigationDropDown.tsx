'use client';
import React, { FC, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useMediaQuery } from '@react-hook/media-query';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import useFetch from '@/hooks/useFetch';
import { getAllCategories } from '@/api';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import toast from 'react-hot-toast';

interface NavigationDropDownProps {}

interface Menu {
  id: any;
  name: string;
  subCategories?: SubMenu[];
}

interface SubMenu {
  id: number;
  name: string;
  link: string;
}

const NavigationDropDown: FC<NavigationDropDownProps> = () => {
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const handleMenuClick = (menu: Menu) => {
    if (menu.subCategories?.length == 0) {
      toast.error('There is no sub categories');
      return;
    }
    setActiveMenu(menu === activeMenu ? null : menu);
  };
  const handleRemoveMenuClick = () => {
    setActiveMenu(null);
  };
  const { data } = useFetch('all-categories', getAllCategories);
  const isMobile = useMediaQueryProvide();

  const categories = data?.data;

  const formatCategories = (categories: any) => {
    return categories
      ? categories
          .filter((category: any) => category.product !== null) // Filter out categories with no products
          .map((parentCategory: any) => ({
            _id: parentCategory._id,
            name: parentCategory.name,
            description: parentCategory.description,
          }))
      : [];
  };

  const formattedCategories = formatCategories(categories);

  if (isMobile) {
    return (
      <div>
        <p className="flex w-full items-center py-2 text-lg font-semibold">
          Products
        </p>

        <ul className="py-2 text-black overflow-y-scroll max-h-[200px]">
          {formattedCategories.map((category: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.3 }}
            >
              <Link
                className="flex rounded-md p-2 cursor-pointer  text-black text-sm items-center gap-x-4 hover:font-medium"
                href={{
                  pathname: `/products/${category.name}`,
                  query: {
                    categoryId: category._id,
                  },
                }}
              >
                <span className="flex-1 uppercase">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger className=" text-black before:bg-black/90 after:bg-black/90 hover:text-black/90 inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%] ">
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent className=" bg-white ">
              <ul className="grid xl:w-[1000px] md:w-[800px] overflow-y-scroll max-h-[200px] text-black p-4 gap-3 xl:grid-cols-4 md:grid-cols-3 z-50">
                {formattedCategories.map((category: any) => {
                  return (
                    <Link
                      href={{
                        pathname: `/products/${category.name}`,
                        query: {
                          categoryId: category._id,
                        },
                      }}
                      key={category.id}
                      passHref
                      className="text-wrap "
                    >
                      <p className="text-sm font-bold text-black/90 hover:text-primary uppercase">
                        {category.name}
                      </p>
                      <p className="text-muted-foreground mt-1 xl:text-xs md:text-[10px] leading-tight">
                        {category.description}
                      </p>
                    </Link>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground ',
            className
          )}
          {...props}
        >
          <div className="text-xs font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-background/20 mt-3">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
export default NavigationDropDown;
