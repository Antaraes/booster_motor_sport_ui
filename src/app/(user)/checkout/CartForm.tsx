'use client';
import { getCartList } from '@/api';
import { Skeleton } from '@/components/ui/skeleton';
import useFetch from '@/hooks/useFetch';
import { currency } from '@/lib';
import { formatter } from '@/lib/utils';
import { useAppSelector } from '@/redux/hook';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect } from 'react';

interface CartFormProps {}

const CartForm: FC<CartFormProps> = ({}) => {
  const { data: data, isLoading, refetch } = useFetch('cart_list', getCartList);
  const { cart_items, total_price } = useAppSelector((state) => state.cart);

  useEffect(() => {
    refetch();
  }, [data, refetch]);

  refetch();

  if (isLoading) {
    return <Skeleton className="w-[300px] h-[500px]" />;
  }

  return (
    <div className="">
      <div className="px-4 pt-8">
        <p className="text-xl font-medium">Order Summary</p>
        <p className="text-gray-400">
          Check your items. And select a suitable shipping method.
        </p>

        {cart_items.length > 0 ? (
          <ul className="flex-1 h-[400px] my-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6 overflow-y-scroll">
            {cart_items.map((item: any, index: number) => (
              <div className="" key={index}>
                <div className="flex rounded-lg bg-white">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      className="h-full w-full object-contain"
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.media[0].path}`}
                      alt="Card background"
                      width={320}
                      height={320}
                    />
                  </div>
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">
                      {item.product_id.title}
                    </span>
                    <p className="mt-auto text-lg font-bold">
                      {currency}
                      {formatter.format(item.unit_price)}{' '}
                      <small>x{item.quantity}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ul>
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
      {cart_items.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 sm:px-6">
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              {currency}
              {formatter.format(total_price || 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartForm;
