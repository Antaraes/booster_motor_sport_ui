'use client';

import { getAllCategories } from '@/api';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { formatCategories } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [year, setYear] = useState(2021); // Initial year (adjust if needed)

  const { data: categories } = useFetch('all-categories', getAllCategories);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear);
  }, []);

  const formattedCategories = formatCategories(categories?.data);

  return (
    <footer className="w-full mt-20 ">
      <div className="mx-auto border-t-2 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*Grid*/}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-8 py-10  max-sm:mx-auto gap-y-8">
          <div className=" mb-10 lg:col-span-2 col-span-1 lg:mb-0">
            <p className="font-bold text-base lg:text-2xl text-center lg:text-start">
              {process.env.NEXT_PUBLIC_COMPANY_NAME}
            </p>
            <p className="py-8 text-sm text-gray-500 lg:max-w-xs text-center lg:text-left">
              Discover a world of fashion, electronics, home essentials, and
              more. Shop the latest trends, enjoy seamless shopping, and find
              everything you need in one place.
            </p>
            <Button className="py-2.5 px-5 h-9 block w-fit rounded-full shadow-sm text-xs text-white mx-auto transition-all  duration-500  lg:mx-0">
              <a href={`tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`}>
                Contact Us
              </a>
            </Button>
          </div>
          {/*End Col*/}
          <div className="lg:mx-auto text-left ">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Commerce</h4>
            <ul className="text-sm  transition-all duration-500">
              <li className="mb-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  href="/aboutus"
                  className=" text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          {/*End Col*/}
          <div className="lg:mx-auto text-left ">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Products</h4>
            <ul className="text-sm  transition-all duration-500">
              {formattedCategories &&
                formattedCategories
                  .slice(0, 4)
                  .map((category: any, index: number) => (
                    <li className="mb-6" key={index}>
                      <Link
                        href={{
                          pathname: `/products/${category.name}`,
                          query: {
                            categoryId: category._id,
                          },
                        }}
                        className="text-gray-600 hover:text-gray-900 uppercase"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
          {/*End Col*/}
        </div>
        {/*Grid*/}
        <div className="py-7 border-t border-gray-200">
          <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
            <span className="text-sm text-gray-500 ">
              &copy; {year} Copyright. All rights reserved.
            </span>
            <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0 ">
              <a
                href="javascript:;"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600"
              >
                <svg
                  className="w-[1.25rem] h-[1.25rem] text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.6757 0H1.32404C0.593117 0 0 0.593227 0 1.32428V22.6756C0 23.4065 0.593227 24 1.32428 24H12.8203V14.708H9.69241V11.2509H12.8203V8.40774C12.8203 5.32161 14.6327 3.74595 17.3594 3.74595C18.6507 3.74595 19.8124 3.8634 20.1423 3.90278V7.07899H18.3843C16.8524 7.07899 16.6076 7.87386 16.6076 8.88363V11.2509H20.0171L19.5043 14.708H16.6076V24H22.6757C23.4066 24 24 23.4065 24 22.6757V1.32404C24 0.593117 23.4065 0 22.6757 0Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="javascript:;"
                className="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600"
              >
                <svg
                  className="w-[1.25rem] h-[1.25rem] text-white"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.2745 0C7.31725 0 0 7.15914 0 16C0 21.5163 2.88525 26.3109 7.43975 28.9154V32L11.4316 29.8347C13.0281 30.2117 14.6296 30.4456 16.2745 30.4456C25.2317 30.4456 32.549 23.2865 32.549 16C32.549 8.71347 25.2317 0 16.2745 0ZM23.9923 21.0084C23.5483 20.9619 23.212 20.8162 22.7078 20.6156C22.0761 20.3817 21.571 20.1762 21.0248 19.9722C20.5182 19.7861 19.955 19.7276 19.4947 20.0816C19.1477 20.3463 18.5515 21.0225 18.3733 21.2735C18.1951 21.5246 17.9793 21.5386 17.5367 21.3613C17.0941 21.184 15.6518 20.6252 13.7482 18.8627C12.0906 17.3573 11.2827 15.7273 11.0501 15.2847C10.8175 14.8421 11.1987 14.5492 11.3754 14.3713C11.5792 14.1681 11.7852 13.8838 11.9825 13.6294C12.1797 13.3749 12.1664 13.1905 12.0157 12.9116C11.8667 12.6348 11.0746 10.7672 10.5865 9.65156C10.1274 8.60345 9.65394 8.76019 9.44895 8.75128C9.24396 8.74236 9.01995 8.74236 8.78925 8.74236C8.55855 8.74236 8.11259 8.8442 7.71696 9.24379C7.32132 9.64337 6.13007 10.8915 6.13007 13.3155C6.13007 15.7395 8.02375 18.3776 8.28199 18.7177C8.54024 19.0579 12.0018 24.288 17.2024 25.9677C18.7775 26.4994 19.9974 26.6837 20.8096 26.7799C21.6217 26.876 22.466 26.681 22.8391 26.2118C23.2122 25.7425 24.5482 24.5868 24.8021 23.9951C25.0561 23.4035 24.8881 22.9926 24.7342 22.7903C24.5803 22.588 24.3563 22.4128 24.1937 22.2705C24.0311 22.1282 23.9077 21.9828 23.9923 21.0084Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    // <footer className="relative bg-blueGray-200 pt-8 pb-6">

    // </footer>
  );
};

export default Footer;
