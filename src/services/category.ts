import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const CategoryOperations = {
  getCategories: async () => await axios.get(`${BASE_URL}/allcategories`),
  getCategory: async (categoryId: string) =>
    await axios.get(`${BASE_URL}/category/${categoryId}`),
  createCategory: async (categoryData: any) =>
    await axios.post(`${BASE_URL}/category-add`, categoryData),
  updateCategory: async (categoryId: string, categoryData: any) =>
    await axios.put(`${BASE_URL}/category-update/${categoryId}`, categoryData),
  deleteCategory: async (categoryId: string) =>
    await axios.delete(`${BASE_URL}/category/${categoryId}`),
};
export default CategoryOperations;
