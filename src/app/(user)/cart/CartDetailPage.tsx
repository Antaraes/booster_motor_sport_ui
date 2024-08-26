'use client';
import { addCartToDatabase, getCartList } from '@/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { currency } from '@/lib';
import { formatter, isAuthenticated } from '@/lib/utils';
import {
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from '@/redux/api/cartApi';
import { fetchCartData } from '@/redux/asyncThunks/cartThunks';
import {
  combineToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart as removeFromCartCartSlice,
} from '@/redux/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Minus, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

interface CartDetailPageProps {}

const CartDetailPage: FC<CartDetailPageProps> = ({}) => {
  const { cart_items, total_price, item_quantity } = useAppSelector(
    (state) => state.cart
  );
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartList,
    enabled: isAuthenticated(),
  });

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
          (item: { product_id: { _id: any } }) =>
            item.product_id._id === newItem.product_id._id
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

  const [updateQuantity, { isLoading: isUpdating }] =
    useUpdateCartItemQuantityMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();
  const handleIncreaseQuantity = async (productId: string) => {
    // Find the item in the cart
    const cartItem = cart_items.find(
      (item) => item.product_id._id === productId
    );

    if (!cartItem) return;

    // Check if the current quantity is less than available product stock
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

  const handleDecreaseQuantity = async (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQueryProvide();

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
    <section className=" relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-gray-300">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                Shopping Cart
              </h2>
              <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                {item_quantity} Items
              </h2>
            </div>
            <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
              <div className="col-span-12 md:col-span-7">
                <p className="font-normal text-lg leading-8 text-gray-400">
                  Product Details
                </p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Quantity
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Total
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-y-scroll max-h-[500px]">
              {cart_items.length > 0 ? (
                cart_items.map((item, index) => (
                  <>
                    <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group">
                      <Trash
                        size={30}
                        color="red"
                        className=" cursor-pointer"
                        onClick={() => handleRemoveProduct(item.product_id._id)}
                      />

                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          width={320}
                          height={320}
                          className="h-full w-full object-contain "
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.media[0].path}`}
                          alt="perfume bottle image"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                        <div className="md:col-span-2">
                          <div className="flex flex-col gap-3">
                            <h6 className="font-semibold text-base leading-7 text-black">
                              {item.product_id.title}
                            </h6>

                            <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-indigo-600">
                              {currency}
                              {formatter.format(item.unit_price)}
                            </h6>
                          </div>
                        </div>
                        <div className="flex items-center  h-full max-md:mt-3">
                          <div className="flex items-center h-full">
                            <button
                              className="group rounded-l-xl px-2 xl:px-5 xl:py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                              onClick={() =>
                                handleDecreaseQuantity(item.product_id._id)
                              }
                            >
                              <svg
                                className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                xmlns="http://www.w3.org/2000/svg"
                                width={22}
                                height={22}
                                viewBox="0 0 22 22"
                                fill="none"
                              >
                                <path
                                  d="M16.5 11H5.5"
                                  stroke=""
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M16.5 11H5.5"
                                  stroke=""
                                  strokeOpacity="0.2"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M16.5 11H5.5"
                                  stroke=""
                                  strokeOpacity="0.2"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 px-2 xl:px-5 xl:py-[15px] py-0  text-center bg-transparent"
                            />
                            <button
                              className="group rounded-r-xl px-2 xl:px-5 xl:py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                              onClick={() =>
                                handleIncreaseQuantity(item.product_id._id)
                              }
                            >
                              <svg
                                className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                xmlns="http://www.w3.org/2000/svg"
                                width={22}
                                height={22}
                                viewBox="0 0 22 22"
                                fill="none"
                              >
                                <path
                                  d="M11 5.5V16.5M16.5 11H5.5"
                                  stroke=""
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M11 5.5V16.5M16.5 11H5.5"
                                  stroke=""
                                  strokeOpacity="0.2"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M11 5.5V16.5M16.5 11H5.5"
                                  stroke=""
                                  strokeOpacity="0.2"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center  md:justify-end max-md:mt-3 h-full">
                          <p className="font-bold text-base leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600">
                            {formatter.format(item.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-xl font-medium text-gray-700">
                    Your cart is empty
                  </p>
                  <p className="text-gray-500 mt-2">
                    Looks like you haven’t added anything to your cart yet.
                  </p>
                  <Link
                    href={'/'}
                    className="mt-4 bg-primary text-white px-6 py-2 rounded-md"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className=" col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
              Order Summary
            </h2>
            <div className="mt-8">
              {/* <div className="flex items-center justify-between pb-6">
                <p className="font-normal text-lg leading-8 text-black">
                  {item_quantity} Items
                </p>
                <p className="font-medium text-lg leading-8 text-black">
                  K{formatter.format(total_price)}
                </p>
              </div> */}
              <form>
                {/* <label className="flex  items-center mb-1.5 text-gray-600 text-sm font-medium">
                  Shipping
                </label>
                <div className="flex pb-6">
                  <div className="relative w-full">
                    <div className=" absolute left-0 top-0 py-3 px-4">
                      <span className="font-normal text-base text-gray-300">
                        Second Delivery
                      </span>
                    </div>
                    <input
                      type="text"
                      className="block w-full h-11 pr-10 pl-36 min-[500px]:pl-52 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-gray-400"
                      placeholder="$5.00"
                    />
                    <button
                      id="dropdown-button"
                      data-target="dropdown-delivery"
                      className="dropdown-toggle flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0 pl-2 "
                      type="button"
                    >
                      <svg
                        className="ml-2 my-auto"
                        width={12}
                        height={7}
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1.5L4.58578 5.08578C5.25245 5.75245 5.58579 6.08579 6 6.08579C6.41421 6.08579 6.74755 5.75245 7.41421 5.08579L11 1.5"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      id="dropdown-delivery"
                      aria-labelledby="dropdown-delivery"
                      className="z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-10 bg-white right-0"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Shopping
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Images
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            News
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Finance
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                {/* <label className="flex items-center mb-1.5 text-gray-400 text-sm font-medium">
                  Promo Code
                </label>
                <div className="flex pb-4 w-full">
                  <div className="relative w-full ">
                    <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                    <input
                      type="text"
                      className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                      placeholder="xxxx xxxx xxxx"
                    />
                    <button
                      id="dropdown-button"
                      data-target="dropdown"
                      className="dropdown-toggle flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0 pl-2 "
                      type="button"
                    >
                      <svg
                        className="ml-2 my-auto"
                        width={12}
                        height={7}
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1.5L4.58578 5.08578C5.25245 5.75245 5.58579 6.08579 6 6.08579C6.41421 6.08579 6.74755 5.75245 7.41421 5.08579L11 1.5"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className="absolute top-10 right-0 z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Shopping
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Images
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            News
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Finance
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                {/* <div className="flex items-center border-b border-gray-200">
                  <button className="rounded-lg w-full bg-black py-2.5 px-4 text-white text-sm font-semibold text-center mb-8 transition-all duration-500 hover:bg-black/80">
                    Apply
                  </button>
                </div> */}
                <div className="flex items-center justify-between py-8">
                  <p className="font-medium text-xl leading-8 text-black">
                    {item_quantity} Items
                  </p>
                  <p className="font-semibold text-xl leading-8 text-indigo-600">
                    {currency}
                    {formatter.format(total_price)}
                  </p>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full "
                  type="button"
                >
                  {checkoutmutation.isPending && <Spinner sm />}Checkout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartDetailPage;
