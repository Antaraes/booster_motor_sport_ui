import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the wishlist item type

interface MediaItem {
  _id: string;
  path: string;
}
interface WishlistItem {
  _id: string; // Add an identifier
  title: string;
  // url: string;
  price: number;
  medias: MediaItem[];
}

// Define the initial state type
interface WishlistState {
  wishlistCount: number;
  wishlists: WishlistItem[];
}

// Define the initial state
const initialState: WishlistState = {
  wishlistCount: 0,
  wishlists: [],
};

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlists: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlists = action.payload;
      state.wishlistCount = action.payload.length;
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItemIndex = state.wishlists.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if the item already exists in the wishlist
        return;
        // state.wishlists[existingItemIndex].quantity += action.payload.quantity;
      }
      // Add the item to the wishlist if it doesn't exist
      state.wishlists.push(action.payload);

      state.wishlistCount = state.wishlists.length;
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlists = state.wishlists.filter(
        (item) => item._id !== action.payload
      );
      state.wishlistCount = state.wishlists.length;
    },
  },
});

// Export actions
export const { setWishlists, addToWishlist, removeFromWishlist } =
  wishlistSlice.actions;

// Export the reducer
export default wishlistSlice.reducer;
