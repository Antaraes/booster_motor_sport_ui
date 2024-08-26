'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addShippingAddress } from '@/api';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

const shippingAddressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  township: z.string().min(1, 'Township is required'),
  city: z.string().min(1, 'City is required'),
  country_code: z.string().min(1, 'Country code is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
});

// Define the form values type
interface ShippingAddressFormValues {
  country: string;
  region: string;
  first_name: string;
  last_name: string;
  address: string;
  township: string;
  city: string;
  country_code: string;
  phone_number: string;
}

export const ShippingAddressService = () => {
  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });
  const navigate = useRouter();

  const shippingMutation = useMutation({
    mutationFn: async (addressData: ShippingAddressFormValues) =>
      addShippingAddress(addressData),
    onSuccess: () => {
      toast.success('Shipping address added successfully');
      // Navigate to a success page or clear the form
      // navigate.push('/success');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
  });

  const onSubmit = (data: ShippingAddressFormValues) => {
    shippingMutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isLoading: shippingMutation.isPending,
  };
};
