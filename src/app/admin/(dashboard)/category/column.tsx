import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },

  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info: { getValue: () => any }) => {
      const date = new Date(info.getValue());
      const formattedDate = format(date, 'd MMM yyyy');
      return <p>{formattedDate}</p>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: (info: { getValue: () => any }) => {
      const date = new Date(info.getValue());
      const formattedDate = format(date, 'd MMM yyyy');
      return <p>{formattedDate}</p>;
    },
  },
];
