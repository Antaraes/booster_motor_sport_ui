import { FC } from 'react';
import { Skeleton } from '../ui/skeleton';

const ProductCardSkeleton: FC = () => {
  return (
    <div className="border rounded-lg p-4 shadow-lg">
      <Skeleton className="w-full h-40 bg-gray-500 rounded-md" />
      <div className="mt-2">
        <Skeleton className="w-3/4 h-6 bg-gray-500 rounded-md" />
        <Skeleton className="w-1/2 h-4 bg-gray-500 rounded-md mt-2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
