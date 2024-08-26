import { FC } from 'react';

interface PaginatedNumbersProps {
  totalPages: number;
  page: number;
  changePage: (page: number) => void;
  maxPageNumberLimit: number;
  minPageNumberLimit: number;
}

const PaginatedNumbers: FC<PaginatedNumbersProps> = ({
  totalPages,
  page,
  changePage,
  maxPageNumberLimit,
  minPageNumberLimit,
}) => {
  return (
    <>
      {Array.from({ length: totalPages + 1 }, (_, index) => {
        if (index < maxPageNumberLimit + 1 && index > minPageNumberLimit) {
          return (
            <button
              key={index}
              onClick={() => changePage(index)}
              className={`bg-white ${
                page === index ? 'bg-gray-500 text-primary' : 'hover:bg-gray-50'
              } border-gray-300 relative items-center px-4 py-2 border text-sm font-medium`}
            >
              {index}
            </button>
          );
        }
        return null;
      })}
    </>
  );
};

interface PaginationProps {
  totalPages: number;

  page: number;
  changePage: (page: number) => void;
  incrementPage: () => void;
  decrementPage: () => void;
  minPageNumberLimit: number;
  maxPageNumberLimit: number;
}

const Pagination: FC<PaginationProps> = ({
  totalPages,
  page,
  changePage,
  incrementPage,
  decrementPage,
  minPageNumberLimit,
  maxPageNumberLimit,
}) => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between  sm:px-6">
      <div className=" w-full flex items-center justify-between">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              disabled={page === 1}
              onClick={decrementPage}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="">Previous</span>
            </button>
            <PaginatedNumbers
              totalPages={totalPages}
              changePage={changePage}
              page={page}
              minPageNumberLimit={minPageNumberLimit}
              maxPageNumberLimit={maxPageNumberLimit}
            />
            <button
              disabled={page === totalPages}
              onClick={incrementPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="">Next</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
