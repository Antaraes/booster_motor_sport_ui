import { FC } from 'react';
import SignupForm from './SingupPage';
import { Metadata } from 'next';

interface pageProps {}
export const metadata: Metadata = {
  title: `Sign up to ${process.env.NEXT_PUBLIC_COMPANY_NAME}`,
};

const page: FC<pageProps> = ({}) => {
  return <SignupForm />;
};

export default page;
