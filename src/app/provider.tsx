'use client';

import { FC, ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReduxProvider from '@/redux/provider';
import { setCookie } from 'cookies-next';

interface providerProps {
  children: ReactNode;
}
const client = new QueryClient();
const Provider: FC<providerProps> = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem('user_ecommerce_token');
    if (token) {
      setCookie('user_ecommerce_token', token);
    }
  });
  return (
    <QueryClientProvider client={client}>
      <ReduxProvider>{children}</ReduxProvider>
    </QueryClientProvider>
  );
};

export default Provider;
