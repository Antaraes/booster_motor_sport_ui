import ProductCard from '@/components/user/Product/ProductCard';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { useAppSelector } from '@/redux/hook';
import { FC } from 'react';
import toast from 'react-hot-toast';
import { Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface SearchProductProps {}

const SearchProduct: FC<SearchProductProps> = ({}) => {
  const { data } = useAppSelector((state) => state.search);
  const isMobile = useMediaQueryProvide();

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center items-start">
        <p className="font-bold text-base lg:text-2xl">Recent Products</p>
      </div>

      <div className="min-h-[150px] relative">
        {data.products.length > 0 ? (
          <Swiper
            slidesPerView={isMobile ? 1.7 : 4.5}
            spaceBetween={isMobile ? 5 : 30}
            modules={[Pagination, Scrollbar]}
            className="mySwiper my-5"
          >
            {data.products.map((product: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <ProductCard product={product} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <>
            <div className="flex absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-col text-center justify-center ">
              <p className="text-2xl lg:text-2xl font-bold text-gray-700">
                These Products Are Not Available Right Now
              </p>
              <p className="text-sm lg:text-base text-gray-500 mt-2">
                We&apos;re currently out of stock, but we&apos;re restocking
                soon with more exciting products. Check back later or explore
                other categories!
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchProduct;
