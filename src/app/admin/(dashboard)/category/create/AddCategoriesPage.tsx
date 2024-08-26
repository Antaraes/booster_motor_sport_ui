'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddCategoryPage from './AddCategory';

import { useSearchParams, useRouter } from 'next/navigation';
interface AddCategoriesPageProps {}

const AddCategoriesPage: FC<AddCategoriesPageProps> = ({}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tabValue, setTabValue] = useState<string | null>('main_category');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setTabValue(type);
    } else {
      setTabValue('main_category');
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setTabValue(value);
    router.push(`?type=${value}`);
  };

  return (
    <Suspense>
      <div className="w-full">
        <AddCategoryPage />
      </div>
    </Suspense>
  );
};

export default AddCategoriesPage;
