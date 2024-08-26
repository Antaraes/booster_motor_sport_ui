'use client';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import Link from 'next/link';
import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from './data-table';
import { columns } from './column';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRmoveMutation } from '@/hooks/useRemoveMutation';
import { removeProduct } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface ProductPageProps {}

const ProductPage: FC<ProductPageProps> = ({}) => {
  const queryClient = useQueryClient();
  const handleMutation = useMutation({
    mutationFn: (productId: any) => removeProduct(productId),
    onError: (error, productId, context) => {
      toast.error('Failed to delete product');
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['all-products'] });
      toast.success('Product deleted successfully');
    },
  });
  const route = useRouter();
  const handleDelete = (productId: string) => {
    handleMutation.mutate(productId);
  };
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-3xl font-bold">Product</p>
        <Button>
          <Link href={'product/create'}>Add New Product</Link>
        </Button>
      </div>
      <DataTable
        columns={[
          ...columns,
          {
            id: 'actions',
            cell: (info) => {
              const product = info.row.original as any;

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        route.push(`product/${product._id}/update`)
                      }
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default ProductPage;
