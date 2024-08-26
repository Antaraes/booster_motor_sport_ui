'use client';
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ForgotService, LoginService } from '@/services/admin/Login.service';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Spinner from '@/components/common/Spinner';
import { Label } from '@/components/ui/label'; // Ensure you have this component

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { form, onSubmit, isLoading } = LoginService();

  const {
    formState: { errors },
  } = form;
  const {
    form: forgotForm,
    onSubmit: forgotOnSubmit,
    isLoading: forgotLoding,
    modal,
    setModal,
  } = ForgotService();
  const {
    formState: { errors: forgotErrors },
  } = forgotForm;

  return (
    <div className="flex justify-between h-screen items-center w-full overflow-y-hidden">
      <div className="w-full flex justify-center">
        <div>
          <p className="text-4xl font-medium">Welcome back!</p>
          <p className="text-base">
            Enter your Credentials to access your account
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 my-10"
          >
            <div>
              <Label className="font-bold">Email</Label>
              <Input {...form.register('email')} placeholder="example.com" />
              <p className="text-sm text-red-600">
                {errors.email && errors.email.message}
              </p>
            </div>
            <div>
              <Label className="font-bold">Password</Label>
              <Input
                {...form.register('password')}
                type="password"
                placeholder="password"
              />
              <p className="text-sm text-red-600">
                {errors.password && errors.password.message}
              </p>
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? <Spinner sm /> : 'Login'}
            </Button>
          </form>
          <Dialog open={modal} onOpenChange={setModal}>
            <DialogTrigger asChild>
              <span className="cursor-pointer underline">Forgot Password</span>
            </DialogTrigger>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>If you dont remember password</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={forgotForm.handleSubmit(forgotOnSubmit)}
                className="space-y-8 my-10"
              >
                <div>
                  <Label className="font-bold">Email</Label>
                  <Input
                    {...forgotForm.register('email')}
                    placeholder="example.com"
                  />
                </div>
                <p className="text-sm text-red-600">
                  {forgotErrors.email && forgotErrors.email.message}
                </p>

                <Button type="submit" className="w-full">
                  {forgotLoding ? <Spinner sm /> : 'Submit'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-1/2 md:block hidden h-full">
        <Image
          src={'/assets/chris.png'}
          width={600}
          height={200}
          className="object-cover"
          alt="loginPage"
        />
      </div>
    </div>
  );
};

export default page;
