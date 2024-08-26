// utils/auth.js
import { deleteCookie, getCookie } from 'cookies-next';

export const logout = () => {
  // Delete the token from local storage
  localStorage.removeItem('ecommerce_token');

  // Delete the token from cookies
  deleteCookie('ecommerce_token');

  // Redirect to the login page
  window.location.href = '/admin/login';
};

export const logoutForUser = () => {
  // Delete the token from local storage
  localStorage.removeItem('user_ecommerce_token');
  localStorage.removeItem('persist:root');

  // Delete the token from cookies
  deleteCookie('user_ecommerce_token');

  // Redirect to the login page
  window.location.href = '/';
};

export const currency = 'MMK';
