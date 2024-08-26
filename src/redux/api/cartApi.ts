import API, { axiosBaseQuery } from '@/api/interceptor';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getCart: builder.mutation({
      query: ({}) => ({
        url: 'cart',
        method: 'GET',
      }),
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: 'cart/add',
        method: 'POST',
        body: { product_id: productId, quantity },
      }),
    }),
    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: 'cart/add',
        method: 'POST',
        body: { product_id: productId, quantity },
      }),
    }),
    removeFromCart: builder.mutation({
      query: ({ productId }) => ({
        url: 'cart/remove',
        method: 'POST',
        body: { product_id: productId },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetCartMutation,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
} = cartApi;
