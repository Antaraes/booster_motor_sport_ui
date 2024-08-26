'use client';
import { getProductByRankandView } from '@/api';
import ProductCard from '@/components/user/Product/ProductCard';
import useFetch from '@/hooks/useFetch';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

interface FeatureProductListProps {}

const FeatureProductList: FC<FeatureProductListProps> = ({}) => {
  const [filter, setFilter] = useState('');
  const filterItem = ['view', 'rank'];
  useEffect(() => {
    setFilter(filterItem[0]);
  }, []);
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = useFetch('productByRandAndView', () => getProductByRankandView(filter));
  const isMobile = useMediaQueryProvide();
  const handleFilter = (query: string) => {
    setFilter(query);
  };
  useEffect(() => {
    refetch();
  }, [filter]);
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-0 justify-between lg:items-center items-start">
        <p className="font-bold text-base md:text-2xl">Feature Products</p>
        <div className="flex justify-center gap-3 items-center cursor-pointer">
          {filterItem.map((item: string, index: number) => (
            <p
              className={`${
                item === filter
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-black'
              } hover:text-primary text-xs md:text-base font-semibold`}
              key={index}
              onClick={() => handleFilter(item)}
            >
              {item.toUpperCase()}
            </p>
          ))}
        </div>
      </div>
      {products?.data.length > 0 ? (
        <Swiper
          slidesPerView={isMobile ? 1.7 : 4.5}
          spaceBetween={isMobile ? 5 : 30}
          className="mySwiper my-5"
        >
          {!isProductsLoading &&
            products?.data.map((product: any, index: number) => (
              <SwiperSlide key={index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <p className="text-2xl lg:text-3xl font-bold text-gray-700">
            Coming Soon!
          </p>
          <p className="text-sm lg:text-base text-gray-500 mt-2">
            We&apos;re working hard to bring you exciting features products.
            Stay tuned!
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureProductList;
