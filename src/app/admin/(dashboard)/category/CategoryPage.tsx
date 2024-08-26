'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './data-table';
import { columns } from './column';
import useFetch from '@/hooks/useFetch';
import { deleteCategory, getAllCategories } from '@/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

import { useRmoveMutation } from '@/hooks/useRemoveMutation';
import EditableRowModal from '@/components/common/EditableRowModal';
import useMediaQueryProvide from '@/hooks/useMediaQueryProvide';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface CategoryPageProps {}

const CategoryPage: FC<CategoryPageProps> = ({}) => {
  const isMobile = useMediaQueryProvide();
  const [categories, setCategories] = useState([]);

  const {
    data,
    refetch: mainRefetch,
    isLoading,
  } = useFetch('all_categories', getAllCategories);

  useEffect(() => {
    setCategories(data?.data);
  }, [data]);
  const queryClient = useQueryClient();

  const [editCategory, setEditCategory] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('main_category');

  const mainHandleMutation = useMutation({
    onMutate: (categoryId) => {
      // Optimistically update UI
      setCategories((oldCategories) =>
        oldCategories.filter((category: any) => category._id !== categoryId)
      );
    },
    mutationFn: (data: any) => deleteCategory(data),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['all_categories'] });
      // queryClient.invalidateQueries('');
      queryClient.setQueryData(['all_categories'], (oldQuerydata: any) => {
        return {
          ...oldQuerydata,
          data: [...oldQuerydata, data.data],
        };
      });
      toast.success('Successfully Deleted');
    },
  });

  const handleDeleteCategory = (categoryId: string) => {
    mainHandleMutation.mutate(categoryId);
    mainRefetch();
  };

  const handleEdit = (category: any) => {
    setEditCategory(category);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between">
          <p className="text-3xl font-bold">Category</p>
          <Button size={isMobile ? 'sm' : 'lg'}>
            <Link
              href={{
                pathname: 'category/create',
                query: { type: currentTab },
              }}
            >
              Add Category
            </Link>
          </Button>
        </div>

        <DataTable
          isLoading={isLoading}
          columns={[
            ...columns,

            {
              id: 'actions',
              cell: (info) => {
                const category = info.row.original as any;
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
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              },
            },
          ]}
          data={categories ? categories : []}
        />
      </div>

      {/* Editable Row Modal */}
      {editCategory && (
        <EditableRowModal
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
          onSave={() => {
            mainRefetch();
          }}
        />
      )}
    </>
  );
};

export default CategoryPage;
