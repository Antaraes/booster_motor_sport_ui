import { FC } from 'react';

interface PaginatedNumbersProps {
  page: number;
  totalPages: number;
  changePage: (page: number) => void;
  minPageNumberLimit: number;
  maxPageNumberLimit: number;
}

const PaginatedNumbers: FC<PaginatedNumbersProps> = ({
  totalPages,
  page,
  changePage,
  maxPageNumberLimit,
  minPageNumberLimit,
}) => {
  return Array.from({ length: totalPages }, (num, index) => {
    if (index < maxPageNumberLimit + 1 && index > minPageNumberLimit)
      return (
        <button
          key={index}
          onClick={() => changePage(index)}
          className={`bg-white ${
            page === index ? 'bg-black text-white' : 'hover:bg-gray-50'
          } border-gray-300 relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
        >
          {index}{' '}
        </button>
      );
    else {
      return null;
    }
  });
};

export default PaginatedNumbers;
