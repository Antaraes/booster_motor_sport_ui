'use client';
import { useState, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProfile, updateProfile } from '@/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import useFetch from '@/hooks/useFetch';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  first_name: z.string().nonempty({ message: 'First name is required' }),
  last_name: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  country_code: z.string().nonempty({ message: 'Country code is required' }),
  phone_number: z.string().nonempty({ message: 'Phone number is required' }),
  photo: z.any().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileProps {}

const Profile: FC<ProfileProps> = ({}) => {
  const {
    data: profileDatas,
    isLoading,
    refetch,
  } = useFetch('get-profile', getProfile);
  const [avater, setAvater] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateProfile(profileDatas.data._id, data),
    onSuccess: () => {
      toast.success('Profile updated');
      refetch();
    },
    onError: (error: any) => {
      toast.error('Error updating profile:', error.message);
    },
  });

  useEffect(() => {
    if (profileDatas) {
      const profileData = profileDatas.data;
      setValue('first_name', profileData.first_name);
      setValue('last_name', profileData.last_name);
      setValue('email', profileData.email);
      setValue('country_code', profileData.country_code);
      setValue('phone_number', profileData.phone_number);
      setValue('photo', profileData.photo);
    }
  }, [profileDatas, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setIsFormDirty(true);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (formData: ProfileFormData) => {
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof Blob) {
        form.append(key, value);
      } else if (typeof value === 'string') {
        form.append(key, value);
      } else {
        form.append(key, String(value || ''));
      }
    });

    mutation.mutate(form);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValue('photo', file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvater(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center w-full h-screen ">
        <Spinner lg />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <div className="flex items-center space-x-3 ">
            <div className="max-h-52 max-w-52">
              <Image
                src={
                  avater !== ''
                    ? avater
                    : `${process.env.NEXT_PUBLIC_MEDIA_URL}${watch('photo')}` ||
                      '/assets/member.png'
                }
                alt="Avatar"
                width="80"
                height="80"
                className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 object-cover"
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-2xl font-bold mb-2">
                {watch('first_name')} {watch('last_name')}
              </h1>
              <Label
                htmlFor="photo"
                className="cursor-pointer bg-black text-white p-2 rounded-2xl"
              >
                Change photo
              </Label>
              <Input
                id="photo"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <Card className="py-10">
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" {...register('first_name')} />
                  {errors.first_name && (
                    <p className="text-red-500">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" {...register('last_name')} />
                  {errors.last_name && (
                    <p className="text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...register('email')} />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <PhoneInput
                    country={'us'}
                    value={watch('phone_number')}
                    onChange={(value, data: any) => {
                      const dialCode = data.dialCode;
                      const phoneNumber = value;
                      setValue('country_code', dialCode);
                      setValue('phone_number', value);
                    }}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="pt-6">
            <Button type="submit" disabled={!isFormDirty || mutation.isPending}>
              {mutation.isPending && <Spinner sm />}Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
