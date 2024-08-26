interface LoginFormValues {
  email: string;
  password: string;
}

type Category = {
  description: any;
  id: number;
  name: string;
  parent_category_id: string | null;
};
