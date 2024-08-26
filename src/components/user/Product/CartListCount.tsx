import { getCartList } from '@/api';
import useFetch from '@/hooks/useFetch';
import {
  combineToCart,
  updateCartItemQuantity,
} from '@/redux/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { FC, useEffect } from 'react';

const CartListCount: FC = () => {
  const { data: cartData, isLoading } = useFetch('cart', getCartList);
  const dispatch = useAppDispatch();
  const currentCartItems = useAppSelector((state) => state.cart.cart_items);

  useEffect(() => {
    if (cartData) {
      const apiCartItems =
        cartData.data?.cart_items?.map((item: any) => ({
          _id: item.product_id._id,
          product_id: item.product_id,
          media: item.media || [],
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })) || [];

      dispatch(combineToCart(apiCartItems));
    }
  }, [cartData, currentCartItems, dispatch]);

  return <div>Cart List Count Component</div>; // Placeholder return
};

export default CartListCount;
