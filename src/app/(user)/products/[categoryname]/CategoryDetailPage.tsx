'use client';
import { FC, useEffect, useState } from 'react';
import BannerList from '../../BannerList';
import useFetch from '@/hooks/useFetch';
import { getAllProductsbyCategory } from '@/api';
import { useParams, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/user/Product/ProductCard';
import Pagination from '@/components/common/Pagination';
import ProductCardSkeleton from '@/components/common/ProductcardSkeleton';

interface CategoryDetailPageProps {}

const CategoryDetailPage: FC<CategoryDetailPageProps> = ({}) => {
  const searchParams = useSearchParams();
  const { categoryname }: { categoryname: string } = useParams();

  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useFetch('category-product', () =>
    getAllProductsbyCategory(searchParams.get('categoryId'), page)
  );
  useEffect(() => {
    refetch();
  }, [data, page]);
  // const [pageSize, setPageSize] = useState(10);

  // For the pagination
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  console.log(page);

  const changePage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const incrementPage = () => {
    setPage(page + 1);
    if (page + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const decrementPage = () => {
    setPage(page - 1);
    if ((page - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
    if (page - 1 === 0) {
      return null;
    }
  };

  // Ensure data is available before using it
  const totalPages = Math.ceil(data?.data.total_count / data?.data.limit) || 0;
  console.log(data?.data.limit, totalPages);
  return (
    <>
      <section className="w-[90%] lg:w-[80%] mx-auto grid gap-3 my-10 lg:grid-cols-3 grid-cols-2">
        <BannerList />
      </section>
      <section className="w-[90%] md:w-[80%] mx-auto">
        <div className="grid gap-3 my-10 lg:grid-cols-4 grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : data?.data?.products.length > 0 ? (
            data?.data.products.map((product: any, index: any) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <p className="w-full text-center my-10 font-bold">
              No Products Found
            </p>
          )}
        </div>
      </section>
      {data?.data.products.length > 0 && (
        <section className="w-[90%] md:w-[80%] mx-auto">
          <Pagination
            totalPages={totalPages}
            page={page}
            changePage={changePage}
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            minPageNumberLimit={minPageNumberLimit}
            maxPageNumberLimit={maxPageNumberLimit}
          />
        </section>
      )}
    </>
  );
};

export default CategoryDetailPage;
