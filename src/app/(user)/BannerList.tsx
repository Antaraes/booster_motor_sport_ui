'use client';
import { getAllCategoriesWithProducts } from '@/api';
import useFetch from '@/hooks/useFetch';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface BannerListProps {}

const BannerList: FC<BannerListProps> = ({}) => {
  const { data: categroy_products, isLoading } = useFetch(
    'categroy_products',
    getAllCategoriesWithProducts
  );

  return (
    <>
      {categroy_products &&
        categroy_products.data.slice(0, 3).map((item: any, index: number) => (
          <>
            <div
              className="bannerCard bg-white relative"
              key={`banner - ${index}`}
            >
              <div className="overflow-hidden rounded-md group-hover:opacity-75 w-full h-[150px] lg:h-[200px]">
                <Image
                  alt="Card background"
                  width={300}
                  height={400}
                  className="h-full w-full object-contain object-center rounded-2xl hover:scale-105 transition-transform duration-300"
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product?.medias[0].path}`}
                />
              </div>
              <div className="content absolute top-5 left-2 z-10 text-white">
                <p className="font-bold text-xs lg:text-lg whitespace-normal break-words">
                  {item.name}
                </p>
                <p className="font-bold text-xs lg:text-lg whitespace-normal break-words">
                  Collection
                </p>
                <Link
                  href={{
                    pathname: `/products/${item.name}`,
                    query: {
                      categoryId: item._id,
                    },
                  }}
                  className="flex cursor-pointer text-xs lg:text-base hover:text-foreground whitespace-normal break-words"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </>
        ))}
    </>
  );
};

export default BannerList;
