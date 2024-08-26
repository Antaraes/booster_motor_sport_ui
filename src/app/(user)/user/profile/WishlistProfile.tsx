import ProductCard from '@/components/user/Product/ProductCard';
import WishlistCount from '@/components/user/Product/WishlistCount';
import { isAuthenticated } from '@/lib/utils';
import { useAppSelector } from '@/redux/hook';
import Link from 'next/link';
import { FC } from 'react';

interface WishlistProfileProps {}

const WishlistProfile: FC<WishlistProfileProps> = ({}) => {
  const { wishlistCount, wishlists } = useAppSelector(
    (state) => state.wishlist
  );

  if (isAuthenticated()) {
    WishlistCount();
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Your Wishlist
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Discover the products you&apos;ve saved for later. Whether you&apos;re
        planning your next purchase or simply daydreaming, your wishlist is the
        perfect place to keep track of everything you love.
      </p>

      {wishlists.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {wishlists.map((wishlist, index) => (
            <ProductCard key={index} product={wishlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Your wishlist is currently empty
          </h3>
          <p className="text-gray-500">
            It seems you haven&apos;t added anything to your wishlist yet. Start
            exploring our products and add your favorites!
          </p>
          <Link
            href={'/'}
            className="mt-6 inline-block px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistProfile;
