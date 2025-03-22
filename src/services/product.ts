import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const ProductOperations = {
  getProducts: async () => await axios.get(`${BASE_URL}/all-products`),
};
export default ProductOperations;
