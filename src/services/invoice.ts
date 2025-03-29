import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const InvoiceOprations = {
  createInvoice: async (invoice: any) => {
    console.log("Creating invoice:api", invoice);
    await axios.post(`${BASE_URL}/crm/create/invoice`, invoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
  },
};
export default InvoiceOprations;
