import WishlistCount from '@/components/user/Product/WishlistCount';
import Footer from '@/layout/user/Footer';
import Navbar from '@/layout/user/Navbar';
import { isAuthenticated } from '@/lib/utils';
import { FC, ReactNode } from 'react';

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
