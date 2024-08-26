'use client';
import { FC, useEffect, useState } from 'react';
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet';
import { CircleX, HeartIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  removeFromWishlist,
  setWishlists,
} from '@/redux/features/wishlistSlice';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import Image from 'next/image';
import { formatter, isAuthenticated } from '@/lib/utils';
import { Button } from '../ui/button';
import { currency } from '@/lib';
import API from '@/api/interceptor';
import { useMutation } from '@tanstack/react-query';
import { removeWishlist } from '@/api';
import toast from 'react-hot-toast';
import WishlistCount from './Product/WishlistCount';
import { useRouter } from 'next/navigation';

const WishlistIcon: FC = () => {
  const [wish, setWish] = useState<any[]>([]);

  const router = useRouter();
  const { wishlistCount, wishlists } = useAppSelector(
    (state) => state.wishlist
  );
  const dispatch = useAppDispatch();
  const isMobile = useMediaQueryProvide();
  const removewishlistmutation = useMutation({
    mutationFn: async (productId) => removeWishlist(productId),
    onSuccess: async (data: any) => {
      toast.success('Item removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response.data.errorDetails.message);
    },
  });
  const handleRemoveWishlist = (productId: any) => {
    dispatch(removeFromWishlist(productId));
    removewishlistmutation.mutate(productId);
  };
  if (isAuthenticated()) {
    WishlistCount();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <div className="flex flex-col items-center">
            <HeartIcon size={20} className="cursor-pointer" />
            <p className="text-xs my-1 lg:block hidden">My Wishlist</p>
          </div>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {wishlistCount}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="bg-white sm:max-w-xl overflow-y-scroll h-full md:h-full"
      >
        {wishlists.length > 0 ? (
          wishlists.map((wishlist, index) => (
            <div key={index} className="relative">
              <div
                onClick={() => router.push(`/${wishlist._id}`)}
                className="border-b-2 p-2 flex items-center gap-2 cursor-pointer relative group"
              >
                <div className="h-[100px] w-[100px]">
                  <Image
                    alt="Card background"
                    width={320}
                    height={320}
                    className="h-full w-full object-contain"
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${wishlist?.medias[0].path}`}
                  />
                </div>
                <div className="w-1/2 group-hover:text-red-500">
                  <p className="font-bold">{wishlist.title}</p>
                  <p className="font-bold">
                    {currency}
                    {formatter.format(wishlist.price)}
                  </p>
                </div>
              </div>

              <CircleX
                size={20}
                className=" hover:text-red-600 absolute right-5 top-5 cursor-pointer"
                onClick={() => handleRemoveWishlist(wishlist._id)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">No items in your wishlist.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistIcon;
