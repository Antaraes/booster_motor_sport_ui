import { getSearchProduct } from '@/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useSearchQuery = (
  page: string,
  limit: string,
  searchQuery: string,
  category?: string
) => {
  return useQuery({
    queryKey: ['search'],
    queryHash: searchQuery,
    queryFn: () => getSearchProduct(page, limit, searchQuery, category),
    enabled: !!searchQuery,
  });
};

export default useSearchQuery;
