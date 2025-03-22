import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const SubCategoryOperations = {
  getSubCategories: async () =>
    await axios.get(`${BASE_URL}/all-subcategories`),
};
export default SubCategoryOperations;
