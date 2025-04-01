import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const headers = {
  "Content-Type":"application/json",
  Authorization:`Bearer ${localStorage.getItem('token')}`
}
const ProductOperations = {
  getProducts: async () => await axios.get(`${BASE_URL}/all-products`),
  getProduct: async (productId: string) =>
    await axios.get(`${BASE_URL}/product/${productId}`),
  createProduct: async (productData: any) =>
    await axios.post(`${BASE_URL}/product-add`,productData,{
      headers
    }),
  updateProduct: async (productId: string, productData: any) =>
    await axios.put(`${BASE_URL}/product-update/${productId}`, productData,{headers}),
  deleteProduct: async (productId: string) =>
    await axios.get(`${BASE_URL}/product-delete/${productId}`),
};
export default ProductOperations;
