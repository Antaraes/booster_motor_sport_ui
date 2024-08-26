import API from '@/api/interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Define the async thunk to fetch cart data
export const fetchCartData = createAsyncThunk(
  'cart/fetchCartData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/cart');
      return response.data; // Return the fetched data
    } catch (error: any) {
      return rejectWithValue(error.response.data); // Return the error message
    }
  }
);
