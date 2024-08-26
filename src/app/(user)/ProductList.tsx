'use client';
import { getAllCategories, getAllProductsbyCategory } from '@/api';
import ProductCard from '@/components/user/Product/ProductCard';
import useFetch from '@/hooks/useFetch';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { FC, useEffect, useState } from 'react';
import 'swiper/css/navigation';
import { Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface ProductListProps {}

const ProductList: FC<ProductListProps> = ({}) => {
  const { data: category, isLoading: isCategoryLoading } = useFetch(
    'all-categories',
    getAllCategories
  );
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const isMobile = useMediaQueryProvide();

  // Use a separate state for product fetching status
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (category && category.data.length > 0) {
      // Set the initial category and fetch products for the first category
      setCategoryId(category.data[0]._id);
      setCategoryName(category.data[0].name);
    }
  }, [category]);

  useEffect(() => {
    if (categoryId) {
      // Fetch products only if a categoryId is set
      const fetchProducts = async () => {
        setIsProductsLoading(true);
        try {
          const response = await getAllProductsbyCategory(categoryId, 1);

          setProducts(response.data.data.products);
        } catch (error) {
          console.error('Failed to fetch products', error);
        } finally {
          setIsProductsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryId]);

  const handleChangeCategory = (categoryName: string, id: string) => {
    setCategoryName(categoryName);
    setCategoryId(id);
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center items-start">
        <p className="font-bold text-base lg:text-2xl">New Products</p>
        <div className="flex justify-center gap-3 items-center">
          {category &&
            category.data.slice(0, 3).map((cat: any, index: number) => (
              <p
                className={`${
                  cat.name === categoryName
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-black'
                } hover:text-primary text-xs lg:text-base font-semibold cursor-pointer`}
                key={index}
                onClick={() => handleChangeCategory(cat.name, cat._id)}
              >
                {cat.name}
              </p>
            ))}
        </div>
      </div>

      <div className="min-h-[150px]">
        {products.length > 0 ? (
          <Swiper
            slidesPerView={isMobile ? 1.7 : 4.5}
            spaceBetween={isMobile ? 5 : 30}
            modules={[Pagination, Scrollbar]}
            className="mySwiper my-5"
          >
            {!isProductsLoading &&
              products.map((product: any, index: number) => (
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
              We&apos;re working hard to bring you exciting new products. Stay
              tuned!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
