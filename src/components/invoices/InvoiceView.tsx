import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Building, Phone, Mail, MapPin, Download, FileText, Calendar, IndianRupee, Truck, Receipt } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from '@/services/invoices';

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // In a real app, fetch the specific invoice
    // For demo, we'll use mock data
    setLoading(true);
    const mockInvoice: Invoice = {
      _id: id || '1',
      invoiceNo: `INV-2025-${id || '001'}`,
      date: '15/03/2025',
      customerDetails: {
        name: 'John Doe',
        phone: 9876543210,
        email: 'john@example.com',
        address: '123 Main St, City'
      },
      gst: true,
      po: false,
      quotation: false,
      gstDetails: {
        gstName: 'John Doe Enterprises',
        gstNo: 'GST123456789',
        gstPhone: null,
        gstEmail: 'accounts@johndoe.com',
        gstAddress: '123 Business Park'
      },
      products: [
        {
          productName: 'Water Softener',
          productQuantity: 1,
          productPrice: 15000,
          productSerialNo: 'WS-001'
        },
        {
          productName: 'Installation Kit',
          productQuantity: 1,
          productPrice: 1500,
          productSerialNo: 'IK-001'
        },
        {
          productName: 'Filter Cartridge',
          productQuantity: 2,
          productPrice: 2000,
          productSerialNo: 'FC-001,FC-002'
        }
      ],
      transport: {
        deliveredBy: 'not_delivered',
        deliveryDate: '2025-03-20'
      },
      paidStatus: 'paid',
      aquakartOnlineUser: false,
      aquakartInvoice: true,
      paymentType: 'upi'
    };

    setTimeout(() => {
      setInvoice(mockInvoice);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDownloadPDF = () => {
    if (!invoice) return;
    
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Invoice', 15, 20);
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoice.invoiceNo}`, 15, 30);
      doc.text(`Date: ${invoice.date}`, 15, 35);

      // Customer Details
      doc.setFontSize(12);
      doc.text('Customer Details', 15, 45);
      doc.setFontSize(10);
      doc.text(`Name: ${invoice.customerDetails.name}`, 15, 55);
      doc.text(`Phone: ${invoice.customerDetails.phone}`, 15, 60);
      doc.text(`Email: ${invoice.customerDetails.email}`, 15, 65);
      doc.text(`Address: ${invoice.customerDetails.address}`, 15, 70);

      // GST Details if applicable
      if (invoice.gst) {
        doc.setFontSize(12);
        doc.text('GST Details', 15, 85);
        doc.setFontSize(10);
        doc.text(`GST Name: ${invoice.gstDetails.gstName}`, 15, 95);
        doc.text(`GST No: ${invoice.gstDetails.gstNo}`, 15, 100);
      }

      // Products Table
      const tableData = invoice.products.map(product => [
        product.productName,
        product.productSerialNo,
        product.productQuantity,
        `₹${product.productPrice.toLocaleString()}`,
        `₹${(product.productPrice * product.productQuantity).toLocaleString()}`
      ]);

      autoTable(doc, {
        startY: invoice.gst ? 110 : 80,
        head: [['Product', 'Serial No', 'Qty', 'Price', 'Total']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 150, 150] }
      });

      // Save the PDF
      doc.save(`${invoice.invoiceNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Invoice Not Found</h2>
          <p className="mt-2 text-gray-600">The requested invoice could not be found.</p>
        </div>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return invoice.products.reduce((sum, product) => sum + (product.productPrice * product.productQuantity), 0);
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return invoice.gst ? subtotal * 0.18 : 0; // Assuming 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Download Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </>
            )}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Aquakart</h1>
                <p className="text-cyan-100 mt-1">GST : 36AJOPH6387A1Z2</p>
                <p className="text-cyan-100 mt-1">#{invoice.invoiceNo}</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end text-cyan-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  <p>{invoice.date}</p>
                </div>
                <div className="flex items-center justify-end text-cyan-100">
                  <Receipt className="h-4 w-4 mr-2" />
                  <p>{invoice.gst ? 'GST Invoice' : 'Regular Invoice'}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Truck className="h-4 w-4 mr-2" />
                  <p className={invoice.transport.deliveredBy === 'delivered' ? 'text-green-200' : 'text-red-200'}>
                    {invoice.transport.deliveredBy === 'delivered' ? 'Delivered' : 'Not Delivered'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Customer and GST Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{invoice.customerDetails.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{invoice.customerDetails.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{invoice.customerDetails.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{invoice.customerDetails.address}</span>
                  </div>
                </div>
              </div>

              {invoice.gst && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">GST Details</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{invoice.gstDetails.gstName}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">GST No:</span> {invoice.gstDetails.gstNo}
                    </div>
                    {invoice.gstDetails.gstPhone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{invoice.gstDetails.gstPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{invoice.gstDetails.gstEmail}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{invoice.gstDetails.gstAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-900">{product.productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {product.productSerialNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                          {product.productQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                          ₹{product.productPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                          ₹{(product.productPrice * product.productQuantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 pt-8">
              <div className="w-full max-w-sm ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  {invoice.gst && (
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span>₹{calculateGST().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Status</h3>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    invoice.paidStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.paidStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.paidStatus.charAt(0).toUpperCase() + invoice.paidStatus.slice(1)}
                  </span>
                  {invoice.paymentType && (
                    <p className="mt-1 text-sm text-gray-500">
                      Payment Method: {invoice.paymentType.toUpperCase()}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Details</h3>
                  <p className="text-sm text-gray-500">
                    Status: {invoice.transport.deliveredBy === 'delivered' ? (
                      <span className="text-green-600 font-medium">Delivered</span>
                    ) : (
                      <span className="text-red-600 font-medium">Not Delivered</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Delivery Date: {invoice.transport.deliveryDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Recommendations */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Water Softener Card */}
                <a 
                  href="https://aquakart.co.in/products/kent-water-softener"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src="https://res.cloudinary.com/aquakartproducts/image/upload/v1708244121/products/estxdgyj28uhpizvxhtd.jpg"
                      alt="Kent Water Softener"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">Kent Water Softener</h4>
                    <p className="mt-1 text-sm text-gray-500">Protect your appliances from hard water damage</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">₹14,000</span>
                      <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800">
                        Best Seller
                      </span>
                    </div>
                  </div>
                </a>

                {/* RO System Card */}
                <a 
                  href="https://aquakart.co.in/products/kent-grand-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src="https://res.cloudinary.com/aquakartproducts/image/upload/v1697890271/subcategories/ynhebfylurso6ip1doa6.png"
                      alt="Kent Grand Plus RO"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">Kent Grand Plus RO</h4>
                    <p className="mt-1 text-sm text-gray-500">Pure and safe drinking water for your family</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">₹18,500</span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        New Arrival
                      </span>
                    </div>
                  </div>
                </a>

                {/* Filter Cartridge Card */}
                <a 
                  href="https://aquakart.co.in/products/kent-filter-cartridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src="https://res.cloudinary.com/aquakartproducts/image/upload/v1723042021/categories/prlk8hg3xgpjmiabfyjc.png"
                      alt="Kent Filter Cartridge"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">Filter Cartridge Set</h4>
                    <p className="mt-1 text-sm text-gray-500">Regular maintenance for optimal performance</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">₹2,000</span>
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Essential
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="https://aquakart.co.in/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-800"
                >
                  View all products on Aquakart
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}