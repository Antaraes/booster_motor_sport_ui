import { FC } from 'react';

import { Metadata } from 'next';
import Profile from './Profile';

interface pageProps {}

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_COMPANY_NAME} - Admin Profile`,
};

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <Profile />
    </>
  );
};

export default page;
