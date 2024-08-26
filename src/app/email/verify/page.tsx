'use client';
import { verify_email } from '@/api';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const search = useSearchParams();
  const { data } = useQuery({
    queryKey: ['email-verify'],
    queryFn: () => verify_email(search.get('token')),
  });
  console.log(data);
  return (
    <div className="w-full h-screen gap-4 flex-col flex justify-center items-center">
      <div className="flex items-center gap-2 mb-20">
        <p className=" font-semibold text-2xl dark:text-white text-black">
          {process.env.NEXT_PUBLIC_COMPANY_NAME}
        </p>
      </div>

      <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-5">
        Created Successfully
      </p>
      <p className="text-xs md:text-sm text-slate-500 ">
        Welcome aboard! Start your happy shopping with{' '}
        {process.env.NEXT_PUBLIC_COMPANY_NAME}!
      </p>
      <Button
        type="submit"
        className="
          bg-gradient-to-r to-primary-green-500 from-primary-green-300
           text-white
          py-2 md:py-3 mt-3
        "
      >
        <Link href={'/'}>Let&apos;s get Start</Link>
      </Button>
    </div>
  );
};

export default Page;
