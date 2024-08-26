import { FC } from 'react';
import UpdateProductPage from './UpdateProductPage';
import { Metadata } from 'next';

interface pageProps {}
export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_COMPANY_NAME} - Update Product`,
  icons: {
    icon: '/favicon.png',
  },
};

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <UpdateProductPage />
    </>
  );
};

export default page;
