'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addNewProduct, getAllCategories } from '@/api'; // Ensure you have an API function to add a product
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';

export interface AddProductFormValues {
  title: string;
  content: string;
  price: string;
  quantity: string;
  // has_variant: boolean;
  category_id: string;
  rank: string;
  // variants?: Variant[];
  medias: FileList;
  // image?: FileList;
  // related_image?: FileList;
  // variant_image?: FileList;
}
export interface Variant {
  name: string;
  value: string;
  price: string;
  image: boolean;
}

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  price: z.string().min(1, { message: 'Price must be greater than 0' }),
  quantity: z.string().min(1, { message: 'Quantity must be greater than 0' }),
  rank: z.string().min(1, { message: 'Quantity must be greater than 0' }),
  // has_variant: z.boolean(),
  category_id: z.string().min(1, { message: 'Subcategory ID is required' }),
  // variants: z
  //   .array(
  //     z.object({
  //       name: z.string(),
  //       value: z.string(),
  //       price: z.string(),
  //       image: z.boolean(),
  //     })
  //   )
  //   .optional(),
  medias: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })
    .refine((files) => files.length == 0, {
      message: 'At least one file',
    })
    .refine((files) => files.length <= 5, {
      message: 'No more than 5 media files are allowed',
    }),
  // image: z
  //   .unknown()
  //   .transform((value) => {
  //     return value as FileList;
  //   })
  //   .optional(),
  // related_image: z
  //   .unknown()
  //   .transform((value) => {
  //     return value as FileList;
  //   })
  //   .optional(),
  // variant_image: z
  //   .unknown()
  //   .transform((value) => {
  //     return value as FileList;
  //   })
  //   .optional(),
});

export const AddProductService = (file: any[]) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(schema),
  });
  const navigate = useRouter();

  const productMutation = useMutation({
    mutationFn: (productData: any) => {
      return addNewProduct(productData);
    },
    onSuccess: () => {
      toast.success('Product added successfully');
      navigate.push(`/admin/product?category=${getValues('category_id')}`);
    },
    onError: (error) => {
      console.error('Product creation failed!', error);
      toast.error('Product creation failed');
    },
  });
  const { data: allCategrories, isLoading } = useFetch(
    'subcategory',
    getAllCategories
  );
  // const categories = allCategrories?.data.flatMap(
  //   (category: { categories: any }) => category.categories
  // );
  const categories = allCategrories?.data;

  const onSubmit = (data: AddProductFormValues) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.price) {
      formData.append('price', data.price);
    }
    if (data.quantity) {
      formData.append('quantity', data.quantity);
    }
    if (data.rank) {
      formData.append('rank', data.rank);
    }
    formData.append('category_id', data.category_id);

    if (data.medias) {
      file.map((image, index) => {
        formData.append(`medias`, image);
      });
    }

    productMutation.mutate(formData);
  };

  return {
    isSuccess: productMutation.isSuccess,
    categories,
    onSubmit,
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    isLoading: productMutation.isPending,
  };
};
