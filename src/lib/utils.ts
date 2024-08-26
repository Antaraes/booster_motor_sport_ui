import { type ClassValue, clsx } from 'clsx';
import { getCookie } from 'cookies-next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};
export const getToken = () => {
  return getCookie('user_ecommerce_token');
};

export const isAdminAuthenticated = () => {
  const token = getCookie('ecommerce_token');
  if (token == 'null' || !token) {
    return false;
  }
  return true;
};

export const isAuthenticated = () => {
  const token = getToken();

  if (token == 'null' || !token) {
    return false;
  }
  return true;
};

export function decodeUrlText(url: string): any {
  // Extract the path and query parameters from the URL
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams.toString();

  // Decode the path and query parameters
  const decodedPath = decodeURIComponent(pathname);
  const decodedParams = decodeURIComponent(searchParams);

  return { decodedPath, decodedParams };
}

export const formatter = new Intl.NumberFormat('en-US');

export const formatCategories = (categories: any) => {
  return categories
    ? categories
        .filter((category: any) => category.product !== null) // Filter out categories with no products
        .map((parentCategory: any) => ({
          _id: parentCategory._id,
          name: parentCategory.name,
          description: parentCategory.description,
        }))
    : [];
};
