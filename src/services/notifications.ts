import axios from "axios";

const BASE = "https://api.aquakart.co.in/v1/notify";

const notificationOperations: any = {
  sendNotification: async (token: string, no: number, message: string) =>
    axios.post(
      `${BASE}/send-whatsapp`,
      { no, message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};
export default notificationOperations;
