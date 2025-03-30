import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const ProductOperations = {
  getProducts: async () => await axios.get(`${BASE_URL}/all-products`),
  getProduct: async (productId: string) =>
    await axios.get(`${BASE_URL}/product/${productId}`),
  createProduct: async (productData: any) =>
    await axios.post(`${BASE_URL}/product-add`, productData),
  updateProduct: async (productId: string, productData: any) =>
    await axios.put(`${BASE_URL}/product-update/${productId}`, productData),
  deleteProduct: async (productId: string) =>
    await axios.get(`${BASE_URL}/product-delete/${productId}`),
};
export default ProductOperations;
