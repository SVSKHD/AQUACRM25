import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const InvoiceOprations = {
  createInvoice: async (invoice: any) => {
    await axios.post(`${BASE_URL}/crm/create/invoice`, invoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
  },
  updateInvoice: async (invoice: any, id: any) => {
    await axios.put(`${BASE_URL}/crm/update/invoice/${id}`, invoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
  },
};
export default InvoiceOprations;
