import Spinner from '@/components/common/Spinner';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Spinner lg />
    </div>
  );
}
