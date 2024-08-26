'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { signin_user } from '@/api'; // Import your signup API function

// Define the form values type
interface LoginFormValue {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  avatar: FileList;
  gender: string;
  dob: string;
  password: string;
}

import * as z from 'zod';

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginService = ({ saveLogin }: { saveLogin: boolean }) => {
  // Initialize the form with the schema
  const form = useForm<LoginFormValue>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useRouter();

  // Define the signup mutation
  const siginmutation = useMutation({
    mutationFn: async (signupData: any) => signin_user(signupData), // Accept FormData as argument
    onSuccess: async (data: any) => {
      const adminToken = getCookie('ecommerce_token');
      if (adminToken) {
        await deleteCookie('ecommerce_token');
      }

      if (saveLogin) {
        localStorage.setItem(
          'user_ecommerce_token',
          data.data.data.access_token
        );
      }
      setCookie('user_ecommerce_token', data.data.data.access_token);
      await navigate.push('/');
      toast.success(data.data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Form submission handler
  const onSubmit = (data: LoginFormValue) => {
    // Create a new FormData object
    const formData = new FormData();

    // Mutate using FormData
    siginmutation.mutate(data);
  };

  return {
    isSuccess: siginmutation.isSuccess,
    onSubmit: onSubmit,
    form,
    isLoading: siginmutation.isPending,
  };
};
