'use client';
import { useState, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useMutation } from '@tanstack/react-query';
import {
  get_user_profile,
  getShippingAddressList,
  updateShippingAddress,
  deleteShippingAddress,
  createShippingAddress,
} from '@/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useFetch from '@/hooks/useFetch';
import toast from 'react-hot-toast';
import { Edit2, Trash } from 'lucide-react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent } from '@/components/ui/dialog';
import Loading from '@/app/loading';

const shippingAddressSchema = z.object({
  first_name: z.string().nonempty({ message: 'First name is required' }),
  last_name: z.string().nonempty({ message: 'Last name is required' }),
  country: z.string().nonempty({ message: 'Country is required' }),
  region: z.string().nonempty({ message: 'Region is required' }),
  address: z.string().nonempty({ message: 'Address is required' }),
  township: z.string().nonempty({ message: 'Township is required' }),
  city: z.string().nonempty({ message: 'City is required' }),
  country_code: z.string().nonempty({ message: 'Country code is required' }),
  phone_number: z.string().nonempty({ message: 'Phone number is required' }),
});
type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

const ShippingAddress: FC = () => {
  const {
    data: shippingData,
    isLoading,
    refetch,
  } = useFetch('get-shipping-address', getShippingAddressList);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createShippingAddress(data),
    onSuccess: (data) => {
      toast.success(data.data.message);
      refetch();
      setModal(false);
      setCurrentAddressId(null);
    },
    onError: (error: any) => {
      toast.error(`Error create shipping address: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateShippingAddress(data, currentAddressId),
    onSuccess: (data) => {
      toast.success(data.data.message);
      refetch();
      setModal(false);
      setCurrentAddressId(null);
    },
    onError: (error: any) => {
      toast.error(`Error updating shipping address: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) => deleteShippingAddress(addressId),
    onSuccess: (data) => {
      toast.success(data.data.message);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Error deleting shipping address: ${error.message}`);
    },
  });

  useEffect(() => {
    if (currentAddressId && shippingData) {
      const shippingAddress = shippingData.data.shippingAddress.find(
        (address: any) => address._id === currentAddressId
      );
      if (shippingAddress) {
        setValue('first_name', shippingAddress.first_name);
        setValue('last_name', shippingAddress.last_name);
        setValue('country', shippingAddress.country);
        setValue('region', shippingAddress.region);
        setValue('address', shippingAddress.address);
        setValue('township', shippingAddress.township);
        setValue('city', shippingAddress.city);
        setValue('country_code', shippingAddress.country_code);
        setValue('phone_number', shippingAddress.phone_number);
      }
    } else {
      reset();
    }
  }, [currentAddressId, shippingData, setValue, reset]);

  useEffect(() => {
    const subscription = watch(() => setIsFormDirty(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (formData: ShippingAddressFormData) => {
    updateMutation.mutate(formData);
  };
  const onAddSubmit = async (formData: ShippingAddressFormData) => {
    createMutation.mutate(formData);
  };

  const handleEdit = (addressId: string) => {
    setModal(true);
    setCurrentAddressId(addressId);
  };

  const handleDelete = (addressId: string) => {
    deleteMutation.mutate(addressId);
  };

  if (isLoading) {
    <Loading />;
  }

  return (
    <>
      <div className="px-4 space-y-6 sm:px-6 ">
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
        <p className="text-muted-foreground">Review your addresses</p>
        <Button
          className="mb-5"
          onClick={() => {
            setModal(true);
            setCurrentAddressId(null);
          }}
        >
          Add New Address
        </Button>
        {shippingData?.data?.shippingAddress.length > 0 ? (
          shippingData.data.shippingAddress.map((address: any) => (
            <Card key={address._id} className="py-4">
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      {address.first_name} {address.last_name}
                    </p>
                    <p>
                      {address.address}, {address.city}, {address.region},{' '}
                      {address.township}
                    </p>
                    <p>
                      {address.country} - {address.phone_number}
                    </p>
                  </div>
                  <div className="space-x-4 flex">
                    <Edit2
                      className="cursor-pointer"
                      onClick={() => handleEdit(address._id)}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={() => handleDelete(address._id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
            <h2 className="text-xl font-semibold">
              No Shipping Addresses Found
            </h2>
            <p className="text-muted-foreground">
              It looks like you haven&apos;t added any shipping addresses yet.
            </p>
          </div>
        )}
      </div>

      {(isFormDirty || currentAddressId === null) && (
        <Dialog onOpenChange={setModal} open={modal}>
          <DialogContent className="max-h-full max-w-screen-lg">
            <form
              onSubmit={handleSubmit(
                currentAddressId == null ? onAddSubmit : onSubmit
              )}
            >
              <div className=" grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" {...register('first_name')} />
                  {errors.first_name && (
                    <p className="text-red-500">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" {...register('last_name')} />
                  {errors.last_name && (
                    <p className="text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register('country')} />
                  {errors.country && (
                    <p className="text-red-500">{errors.country.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" {...register('region')} />
                  {errors.region && (
                    <p className="text-red-500">{errors.region.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register('address')} />
                  {errors.address && (
                    <p className="text-red-500">{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="township">Township</Label>
                  <Input id="township" {...register('township')} />
                  {errors.township && (
                    <p className="text-red-500">{errors.township.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && (
                    <p className="text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <PhoneInput
                    country={'us'}
                    value={watch('phone_number')}
                    onChange={(value, data: any) => {
                      const dialCode = data.dialCode;
                      setValue('country_code', dialCode);
                      setValue('phone_number', value);
                    }}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                <Button type="button" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !isFormDirty ||
                    updateMutation.isPending ||
                    createMutation.isPending
                  }
                >
                  {updateMutation.isPending ||
                    (createMutation.isPending && <Spinner sm />)}
                  Save Address
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ShippingAddress;
