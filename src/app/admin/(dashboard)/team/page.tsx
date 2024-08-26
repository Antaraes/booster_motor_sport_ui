'use client';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import MemberList from './MemberList';
import Link from 'next/link';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between">
        <p className="text-3xl font-bold">Team</p>
        <Button>
          <Link href={'team/create'}>Add New Member</Link>
        </Button>
      </div>
      <MemberList />
    </>
  );
};

export default page;
