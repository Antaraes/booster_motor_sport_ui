import { Button } from '@/components/ui/button';
import { truncateText } from '@/lib/utils';
import {
  AddProductFormValues,
  Variant,
} from '@/services/product/AddProduct.service';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';

export const columns: ColumnDef<AddProductFormValues>[] = [
  {
    accessorKey: 'medias',
    header: 'Media',
    cell: (info) => {
      const media = info.getValue() as any;
      const isVideo = media[0] && media[0].path.endsWith('.mp4');
      return isVideo ? (
        <video width="50" height="50" controls>
          <source
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${media[0]?.path}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border ">
          <Image
            alt="Card background"
            width={320}
            height={320}
            className="h-full w-full object-contain "
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${media[0].path}`}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: (info) => {
      const text = info.getValue()!.toString();
      const truncatedText = truncateText(text, 10);
      return <div dangerouslySetInnerHTML={{ __html: truncatedText }}></div>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <button
          className="flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: (info) => `$${info.getValue()}`,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  // {
  //   accessorKey: 'variants',
  //   header: 'Variants',
  //   cell: (info) => {
  //     const variants = info.getValue() as Variant[];
  //     return variants
  //       .map(
  //         (variant) => `${variant.name}: ${variant.value} ($${variant.price})`
  //       )
  //       .join(', ');
  //   },
  // },

  // {
  //   accessorKey: 'related_image',
  //   header: 'Related Images',
  //   cell: (info) => {
  //     const images = info.getValue() as string[];
  //     return images.map((image, index) => (
  //       <Image
  //         key={index}
  //         src={image}
  //         alt={`Related Image ${index}`}
  //         width="50"
  //         height="50"
  //       />
  //     ));
  //   },
  // },
  // {
  //   accessorKey: 'variant_image',
  //   header: 'Variant Images',
  //   cell: (info) => {
  //     const images = info.getValue() as string[];
  //     return images.map((image, index) => (
  //       <Image
  //         key={index}
  //         src={image}
  //         alt={`Variant Image ${index}`}
  //         width="50"
  //         height="50"
  //       />
  //     ));
  //   },
  // },
];
