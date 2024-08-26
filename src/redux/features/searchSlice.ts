import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface SearchState {
  data: Record<string, any>;
}

// Define the initial state
const initialState: SearchState = {
  data: {},
};

// Create the slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Record<string, any>>) => {
      state.data = action.payload;
    },
    clearData: (state) => {
      state.data = {};
    },
  },
});

// Export actions
export const { setData, clearData } = searchSlice.actions;

// Export the reducer
export default searchSlice.reducer;
