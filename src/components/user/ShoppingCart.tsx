'use client';
import { FC, useEffect, useState } from 'react';
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CircleX,
  Cross,
  ShoppingCart as ShoppingCartIcon,
  Trash,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setWishlists } from '@/redux/features/wishlistSlice';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import {
  addToCart,
  combineToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart as removeFromCartCartSlice,
  updateCartItemQuantity,
} from '@/redux/features/cartSlice';
import { Button } from '../ui/button';
import { formatter, isAuthenticated } from '@/lib/utils';
import Image from 'next/image';
import {
  useGetCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from '@/redux/api/cartApi';
import { fetchCartData } from '@/redux/asyncThunks/cartThunks';
import useFetch from '@/hooks/useFetch';
import Link from 'next/link';
import { addCartToDatabase, getCartList } from '@/api';
import { usePathname, useRouter } from 'next/navigation';
import { currency } from '@/lib';
import CartListCount from './Product/CartListCount';
import API from '@/api/interceptor';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ShoppingCart: FC = () => {
  const [open, SetOpen] = useState(false);
  const { cart_items, total_price, item_quantity } = useAppSelector(
    (state) => state.cart
  );

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartList,
    enabled: isAuthenticated(),
  });

  // const [updateQuantity, { isLoading: isUpdating }] =
  //   useUpdateCartItemQuantityMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();

  const handleIncreaseQuantity = async (productId: string) => {
    // Find the item in the cart
    const cartItem = currentCartItems.find(
      (item) => item.product_id._id === productId
    );

    if (!cartItem) return;

    // Check if the   current quantity is less than available product stock

    if (cartItem.quantity < cartItem.product_id.product_quantity) {
      try {
        // Update the quantity in the Redux state
        dispatch(increaseQuantity(productId));

        // Call the backend to update the cart quantity
      } catch (error) {
        console.error('Failed to update quantity:', error);

        // Roll back the state change if the API call fails
        dispatch(decreaseQuantity(productId)); // Undo the increase
        // Optionally show an error message to the user
      }
    } else {
      toast.success('Cannot increase quantity, stock limit reached', {
        icon: '⚠️', // Optional: Add a warning icon
      });
      // Optionally show a message to the user about stock limitation
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (!isAuthenticated()) {
      dispatch(removeFromCartCartSlice(productId));
      return;
    } else {
      const hasProduct = cartData?.data.data.cart_items.filter(
        (c: any) => c.product_id._id === productId
      );
      if (hasProduct.length > 0) {
        removeFromCart({ productId: productId }).catch(console.error);
        dispatch(removeFromCartCartSlice(productId));
      }
      dispatch(removeFromCartCartSlice(productId));
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
    // updateQuantity({ productId: productId, quantity: -1 }).catch(console.error);
  };
  const dispatch = useAppDispatch();
  const location = usePathname();
  const isMobile = useMediaQueryProvide();

  const currentCartItems = useAppSelector((state) => state.cart.cart_items);

  useEffect(() => {
    if (cartData) {
      const apiCartItems =
        cartData.data.data?.cart_items?.map((item: any) => ({
          _id: item.product_id._id,
          product_id: item.product_id,
          media: item.media || [],
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })) || [];

      // Optional: Add logic to check if apiCartItems differs from the current state
      const currentItems = cart_items;
      const hasChanges = apiCartItems.some((newItem: any) => {
        const existingItem = currentItems.find(
          (item) => item.product_id._id === newItem.product_id._id
        );
        return (
          !existingItem ||
          existingItem.quantity !== newItem.quantity ||
          existingItem.unit_price !== newItem.unit_price
        );
      });
      const hasChangesinLocalStorage = currentItems.some((newItem: any) => {
        const existingItem = apiCartItems.find(
          (item: any) => item.product_id._id === newItem.product_id._id
        );
        return (
          !existingItem ||
          existingItem.quantity !== newItem.quantity ||
          existingItem.unit_price !== newItem.unit_price
        );
      });
      if (!hasChangesinLocalStorage) {
        dispatch(combineToCart(apiCartItems));
      }
    }
  }, [cartData]);

  const navigate = useRouter();

  useEffect(() => {
    SetOpen(false);
  }, [location]);

  const checkoutmutation = useMutation({
    mutationFn: (data: any) => {
      return addCartToDatabase(data);
    },
    onSuccess: async () => {
      await navigate.push('/checkout');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const handleCheckout = async (data: any) => {
    const authenticated = isAuthenticated();
    if (authenticated) {
      const formattedCartItems = cart_items.map((item: any) => ({
        product_id: item.product_id._id, // Extract product_id from the product object
        quantity: item.quantity, // Extract the quantity
      }));
      const cartListPayload = {
        cart_list: JSON.stringify(formattedCartItems),
      };
      checkoutmutation.mutate(cartListPayload);
    } else {
      toast((t) => (
        <div className="flex items-center p-4  rounded-lg ">
          <div className="flex-1">
            <p className="text-gray-800 font-semibold">You need to login</p>
          </div>
          <div className="flex space-x-4 ml-4">
            <Link
              className="text-blue-600 hover:underline font-semibold"
              onClick={() => toast.dismiss(t.id)}
              href={'/login'}
            >
              Login
            </Link>
            <button
              className="text-gray-600 hover:text-red-600 font-semibold"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ));
    }
  };

  return (
    <Sheet open={open} onOpenChange={SetOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <div className="flex flex-col items-center">
            <ShoppingCartIcon size={20} className="cursor-pointer" />
            <p className="text-xs my-1 lg:block hidden">Your Cart</p>
          </div>
          {item_quantity > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {item_quantity}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="bg-white sm:max-w-lg flex h-full flex-col  shadow-xl"
      >
        <SheetTitle className="  overflow-y-auto px-4  sm:px-6">
          Shoping Cart
        </SheetTitle>
        <ul className="flex-1  overflow-y-scroll  ">
          {cart_items.length > 0 &&
            cart_items.map((item: any, index: number) => (
              <li
                key={index}
                className="border-b-2 p-2 flex  items-center gap-2"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {item.media[0] === undefined && item.media.length > 0 ? (
                    <Image
                      alt="Card background"
                      width={320}
                      height={320}
                      className="h-full w-full object-contain object-center md:h-full md:w-full"
                      src={'/assets/imagenotfound.png'}
                    />
                  ) : (
                    <>
                      <Image
                        alt="Card background"
                        width={320}
                        height={320}
                        className="h-full w-full object-contain "
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.media[0]?.path}`}
                      />
                    </>
                  )}
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="grid grid-cols-3 text-base font-medium text-gray-900">
                    <p className="col-span-2 font-normal text-xs mb-4">
                      {item.product_id.title}
                    </p>
                    <div className="flex w-full justify-end">
                      <CircleX
                        size={20}
                        className="  cursor-pointer"
                        onClick={() => handleRemoveProduct(item.product_id._id)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(item.product_id._id)
                        }
                        className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent  flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          width={18}
                          height={19}
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.5 9.5H13.5"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        id="number"
                        value={item.quantity}
                        readOnly
                        className="border border-gray-200 rounded-full w-5 aspect-square outline-none text-gray-900 font-semibold text-sm   bg-gray-100  text-center"
                      />
                      <button
                        onClick={() =>
                          handleIncreaseQuantity(item.product_id._id)
                        }
                        className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent  flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
                      >
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          width={18}
                          height={19}
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.75 9.5H14.25M9 14.75V4.25"
                            stroke=""
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <p>
                      {currency}
                      {formatter.format(item.unit_price)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <div className="border-t border-gray-200 px-4 py-2  sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>
              {currency}
              {formatter.format(total_price)}
            </p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6 w-full">
            <Button className="w-full mb-3" disabled={cart_items.length === 0}>
              <Link href="/cart">View Cart</Link>
            </Button>
            <Button
              className="w-full "
              disabled={cart_items.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
