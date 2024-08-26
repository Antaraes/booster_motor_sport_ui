import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCartData } from '../asyncThunks/cartThunks';
import { cartApi } from '../api/cartApi';

// Define the product type
interface Product {
  _id: string;
  title: string;
  product_quantity: number;
}

// Define the cart item type
interface CartItem {
  _id: string; // Unique ID for the cart item
  product_id: Product; // The product associated with this cart item
  media: MediaItem[];
  quantity: number; // Quantity of the product in the cart
  unit_price: number; // Unit price of the product
  total_price: number; // Total price for this cart item (quantity * unit_price)
}

interface MediaItem {
  _id: string;
  path: string;
}

// Define the initial state type
interface CartState {
  cart_items: CartItem[];

  total_price: number;
  item_quantity: number;
}

// Define the initial state
const initialState: CartState = {
  cart_items: [],
  total_price: 0,
  item_quantity: 0,
};

// Create the slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart_items.findIndex(
        (item) => item.product_id._id === action.payload.product_id._id
      );

      if (existingItemIndex !== -1) {
        // If the item already exists in the cart, update its quantity and total price
        const existingItem = state.cart_items[existingItemIndex];
        existingItem.quantity += action.payload.quantity;
        existingItem.total_price =
          existingItem.quantity * existingItem.unit_price;
      } else {
        // Add the item to the cart if it doesn't exist
        state.cart_items.push({
          ...action.payload,
          total_price: action.payload.quantity * action.payload.unit_price,
        });
      }

      // Update item_quantity and total_price
      state.item_quantity += action.payload.quantity;
      state.total_price = state.cart_items.reduce(
        (total, item) => total + item.total_price,
        0
      );
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.cart_items.find(
        (item) => item.product_id._id === action.payload
      );

      if (itemToRemove) {
        // Update item_quantity before removing the item
        state.item_quantity -= itemToRemove.quantity;
        state.cart_items = state.cart_items.filter(
          (item) => item.product_id._id !== action.payload
        );

        // Recalculate the total price of the cart
        state.total_price = state.cart_items.reduce(
          (total, item) => total + item.total_price,
          0
        );
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.cart_items.findIndex(
        (item) => item.product_id._id === productId
      );

      if (itemIndex !== -1 && quantity > 0) {
        const item = state.cart_items[itemIndex];
        const quantityDifference = quantity - item.quantity;

        // Update the quantity and total price for the cart item
        item.quantity = quantity;
        item.total_price = item.quantity * item.unit_price;

        // Update item_quantity and total_price
        state.item_quantity += quantityDifference;
        state.total_price = state.cart_items.reduce(
          (total, item) => total + item.total_price,
          0
        );
      }
    },
    clearCart: (state) => {
      state.cart_items = [];
      state.total_price = 0;
      state.item_quantity = 0;
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const itemIndex = state.cart_items.findIndex(
        (item) => item.product_id._id === productId
      );

      if (itemIndex !== -1) {
        const item = state.cart_items[itemIndex];
        item.quantity += 1;
        item.total_price = item.quantity * item.unit_price;

        // Update item_quantity and total_price
        state.item_quantity += 1;
        state.total_price = state.cart_items.reduce(
          (total, item) => total + item.total_price,
          0
        );
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const itemIndex = state.cart_items.findIndex(
        (item) => item.product_id._id === productId
      );

      if (itemIndex !== -1 && state.cart_items[itemIndex].quantity > 1) {
        const item = state.cart_items[itemIndex];
        item.quantity -= 1;
        item.total_price = item.quantity * item.unit_price;

        // Update item_quantity and total_price
        state.item_quantity -= 1;
        state.total_price = state.cart_items.reduce(
          (total, item) => total + item.total_price,
          0
        );
      }
    },
    combineToCart: (state, action: PayloadAction<CartItem[]>) => {
      const newItems = action.payload;

      newItems.forEach((newItem) => {
        const existingItemIndex = state.cart_items.findIndex(
          (item) => item.product_id._id === newItem.product_id._id
        );

        if (existingItemIndex !== -1) {
          const existingItem = state.cart_items[existingItemIndex];
          if (
            existingItem.quantity !== newItem.quantity ||
            existingItem.unit_price !== newItem.unit_price
          ) {
            existingItem.quantity = newItem.quantity;
            existingItem.unit_price = newItem.unit_price;
            existingItem.total_price =
              existingItem.quantity * existingItem.unit_price;
          }
        } else {
          state.cart_items.push({
            ...newItem,
            total_price: newItem.quantity * newItem.unit_price,
          });
        }
      });

      // Recalculate total_price and item_quantity
      state.total_price = state.cart_items.reduce(
        (total, item) => total + item.total_price,
        0
      );

      state.item_quantity = state.cart_items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.fulfilled, (state, action) => {
        // Update the state with the fetched cart data
        const cartData = action.payload.data;
        state.cart_items = cartData.cart_items;
        state.total_price = cartData.total_price;
        state.item_quantity = cartData.cart_items.reduce(
          (total: any, item: any) => total + item.quantity,
          0
        );
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        console.error('Failed to fetch cart data:', action.payload);
      })
      .addMatcher(
        cartApi.endpoints.addToCart.matchFulfilled,
        (state, action) => {
          const cartData = action.payload.data;
          state.cart_items = cartData.cart_items;
          state.total_price = cartData.total_price;
          state.item_quantity = cartData.cart_items.reduce(
            (total: any, item: any) => total + item.quantity,
            0
          );
        }
      )
      .addMatcher(
        cartApi.endpoints.removeFromCart.matchFulfilled,
        (state, action) => {
          const cartData = action.payload.data;
          state.cart_items = cartData.cart_items;
          state.total_price = cartData.total_price;
          state.item_quantity = cartData.cart_items.reduce(
            (total: any, item: any) => total + item.quantity,
            0
          );
        }
      )
      .addMatcher(
        cartApi.endpoints.updateCartItemQuantity.matchFulfilled,
        (state, action) => {
          const cartData = action.payload.data;
          state.cart_items = cartData.cart_items;
          state.total_price = cartData.total_price;
          state.item_quantity = cartData.cart_items.reduce(
            (total: any, item: any) => total + item.quantity,
            0
          );
        }
      );
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  combineToCart,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
