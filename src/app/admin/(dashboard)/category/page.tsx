import { FC } from 'react';
import CategoryPage from './CategoryPage';
import { Metadata } from 'next';

interface pageProps {}
export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_COMPANY_NAME} - Dashboard/Category Page`,
};

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <CategoryPage />
    </>
  );
};

export default page;
