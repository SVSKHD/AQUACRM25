import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  Building,
  Phone,
  Mail,
  MapPin,
  Download,
  FileText,
  Calendar,
  IndianRupee,
  Truck,
  Receipt,
  Copy,
  Check,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";

// Extend jsPDF to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}
import autoTable from "jspdf-autotable";
import type { Invoice } from "@/services/invoices";
import { invoiceOperations } from "@/services/invoices";

const termsAndConditions = [
  {
    title: "Transport",
    description: "TRANSPORT / LIFTING CHARGES WILL BE BORNE BY THE CUSTOMER.",
  },
  {
    title: "Plumber",
    description:
      "PLUMBER SHOULD BE PROVIDED AT THE TIME OF PLUMBING (OR) OUR PLUMBING CONTRACTORS WILL ATTRACT PLUMBING CHARGES.",
  },
  {
    title: "Plumbing Material",
    description:
      "PLUMBING MATERIALS / ELECTRICAL CONNECTION BY CUSTOMER , IF THE PRESSURE BOOSTER PUMP PLUMBING WILL ATTRACT EXTRA CHARGES ",
  },
  {
    title: "SALES RETURN",
    description: "IF THE UNIT IS UNBOXED MACHINE WILL NOT BE TAKEN BACK",
  },
  {
    title: "Delivery and Installation policy",
    description: "DELIVERY / INSTALLATION COMPLETED WITHIN 7 WORKING DAYS. ",
  },
  {
    title: "Advance policy",
    description: "100% ADVANCE ALONG WITH PO.",
  },
  {
    title: "Work Monitoring",
    description:
      "PLUMBING WORK VERIFICATION , PROGRAMMING AND TRAINING AND WARRANTY UPLOAD WILL BE DONE BY OUR SERVICE ENGINEERS",
  },
];

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      await invoiceOperations.getInvoiceById(id).then((res) => {
        setTimeout(() => {
          setInvoice(res.data);
          setLoading(false);
        }, 1000);
      });
    } catch (error) {
      setError("An error occurred while fetching the invoice.");
      setLoading(false);
    }
  };

  const gstValueGenerate = (price: number) => {
    let basePrice = Math.floor(price * 0.8474594);
    let gst = Math.floor(basePrice * 0.18);
    return gst;
  };

  const BasePrice = (price: number) => {
    let basePrice = Math.floor(price * 0.8474594);
    return basePrice;
  };

  const calculateSubtotal = () => {
    return invoice?.products.reduce(
      (sum, product) => sum + product.productPrice,
      0,
    );
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;

    setDownloading(true);

    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text("Aquakart - Invoice", 15, 20);

      // Top-right Aquakart and GST
      doc.setFontSize(18);
      doc.text("Aquakart", 135, 20);
      doc.setFontSize(10);
      doc.text("GST: 36AJOPH6387A1Z2", 135, 25);

      // Invoice No & Date
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoice.invoiceNo}`, 15, 30);
      doc.text(`Date: ${invoice.date}`, 15, 35);

      // Customer & GST Details Side by Side
      doc.setFontSize(12);
      doc.text("Customer Details", 15, 45);

      doc.setFontSize(10);
      // Customer Details
      doc.text(`Name: ${invoice.customerDetails.name}`, 15, 55);
      doc.text(`Phone: ${invoice.customerDetails.phone}`, 15, 60);
      doc.text(`Email: ${invoice.customerDetails.email}`, 15, 65);
      const customerAddressLines = doc.splitTextToSize(
        `Address: ${invoice.customerDetails.address}`,
        90,
      );
      customerAddressLines.forEach((line: any, idx: any) => {
        doc.text(line, 15, 70 + idx * 5);
      });

      // GST Details
      if (invoice.gst) {
        doc.text("GST Details", 110, 45);
        doc.text(`GST Name: ${invoice.gstDetails.gstName}`, 110, 55);
        doc.text(`GST No: ${invoice.gstDetails.gstNo}`, 110, 60);
        doc.text(`GST Email: ${invoice.gstDetails.gstEmail}`, 110, 65);

        const gstAddressLines = invoice.gstDetails.gstAddress
          ? invoice.gstDetails.gstAddress.split("\n")
          : [];
        doc.text("Address:", 110, 70);
        gstAddressLines.forEach((line, idx) => {
          doc.text(line, 115, 75 + idx * 5);
        });
      }

      // Adjust startY closer
      let startY = 80;

      // Bank Details (Moved slightly up)
      if (invoice.po) {
        doc.setFontSize(12);
        doc.text("Bank Details", 15, startY);
        doc.setFontSize(10);

        // ICICI Bank
        doc.text("ICICI Bank", 15, startY + 8);
        doc.text("A/c Name: Kundana Enterprises", 15, startY + 13);
        doc.text("A/c No: 8813356673", 15, startY + 18);
        doc.text("IFSC: KKBK0007463", 15, startY + 23);

        // Kotak Bank
        doc.text("Kotak Bank", 75, startY + 8);
        doc.text("A/c Name: Kundana Enterprises", 75, startY + 13);
        doc.text("A/c No: 131605003314", 75, startY + 18);
        doc.text("IFSC: ICIC0001316", 75, startY + 23);

        // UPI Details
        doc.text("UPI", 135, startY + 8);
        doc.text("GPay: 9182119842", 135, startY + 13);
        doc.text("PhonePe: 9182119842", 135, startY + 18);

        startY += 35;
      }

      // Products Table
      const tableData = invoice.products.map((product) => [
        product.productName,
        product.productSerialNo,
        product.productQuantity,
        `Rs.${BasePrice(product.productPrice).toLocaleString()}`,
        `Rs.${gstValueGenerate(product.productPrice).toLocaleString()}`,
        `Rs.${product.productPrice.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: startY,
        head: [["Product", "Serial No", "Qty", "BasePrice", "GST", "Total"]],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 120, 200], textColor: 255 },
        theme: "grid",
        margin: { left: 15, right: 15 },
      });

      // Terms and Conditions
      const finalY = doc.lastAutoTable?.finalY ?? startY;
      doc.setFontSize(12);
      doc.text("Terms and Conditions", 15, finalY + 15);
      doc.setFontSize(8);

      let termsY = finalY + 20;
      termsAndConditions.forEach((term, index) => {
        doc.text(`${index + 1}. ${term.title}:`, 15, termsY);
        const splitDescription = doc.splitTextToSize(term.description, 180);
        splitDescription.forEach((line: any) => {
          doc.text(line, 20, (termsY += 5));
        });
        termsY += 7;
      });

      // Save PDF
      doc.save(`${invoice.invoiceNo}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = (field: string) => {
    let textToCopy = "";
    switch (field) {
      case "iciciDetails":
        textToCopy =
          "Account Name: Kundana Enterprises\nAccount No: 8813356673\nIFSC: KKBK0007463";
        break;
      case "kotakDetails":
        textToCopy =
          "Account Name: Kundana Enterprises\nAccount No: 131605003314\nIFSC: ICIC0001316";
        break;
      case "upiDetails":
        textToCopy = "GPay: 9182119842\nPhonePe: 9182119842";
        break;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
          <h2 className="text-xl font-semibold text-gray-900">
            Invoice Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The requested invoice could not be found.
          </p>
        </div>
      </div>
    );
  }

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return invoice.gst ? (subtotal ?? 0) * 0.18 : 0; // Assuming 18% GST
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
                {invoice.po ? (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Purchase Order
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </>
                )}
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
                  <p>
                    {invoice.po
                      ? "Purchase Order"
                      : invoice.gst
                        ? "GST Invoice"
                        : "Regular Invoice"}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <Truck className="h-4 w-4 mr-2" />
                  <p
                    className={
                      invoice.transport.deliveredBy === "delivered"
                        ? "text-green-200"
                        : "text-red-200"
                    }
                  >
                    {invoice.transport.deliveredBy === "delivered"
                      ? "Delivered"
                      : "Not Delivered"}
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Details
                </h2>
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    GST Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{invoice.gstDetails.gstName}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">GST No:</span>{" "}
                      {invoice.gstDetails.gstNo}
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Products
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Serial No
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gst
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-900">
                              {product.productName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {product.productSerialNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                          {product.productQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                          ₹
                          {gstValueGenerate(
                            product.productPrice,
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">
                          ₹{BasePrice(product.productPrice).toLocaleString()}
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
                    <span>
                      ₹{BasePrice(calculateSubtotal() ?? 0).toLocaleString()}
                    </span>
                  </div>
                  {!invoice?.gst && (
                    <div className="flex justify-between text-gray-600">
                      <span>Gst</span>
                      <span>
                        ₹
                        {gstValueGenerate(
                          calculateSubtotal() ?? 0,
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {invoice.gst && (
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span>
                        ₹
                        {gstValueGenerate(
                          calculateSubtotal() ?? 0,
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{(calculateSubtotal() ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Payment Status
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invoice.paidStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.paidStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {invoice.paidStatus.charAt(0).toUpperCase() +
                      invoice.paidStatus.slice(1)}
                  </span>
                  {invoice.paymentType && (
                    <p className="mt-1 text-sm text-gray-500">
                      Payment Method: {invoice.paymentType.toUpperCase()}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Delivery Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    {invoice.transport.deliveredBy === "delivered" ? (
                      <span className="text-green-600 font-medium">
                        Delivered
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Not Delivered
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Delivery Date: {invoice.transport.deliveryDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details Section (shown when po is true) */}
            {invoice.po && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Payment Details</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* ICICI Bank Details */}
                      <div
                        className={`bg-white rounded-lg border ${
                          copiedField === "iciciDetails"
                            ? "border-cyan-500"
                            : "border-gray-200"
                        } p-4 cursor-pointer hover:shadow-md transition-all duration-200`}
                        onClick={() => copyToClipboard("iciciDetails")}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">
                            ICICI Bank
                          </h3>
                          {copiedField === "iciciDetails" ? (
                            <Check className="h-4 w-4 text-cyan-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <hr className="my-2" />
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">A/c Name:</span>{" "}
                            Kundana Enterprises
                          </p>
                          <p>
                            <span className="font-medium">A/c No:</span>{" "}
                            8813356673
                          </p>
                          <p>
                            <span className="font-medium">IFSC:</span>{" "}
                            ICIC0001316
                          </p>
                        </div>
                      </div>

                      {/* KOTAK Bank Details */}
                      <div
                        className={`bg-white rounded-lg border ${
                          copiedField === "kotakDetails"
                            ? "border-cyan-500"
                            : "border-gray-200"
                        } p-4 cursor-pointer hover:shadow-md transition-all duration-200`}
                        onClick={() => copyToClipboard("kotakDetails")}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">
                            KOTAK Bank
                          </h3>
                          {copiedField === "kotakDetails" ? (
                            <Check className="h-4 w-4 text-cyan-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <hr className="my-2" />
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">A/c Name:</span>{" "}
                            Kundana Enterprises
                          </p>
                          <p>
                            <span className="font-medium">A/c No:</span>{" "}
                            131605003314
                          </p>
                          <p>
                            <span className="font-medium">IFSC:</span>{" "}
                            KKBK0007463
                          </p>
                        </div>
                      </div>

                      {/* UPI Details */}
                      <div
                        className={`bg-white rounded-lg border ${
                          copiedField === "upiDetails"
                            ? "border-cyan-500"
                            : "border-gray-200"
                        } p-4 cursor-pointer hover:shadow-md transition-all duration-200`}
                        onClick={() => copyToClipboard("upiDetails")}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">UPI</h3>
                          {copiedField === "upiDetails" ? (
                            <Check className="h-4 w-4 text-cyan-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <hr className="my-2" />
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">GPay:</span>{" "}
                            9182119842
                          </p>
                          <p>
                            <span className="font-medium">PhonePe:</span>{" "}
                            9182119842
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Click on any card to copy the details
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-t-lg">
                  <h2 className="text-lg font-semibold">
                    Terms and Conditions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {termsAndConditions.map((term, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-gray-900">
                          {index + 1}. {term.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {term.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Recommendations */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recommended Products
              </h3>
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
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">
                      Kent Water Softener
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Protect your appliances from hard water damage
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹14,000
                      </span>
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
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">
                      Kent Grand Plus RO
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Pure and safe drinking water for your family
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹18,500
                      </span>
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
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-cyan-600">
                      Filter Cartridge Set
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Regular maintenance for optimal performance
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹2,000
                      </span>
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
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
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
