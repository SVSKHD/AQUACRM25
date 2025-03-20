import { FileText, Edit2, Trash2, Send } from "lucide-react";
import type { Invoice } from "@/services/invoices";

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
  calculateTotal: (products: Invoice["products"]) => number;
}

export default function InvoiceList({
  invoices,
  onEdit,
  calculateTotal,
  onSend,
}: InvoiceListProps) {
  return (
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
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div className="font-medium text-gray-900">
                {invoice.customerDetails.name}
              </div>
              <div>{invoice.customerDetails.phone}</div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {invoice.date}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              ₹{calculateTotal(invoice.products).toLocaleString()}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                className="text-cyan-600 hover:text-cyan-900 mr-4"
                onClick={() => onSend(invoice)}
              >
                <Send className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(invoice)}
                className="text-cyan-600 hover:text-cyan-900 mr-4"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="text-red-600 hover:text-red-900">
                <Trash2 className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
