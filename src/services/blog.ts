import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const BlogOperations = {
  createBlogs: async (invoice: any) => {
    await axios.post(`${BASE_URL}/crm/create/invoice`, invoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
  },
  updateBlogs: async (invoice: any, id: any) => {
    await axios.put(`${BASE_URL}/crm/update/invoice/${id}`, invoice, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
  },
  getBlogs: async () => await axios.get(`${BASE_URL}/all-blogs`),
};
export default BlogOperations;
