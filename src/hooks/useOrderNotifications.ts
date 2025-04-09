import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addNotification } from '@/store/slices/notificationSlice';

// Mock function to simulate checking for new orders
const checkForNewOrders = async () => {
  // In production, this would make an API call to check for new orders
  const mockNewOrder = {
    id: Date.now().toString(),
    orderId: `ORD-${Math.floor(Math.random() * 1000)}`,
    customerName: 'John Doe',
    amount: 15000
  };

  // Simulate random new orders
  return Math.random() > 0.7 ? mockNewOrder : null;
};

export function useOrderNotifications() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkOrders = async () => {
      try {
        const newOrder = await checkForNewOrders();
        
        if (newOrder) {
          dispatch(addNotification({
            id: newOrder.id,
            title: 'New Order Received',
            message: `Order #${newOrder.orderId} received from ${newOrder.customerName} for ₹${newOrder.amount}`,
            type: 'info',
            timestamp: new Date().toISOString(),
            read: false,
            link: `/orders/${newOrder.orderId}`
          }));
        }
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    };

    // Check immediately on mount
    checkOrders();

    // Then check every 30 seconds
    const interval = setInterval(checkOrders, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);
}