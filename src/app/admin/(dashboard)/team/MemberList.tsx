'use client';
import { FC } from 'react';
import MemberCard from './memberCard';
import useFetch from '@/hooks/useFetch';
import { memberList } from '@/api';
import Spinner from '@/components/common/Spinner';
import { useQuery } from '@tanstack/react-query';

interface MemberListProps {}

const MemberList: FC<MemberListProps> = ({}) => {
  const { data, isLoading } = useFetch('memberList', memberList);

  if (isLoading) {
    <div>
      <Spinner lg />
    </div>;
  }

  return (
    <div className="grid md:grid-cols-3 grid-cols-2 my-10 gap-4 space-x-4">
      {data?.data.map((admin: any, index: number) => (
        <MemberCard data={admin} key={index} />
      ))}
    </div>
  );
};

export default MemberList;
