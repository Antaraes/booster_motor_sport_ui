'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { signup_user } from '@/api'; // Import your signup API function

// Define the form values type
interface SignupFormValues {
  // first_name: string;
  // last_name: string;
  email: string;
  // country_code: string;
  // phone_number: string;
  // avatar: FileList;
  // gender: string;
  // dob: string;
  password: string;
}

import * as z from 'zod';

// Define the validation schema
const signupSchema = z.object({
  // first_name: z.string().min(1, 'First name is required'),
  // last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  // country_code: z.string().min(1, 'Country code is required'),
  // phone_number: z.string().min(1, 'Phone number is required'),
  // avatar: z.any(),
  // gender: z.string().min(1, 'Gender is required'),
  // dob: z.string().min(1, 'Date of birth is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupService = () => {
  // Initialize the form with the schema
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useRouter();

  // Define the signup mutation
  const signupMutation = useMutation({
    mutationFn: async (signupData: SignupFormValues) => signup_user(signupData), // Accept FormData as argument
    onSuccess: async (data: any) => {
      setCookie('user_ecommerce_token', data.data.data.access_token);
      await navigate.push('/');
      toast.success('Signup successful');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  // Form submission handler
  const onSubmit = (data: SignupFormValues) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append form data
    // formData.append('first_name', data.first_name);
    // formData.append('last_name', data.last_name);
    // formData.append('email', data.email);
    // formData.append('country_code', data.country_code);
    // formData.append('phone_number', data.phone_number);
    // formData.append('gender', data.gender);
    // formData.append('dob', data.dob);
    // formData.append('password', data.password);

    // Append the avatar file(s)
    // if (data.avatar && data.avatar.length > 0) {
    //   Array.from(data.avatar).forEach((file) => {
    //     formData.append('avatar', file);
    //   });
    // }

    // Mutate using FormData
    signupMutation.mutate(data);
  };

  return {
    isSuccess: signupMutation.isSuccess,
    onSubmit: onSubmit, // Wrap the onSubmit handler with form's handleSubmit
    form,
    isLoading: signupMutation.isPending,
  };
};
