import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const CategoryOperations = {
  getCategories: async () => await axios.get(`${BASE_URL}/allcategories`),
};
export default CategoryOperations;
