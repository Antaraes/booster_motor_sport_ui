// components/EditableRowModal.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateCategory } from '@/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

import { UpdateCategoryService } from '@/services/category/AddCategory.service';
import Spinner from './Spinner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const EditableRowModal = ({
  isOpen,
  onClose,
  category,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: any;
  onSave: any;
}) => {
  const has_parent = category && category.parent_category_id != null;
  const {
    register,
    handleSubmit,
    setValue,
    onSubmit,
    isLoadingCategories,
    parentCategories,
    errors,
    isLoading,
  } = UpdateCategoryService(category._id, has_parent, onClose);

  React.useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description);
      category.parent_category_id != null &&
        setValue('parent_category_id', category.parent_category_id._id);
    }
  }, [category, setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="name">Name:</Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                className="border rounded-md px-2 py-1"
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description:</Label>
              <Input
                id="description"
                {...register('description')}
                className="border rounded-md px-2 py-1"
              />
            </div>
            {category.parent_category_id !== null && (
              <div>
                <Label className="font-bold" htmlFor="parentCategoryId">
                  Parent Category
                </Label>
                <select
                  id="parentCategoryId"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('parent_category_id', {
                    required: 'Parent Category ID is required',
                  })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Parent Category
                  </option>
                  {isLoadingCategories ? (
                    <option>Loading...</option>
                  ) : (
                    parentCategories?.data.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.parent_category_id && (
                  <p>{errors.parent_category_id.message}</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              disabled={isLoading}
            >
              {isLoading ? <Spinner sm /> : 'Save'}
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditableRowModal;
