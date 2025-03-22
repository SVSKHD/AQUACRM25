import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";
const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
}

interface GSTDetails {
  gstName: string;
  gstNo: string;
  gstPhone: number | null;
  gstEmail: string;
  gstAddress: string;
}

interface Transport {
  deliveredBy: string;
  deliveryDate: string;
}

interface Product {
  productName: string;
  productQuantity: number;
  productPrice: number;
  productSerialNo: string;
  _id?: string;
}

interface Invoice {
  _id: string;
  invoiceNo: string;
  date: string;
  customerDetails: {
    name: string;
    phone: number;
    email: string;
    address: string;
  };
  gst: boolean;
  po: boolean;
  quotation: boolean;
  gstDetails: GSTDetails;
  products: Product[];
  transport: Transport;
  paidStatus: string;
  aquakartOnlineUser: boolean;
  aquakartInvoice: boolean;
  paymentType: string;
  createdAt?: string;
  updatedAt?: string;
}

const sanitizeInvoiceData = (invoice: any): Partial<Invoice> => {
  return {
    _id: invoice._id,
    invoiceNo: invoice.invoiceNo || '',
    date: invoice.date || new Date().toLocaleDateString('en-GB'),
    customerDetails: {
      name: invoice.customerDetails?.name || '',
      phone: Number(invoice.customerDetails?.phone) || 0,
      email: invoice.customerDetails?.email || '',
      address: invoice.customerDetails?.address || '',
    },
    gst: Boolean(invoice.gst),
    po: Boolean(invoice.po),
    quotation: Boolean(invoice.quotation),
    gstDetails: {
      gstName: invoice.gstDetails?.gstName || '',
      gstNo: invoice.gstDetails?.gstNo || '',
      gstPhone: invoice.gstDetails?.gstPhone ? Number(invoice.gstDetails.gstPhone) : null,
      gstEmail: invoice.gstDetails?.gstEmail || '',
      gstAddress: invoice.gstDetails?.gstAddress || '',
    },
    products: Array.isArray(invoice.products) ? invoice.products.map((p: any) => ({
      productName: p.productName || '',
      productQuantity: Number(p.productQuantity) || 1,
      productPrice: Number(p.productPrice) || 0,
      productSerialNo: p.productSerialNo || '',
      _id: p._id,
    })) : [],
    transport: {
      deliveredBy: invoice.transport?.deliveredBy || '',
      deliveryDate: invoice.transport?.deliveryDate || '',
    },
    paidStatus: invoice.paidStatus || '',
    aquakartOnlineUser: Boolean(invoice.aquakartOnlineUser),
    aquakartInvoice: Boolean(invoice.aquakartInvoice),
    paymentType: invoice.paymentType || '',
  };
};

// Dummy data for development
const dummyInvoices: Invoice[] = [
  { 
    _id: '1',
    invoiceNo: 'INV-2025-001',
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
      }
    ],
    transport: {
      deliveredBy: 'Express Delivery',
      deliveryDate: '2025-03-20'
    },
    paidStatus: 'paid',
    aquakartOnlineUser: false,
    aquakartInvoice: true,
    paymentType: 'upi'
  },
  {
    _id: '2',
    invoiceNo: 'INV-2025-002',
    date: '16/03/2025',
    customerDetails: {
      name: 'Jane Smith',
      phone: 9876543211,
      email: 'jane@example.com',
      address: '456 Park Ave, City'
    },
    gst: false,
    po: true,
    quotation: false,
    gstDetails: {
      gstName: '',
      gstNo: '',
      gstPhone: null,
      gstEmail: '',
      gstAddress: ''
    },
    products: [
      {
        productName: 'RO System',
        productQuantity: 1,
        productPrice: 25000,
        productSerialNo: 'RO-001'
      },
      {
        productName: 'Installation Kit',
        productQuantity: 1,
        productPrice: 2000,
        productSerialNo: 'IK-001'
      }
    ],
    transport: {
      deliveredBy: 'In-house',
      deliveryDate: '2025-03-21'
    },
    paidStatus: 'pending',
    aquakartOnlineUser: true,
    aquakartInvoice: true,
    paymentType: 'card'
  }
];

export const invoiceOperations = {
  getInvoices: async (): Promise<{ data: Invoice[] }> => {
    try {
      // Use dummy data instead of making an API call that could cause cloning errors
      // return { data: [...dummyInvoices] };
      
     
      const response = await axios.get<{ data: Invoice[] }>(`${BASE_URL}/crm/admin/all-invoices`);
      return {
        data: response.data.data.map(invoice => sanitizeInvoiceData(invoice) as Invoice)
      };
      
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { data: [] };
    }
  },

  getInvoiceById: async (invoiceId: any): Promise<Invoice | null> => {
    try {
      const response = await axios.get<Invoice>(`${BASE_URL}/crm/invoice/${invoiceId}`);
      return response;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return null;
    }
  },

  createInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    try {
      // For demo purposes, return a mock response
      // const newInvoice = {
      //   ...sanitizeInvoiceData(invoice),
      //   _id: Math.random().toString(36).substring(2, 15),
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString()
      // } as Invoice;
      
      // return newInvoice;
      
      
      const sanitizedData = sanitizeInvoiceData(invoice);
      const response = await axios.post<Invoice>(`${BASE_URL}/crm/admin/create-invoice`,{headers}, sanitizedData);
      return sanitizeInvoiceData(response.data) as Invoice;
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  updateInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    try {   
      const sanitizedData = sanitizeInvoiceData(invoice);
      const response = await axios.put<Invoice>(
        `${BASE_URL}/crm/admin/update-invoice/${invoice._id}`, {headers},
        sanitizedData
      );
      return sanitizeInvoiceData(response.data) as Invoice;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  deleteInvoice: async (invoiceId: string): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/crm/delete/invoice/${invoiceId}`, {headers});
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

export type { Invoice, Product, GSTDetails, Transport };