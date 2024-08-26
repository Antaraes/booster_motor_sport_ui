'use client';
import React, { useState } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignupService } from '@/services/user/Signup.service';
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const SignupForm = () => {
  const { form, onSubmit, isLoading } = SignupService();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // Destructure formState to get errors
  const {
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row">
          <div className="relative w-full bg-cover lg:w-6/12 xl:w-7/12 bg-gradient-to-r from-white via-white to-gray-100">
            <div className="relative flex flex-col items-center justify-center w-full h-full px-10 my-20 lg:px-16 lg:my-0">
              <div className="flex flex-col items-start space-y-8 tracking-tight lg:max-w-3xl">
                <div className="relative">
                  <p className="mb-2 font-medium text-gray-700 uppercase">
                    Shop Smarter
                  </p>
                  <h2 className="text-5xl font-bold text-gray-900 xl:text-6xl">
                    Features to Enhance Your Shopping Experience
                  </h2>
                </div>
                <p className="text-2xl text-gray-700">
                  Discover a seamless shopping experience designed to help you
                  find exactly what you need, faster and easier.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full bg-white lg:w-6/12 xl:w-5/12">
            <div className="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24">
              <h4 className="w-full text-3xl font-bold">Create an account</h4>
              <p className="text-lg text-gray-500">
                or, if you have an account you can{' '}
                <Link
                  href="/login"
                  className="text-blue-600 underline"
                  data-primary="blue-600"
                >
                  sign in
                </Link>
              </p>
              <div className="relative w-full mt-4 ">
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    action=""
                    encType="multipart/form-data"
                    className="max-w-4xl gap-4 mx-auto  grid  "
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Your email address.</FormDescription>
                          <FormMessage>{errors.email?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword ? (
                                  <EyeIcon size={24} />
                                ) : (
                                  <EyeOffIcon size={24} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your password (at least 8 characters).
                          </FormDescription>
                          <FormMessage>{errors.password?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="mt-4">
                      {isLoading && <Spinner />}Signup
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
