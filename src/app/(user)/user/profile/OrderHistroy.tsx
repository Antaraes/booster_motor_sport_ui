import { FC, useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getUserOrderhistory } from '@/api';
import Loading from '@/app/loading';
import { currency } from '@/lib';

interface OrderHistoryProps {}

const OrderHistory: FC<OrderHistoryProps> = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['OrderHistory'],
    queryFn: getUserOrderhistory,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 px-4 md:px-6 ">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <p className="text-gray-500">
        Review your past orders and track current shipments.
      </p>
      <div className="space-y-4">
        {data?.data?.data.order.map((order: any) => (
          <OrderSummary key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

interface OrderSummaryProps {
  order: any;
}

const OrderSummary: FC<OrderSummaryProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div
        className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="space-y-1">
          <p className="text-lg font-semibold">Order ID: {order._id}</p>
          <p className="text-sm text-gray-600">
            Total Price: {currency}
            {order.total_price}
          </p>
          <p className="text-sm text-gray-600">Status: {order.order_status}</p>
          <p className="text-sm text-gray-600">
            Ordered On:{' '}
            {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}
          </p>
        </div>
        <button className="text-blue-500" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {isOpen && (
        <div className="bg-white p-4">
          {order.order_items.map((item: any) => (
            <div key={item._id} className="border-b py-2">
              <p className="font-semibold">{item.product_id?.title}</p>
              <p>Quantity: {item?.quantity}</p>
              <p>
                Unit Price: {currency}
                {item?.unit_price}
              </p>
              <p>
                Total Price: {currency}
                {item.total_price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
