import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface MemberCardProps {
  data: any;
}

const MemberCard: FC<MemberCardProps> = ({ data }) => {
  return (
    <Link
      href={`team/${data._id}`}
      className="flex flex-col gap-2 justify-center items-center cursor-pointer"
    >
      <Image
        src={'/assets/member.png'}
        width={110}
        height={110}
        alt="avatar"
        className="rounded-full h-20 w-20 md:w-28 md:h-28"
      />
      <p>
        {data.first_name} {data.last_name}
      </p>
      <p className="text-muted-foreground text-xs">{data.role_id.name}</p>
      <p className="text-xs text-muted-foreground">{data.email}</p>
    </Link>
  );
};

export default MemberCard;
