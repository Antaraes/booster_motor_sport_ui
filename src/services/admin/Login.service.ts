'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { forgotpassword, login } from '@/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cookies } from 'next/headers';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const forgotschema = z.object({
  email: z.string().email(),
});
export const LoginService = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });
  const navigate = useRouter();
  // const [isLoading, setIsloading] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(true);
  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginFormValues) => login(loginData),
    onSuccess: async (data: any) => {
      const adminToken = getCookie('user_ecommerce_token');
      if (adminToken) {
        await deleteCookie('user_ecommerce_token');
      }
      setCookie('ecommerce_token', data.data.data.access_token);
      await navigate.push('/admin');
      toast.success(data.data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  return {
    isSuccess: loginMutation.isSuccess,
    onSubmit,
    form,
    isLoading: loginMutation.isPending,
  };
};
export const ForgotService = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(forgotschema),
  });
  const [modal, setModal] = useState<boolean>(false);

  // const [isLoading, setIsloading] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(true);
  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginFormValues) => forgotpassword(loginData),
    onSuccess: async (data: any) => {
      toast.success(data.data.message);
      setModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  return {
    isSuccess: loginMutation.isSuccess,
    onSubmit,
    form,
    modal,
    setModal,
    isLoading: loginMutation.isPending,
  };
};
