import axios from "axios";

const BASE_URL = "https://api.aquakart.co.in/v1";

const SubCategoryOperations = {
  getSubCategories: async () =>
    await axios.get(`${BASE_URL}/all-subcategories`),
  getSubCategory: async (subCategoryId: string) =>
    await axios.get(`${BASE_URL}/subcategory/${subCategoryId}`),
  createSubCategory: async (subCategoryData: any) =>
    await axios.post(`${BASE_URL}/subcategory-add`, subCategoryData),
  updateSubCategory: async (subCategoryId: string, subCategoryData: any) =>
    await axios.put(
      `${BASE_URL}/subcategory-update/${subCategoryId}`,
      subCategoryData,
    ),
  deleteSubCategory: async (subCategoryId: string) =>
    await axios.get(`${BASE_URL}/subcategory/${subCategoryId}`),
};
export default SubCategoryOperations;
