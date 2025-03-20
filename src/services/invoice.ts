import axios from "axios"


const BASE_URL = "https://api.aquakart.co.in/v1"
const token = localStorage.getItem("token")


const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
}
const InvoiceApiOperations = {
  getInvoices: async () =>
    await axios.get(`${BASE_URL}/crm/admin/all-invoices`),
  getInvoiceById: async (id: string) =>
    await axios.get(`${BASE_URL}/crm/invoice/${id}`),
  createInvoice: async (token: string, data: any) => 
    await axios.post(
      `${BASE_URL}/crm/create/invoice`,
      data, { headers }),
    updateInvoice:async (token: string, data: any) =>
    await axios.put(`${BASE_URL}/crm/update/invoice`, data, { headers }),
    deleteInvoice:async (token: string, id: string) => await axios.delete(`${BASE_URL}/crm/delete/invoice/${id}`, { headers })
};

export default InvoiceApiOperations