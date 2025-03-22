import {useState, Fragment} from 'react';
import { FileText, Edit2, Trash2, Send, ExternalLink, Download, Package, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { invoiceOperations, type Invoice } from '@/services/invoices';

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
  calculateTotal: (products: Invoice["products"]) => number;
}


interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onConfirm: () => void;
}

function DeleteDialog({
  isOpen,
  onClose,
  invoice,
  onConfirm,
}: DeleteDialogProps) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>

                <Dialog.Title
                  as="h3"
                  className="mt-4 text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  Delete Invoice
                </Dialog.Title>

                <div className="mt-3">
                  <p className="text-sm text-gray-500 text-center">
                    Are you sure you want to delete invoice{" "}
                    <span className="font-medium text-gray-900">
                      {invoice?.invoiceNo}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}





export default function InvoiceList({ invoices, onEdit, calculateTotal, onDelete }: InvoiceListProps) {
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
    console.log("Invoice selected for deletion:", invoice);
  };

const handleDeleteConfirm = async() => {
  if (selectedInvoice) {
    const response= await invoiceOperations.deleteInvoice(selectedInvoice._id);
    console.log("Invoice deleted:", response);
  } else {
    console.warn("No invoice selected for deletion!");
  }

  setIsDeleteDialogOpen(false);
  setSelectedInvoice(null);
};



  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              Invoice
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Products
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Amount
            </th>
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
                    <div className="font-medium text-gray-900">
                      {invoice.invoiceNo}
                    </div>
                    <div className="text-gray-500">
                      {invoice.gst ? "GST" : ""} {invoice.po ? "PO" : ""}{" "}
                      {invoice.quotation ? "Quotation" : ""}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Status:{" "}
                      {invoice.transport.deliveredBy === "delivered" ? (
                        <span className="text-green-600">Delivered</span>
                      ) : (
                        <span className="text-red-600">Not Delivered</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="font-medium text-gray-900">
                  {invoice.customerDetails.name}
                </div>
                <div>{invoice.customerDetails.phone}</div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <div className="max-w-xs">
                  {invoice.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-1 last:mb-0"
                    >
                      <Package className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-medium">
                          {product.productName}
                        </span>
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
                    onClick={() => handleDeleteClick(invoice)}
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
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        invoice={selectedInvoice}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}