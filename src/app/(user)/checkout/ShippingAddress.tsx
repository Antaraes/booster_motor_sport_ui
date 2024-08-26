'use client';

import React, { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Spinner from '@/components/common/Spinner'; // Import Spinner component for loading state
import { ShippingAddressService } from '@/services/user/Shipping.service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { getShippingAddressList } from '@/api';
import useFetch from '@/hooks/useFetch';

interface ShippingAddressFormProps {
  selectedAddressId: string | null;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string | null>>;
}
const ShippingAddressForm: FC<ShippingAddressFormProps> = ({
  selectedAddressId,
  setSelectedAddressId,
}) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { data: shippingData, isLoading } = useFetch(
    'get-shipping-addresses',
    getShippingAddressList
  );

  const router = useRouter();

  useEffect(() => {
    if (shippingData?.data && shippingData.data.shippingAddress.length > 0) {
      setSelectedAddressId(shippingData.data.shippingAddress[0]._id); // Default to first address
    } else {
      setIsAlertDialogOpen(true); // Open the dialog if no address is available
    }
  }, [shippingData]);

  if (isLoading) {
    return (
      <div className="flex justify-center w-full h-screen">
        <Spinner lg />
      </div>
    );
  }

  const handleCancel = () => {
    setIsAlertDialogOpen(false);
    router.push('/'); // Navigate to home page
  };

  return (
    <div className="max-w-4xl w-full mx-auto mt-8 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Select a Shipping Address</h2>

      {shippingData?.data && shippingData?.data.shippingAddress.length > 0 ? (
        shippingData?.data.shippingAddress.map((address: any) => (
          <Card
            key={address._id}
            className={`cursor-pointer p-4 ${
              selectedAddressId === address._id ? 'border border-blue-500' : ''
            }`}
            onClick={() => setSelectedAddressId(address._id)}
          >
            <CardContent>
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="shipping_address"
                  checked={selectedAddressId === address._id}
                  onChange={() => setSelectedAddressId(address._id)}
                  className="cursor-pointer"
                />
                <div>
                  <p className="font-semibold">
                    {address.first_name} {address.last_name}
                  </p>
                  <p>
                    {address.address}, {address.township}, {address.city}
                  </p>
                  <p>
                    {address.region}, {address.country}
                  </p>
                  <p>
                    {address.country_code} {address.phone_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>No Shipping Address Found</AlertDialogTitle>
              <AlertDialogDescription>
                You currently have no shipping addresses saved. Please add a new
                address or go back to the homepage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Go Back Home
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push('/user/profile?tab=shipping')}
              >
                Add New Address
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {selectedAddressId && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Selected Shipping Address Details
          </h3>
          {shippingData?.data.shippingAddress.map(
            (address: any) =>
              address._id === selectedAddressId && (
                <div key={address._id} className="space-y-4">
                  <div>
                    <p className="font-semibold">First Name:</p>
                    <p>{address.first_name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Last Name:</p>
                    <p>{address.last_name}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Country:</p>
                    <p>{address.country}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Region:</p>
                    <p>{address.region}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Address:</p>
                    <p>{address.address}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Township:</p>
                    <p>{address.township}</p>
                  </div>
                  <div>
                    <p className="font-semibold">City:</p>
                    <p>{address.city}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Country Code:</p>
                    <p>{address.country_code}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone Number:</p>
                    <p>{address.phone_number}</p>
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingAddressForm;
