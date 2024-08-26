import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface categoryState {
  name: string;
}

// Define the initial state
const initialState: categoryState = {
  name: '',
};

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

// Export actions
export const { setCategory } = wishlistSlice.actions;

// Export the reducer
export default wishlistSlice.reducer;
