'use client';
import { getAllCategoriesWithProducts } from '@/api';
import useFetch from '@/hooks/useFetch';
import { setCategory } from '@/redux/features/categorySlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import ProductList from './ProductList';
import FeatureProductList from './FeatureProductList';
import BannerList from './BannerList';
import SearchProduct from './SearchProduct';

interface LandingPageProps {}

const LandingPage: FC<LandingPageProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.search);

  return (
    <>
      {/* Start Banner Section  */}
      <section className=" w-[90%] lg:w-[80%] mx-auto grid gap-3 my-10 lg:grid-cols-3 grid-cols-2">
        <BannerList />
      </section>
      {/* End Banner Section  */}
      {data.products?.length > 0 && (
        <section className="md:w-[80%] w-[90%] mx-auto my-16">
          <SearchProduct />
        </section>
      )}
      {/* New Product Section */}
      <section className="md:w-[80%] w-[90%] mx-auto my-16">
        <ProductList />
      </section>
      {/* New Product Section */}
      {/* Feature Product Section */}
      <section className="md:w-[80%] w-[90%] mx-auto mt-10">
        <FeatureProductList />
      </section>
      {/* Feature Product Section */}
    </>
  );
};

export default LandingPage;
