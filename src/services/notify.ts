import axios from "axios";

const BASE = "https://api.aquakart.co.in/v1/notify";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
const NotifyOperations = {
  sendWhatsApp: async (no: number, message: string) => {
    try {
      const response = await axios.post(
        `${BASE}/send-whatsappp`,
        { no, message },
        { headers },
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
export default NotifyOperations;
