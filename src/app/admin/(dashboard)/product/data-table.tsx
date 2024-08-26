import { useState, useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import { getBlogsbyCategory, getAllCategories } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Spinner from '@/components/common/Spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  VisibilityState,
  getSortedRowModel,
  getPaginationRowModel,
  getCoreRowModel,
} from '@tanstack/react-table';
import { useQueries, useQuery } from '@tanstack/react-query';

interface SubCategory {
  _id: string;
  name: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  pagination?: any;
}

export function DataTable<TData, TValue>({
  columns,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchValue, setSearchValue] = useState<string>('');
  const [categories, setcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [tableData, setTableData] = useState<TData[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const router = useRouter();
  const { data, isLoading } = useFetch('categories', getAllCategories);
  const {
    data: products,
    isLoading: productLoading,
    refetch,
  } = useQuery({
    queryKey: ['all-products'],
    queryFn: () =>
      getBlogsbyCategory(
        selectedCategory || categories[0]?._id,
        pageIndex + 1,
        pageSize
      ),
    enabled: !!selectedCategory && !!categories?.length,
  });
  const query = useSearchParams();

  useEffect(() => {
    if (data && data.data.length > 0) {
      setcategories(data.data);
      setSelectedCategory(
        query.get('category') ? query.get('category') : data.data[0]._id
      );
    }
  }, [data]);

  useEffect(() => {
    if (selectedCategory) {
      refetch();
      setTableData(products?.data.data.products || []);
    }
  }, [products?.data.data.products, selectedCategory, pageIndex, pageSize]);

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil((products?.data.data.total_count || 0) / pageSize),

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    table.setGlobalFilter(value);
  };

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    setSelectedCategory(category);
    router.push(`?category=${category}`);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <Spinner lg />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search all columns..."
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedCategory}
          defaultValue={query.get('category')!}
          onChange={handleCategoryChange}
          className="flex h-9 w-full rounded-md border border-input bg-transparent mx-10 px-2 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.length !== 0 ? (
            <>
              {categories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </>
          ) : (
            <option>no categories</option>
          )}
        </select>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border ">
        <Table className=" ">
          <TableHeader className="max-w-screen-sm md:max-w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {productLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full bg-black/40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <span>
          Page {pageIndex + 1} of{' '}
          {Math.ceil((products?.data.data.total_count || 0) / pageSize)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={
            pageIndex >=
            Math.ceil((products?.data.data.total_count || 0) / pageSize) - 1
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
