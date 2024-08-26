'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addMember } from '@/api'; // Update this import to your actual API function
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCookies } from 'next-client-cookies';

const schema = z.object({
  first_name: z.string().nonempty('First name is required'),
  last_name: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email format'),
  country_code: z.string().nonempty('Country code is required'),
  phone_number: z.string().nonempty('Phone number is required'),
  photo: z.any().refine((file) => file instanceof FileList && file.length > 0, {
    message: 'Photo is required',
  }),
  avatar: z.any().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role_id: z.string().nonempty('Role ID is required'),
});

export type EmployeeFormValues = z.infer<typeof schema>;

export const AddEmployeeService = () => {
  const cookies = useCookies();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
  });
  const navigate = useRouter();

  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData: FormData) => addMember(employeeData),
    onSuccess: () => {
      toast.success('Employee added successfully');
      navigate.push('/admin/team');
    },
    onError: (error: any) => {
      console.error('Adding employee failed!', error);
      toast.error('Adding employee failed');
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] instanceof FileList) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    addEmployeeMutation.mutate(formData);
  };

  return {
    isSuccess: addEmployeeMutation.isSuccess,
    onSubmit,
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    isLoading: addEmployeeMutation.isPending,
  };
};
