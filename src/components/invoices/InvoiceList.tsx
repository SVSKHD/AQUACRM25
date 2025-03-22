import { FileText, Edit2, Trash2, Send, ExternalLink, Download, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Invoice } from '@/services/invoices';

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  calculateTotal: (products: Invoice['products']) => number;
}

export default function InvoiceList({ invoices, onEdit, calculateTotal }: InvoiceListProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Invoice</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Products</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {invoices.map((invoice) => (
          <tr key={invoice._id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="font-medium text-gray-900">{invoice.invoiceNo}</div>
                  <div className="text-gray-500">
                    {invoice.gst ? 'GST' : ''} {invoice.po ? 'PO' : ''} {invoice.quotation ? 'Quotation' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {invoice.transport.deliveredBy === 'delivered' ? (
                      <span className="text-green-600">Delivered</span>
                    ) : (
                      <span className="text-red-600">Not Delivered</span>
                    )}
                  </div>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="font-medium text-gray-900">{invoice.customerDetails.name}</div>
              <div>{invoice.customerDetails.phone}</div>
            </td>
            <td className="px-3 py-4 text-sm text-gray-500">
              <div className="max-w-xs">
                {invoice.products.map((product, index) => (
                  <div key={index} className="flex items-center mb-1 last:mb-0">
                    <Package className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-medium">{product.productName}</span>
                      <span className="text-gray-400 mx-1">×</span>
                      <span>{product.productQuantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {invoice.date}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              ₹{calculateTotal(invoice.products).toLocaleString()}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div className="flex justify-end space-x-3">
                <Link
                  to={`/invoice/${invoice._id}`}
                  target="_blank"
                  className="text-cyan-600 hover:text-cyan-900 bg-cyan-50 p-2 rounded-full"
                  title="View Invoice"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  className="text-purple-600 hover:text-purple-900 bg-purple-50 p-2 rounded-full"
                  title="Download Invoice"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-full"
                  title="Send Invoice"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(invoice)}
                  className="text-amber-600 hover:text-amber-900 bg-amber-50 p-2 rounded-full"
                  title="Edit Invoice"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"
                  title="Delete Invoice"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}