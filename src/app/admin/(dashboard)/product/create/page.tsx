'use client';
import { FC, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AddProductService,
  Variant,
} from '@/services/product/AddProduct.service';
import { Trash } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import 'react-quill/dist/quill.snow.css';
import { Switch } from '@/components/ui/switch';
import Spinner from '@/components/common/Spinner';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface PageProps {}

const ProductPage: FC<PageProps> = ({}) => {
  const [filesList, setFiles] = useState<any[]>();
  const {
    register,
    categories,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
    isSuccess,
    control,
  } = AddProductService(filesList!);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const [variants, setVariants] = useState<Variant[]>([
    { name: '', value: '', price: '', image: false },
  ]);
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newVariants: any[] = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const handleImageUpload = (newFiles: FileList) => {
    if (newFiles.length > 5) {
      toast.error('No more than 5 media files are allowed');
    }
    const updatedFiles = [
      ...Array.from(filesList || []),
      ...Array.from(newFiles),
    ];

    setFiles(updatedFiles.slice(0, 5));

    const imageUrls = updatedFiles.slice(0, 5).map((file) => {
      let url = URL.createObjectURL(file);
      let urlType = file.name;
      return { url, urlType };
    });

    setUploadedImages(imageUrls);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: '', value: '', price: '', image: false },
    ]);
  };

  const removeVariant = (index: any) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <p className="text-4xl border-secondary font-bold">Add New Product</p>
      <hr className="h-px my-8 border-0 bg-gray-700" />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid w-full items-center gap-10 grid-cols-2 justify-between">
          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Title</h4>
            <p className="text-foreground">Enter the product title</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter Title.."
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Content</h4>
            <p className="text-foreground">Enter the product content</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="content">
              Content
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  className="h-full "
                  onChange={field.onChange}
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [
                          { list: 'ordered' },
                          { list: 'bullet' },
                          { indent: '-1' },
                          { indent: '+1' },
                        ],
                        ['link', 'image', 'video'],
                        ['code-block'],
                        ['clean'],
                      ],
                    },
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={[
                    'header',
                    'font',
                    'size',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'indent',
                    'link',
                    'image',
                    'video',
                    'code-block',
                  ]}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Price</h4>
            <p className="text-foreground">Enter the product price</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="price">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              min={0}
              {...register('price', { required: 'Price is required' })}
              placeholder="Enter Price.."
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Quantity</h4>
            <p className="text-foreground">Enter the product quantity</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="quantity">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              {...register('quantity', { required: 'Quantity is required' })}
              placeholder="Enter Quantity.."
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Rank</h4>
            <p className="text-foreground">Enter the product rank</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="rank">
              Rank
            </Label>
            <Input
              id="rank"
              min={0}
              type="number"
              {...register('rank', { required: 'Rank is required' })}
              placeholder="Enter Rank.."
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Category</h4>
            <p className="text-foreground">Select the category</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="category_id">
              Category
            </Label>
            <select
              id="category_id"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('category_id', {
                required: 'category is required',
              })}
            >
              <option value="">Select Subcategory</option>
              {categories?.map((category: { name: string; _id: string }) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          <div className="hidden lg:block">
            <h4 className="text-2xl font-bold">Image</h4>
            <p className="text-foreground">Upload the product image</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="medias">
              Image
            </Label>
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-5 h-full w-[80%] ">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative ${
                      selectedItems.includes(index)
                        ? 'border-2 border-red-500'
                        : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt="uploaded image"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100   "
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    maxLength={5}
                    {...register('medias')}
                    multiple
                    max={5}
                    className="hidden"
                    id="dropzone-file"
                    onChange={(e) => handleImageUpload(e.target.files!)}
                  />
                </label>
              </div>
            )}
            {errors.medias && (
              <p className="text-red-500">{errors.medias.message}</p>
            )}
          </div>

          {/* <div>
            <h4 className="text-2xl font-bold">Related Image</h4>
            <p className="text-foreground">Upload the related image</p>
          </div> */}
          {/* <div>
            <Label className="font-bold" htmlFor="related_image">
              Related Image
            </Label>
            <Input
              id="related_image"
              type="file"
              {...register('related_image')}
            />
            {errors.related_image && (
              <p className="text-red-500">{errors.related_image.message}</p>
            )}
          </div> */}
          {/* <div>
            <h4 className="text-2xl font-bold">Has Variant</h4>
            <p className="text-foreground">Does the product have variants?</p>
          </div> */}
          {/* <div>
            <Label className="font-bold" htmlFor="has_variant">
              Has Variant
            </Label>
            <Input
              id="has_variant"
              type="checkbox"
              {...register('has_variant')}
              placeholder="Does the product have variants?"
            />
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-base">Has Variants</p>
              </div>
              <div>
                <Controller
                  name="has_variant"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="has_variant"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            {errors.has_variant && (
              <p className="text-red-500">{errors.has_variant.message}</p>
            )}
          </div> */}

          {/* <div>
            <h4 className="text-2xl font-bold">Variants</h4>
            <p className="text-foreground">Add product variants</p>
          </div> */}
          {/* <div>
            {variants.map((variant, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Variant Name</Label>
                  <Button
                    type="button"
                    color="red"
                    size={'sm'}
                    variant={'link'}
                    onClick={() => removeVariant(index)}
                  >
                    <Trash />
                  </Button>
                </div>
                <Input
                  type="text"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(index, 'name', e.target.value)
                  }
                  placeholder="Variant Name"
                />
                <Label className="font-bold">Variant Value</Label>

                <Input
                  type="text"
                  value={variant.value}
                  onChange={(e) =>
                    handleVariantChange(index, 'value', e.target.value)
                  }
                  placeholder="Variant Value"
                />
                <Label className="font-bold">Variant Price</Label>
                <Input
                  type="text"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, 'price', e.target.value)
                  }
                  placeholder="Variant Price"
                />
                <Label className="font-bold">Variant Image</Label>
                <input
                  type="checkbox"
                  checked={variant.image}
                  onChange={(e) =>
                    handleVariantChange(index, 'image', e.target.checked)
                  }
                />
              </div>
            ))}
            <Button type="button" onClick={addVariant}>
              Add Variant
            </Button>
          </div> */}

          {/* <div>
            <h4 className="text-2xl font-bold">Variant Image</h4>
            <p className="text-foreground">Upload the variant image</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="variant_image">
              Variant Image
            </Label>
            <Input
              id="variant_image"
              type="file"
              {...register('variant_image')}
            />
            {errors.variant_image && (
              <p className="text-red-500">{errors.variant_image.message}</p>
            )}
          </div> */}

          <div className=" col-span-2 flex items-center md:justify-end">
            <Button disabled={isLoading} type="submit" className="px-10">
              {isLoading && <Spinner />}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductPage;
