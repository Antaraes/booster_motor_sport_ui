'use client';
import { useState, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useMutation } from '@tanstack/react-query';
import { get_user_profile, updateUserProfile } from '@/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import useFetch from '@/hooks/useFetch';
import { isPending } from '@reduxjs/toolkit';

const profileSchema = z.object({
  first_name: z.string().nonempty({ message: 'First name is required' }),
  last_name: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  country_code: z.string({ message: 'Country Code is required' }).optional(),
  phone_number: z.string({ message: 'Phone Number is required' }).optional(),
  gender: z.string({ message: 'Gender is required' }).optional(),
  dob: z.string().nonempty({ message: 'Date of birth is required' }),
  avatar: z.any().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;
type gender = 'Male' | 'Female' | 'Other';
const Profile: FC = () => {
  const gender: gender[] = ['Male', 'Female', 'Other'];
  const {
    data: profileDatas,
    isLoading,
    refetch,
  } = useFetch('get-profile', get_user_profile);
  const [avatar, setAvatar] = useState('');
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
    mutationFn: (data: any) =>
      updateUserProfile(profileDatas.data.user._id, data),
    onSuccess: (data) => {
      toast.success(data.data.message);
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Error updating profile: ${error.message}`);
    },
  });

  useEffect(() => {
    if (profileDatas) {
      const profileData = profileDatas.data.user;
      setValue('first_name', profileData.first_name);
      setValue('last_name', profileData.last_name);
      setValue('email', profileData.email);
      setValue('country_code', profileData.country_code);
      setValue('phone_number', profileData.phone_number);
      setValue('gender', profileData.gender);
      setValue('dob', profileData.dob);
      setValue('avatar', profileData.avatar);
    }
  }, [profileDatas, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setIsFormDirty(true);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (formData: any) => {
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
    setValue('avatar', file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
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
    <>
      <div className="px-4 space-y-6 sm:px-6">
        <Card>
          <CardContent className="flex items-center space-x-3 h-full py-5 ">
            <div className="max-h-52 max-w-52">
              <Image
                src={
                  avatar !== ''
                    ? avatar
                    : `${process.env.NEXT_PUBLIC_MEDIA_URL}${watch('avatar')}` ||
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
          </CardContent>
        </Card>

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
                  <Input id="email" {...register('email')} disabled={true} />
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
                      setValue('country_code', dialCode);
                      setValue('phone_number', value);
                    }}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
                  {errors.country_code && (
                    <p className="text-red-500">
                      {errors.country_code.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('gender', {
                      required: 'Gender is required',
                    })}
                  >
                    <option value="">Select Gender</option>

                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Other'}>Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2 mt-2 flex flex-col">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] justify-start text-left font-normal',
                          !watch('dob') && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('dob') ? (
                          format(new Date(watch('dob')), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(watch('dob'))}
                        onSelect={(date) =>
                          setValue(
                            'dob',
                            date?.toISOString().split('T')[0] || ''
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dob && (
                    <p className="text-red-500">{errors.dob.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className=""
              disabled={!isFormDirty || mutation.isPending}
            >
              {mutation.isPending && <Spinner sm />}Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
