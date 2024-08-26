import { FC } from 'react';
import Layout from './layout';
import { Metadata } from 'next';

interface pageProps {}
export const metadata: Metadata = {
  title: 'User Profile',
};

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <Layout />
    </>
  );
};

export default page;
