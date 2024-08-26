import { getWishlists } from '@/api';
import useFetch from '@/hooks/useFetch';
import { addToWishlist } from '@/redux/features/wishlistSlice';
import { useAppDispatch } from '@/redux/hook';
import { FC, useEffect } from 'react';

const WishlistCount = () => {
  const { data: wishlistData, isFetched: wishlistFetchSuccess } = useFetch(
    'wishlists',
    getWishlists
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (wishlistFetchSuccess) {
      // Add fetched wishlists to Redux store
      wishlistData &&
        wishlistData.data?.wish_list?.forEach((item: any) => {
          dispatch(
            addToWishlist({
              _id: item.product_id._id,
              price: item.product_id.price,
              title: item.product_id.title,
              medias: item.medias || [], // Ensure medias is always an array
            })
          );
        });
    }
  }, [wishlistData]);
};

export default WishlistCount;
