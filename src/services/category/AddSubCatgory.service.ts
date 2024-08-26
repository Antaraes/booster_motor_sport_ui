'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addSubcategory, getAllCategories } from '@/api'; // Ensure you have an API function to add a subcategory
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';

interface Subcategory {
  name: string;
  description: string;
  parentCategoryId: string;
}
const schema = z.object({
  name: z.string().min(1, { message: 'Subcategory name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  parentCategoryId: z
    .string()
    .min(1, { message: 'Parent Category ID is required' }),
});

export const AddSubcategoryService = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Subcategory>({
    resolver: zodResolver(schema),
  });
  const navigate = useRouter();
  const { data: parentCategories, isLoading: isLoadingCategories } = useFetch(
    'parentCategories',
    getAllCategories
  );

  const subcategoryMutation = useMutation({
    mutationFn: async (subcategoryData) => addSubcategory(subcategoryData),
    onSuccess: (data) => {
      toast.success('Subcategory added successfully');
      navigate.push('/admin/subcategories');
    },
    onError: (error) => {
      console.error('Subcategory creation failed!', error);
      toast.error('Subcategory creation failed');
    },
  });

  const onSubmit = (data: any) => {
    subcategoryMutation.mutate(data);
  };

  return {
    isSuccess: subcategoryMutation.isSuccess,
    onSubmit,
    register,
    handleSubmit,
    errors,
    setValue,
    isLoadingCategories,
    control,
    parentCategories,
    isLoading: subcategoryMutation.isPending,
  };
};
