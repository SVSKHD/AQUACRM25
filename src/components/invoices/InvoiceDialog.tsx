import { useState, Fragment, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import type { Invoice, Product } from '@/services/invoices';

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
}

// Static product list
const productList = [
  { id: '1', name: 'Kent Water Softener', price: 15000 },
  { id: '2', name: 'RO System', price: 25000 },
  { id: '3', name: 'UV Filter', price: 8000 },
  { id: '4', name: 'Sand Filter', price: 12000 },
  { id: '5', name: 'Filter Cartridge', price: 2000 },
  { id: '6', name: 'Installation Kit', price: 1500 },
  { id: '7', name: 'Pressure Pump', price: 5000 },
  { id: '8', name: 'Water Tank', price: 3000 }
];

// Delivery status options
const deliveryStatusOptions = [
  { value: 'delivered', label: 'Delivered' },
  { value: 'not_delivered', label: 'Not Delivered' }
];

export default function InvoiceDialog({ isOpen, onClose, invoice = null }: InvoiceDialogProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>(
    invoice || {
      invoiceNo: '',
      date: new Date().toLocaleDateString('en-GB'),
      customerDetails: {
        name: '',
        phone: 0,
        email: '',
        address: ''
      },
      gst: false,
      po: false,
      quotation: false,
      gstDetails: {
        gstName: '',
        gstNo: '',
        gstPhone: null,
        gstEmail: '',
        gstAddress: ''
      },
      products: [],
      transport: {
        deliveredBy: 'not_delivered',
        deliveryDate: ''
      },
      paidStatus: '',
      aquakartOnlineUser: false,
      aquakartInvoice: false,
      paymentType: ''
    }
  );

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    productName: '',
    productQuantity: 1,
    productPrice: 0,
    productSerialNo: ''
  });

  // Handle product selection from dropdown
  const handleProductSelect = (productId: string) => {
    const selectedProduct = productList.find(p => p.id === productId);
    if (selectedProduct) {
      setNewProduct({
        ...newProduct,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price
      });
    }
  };

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onClose();
  };

  const addProduct = () => {
    if (newProduct.productName && newProduct.productPrice) {
      setFormData({
        ...formData,
        products: [...(formData.products || []), { ...newProduct } as Product]
      });
      // Reset the form
      setNewProduct({
        productName: '',
        productQuantity: 1,
        productPrice: 0,
        productSerialNo: ''
      });
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...(formData.products || [])];
    updatedProducts.splice(index, 1);
    setFormData({
      ...formData,
      products: updatedProducts
    });
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-6"
                >
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={formData.invoiceNo}
                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="DD/MM/YYYY"
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.customerDetails?.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, name: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="number"
                          value={formData.customerDetails?.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, phone: Number(e.target.value) }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.customerDetails?.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, email: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          value={formData.customerDetails?.address}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, address: e.target.value }
                          })}
                          rows={3}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Options */}
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.gst}
                        onChange={(e) => setFormData({ ...formData, gst: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">GST Invoice</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.po}
                        onChange={(e) => setFormData({ ...formData, po: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">PO</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.quotation}
                        onChange={(e) => setFormData({ ...formData, quotation: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Quotation</span>
                    </label>
                  </div>

                  {/* GST Details */}
                  {formData.gst && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">GST Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Name</label>
                          <input
                            type="text"
                            value={formData.gstDetails?.gstName}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstName: e.target.value }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                          <input
                            type="text"
                            value={formData.gstDetails?.gstNo}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstNo: e.target.value }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Phone</label>
                          <input
                            type="number"
                            value={formData.gstDetails?.gstPhone || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstPhone: Number(e.target.value) }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Email</label>
                          <input
                            type="email"
                            value={formData.gstDetails?.gstEmail}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstEmail: e.target.value }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Address</label>
                          <textarea
                            value={formData.gstDetails?.gstAddress}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstAddress: e.target.value }
                            })}
                            rows={3}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Products</h4>
                    
                    {/* Product List */}
                    <div className="space-y-4 mb-4">
                      {formData.products?.map((product, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {product.productQuantity} × ₹{product.productPrice}
                              {product.productSerialNo && ` • S/N: ${product.productSerialNo}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Product Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                        <select
                          value={productList.find(p => p.name === newProduct.productName)?.id || ''}
                          onChange={(e) => handleProductSelect(e.target.value)}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          <option value="">Select a product</option>
                          {productList.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ₹{product.price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                        <input
                          type="text"
                          value={newProduct.productSerialNo}
                          onChange={(e) => setNewProduct({ ...newProduct, productSerialNo: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={newProduct.productQuantity}
                          onChange={(e) => setNewProduct({ ...newProduct, productQuantity: Number(e.target.value) })}
                          min="1"
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={newProduct.productPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, productPrice: Number(e.target.value) })}
                          min="0"
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add Product
                    </button>
                  </div>

                  {/* Transport Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Transport Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                        <select
                          value={formData.transport?.deliveredBy}
                          onChange={(e) => setFormData({
                            ...formData,
                            transport: { ...formData.transport!, deliveredBy: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          {deliveryStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                        <input
                          type="date"
                          value={formData.transport?.deliveryDate}
                          onChange={(e) => setFormData({
                            ...formData,
                            transport: { ...formData.transport!, deliveryDate: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                          value={formData.paidStatus}
                          onChange={(e) => setFormData({ ...formData, paidStatus: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          <option value="">Select Status</option>
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="partial">Partial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                        <select
                          value={formData.paymentType}
                          onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          <option value="">Select Type</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="upi">UPI</option>
                          <option value="bank">Bank Transfer</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
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
                      {invoice ? 'Update Invoice' : 'Create Invoice'}
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