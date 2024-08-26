import { FC } from 'react';
import LoginPage from './LoginPage';
import { Metadata } from 'next';

interface pageProps {}

export const metadata: Metadata = {
  title: `Login to ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
};

const page: FC<pageProps> = ({}) => {
  return <LoginPage />;
};

export default page;
