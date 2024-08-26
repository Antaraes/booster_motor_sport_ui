'use client';
import { FC, useEffect, useRef, useState } from 'react';
import ShippingAddressForm from './ShippingAddress';
import CartForm from './CartForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addCheckout, getCartList } from '@/api';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/useFetch';

interface CartPageProps {}

const CheckoutSchema = z.object({
  payment_method: z.enum(['credit-card', 'visa-card', 'cash-on-deli']),

  order_note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof CheckoutSchema>;

const CartPage: FC<CartPageProps> = ({}) => {
  const cartFormRef = useRef<HTMLDivElement>(null);
  const [shippingFormHeight, setShippingFormHeight] = useState<number>(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const { data: data, isLoading, refetch } = useFetch('cart_list', getCartList);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutSchema),
  });

  // Set the height of the ShippingAddressForm based on the CartForm height
  useEffect(() => {
    if (cartFormRef.current) {
      setShippingFormHeight(cartFormRef.current.clientHeight);
    }
  }, []);
  const router = useRouter();

  const checkoutMutation = useMutation({
    mutationFn: (data: any) => addCheckout(data),
    onSuccess: async () => {
      await localStorage.removeItem('persist:root');
      window.location.href = '/success';
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    const formData = { ...data, shipping_address_id: selectedAddressId };
    checkoutMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        {/* CartForm Section */}
        <div ref={cartFormRef}>
          <CartForm />
        </div>

        {/* Shipping Address Section */}
        <div className="mt-10 bg-gray-50 px-10 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div
            className="overflow-y-scroll "
            style={{ maxHeight: `${shippingFormHeight}px` }} // Set dynamic height
          >
            <ShippingAddressForm
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />

            <div className="space-y-4 mt-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="credit-card"
                        type="radio"
                        value="credit-card"
                        {...register('payment_method')}
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>
                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="credit-card"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        Credit Card
                      </label>
                      <p
                        id="credit-card-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Pay with your credit card
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="visa-card"
                        type="radio"
                        value="visa-card"
                        {...register('payment_method')}
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>
                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="visa-card"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        Visa Card
                      </label>
                      <p
                        id="visa-card-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Pay with your Visa card
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="cash-on-deli"
                        type="radio"
                        value="cash-on-deli"
                        {...register('payment_method')}
                        className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />
                    </div>
                    <div className="ms-4 text-sm">
                      <label
                        htmlFor="cash-on-deli"
                        className="font-medium leading-none text-gray-900 dark:text-white"
                      >
                        Cash on Delivery
                      </label>
                      <p
                        id="cash-on-deli-text"
                        className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                      >
                        Pay when you receive the product
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {errors.payment_method && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.payment_method.message}
                </p>
              )}
              <div className="mt-4">
                <label
                  htmlFor="orderNote"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Note
                </label>
                <textarea
                  id="orderNote"
                  {...register('order_note')}
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Add any additional instructions for your order..."
                ></textarea>
              </div>
              {errors.order_note && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.order_note.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              checkoutMutation.isPending || data?.data?.cart_items.length === 0
            }
            className="w-full mt-5"
          >
            {checkoutMutation.isPending && <Spinner sm />} Place Order
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CartPage;
