'use client';
import { LoginService } from '@/services/user/Login.service';
import { FC, useState } from 'react';

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
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { isAuthenticated } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {
  const [saveLogin, setSaveLogin] = useState<boolean>(false);
  const { form, onSubmit, isLoading } = LoginService({ saveLogin });
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
    <section className="w-full h-screen flex flex-col justify-center items-center px-8 py-16 bg-gray-100 xl:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center md:flex-row">
          <div className="w-full space-y-5 md:w-3/5 md:pr-16">
            <p
              className="font-medium text-blue-500 uppercase"
              data-primary="blue-500"
            >
              Elevating Your Shopping Experience
            </p>
            <h2 className="text-2xl font-extrabold leading-none text-black sm:text-3xl md:text-5xl">
              Redefining How You Shop Online
            </h2>
            <p className="text-xl text-gray-600 md:pr-16">
              Discover innovative ways to connect with products that match your
              style and needs. We&apos;re transforming the way customers shop
              and interact with brands.
            </p>
          </div>

          <div className="w-full mt-16 md:mt-0 md:w-2/5">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                action=""
                encType="multipart/form-data"
                className="relative z-10 h-auto p-8 py-10 overflow-hidden bg-white grid gap-4 border-b-2 border-gray-300 rounded-lg shadow-2xl px-7"
                data-rounded="rounded-lg"
                data-rounded-max="rounded-full"
              >
                <h3 className="mb-3 text-2xl font-medium text-center">
                  Sign in to your Account
                </h3>
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

                      <FormMessage>{errors.password?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-center">
                  <Input
                    type="checkbox"
                    id="keepmelogin"
                    size={20}
                    className=" w-3"
                    onChange={() => setSaveLogin(!saveLogin)}
                  />
                  <Label htmlFor="keepmelogin" className="text-sm">
                    Keep me login
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 w-full"
                >
                  {isLoading && <Spinner />}Login
                </Button>
                <p className="w-full mt-4 text-sm text-center text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-blue-500 underline">
                    Sign up here
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
