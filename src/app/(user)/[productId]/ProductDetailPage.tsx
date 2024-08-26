'use client';
import { addWishlist, getDetailProduct, removeWishlist } from '@/api';
import { Button } from '@/components/ui/button';
import { formatter, isAuthenticated, truncateText } from '@/lib/utils';
import {
  addToWishlist,
  removeFromWishlist,
} from '@/redux/features/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addToCart } from '@/redux/features/cartSlice';
import useFetch from '@/hooks/useFetch';
import { currency } from '@/lib';
import Loading from '@/app/loading';

interface ProductDetailPageProps {}

const ProductDetailPage: FC<ProductDetailPageProps> = ({}) => {
  const { productId } = useParams();
  const { data: product, isLoading } = useFetch('productDetail', () =>
    getDetailProduct(productId)
  );

  const [modal, setModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const route = useRouter();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlists);

  const { mutate } = useMutation({
    mutationFn: (data: any) => addWishlist(data),
    onSuccess: () => {
      toast.success('Added To Wishlist');
    },
  });

  const removewishlistmutation = useMutation({
    mutationFn: async (productId) => removeWishlist(productId),
    onSuccess: async (data: any) => {
      toast.success('Item removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response.data.errorDetails.message);
    },
  });
  const handleRemoveWishlist = (productId: any) => {
    dispatch(removeFromWishlist(productId));
    removewishlistmutation.mutate(productId);
  };

  // Update wishlist from fetched data and local changes
  useEffect(() => {
    if (product?.data?._id) {
      const itemInWishlist = wishlist.some(
        (item: any) => item._id === product.data._id
      );
      setIsInWishlist(itemInWishlist);
    }
  }, [wishlist, product]);

  if (isLoading || !product?.data) {
    return <Loading />;
  }

  const {
    medias,
    title,
    content,
    _id,
    view,
    price,
    quantity: product_quantity,
  } = product.data;

  const isVideo = medias[0] && medias[0].path.endsWith('.mp4');

  const handleWishlist = () => {
    const formData = new FormData();
    const auth = isAuthenticated();

    if (!auth) {
      toast.success('Please login to add wishlist');
      return route.push('/login');
    }
    if (isInWishlist) {
      handleRemoveWishlist(_id);
      dispatch(removeFromWishlist(_id));
      toast.success('Item removed successfully');
    } else {
      dispatch(addToWishlist({ _id, title, price, medias: medias }));
      formData.append('product_id', _id);
      mutate({ product_id: _id });
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: `${_id}-${Math.random()}`, // Unique ID for cart item
        product_id: { _id, title, product_quantity: product_quantity },
        media: medias,
        quantity,
        unit_price: price,
        total_price: quantity * price,
      })
    );
    toast.success('Added to Cart');
    setModal(false);
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity < product_quantity) {
        return prevQuantity + 1;
      }
      toast.success('Cannot increase quantity, stock limit reached', {
        icon: '⚠️', // Optional: Add a warning icon
      });
      return prevQuantity; // Return the same value if quantity exceeds product_quantity
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };
  console.log(product_quantity);

  return (
    <div className="lg:flex gap-4 ">
      <div className="lg:w-64 relative overflow-hidden rounded-md h-80 bg-white">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${medias[0].path}`}
          ></video>
        ) : (
          <Image
            alt="Card background"
            width={320}
            height={320}
            className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${medias[0].path}`}
          />
        )}
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="text-lg font-bold mt-2">{title}</h1>

        <div
          id="blog-content"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
          className="text-xs lg:text-sm text-gray-500"
        ></div>

        <p className="text-xs my-3 lg:text-sm text-gray-500">View: {view}</p>
        <p className="text-sm my-3 font-bold text-gray-900">
          Price: {currency}
          {formatter.format(price)}
        </p>

        <div className="flex gap-5 items-center ">
          <div className="flex items-center gap-4">
            <button
              onClick={decreaseQuantity}
              className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
            >
              <svg
                className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                width={18}
                height={19}
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 9.5H13.5"
                  stroke=""
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              type="text"
              id="number"
              value={quantity}
              readOnly
              className="border  border-gray-200 rounded-full w-auto max-w-12 aspect-square outline-none text-gray-900 font-semibold text-sm py-1.5 px-3 bg-gray-100 text-center"
            />
            <button
              onClick={increaseQuantity}
              className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300"
            >
              <svg
                className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                width={18}
                height={19}
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75 9.5H14.25M9 14.75V4.25"
                  stroke=""
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-3">
            <Button disabled={product_quantity === 0} onClick={handleAddToCart}>
              {product_quantity === 0 ? 'Out of Stock' : 'Add To Cart'}
            </Button>
          </div>
          <div
            className={`${
              isInWishlist ? '' : ''
            } flex transition-all duration-300  justify-center items-center cursor-pointer`}
          >
            <HeartIcon
              onClick={handleWishlist}
              className={`text-black ${isInWishlist ? 'fill-red-600' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
