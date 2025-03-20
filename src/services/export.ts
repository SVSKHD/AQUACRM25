import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from './invoices';

export const exportService = {
  toExcel: (invoices: Invoice[]) => {
    const data = invoices.map(invoice => ({
      'Invoice No': invoice.invoiceNo,
      'Date': invoice.date,
      'Customer Name': invoice.customerDetails.name,
      'Customer Phone': invoice.customerDetails.phone,
      'Customer Email': invoice.customerDetails.email,
      'Total Amount': invoice.products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0),
      'Payment Status': invoice.paidStatus,
      'Payment Type': invoice.paymentType,
      'Type': [
        invoice.gst ? 'GST' : '',
        invoice.po ? 'PO' : '',
        invoice.quotation ? 'Quotation' : ''
      ].filter(Boolean).join(', ') || 'Regular'
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Invoices');
    writeFile(wb, 'invoices.xlsx');
  },

  toPDF: (invoices: Invoice[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Invoices Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const tableData = invoices.map(invoice => [
      invoice.invoiceNo,
      invoice.date,
      invoice.customerDetails.name,
      invoice.products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
      }),
      invoice.paidStatus,
      [
        invoice.gst ? 'GST' : '',
        invoice.po ? 'PO' : '',
        invoice.quotation ? 'Quotation' : ''
      ].filter(Boolean).join(', ') || 'Regular'
    ]);

    autoTable(doc, {
      head: [['Invoice No', 'Date', 'Customer', 'Amount', 'Status', 'Type']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 150, 150] }
    });

    doc.save('invoices.pdf');
  }
};