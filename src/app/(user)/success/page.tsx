import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 md:px-6 py-12 md:py-24 lg:py-32">
      <div className="max-w-md text-center space-y-6">
        <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 inline-flex">
          <CheckIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Order Successful
        </h1>
        <p className="text-gray-500 dark:text-gray-400 md:text-xl">
          Thank you for your purchase! Your order has been successfully placed
          and is being processed.
        </p>
        <p className="text-gray-500 dark:text-gray-400 md:text-xl">
          You will receive an email confirmation shortly with your order details
          and tracking information.
        </p>
        <div className="mt-6 flex flex-col items-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
          <Link
            href="/user/profile?tab=orders"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
