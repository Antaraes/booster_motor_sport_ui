'use client';
import { FC, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HeartIcon, MapPin, Settings, ShoppingCart, User } from 'lucide-react';
import Profile from './UserProfile';
import ShippingAddress from './ShippingAddress';
import WishlistProfile from './WishlistProfile';
import OrderHistroy from './OrderHistroy';
import UserSetting from './UserSetting';

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    router.push(`?tab=${tabName}`);
  };

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6 w-full max-w-7xl mx-auto p-5">
      <div className="bg-muted rounded-lg overflow-hidden">
        <nav className="flex flex-col">
          <CustomButton
            Icon={<User className="w-5 h-5" />}
            title="Profile"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
            tabName="profile"
          />
          <CustomButton
            Icon={<HeartIcon className="w-5 h-5" />}
            title="Wishlist"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
            tabName="wishlist"
          />
          <CustomButton
            Icon={<ShoppingCart className="w-5 h-5" />}
            title="Order History"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
            tabName="orders"
          />
          <CustomButton
            Icon={<MapPin className="w-5 h-5" />}
            title="Shipping Address"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
            tabName="shipping"
          />
          <CustomButton
            Icon={<Settings className="w-5 h-5" />}
            title="Setting"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
            tabName="setting"
          />
        </nav>
      </div>
      <div className="bg-muted rounded-lg p-6">
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'wishlist' && <WishlistProfile />}
        {activeTab === 'orders' && <OrderHistroy />}
        {activeTab === 'shipping' && <ShippingAddress />}
        {activeTab === 'setting' && <UserSetting />}
      </div>
    </div>
  );
};

export default Layout;

const CustomButton = ({
  activeTab,
  setActiveTab,
  Icon,
  title,
  tabName,
}: {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  Icon: ReactNode;
  title: string;
  tabName: string;
}) => (
  <Button
    variant={activeTab === tabName ? 'secondary' : 'ghost'}
    className="justify-start gap-3 hover:text-primary px-4 py-3 text-left w-full hover:bg-muted/50 transition-colors"
    onClick={() => setActiveTab(tabName)}
  >
    {Icon}
    {title}
  </Button>
);
