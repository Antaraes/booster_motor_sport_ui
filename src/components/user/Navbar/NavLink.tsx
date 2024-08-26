import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

interface NavLinkProps {
  name: string;
  isActive?: boolean;
  category: any;
}

const NavLink: FC<NavLinkProps> = ({ category, name, isActive }) => {
  const searchParams = useSearchParams();
  return (
    <Link
      href={{
        pathname: `/products/${category.name}`,
        query: {
          categoryId: category._id,
        },
      }}
      className={`cursor-pointer md:text-sm relative inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-8 text-base font-medium transition-all ease-in-out  hover:text-primary/90 
      before:transition-[width] before:ease-in-out before:duration-500 before:absolute before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] before:bg-primary/90 
      after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:origin-center after:h-[2px] after:w-0 ${
        searchParams.get('categoryId') === category._id
          ? 'after:w-[100%] text-primary after:right-0'
          : 'hover:after:w-[50%] after:right-[50%] text-black'
      } after:bottom-0  after:bg-primary`}
    >
      {name}
    </Link>
  );
};

export default NavLink;
