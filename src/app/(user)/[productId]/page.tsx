import { FC } from 'react';
import ProductDetailPage from './ProductDetailPage';
import FeatureProductList from '../FeatureProductList';
import ProductList from '../ProductList';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="md:w-[80%] w-[90%] mx-auto">
      <section className="my-10">
        <ProductDetailPage />
      </section>
      <section className="my-10 ">
        <ProductList />
      </section>
      <section className="my-10 ">
        <FeatureProductList />
      </section>
    </div>
  );
};

export default page;
