'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatter, isAuthenticated, truncateText } from '@/lib/utils';
import {
  addToWishlist,
  removeFromWishlist,
} from '@/redux/features/wishlistSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { HeartIcon, ListCollapse, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addWishlist, getWishlists, removeWishlist } from '@/api';
import toast from 'react-hot-toast';
import useFetch from '@/hooks/useFetch';
import { addToCart } from '@/redux/features/cartSlice';
import WishlistCount from './WishlistCount';
import { useUpdateCartItemQuantityMutation } from '@/redux/api/cartApi';
import Link from 'next/link';
import { currency } from '@/lib';

interface ProductCardProps {
  product: any;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const {
    medias,
    title,
    content,
    _id,
    view,
    price,
    quantity: product_quantity,
  } = product;

  const { cart_items, total_price, item_quantity } = useAppSelector(
    (state) => state.cart
  );

  const [modal, setModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // Fetch wishlists and dispatch them to Redux store

  const isVideo = medias[0] && medias[0].path.endsWith('.mp4');
  const truncatedTitle = truncateText(title, 8);
  const truncatedText = content && truncateText(content, 50);
  const route = useRouter();
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlists);

  const { mutate } = useMutation({
    mutationFn: (data: any) => addWishlist(data),
    onSuccess: () => {
      toast.success('Added To Wishlist');
    },
  });

  // // Update wishlist from fetched data and local changes

  // Check if the product is in the wishlist
  useEffect(() => {
    const itemInWishlist = wishlist.some((item: any) => item._id === _id);
    setIsInWishlist(itemInWishlist);
  }, [wishlist, _id]);

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

  const router = useRouter();
  const handleWishlist = () => {
    const formData = new FormData();
    const auth = isAuthenticated();

    if (!auth) {
      setIsAlertDialogOpen(true);
      return;
    }
    if (isInWishlist) {
      handleRemoveWishlist(_id);
      dispatch(removeFromWishlist(_id));
    } else {
      dispatch(addToWishlist({ _id, title, price, medias: medias }));
      formData.append('product_id', _id);
      mutate({ product_id: _id });
    }
  };
  const [updateQuantity, { isLoading: isUpdating }] =
    useUpdateCartItemQuantityMutation();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: `${_id}-${Math.random()}`, // Unique ID for cart item
        product_id: { _id, title, product_quantity },
        media: medias,
        quantity,
        unit_price: price,
        total_price: quantity * price,
      })
    );
    // updateQuantity({ productId: _id, quantity: 1 }).catch(console.error);

    toast.success('Added to Cart');
    setModal(false); // Optionally close the modal after adding to cart
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

  if (isAuthenticated()) {
    WishlistCount();
  }

  return (
    <>
      <Dialog open={modal} onOpenChange={setModal}>
        <div
          className={`group relative  w-full h-[350px]  lg:[280px] p-3 rounded-md border border-gray-200 `}
        >
          <div className="relative h-2/3 w-full overflow-hidden rounded-md">
            <div
              className="absolute group-hover:bottom-0 -bottom-10 bg-black text-white w-full text-center transition-all duration-300 p-0 md:p-2 cursor-pointer hidden md:block"
              onClick={() => setModal(!modal)}
            >
              Quick View
            </div>
            <div
              className={`${
                isInWishlist ? '' : 'bg-primary w-10 h-10 rounded-full'
              } md:flex hidden group-hover:opacity-100 opacity-0 absolute top-2 justify-center items-center right-2 cursor-pointer`}
            >
              <HeartIcon
                onClick={handleWishlist}
                className={`text-white ${isInWishlist ? 'fill-red-600' : ''}`}
              />
            </div>

            {medias[0] === undefined ? (
              <Image
                alt="Card background"
                width={320}
                height={320}
                className="h-full w-full object-contain object-center md:h-full md:w-full"
                src={'/assets/imagenotfound.png'}
              />
            ) : (
              <>
                {isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${medias[0]?.path || '/assets/imagenotfound.png'}`}
                  ></video>
                ) : (
                  <Image
                    alt="Card background"
                    width={320}
                    height={320}
                    className="h-full w-full object-contain object-center md:h-full md:w-full"
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${medias[0]?.path}`}
                  />
                )}
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col justify-between items-start h-1/3">
            <div className="flex-grow">
              <p className="font-medium md:text-base text-xs">
                {truncatedTitle}
              </p>
              <p className="font-bold text-sm">
                {currency}
                {formatter.format(price)}
              </p>
            </div>
            <div
              className={`border-t-2 ${product_quantity === 0 && 'hidden'} md:hidden w-full flex items-center justify-center gap-4 py-3`}
            >
              <ShoppingCart
                onClick={handleAddToCart}
                size={20}
                className="text-gray-600 cursor-pointer hover:text-black"
              />
              <HeartIcon
                size={20}
                onClick={handleWishlist}
                className={`text-gray-600 ${isInWishlist ? 'fill-black' : ''} hover:text-black cursor-pointer`}
              />
              <ListCollapse size={20} onClick={() => setModal(true)} />
            </div>
          </div>
        </div>

        <DialogContent className="p-5 bg-white flex md:flex-row flex-col justify-between items-center md:max-w-3xl  w-full">
          <div className="w-1/2 h-80 relative overflow-hidden rounded-md bg-white">
            <div
              className={`${
                isInWishlist ? '' : 'bg-primary w-10 h-10 rounded-full'
              } md:flex hidden transition-all duration-300 absolute top-2 justify-center items-center right-2 cursor-pointer`}
            >
              <HeartIcon
                onClick={handleWishlist}
                className={`text-white ${isInWishlist ? 'fill-red-600' : ''}`}
              />
            </div>
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
                className="h-full w-full object-contain object-center md:h-full md:w-full"
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${medias[0].path}`}
              />
            )}
          </div>
          <div className="w-full md:w-1/2 relative">
            <h1 className="text-lg font-bold mt-2">{title}</h1>

            <div
              id="blog-content"
              dangerouslySetInnerHTML={{
                __html: truncatedText,
              }}
              className="text-xs lg:text-sm text-gray-500"
            ></div>
            <div className="flex items-center my-2 space-x-4">
              <p className="text-xs md:text-sm text-gray-500">View: {view}</p>
              <p className="text-sm font-bold text-gray-900">
                Price: {currency}
                {formatter.format(price)}
              </p>
            </div>
            <div className="flex md:flex-col flex-row justify-between">
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
                  className="border border-gray-200 rounded-full w-auto max-w-12 aspect-square outline-none text-gray-900 font-semibold text-sm py-1.5 px-3 bg-gray-100 text-center"
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
              <div className="flex gap-3 mt-3">
                <Button>
                  <Link href={`/${_id}`}>Detail</Link>
                </Button>
                <Button
                  disabled={product_quantity === 0}
                  onClick={handleAddToCart}
                >
                  {product_quantity === 0 ? 'Out of Stock' : 'Add To Cart'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isAlertDialogOpen && (
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                You must login to add wishlist
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push('/login')}>
                Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ProductCard;
