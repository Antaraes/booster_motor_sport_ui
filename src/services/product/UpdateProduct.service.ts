import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { getAllCategories, getDetailProduct, updateProduct } from '@/api';
import useFetch from '@/hooks/useFetch';
import API from '@/api/interceptor';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AddProductFormValues } from './AddProduct.service';

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  rank: z
    .string()
    .optional()
    .transform((value) => (value ? parseFloat(value) : undefined))
    .refine((value: any) => !isNaN(value), {
      message: 'Rank must be a number',
    }),
  category_id: z.string().min(1, { message: 'Category ID is required' }),
  price: z
    .string()
    .optional()
    .transform((value) => (value ? parseFloat(value) : undefined))
    .refine((value: any) => !isNaN(value), {
      message: 'Price must be a number',
    }),
  quantity: z
    .string()
    .optional()
    .transform((value) => (value ? parseFloat(value) : undefined))
    .refine((value: any) => !isNaN(value), {
      message: 'Quantity must be a number',
    }),
  medias_to_remove: z.array(z.string()).optional(),
  medias: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })

    .refine((files) => files.length <= 5, {
      message: 'No more than 5 media files are allowed',
    }),
});

type updateProductFormValue = z.infer<typeof schema>;
export const UpdateProductService = (
  productId: any,
  filesList: any[],
  deletedArrayImage: string[]
) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    data: loadProductData,
    refetch,
    isLoading: isLoading,
  } = useFetch('each_product', () => getDetailProduct(productId));
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<updateProductFormValue>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (loadProductData) {
      reset({
        title: loadProductData?.data?.title,
        content: loadProductData?.data?.content,
        price: loadProductData?.data?.price.toString(),
        quantity: loadProductData?.data?.quantity.toString(),
        rank: loadProductData?.data?.rank.toString(),
        category_id: loadProductData?.data?.category_id,
        medias: loadProductData?.data?.medias,
      });
    }
  }, [loadProductData, reset]);

  const { data: allCategrories } = useFetch('subcategory', getAllCategories);

  const navigate = useRouter();
  useEffect(() => {
    refetch();
  }, [productId]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateProduct(productId, data),
    onSuccess: (data) => {
      toast.success(data.data.message);

      navigate.push(
        `/admin/product?category=${loadProductData?.data?.category_id}`
      );
    },
    onError: (error: any) => {
      toast.error('Blog creation failed', error.message);
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (
      filesList &&
      loadProductData?.data?.medias.length + filesList.length > 5
    ) {
      toast.error('Total media files cannot exceed 5');
      return;
    }
    formData.append('_method', 'PUT');

    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);

    if (data.rank) {
      formData.append('rank', data.rank);
    }
    if (deletedArrayImage) {
      formData.append('medias_to_remove', JSON.stringify(deletedArrayImage));
    }
    formData.append('category_id', data.category_id);

    if (filesList) {
      filesList.map((media, index) => {
        formData.append(`medias`, media);
      });
    }

    mutation.mutate(formData);
  };

  return {
    register,
    allCategrories,
    watch,
    errors,
    isLoading: mutation.isPending || isLoading,
    handleSubmit,
    onSubmit,
    setValue,
    getValues,
    isSuccess,
    control,
    loadProductData,
  };
};
