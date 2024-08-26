import { combineReducers } from '@reduxjs/toolkit';
import counter from './features/counterSlice';
import wishlist from './features/wishlistSlice';
import search from './features/searchSlice';
import cart from './features/cartSlice';
import category from './features/categorySlice';
import { cartApi } from './api/cartApi';

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  counter,
  wishlist,
  search,
  cart,
  category,
  [cartApi.reducerPath]: cartApi.reducer,
});

export default rootReducer;
