'use client';
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/common/Spinner';
import { AddCategoryService } from '@/services/category/AddCategory.service';
import { useParams } from 'next/navigation';

interface pageProps {}

const AddCategoryPage: FC<pageProps> = ({}) => {
  const { register, errors, isLoading, handleSubmit, onSubmit, isSuccess } =
    AddCategoryService();

  return (
    <div className="w-full flex flex-col justify-center">
      <p className="text-4xl border-secondary font-bold">Add New Category</p>
      <hr className="h-px my-8 border-0 bg-gray-700" />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid w-full items-center gap-10 grid-cols-2 justify-between">
          <div>
            <h4 className="text-2xl font-bold">Category Name</h4>
            <p className="text-foreground">Enter the category name</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="name">
              Category Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register('name', { required: 'Category name is required' })}
              placeholder="Enter Category Name.."
            />
            {errors.name && (
              <p className="text-red-500">{errors.root?.message}</p>
            )}
          </div>

          <div>
            <h4 className="text-2xl font-bold">Description</h4>
            <p className="text-foreground">Enter the description</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="description">
              Description
            </Label>
            <textarea
              id="description"
              maxLength={100}
              {...register('description', {
                required: 'Description is required',
              })}
              className="flex h-9 w-full min-h-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter Description.."
            />
            {errors.description && (
              <p className="text-red-500">{errors.root?.message}</p>
            )}
          </div>

          <div></div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Spinner sm /> : 'Submit'}
          </Button>
        </div>
      </form>
      {isSuccess && <p>Category added successfully!</p>}
    </div>
  );
};

export default AddCategoryPage;
