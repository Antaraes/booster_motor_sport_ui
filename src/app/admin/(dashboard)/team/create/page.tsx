'use client';
import { getRoles } from '@/api';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useFetch from '@/hooks/useFetch';
import { AddEmployeeService } from '@/services/admin/team/AddEmployee.service';
import { FC, useState } from 'react';

interface pageProps {}
interface Country {
  name: string;
  code: string;
}

const Page: FC<pageProps> = ({}) => {
  const {
    register,
    control,
    errors,
    isLoading,
    handleSubmit,
    onSubmit,
    isSuccess,
    setValue,
  } = AddEmployeeService();
  const countries: Country[] = [
    { name: 'United Arab Emirates', code: '+971' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    // Add more countries as needed
  ];

  const { data: role } = useFetch('roles', getRoles);

  const [countryCode, setCountryCode] = useState<string>('');

  const handleCountryChange = (event: any) => {
    const selectedCountry = countries.find(
      (country) => country.name === event.target.value
    );
    if (selectedCountry) {
      setCountryCode(selectedCountry.code);
      setValue('country_code', selectedCountry.code);
    }
  };
  return (
    <div className="w-full  flex flex-col justify-center ">
      <p className="text-4xl  border-secondary font-bold">Add New Employee</p>
      <hr className="h-px my-8 border-0 bg-gray-700" />
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid w-full items-center gap-10 grid-cols-2 justify-between">
          <div>
            <h4 className="text-2xl font-bold">First Name</h4>
            <p className="text-foreground">Enter the first name</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="first_name">
              First Name
            </Label>
            <Input
              id="first_name"
              type="text"
              {...register('first_name', {
                required: 'First name is required',
              })}
              placeholder="Enter First Name.."
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <h4 className="text-2xl font-bold">Last Name</h4>
            <p className="text-foreground">Enter the last name</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="last_name">
              Last Name
            </Label>
            <Input
              id="last_name"
              type="text"
              {...register('last_name', { required: 'Last name is required' })}
              placeholder="Enter Last Name.."
            />
            {errors.last_name && (
              <p className="text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <h4 className="text-2xl font-bold">Email</h4>
            <p className="text-foreground">Enter the email address</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter Email.."
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <h4 className="text-2xl font-bold">Country Code</h4>
            <p className="text-foreground">Enter the country code</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="country_code">
              Country Code
            </Label>
            <select
              className=" flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="country"
              onChange={handleCountryChange}
              defaultValue=""
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country_code && (
              <p className="text-red-500">{errors.country_code.message}</p>
            )}
          </div>

          <div>
            <h4 className="text-2xl font-bold">Phone Number</h4>
            <p className="text-foreground">Enter the phone number</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="phone_number">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              type="text"
              {...register('phone_number', {
                required: 'Phone number is required',
              })}
              placeholder="Enter Phone Number.."
            />
            {errors.phone_number && (
              <p className="text-red-500">{errors.phone_number.message}</p>
            )}
          </div>

          <div className="self-start">
            <h4 className="text-2xl font-bold">Photo</h4>
            <p className="text-foreground">Upload a photo</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="photo">
              Photo
            </Label>
            <Input
              id="photo"
              type="file"
              {...register('photo', { required: 'Photo is required' })}
            />
          </div>

          <div className="self-start">
            <h4 className="text-2xl font-bold">Avatar</h4>
            <p className="text-foreground">Upload an avatar</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="avatar">
              Avatar
            </Label>
            <Input id="avatar" type="file" {...register('avatar')} />
          </div>

          <div>
            <h4 className="text-2xl font-bold">Password</h4>
            <p className="text-foreground">Enter a password</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter Password.."
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="self-start">
            <h4 className="text-2xl font-bold">Role ID</h4>
            <p className="text-foreground">Enter the role ID</p>
          </div>
          <div>
            <Label className="font-bold" htmlFor="role_id">
              Role ID
            </Label>
            <select
              id="role_id"
              className=" flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('role_id', { required: 'Role is required' })}
            >
              <option value="">Select Role</option>
              {role?.data.map((r: any) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500">{errors.role_id.message}</p>
            )}
          </div>
          <div></div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Spinner sm /> : 'Submit'}
          </Button>
        </div>
      </form>
      {isSuccess && <p>Employee added successfully!</p>}
    </div>
  );
};

export default Page;
