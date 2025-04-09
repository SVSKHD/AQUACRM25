import { useState, Fragment } from 'react';
import { Search, Package, Truck, IndianRupee, Calendar, Clock, User, Phone, Mail, MapPin, ExternalLink, Download, FileText, ChevronDown, ChevronUp, CheckCircle2, Circle, CircleDot, ShoppingBag, Wallet, CreditCard, Building2, AlertTriangle, Edit2 } from 'lucide-react';
import { Dialog, Transition, Tab } from '@headlessui/react';

interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Order {
  _id: string;
  user: string;
  orderId: string;
  orderType: string;
  transactionId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  currency: string;
  billingAddress: Address;
  shippingAddress: Address;
  shippingMethod: string;
  shippingCost: number;
  estimatedDelivery: string;
  orderStatus: string;
  refund: boolean;
  refundStatus: string;
  offerApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockOrderResponse = {
  "success": true,
  "data": [
    {
      "_id": "67ef9bc906b297db918519e5",
      "user": "67c09d9fbcf5562007e185d8",
      "orderId": "AQOD04042025IJ",
      "orderType": "Cash On Delivery",
      "transactionId": "AQTR-COD-RSQF5D04042025",
      "items": [
        {
          "productId": "67b238ad6f4c5b8663b202f9",
          "name": "Kent Automatic Water Softener 25 | Aquakart",
          "price": 70000,
          "quantity": 1,
          "_id": "67ef9bc906b297db918519e6"
        },
        {
          "productId": "6748bc41ffb5064e3c2ade4b",
          "name": "Kent Automatic Water Softener 100L | Aquakart",
          "price": 129000,
          "quantity": 1,
          "_id": "67ef9bc906b297db918519e7"
        },
        {
          "productId": "66b5e7c00cea4415f6b29167",
          "name": "Kent Sandfilter | Aquakart",
          "price": 19500,
          "quantity": 1,
          "_id": "67ef9bc906b297db918519e8"
        },
        {
          "productId": "65d1bc9f448369ec4b7e1853",
          "name": "Kent Bathroom Water Softener 5.5L | Aquakart",
          "price": 14250,
          "quantity": 1,
          "_id": "67ef9bc906b297db918519e9"
        }
      ],
      "totalAmount": 232750,
      "paymentMethod": "Cash On Delivery",
      "paymentStatus": "Pending",
      "currency": "INR",
      "billingAddress": {
        "street": "Janapriya Appts",
        "city": "Hyderabad South East",
        "state": "Telangana",
        "postalCode": "500048",
        "_id": "67c147fcbcf5562007e18b5e"
      },
      "shippingAddress": {
        "street": "Janapriya Appts",
        "city": "Hyderabad South East",
        "state": "Telangana",
        "postalCode": "500048",
        "_id": "67c147fcbcf5562007e18b5e"
      },
      "shippingMethod": "Standard",
      "shippingCost": 50,
      "estimatedDelivery": "2025-04-11T08:43:52.701Z",
      "orderStatus": "Processing",
      "refund": false,
      "refundStatus": "Not Initiated",
      "offerApplied": false,
      "createdAt": "2025-04-04T08:43:53.182Z",
      "updatedAt": "2025-04-04T08:43:53.182Z",
      "__v": 0
    }
  ]
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function OrderDialog({ isOpen, onClose, order }: { isOpen: boolean; onClose: () => void; order?: Order | null }) {
  const [formData, setFormData] = useState<Partial<Order>>(
    order || {
      orderStatus: 'Processing',
      paymentStatus: 'Pending',
      shippingMethod: 'Standard',
      estimatedDelivery: new Date().toISOString(),
      refund: false,
      refundStatus: 'Not Initiated'
    }
  );

  const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
  const shippingMethods = ['Standard', 'Express', 'Priority'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting order update:', formData);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 text-cyan-500 mr-2" />
                  Edit Order {order?.orderId}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {/* Order Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <select
                      value={formData.orderStatus}
                      onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                    <select
                      value={formData.shippingMethod}
                      onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
                    >
                      {shippingMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estimated Delivery */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery</label>
                    <input
                      type="datetime-local"
                      value={new Date(formData.estimatedDelivery || '').toISOString().slice(0, 16)}
                      onChange={(e) => setFormData({ ...formData, estimatedDelivery: new Date(e.target.value).toISOString() })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
                    />
                  </div>

                  {/* Refund Section */}
                  {formData.paymentStatus === 'Refunded' && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800">Refund Information</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.refund}
                                onChange={(e) => setFormData({ ...formData, refund: e.target.checked })}
                                className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                              />
                              <label className="ml-2 text-sm text-red-700">
                                Confirm Refund
                              </label>
                            </div>
                            <select
                              value={formData.refundStatus}
                              onChange={(e) => setFormData({ ...formData, refundStatus: e.target.value })}
                              className="mt-1 block w-full rounded-lg border border-red-300 bg-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 text-sm"
                            >
                              <option value="Not Initiated">Not Initiated</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Update Order
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function OrderRow({ order, onEdit }: { order: Order; onEdit: (order: Order) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(order)}
              className="text-cyan-600 hover:text-cyan-900"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </td>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
          <div className="flex items-center">
            <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <div className="font-medium text-gray-900">#{order.orderId}</div>
              <div className="text-gray-500">{formatDate(order.createdAt)}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
          ₹{order.totalAmount.toLocaleString()}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-4 py-6 bg-gray-50 border-t border-gray-200">
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Subtotal</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{calculateSubtotal().toLocaleString()}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Shipping</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{order.shippingCost.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">Total</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">₹{order.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Addresses and Payment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shipping Address Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Truck className="h-5 w-5 text-cyan-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.shippingAddress.street}</p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                        <p className="text-sm text-gray-500">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipping Method</p>
                        <p className="text-sm text-gray-500">{order.shippingMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Building2 className="h-5 w-5 text-cyan-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Billing Address</h4>
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.billingAddress.street}</p>
                        <p className="text-sm text-gray-500">
                          {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details Card */}
                <div className={`bg-white rounded-lg shadow-sm p-6 border h-full flex flex-col ${
                  order.paymentMethod === 'Cash On Delivery' ? 'border-yellow-200' : 'border-gray-200'
                }`}>
                  <div className="flex items-center mb-4">
                    {order.paymentMethod === 'Cash On Delivery' ? (
                      <Wallet className="h-5 w-5 text-yellow-500 mr-2" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <h4 className="text-sm font-medium text-gray-900">Payment Details</h4>
                  </div>
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payment Method</span>
                      <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payment Status</span>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Transaction ID</span>
                      <span className="text-sm font-mono text-gray-900">{order.transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-sm text-gray-900">Total Amount</span>
                      <span className="text-sm text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    {order.paymentMethod === 'Cash On Delivery' && (
                      <div className="mt-auto bg-yellow-50 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 flex items-center">
                          <CircleDot className="h-4 w-4 mr-2 text-yellow-500" />
                          Please keep exact change ready
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const tabs = [
    { name: 'All Orders', icon: ShoppingBag },
    { name: 'Cash on Delivery', icon: Wallet },
    { name: 'Prepaid', icon: CreditCard }
  ];

  const filterOrdersByType = (orders: Order[], type: string | null) => {
    if (!type) return orders; // "All Orders" tab
    return orders.filter(order => {
      if (type === 'Cash on Delivery') {
        return order.paymentMethod === 'Cash On Delivery';
      }
      return order.paymentMethod !== 'Cash On Delivery'; // Prepaid orders
    });
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const filteredOrders = mockOrderResponse.data
    .filter(order =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including their details and current status.
          </p>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="mt-6 flex items-center justify-between">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <Tab.List className="flex space-x-2 rounded-lg bg-gray-100 p-1 ml-6">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'rounded-md px-3 py-2 text-sm font-medium flex items-center whitespace-nowrap',
                    selected
                      ? 'bg-white text-cyan-700 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  )
                }
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-8">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white shadow ring-1 ring-black ring-opacity-5 overflow-hidden',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="w-12 py-3.5 pl-4 pr-3"></th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Order</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filterOrdersByType(filteredOrders, tab.name === 'All Orders' ? null : tab.name).map((order) => (
                      <OrderRow key={order._id} order={order} onEdit={handleEdit} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <OrderDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}